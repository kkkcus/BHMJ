// src/pages/Recommend.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Recommend.module.css";
import { postRecommend } from "../lib/api";
import { ALL_ING, POPULAR, normalizeIngName } from "../lib/ingredientCatalog";
import BottomNav from "../components/BottomNav";
import { findRecipe } from "../data/recipes";

type Item = {
  id: string;
  name: string;
  qty: number;
  unit: "개" | "g" | "ml" | "장";
};

type Recipe = {
  id: string;
  title: string;
  estTime?: string;
  need?: string[];
};

const UNITS: Item["unit"][] = ["개", "g", "ml", "장"];

type SortKey = "match_desc" | "time_asc" | "need_asc";

export default function Recommend() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = sessionStorage.getItem('bhmj_rec_items');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // 드롭다운 제어
  const [openDrop, setOpenDrop] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = (id: string, delta: 1 | -1) => {
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => changeQty(id, delta), 80);
    }, 400);
  };
  const stopHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
  };

  // items 변경 시 sessionStorage 저장
  useEffect(() => {
    sessionStorage.setItem('bhmj_rec_items', JSON.stringify(items));
  }, [items]);

  // 추천 결과
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<Recipe[]>(() => {
    try {
      const saved = sessionStorage.getItem('bhmj_rec_recs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // ✅ 무신사식: 버튼 → 바텀시트
  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>("match_desc");

  // 시간 필터 (null이면 제한 없음)
  const [maxTime, setMaxTime] = useState<number | null>(20);

  // 제안 리스트: 입력 없으면 인기 재료, 입력 있으면 부분 일치
  const suggestions = useMemo(() => {
    const q = query.trim();
    if (!q) return POPULAR.slice(0, 30);

    const qLower = q.toLowerCase();
    const matched = ALL_ING.filter((v) => v.toLowerCase().includes(qLower));

    // 1) 매칭된 것 우선
    // 2) 매칭이 없어도 Enter로 바로 추가할 수 있게 q를 첫 후보로 넣음
    const out = matched.length ? matched : [q];

    // q가 이미 후보에 있으면 중복 제거
    const uniq = Array.from(new Set(out));
    return uniq.slice(0, 30);
  }, [query]);

  // suggestions 바뀌면 hoverIdx가 범위 밖으로 튀지 않게 정리
  useEffect(() => {
    setHoverIdx((prev) => {
      if (suggestions.length === 0) return -1;
      if (prev >= suggestions.length) return suggestions.length - 1;
      return prev;
    });
  }, [suggestions]);

  const pushItem = (name: string) => {
    const n = normalizeIngName(name);
    if (!n) return;

    setItems((prev) => {
      const idx = prev.findIndex((it) => it.name === n);
      if (idx >= 0) {
        return prev.map((it, i) => (i === idx ? { ...it, qty: it.qty + 1 } : it));
      }
      return [...prev, { id: crypto.randomUUID(), name: n, qty: 1, unit: "개" }];
    });
  };

  const addFromEnter = () => {
    const target = suggestions[hoverIdx >= 0 ? hoverIdx : 0] ?? query.trim();
    if (!target) return;
    pushItem(target);
    setQuery("");
    setHoverIdx(-1);
    setOpenDrop(false);
  };

  const changeQty = (id: string, delta: 1 | -1) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));

  const changeUnit = (id: string, unit: Item["unit"]) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, unit } : it)));

  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  // ✅ 프론트 표시용: 시간필터 + 정렬
  const viewRecs = useMemo(() => {
    const parseMin = (t?: string) => {
      if (!t) return 9999;
      const m = t.match(/\d+/);
      return m ? Number(m[0]) : 9999;
    };

    let arr = [...recs];

    // 시간 N분 이하만 보기
    if (maxTime != null) arr = arr.filter((r) => parseMin(r.estTime) <= maxTime);

    // 정렬
    if (sortKey === "time_asc") arr.sort((a, b) => parseMin(a.estTime) - parseMin(b.estTime));
    else if (sortKey === "need_asc") arr.sort((a, b) => (a.need?.length ?? 0) - (b.need?.length ?? 0));
    // match_desc는 백엔드가 점수 안 주면 일단 원래 순서 유지

    return arr;
  }, [recs, maxTime, sortKey]);

  // 추천 버튼 클릭 (서버에는 그냥 추천만 요청)
  const handleRecommend = async () => {
    if (!items.length) return;
    try {
      setLoading(true);
      setRecs([]);
      const avoid: string[] = (() => {
        try {
          const saved = localStorage.getItem('bhmj_avoid');
          return saved ? JSON.parse(saved) : [];
        } catch { return []; }
      })();
      const recipes = await postRecommend({
        ingredients: items.map((i) => ({ name: i.name, qty: i.qty, unit: i.unit })),
        limit: 10,
        avoid,
      });
      setRecs(recipes);
      sessionStorage.setItem('bhmj_rec_recs', JSON.stringify(recipes));
    } catch (e) {
      alert("추천 요청 실패");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 입력 이벤트
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpenDrop(true);
      if (!suggestions.length) return;
      setHoverIdx((i) => Math.min((i < 0 ? 0 : i + 1), suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!suggestions.length) return;
      setHoverIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      addFromEnter();
    } else if (e.key === "Escape") {
      setOpenDrop(false);
      setHoverIdx(-1);
    }
  };

  return (
    <main className={`card ${s.pageWrap}`}>
      <div className={s.stickyTop}>
      {/* 상단바 */}
      <div className={s.topbar}>
        <button className={s.iconCircle} onClick={() => history.back()} aria-label="뒤로가기">
          <img src="/back.png" className={s.icon} alt="" />
        </button>
        <div className={s.title}>냉장고 털기</div>
        <button className={s.iconCircle} aria-label="도움말">
          <img src="/help.png" className={s.icon} alt="" />
        </button>
      </div>

      {/* 검색 + 제안 드롭다운 */}
      <div className={s.searchBlock}>
        <div className={s.searchRow}>
          <input
            ref={inputRef}
            className={s.search}
            placeholder="재료명을 입력해주세요!"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenDrop(true);
              setHoverIdx(-1);
            }}
            onFocus={() => setOpenDrop(true)}
            onBlur={() => setTimeout(() => setOpenDrop(false), 120)}
            onKeyDown={onKeyDown}
          />

          {openDrop && suggestions.length > 0 && (
            <div className={s.dropdown}>
              {suggestions.map((name, i) => (
                <button
                  key={`${name}-${i}`}
                  className={`${s.dropItem} ${i === hoverIdx ? s.dropItemActive : ""}`}
                  onMouseDown={(ev) => ev.preventDefault()} // blur 방지
                  onClick={() => {
                    pushItem(name);
                    setQuery("");
                    setHoverIdx(-1);
                    setOpenDrop(false);
                  }}
                  onMouseEnter={() => setHoverIdx(i)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ 무신사식: 정렬/필터 버튼 바 */}
      <div className={s.filterBar}>
        <button
          className={s.chipBtn}
          onClick={() => {
            setOpenSort(true);
            setOpenFilter(false);
          }}
        >
          정렬
        </button>
        <button
          className={s.chipBtn}
          onClick={() => {
            setOpenFilter(true);
            setOpenSort(false);
          }}
        >
          필터
        </button>

        {/* 상태 표시(선택) */}
      {maxTime != null && (
        <button
          type="button"
          className={s.chipActive}
          onClick={() => setMaxTime(null)}
          aria-label={`시간 필터 해제 (${maxTime}분 이하)`}
          title="필터 해제"
        >
          {maxTime}분 이하 <span className={s.chipX}>×</span>
        </button>
      )}

      {sortKey !== "match_desc" && (
        <button
          type="button"
          className={s.chipActive}
          onClick={() => setSortKey("match_desc")}
          aria-label="정렬 해제(기본 추천 순으로)"
          title="정렬 해제"
        >
          {sortKey === "time_asc" ? "시간순" : "추가재료순"} <span className={s.chipX}>×</span>
        </button>
      )}

      </div>

      {/* 선택된 재료 리스트 */}
      <div className={s.list}>
        {items.map((it) => (
          <div key={it.id} className={s.itemCard}>
            <div className={s.cardName}>{it.name}</div>

            <div className={s.qtyBox}>
              <button
                className={s.roundMini}
                onClick={() => changeQty(it.id, -1)}
                onMouseDown={() => startHold(it.id, -1)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                aria-label="수량 감소"
              >–</button>
              <div className={s.qtyDisplay}>{it.qty}</div>
              <button
                className={s.roundMini}
                onClick={() => changeQty(it.id, +1)}
                onMouseDown={() => startHold(it.id, +1)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                aria-label="수량 증가"
              >+</button>
            </div>

            <select className={s.unit} value={it.unit} onChange={(e) => changeUnit(it.id, e.target.value as Item["unit"])}>
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <button className={s.delete} onClick={() => removeItem(it.id)} aria-label="삭제">
              ×
            </button>
          </div>
        ))}
      </div>

      {/* 하단: 레시피 추천받기 */}
      <div className={s.bottomArea}>
        <button className={s.recommendBtn} disabled={!items.length || loading} onClick={handleRecommend}>
          {loading ? "추천 생성 중…" : "레시피 추천받기"}
        </button>
      </div>

      {/* 구분선 */}
      <div className={s.divider} />
      </div>{/* /stickyTop */}

      {/* 추천 결과 출력 */}
      <div className={s.scrollArea}>
        {!!recs.length && (
          <div className={s.results}>
              {viewRecs.map((r) => (
                <article key={r.id} className={s.recipe}>
                  <div className={s.recipeHead}>
                    <img src="/fridge.png" alt="" />
                    <div>
                      <div className={s.titleRow}>{r.title}</div>
                      <div className={s.meta}>
                        {r.estTime ?? "-"} · {findRecipe(r.title)?.difficulty ?? "-"}
                      </div>
                    </div>
                  </div>
                  <button
                    className={s.viewBtn}
                    onClick={() => nav(`/recipe/${encodeURIComponent(r.title)}`, {
                      state: { need: r.need, estTime: r.estTime }
                    })}
                  >자세히</button>
                </article>
              ))}
          </div>
        )}
      </div>

      <BottomNav />

      {/* ✅ 바텀시트(필터/정렬) */}
      {(openFilter || openSort) && (
        <div
          className={s.sheetBackdrop}
          onClick={() => {
            setOpenFilter(false);
            setOpenSort(false);
          }}
        >
          <div className={s.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={s.sheetHeader}>
              <div className={s.sheetTitle}>{openSort ? "정렬" : "필터"}</div>
              <button
                className={s.sheetClose}
                onClick={() => {
                  setOpenFilter(false);
                  setOpenSort(false);
                }}
              >
                ×
              </button>
            </div>

            {openSort ? (
              <div className={s.sheetBody}>
                <button className={`${s.opt} ${sortKey === "match_desc" ? s.optOn : ""}`} onClick={() => setSortKey("match_desc")}>
                  기본(추천 순)
                </button>
                <button className={`${s.opt} ${sortKey === "time_asc" ? s.optOn : ""}`} onClick={() => setSortKey("time_asc")}>
                  시간 짧은 순
                </button>
                <button className={`${s.opt} ${sortKey === "need_asc" ? s.optOn : ""}`} onClick={() => setSortKey("need_asc")}>
                  추가재료 적은 순
                </button>
              </div>
            ) : (
              <div className={s.sheetBody}>
                <div className={s.sectionTitle}>시간</div>
                <div className={s.pills}>
                  {[10, 15, 20, 30].map((m) => (
                    <button
                      key={m}
                      className={`${s.pillOpt} ${maxTime === m ? s.pillOptOn : ""}`}
                      onClick={() => setMaxTime(m)}
                    >
                      {m}분 이하
                    </button>
                  ))}
                  <button
                    className={`${s.pillOpt} ${maxTime === null ? s.pillOptOn : ""}`}
                    onClick={() => setMaxTime(null)}
                  >
                    제한 없음
                  </button>
                </div>
              </div>
            )}

            <div className={s.sheetFooter}>
              <button
                className={s.applyBtn}
                onClick={() => {
                  setOpenFilter(false);
                  setOpenSort(false);
                }}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
