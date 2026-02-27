import { C } from '../styles/designTokens';
import { Icon } from './Icons';

// Sidebar Navigation
export const Sidebar = ({ currentPage, setPage, open }) => {
  const navItems = [
    { id: "home", icon: <Icon.Home />, label: "Dashboard" },
    { id: "templates", icon: <Icon.Grid />, label: "Templates" },
    { id: "editor", icon: <Icon.Edit />, label: "Editor" },
    { id: "analytics", icon: <Icon.BarChart />, label: "Analytics" },
  ];

  return (
    <div style={{
      width: open ? 220 : 0,
      minWidth: open ? 220 : 0,
      overflow: "hidden",
      background: C.panelAlt,
      borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      transition: "width 0.25s ease, min-width 0.25s ease",
      flexShrink: 0,
    }}>
      <div style={{ padding: "16px 12px", opacity: open ? 1 : 0, transition: "opacity 0.2s", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(item => (
          <div key={item.id} className={`nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}

        <div style={{ margin: "20px 0 8px", padding: "0 4px", fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Workspace</div>

        <div className="nav-item" onClick={() => setPage("templates")}>
          <Icon.Sparkle /> <span>AI Recommend</span>
        </div>
        <div className="nav-item">
          <Icon.Layers /> <span>My Designs</span>
        </div>
        <div className="nav-item">
          <Icon.Image /> <span>Assets</span>
        </div>

        <div style={{ flex: 1 }} />
        
        {/* AI Status */}
        <div style={{ marginTop: "auto", padding: "12px 8px" }}>
          <div style={{ background: C.aiDim, border: `1px solid rgba(34,211,238,0.2)`, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.ai, boxShadow: `0 0 6px ${C.ai}` }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.ai }}>AI ACTIVE</span>
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Model: Grafiq-LTR v2</div>
          </div>
        </div>
      </div>
    </div>
  );
};
