import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const nav = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => nav("/login"), 3000); // 3초 후 로그인으로
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div style={outer}>
      <div style={phone}>
        <div style={title}>밥해먹자</div>

        <div style={circleWrap}>
          {/* 로고가 없으면 임시 원만 표시됨 */}
          <img
            src="/logo.png"
            alt="앱 로고"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
            onError={(e) => {
              // 로고 없을 때 회색 배경만
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div style={fallbackCircle} />
        </div>

        <div style={{ textAlign: "center", marginTop: 8, opacity: 0.6, fontSize: 12 }}>
          로딩 중...
        </div>
      </div>
    </div>
  );
}

const outer: React.CSSProperties = {
  width: "100%",
  minHeight: "100dvh",
  background: "#f6f7fb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const phone: React.CSSProperties = {
  width: 360,
  minHeight: 640,
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
  padding: "24px 16px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const title: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  textAlign: "center",
  padding: "6px 0",
  borderBottom: "1px solid #eee",
};

const circleWrap: React.CSSProperties = {
  width: 180,
  height: 180,
  borderRadius: "50%",
  border: "2px solid #E5E7EB",
  margin: "80px auto 0",
  position: "relative",
  overflow: "hidden",
};

const fallbackCircle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#f3f4f6,#e5e7eb)",
};
