# backend/auth_kakao.py
import os, secrets
from urllib.parse import urlencode
from pathlib import Path

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")  # ✅ backend/.env 강제 로드

import httpx
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/auth/kakao", tags=["auth"])

KAUTH = "https://kauth.kakao.com"
KAPI  = "https://kapi.kakao.com"

STATE_COOKIE = "kakao_oauth_states"  # ✅ 여러 개 저장할 쿠키 키
TOKEN_COOKIE = "kakao_access_token"

def _env():
    client_id = os.getenv("KAKAO_REST_API_KEY")
    client_secret = os.getenv("KAKAO_CLIENT_SECRET", "")
    redirect_uri = os.getenv("KAKAO_REDIRECT_URI", "http://localhost:8000/auth/kakao/callback")
    frontend_success = os.getenv("FRONTEND_LOGIN_SUCCESS", "http://localhost:5173/")
    print(f"[DEBUG] KAKAO_REDIRECT_URI={redirect_uri}", flush=True)
    if not client_id:
        raise RuntimeError("KAKAO_REST_API_KEY가 설정되지 않았습니다.")
    return client_id, client_secret, redirect_uri, frontend_success

def _push_state(existing: str, new_state: str, keep: int = 5) -> str:
    states = [s for s in (existing or "").split(",") if s]
    if new_state not in states:
        states.insert(0, new_state)
    return ",".join(states[:keep])

@router.get("/login")
async def kakao_login(request: Request):
    client_id, _, redirect_uri, _ = _env()

    state = secrets.token_urlsafe(16)

    params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "state": state,
        "prompt": "login",
    }
    auth_url = f"{KAUTH}/oauth/authorize?{urlencode(params)}"

    # ✅ state를 "최근 N개" 쿠키로 저장 (여러 번 눌러도 통과)
    existing = request.cookies.get(STATE_COOKIE, "")
    new_value = _push_state(existing, state)

    resp = RedirectResponse(auth_url)
    resp.set_cookie(
        STATE_COOKIE,
        new_value,
        httponly=True,
        samesite="lax",
        max_age=300,
        path="/",
    )
    return resp

@router.get("/callback")
async def kakao_callback(request: Request, code: str | None = None, state: str | None = None):
    client_id, client_secret, redirect_uri, frontend_success = _env()

    if not code:
        raise HTTPException(400, "code가 없습니다.")

    # ✅ state 검증
    cookie_states = request.cookies.get(STATE_COOKIE, "")
    states = [s for s in cookie_states.split(",") if s]
    if not state or state not in states:
        raise HTTPException(400, "state 검증 실패(재시도해 주세요).")

    # ✅ 토큰 교환
    token_url = f"{KAUTH}/oauth/token"
    data = {
        "grant_type": "authorization_code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "code": code,
    }
    if client_secret:
        data["client_secret"] = client_secret

    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            token_url,
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        if token_res.status_code != 200:
            raise HTTPException(token_res.status_code, f"token 교환 실패: {token_res.text}")

        token_json = token_res.json()
        access_token = token_json.get("access_token")
        if not access_token:
            raise HTTPException(400, "access_token이 없습니다.")

        expires = int(token_json.get("expires_in", 3600))

    # ✅ 여기서 resp는 딱 1번만 만들기
    resp = RedirectResponse(frontend_success)

    # ✅ access_token을 HttpOnly 쿠키로 저장
    resp.set_cookie(
        TOKEN_COOKIE,
        access_token,
        httponly=True,
        samesite="lax",
        max_age=expires,
        path="/",
    )

    # ✅ 사용한 state는 쿠키에서 제거(깔끔)
    remaining = [s for s in states if s != state]
    if remaining:
        resp.set_cookie(
            STATE_COOKIE,
            ",".join(remaining),
            httponly=True,
            samesite="lax",
            max_age=300,
            path="/",
        )
    else:
        resp.delete_cookie(STATE_COOKIE, path="/")

    return resp

@router.post("/logout")
async def kakao_logout(request: Request):
    from fastapi.responses import JSONResponse
    token = request.cookies.get(TOKEN_COOKIE)
    resp = JSONResponse({"ok": True})
    resp.delete_cookie(TOKEN_COOKIE, path="/")
    if token:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{KAPI}/v1/user/logout",
                headers={"Authorization": f"Bearer {token}"},
            )
    return resp

@router.get("/me")
async def kakao_me(request: Request):
    token = request.cookies.get(TOKEN_COOKIE)
    if not token:
        raise HTTPException(401, "로그인 토큰이 없습니다.")

    async with httpx.AsyncClient() as client:
        me_res = await client.get(
            f"{KAPI}/v2/user/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    if me_res.status_code != 200:
        raise HTTPException(me_res.status_code, me_res.text)

    return me_res.json()