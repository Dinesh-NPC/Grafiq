import { C } from '../styles/designTokens';
import { Icon } from './Icons';

// Top Navigation
export const TopNav = ({ currentPage, setPage, sidebarOpen, setSidebarOpen }) => {
  const getPageLabel = () => {
    switch(currentPage) {
      case "home": return "Dashboard";
      case "templates": return "Templates";
      case "preview": return "AI Preview";
      case "editor": return "Editor";
      case "analytics": return "Analytics";
      default: return "Dashboard";
    }
  };

  return (
    <div className="glass" style={{
      height: 60, borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", padding: "0 20px",
      gap: 16, position: "relative", zIndex: 100,
      flexShrink: 0,
    }}>
      <button onClick={() => setSidebarOpen(o => !o)} className="btn-ghost" style={{ padding: "6px 10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 16 }}>
          <div style={{ height: 1.5, background: C.textSub, borderRadius: 1, transition: "all 0.2s", transform: sidebarOpen ? "none" : "scaleX(0.7)", transformOrigin: "left" }} />
          <div style={{ height: 1.5, background: C.textSub, borderRadius: 1 }} />
          <div style={{ height: 1.5, background: C.textSub, borderRadius: 1, transition: "all 0.2s", transform: sidebarOpen ? "none" : "scaleX(0.85)", transformOrigin: "left" }} />
        </div>
      </button>
      
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setPage("home")}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${C.accent}, ${C.ai})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 800, color: "white", fontFamily: "Syne, sans-serif",
        }}>G</div>
        <span className="syne" style={{ fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>Grafiq</span>
      </div>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
        <span style={{ color: C.textMuted, fontSize: 13 }}>{getPageLabel()}</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ position: "relative" }}>
        <input style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "8px 14px 8px 36px",
          color: C.text, fontSize: 13,
          width: 240, outline: "none",
          transition: "border-color 0.2s",
        }}
          placeholder="Search templates…"
          onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textMuted }}>
          <Icon.Search />
        </div>
      </div>

      {/* Actions */}
      <button className="btn-primary" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}>
        <Icon.Plus /> New Graphic
      </button>

      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        background: `linear-gradient(135deg, ${C.accent}, #818CF8)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, cursor: "pointer",
      }}>JD</div>
    </div>
  );
};
