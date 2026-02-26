import { useState, useCallback, useMemo, useRef, useEffect, memo } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0F172A",
  panel: "#111827",
  panelAlt: "#0D1424",
  accent: "#6366F1",
  accentDim: "rgba(99,102,241,0.15)",
  ai: "#22D3EE",
  aiDim: "rgba(34,211,238,0.12)",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(99,102,241,0.4)",
  text: "#F1F5F9",
  textMuted: "#64748B",
  textSub: "#94A3B8",
};

// ─── Global Styles ─────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      background: ${C.bg};
      color: ${C.text};
      font-family: 'DM Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow: hidden;
    }
    
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
    
    .syne { font-family: 'Syne', sans-serif; }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 8px rgba(34,211,238,0.3); } 50% { box-shadow: 0 0 20px rgba(34,211,238,0.6); } }
    @keyframes slide-in { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    
    .fade-in { animation: fadeIn 0.35s ease both; }
    .slide-in { animation: slide-in 0.3s ease both; }
    
    .skeleton {
      background: linear-gradient(90deg, ${C.panel} 25%, rgba(255,255,255,0.04) 50%, ${C.panel} 75%);
      background-size: 400px 100%;
      animation: shimmer 1.4s infinite;
    }
    
    .ai-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .float { animation: float 3s ease-in-out infinite; }
    
    .glass {
      background: rgba(17,24,39,0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    
    .card-hover {
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      border-color: rgba(99,102,241,0.4);
    }
    
    .btn-primary {
      background: linear-gradient(135deg, ${C.accent}, #4F46E5);
      color: white;
      border: none;
      border-radius: 10px;
      padding: 10px 20px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      letter-spacing: 0.01em;
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
    .btn-primary:active { transform: translateY(0); }
    
    .btn-ghost {
      background: rgba(255,255,255,0.04);
      color: ${C.textSub};
      border: 1px solid ${C.border};
      border-radius: 10px;
      padding: 9px 18px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-ghost:hover { background: rgba(255,255,255,0.07); color: ${C.text}; border-color: rgba(255,255,255,0.12); }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      color: ${C.textMuted};
      font-size: 14px;
      font-weight: 500;
      border: 1px solid transparent;
      text-decoration: none;
      white-space: nowrap;
    }
    .nav-item:hover { background: rgba(255,255,255,0.04); color: ${C.text}; }
    .nav-item.active { background: ${C.accentDim}; color: ${C.accent}; border-color: rgba(99,102,241,0.2); }
    
    input, textarea {
      font-family: 'DM Sans', sans-serif;
    }
    
    .resizable-panel { transition: width 0.2s ease; }
    
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
  `}</style>
);

// ─── Icons (SVG) ──────────────────────────────────────────────────────────────
const Icon = {
  Grid: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Wand: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 4-1 1"/><path d="m9 4 1 1"/><path d="M4 9l1 1"/><path d="M4 15l1-1"/><path d="m20 9-1 1"/><path d="m20 15-1-1"/><path d="m9 20 1-1"/><path d="m15 20-1-1"/><circle cx="12" cy="12" r="4"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Layers: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Trending: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Zap: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  Cpu: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  Image: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Type: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  Move: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>,
  BarChart: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Home: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Sparkle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
};

// ─── Mock Data Generation ─────────────────────────────────────────────────────
const SPORT_CATEGORIES = ["Cricket", "Football", "Basketball", "Tennis", "Formula 1", "Baseball"];
const TEMPLATE_TYPES = ["Match", "Player", "Team", "Season", "Highlight", "Stats"];
const GRADIENT_PRESETS = [
  ["#1e3a5f","#0f2027"],["#1a1a2e","#16213e"],["#0d1b2a","#1b263b"],
  ["#1a0533","#2d1b69"],["#003049","#023e5c"],["#1a2f1a","#0d1f0d"],
  ["#2d1515","#1a0a0a"],["#1f1a2e","#2d1b4e"],["#0a1628","#162032"],
  ["#1e1e2e","#2a2a3e"],["#0f1923","#1a2840"],["#1a1f2e","#252b3d"],
];

const generateTemplates = () => {
  return Array.from({ length: 620 }, (_, i) => {
    const type = TEMPLATE_TYPES[i % TEMPLATE_TYPES.length];
    const sport = SPORT_CATEGORIES[Math.floor(i / 20) % SPORT_CATEGORIES.length];
    const gradient = GRADIENT_PRESETS[i % GRADIENT_PRESETS.length];
    const popularity = Math.random();
    const recency = Math.random();
    const pastUsage = Math.random();
    // XGBoost-like ranking score simulation
    const rankScore = (popularity * 0.4) + (recency * 0.3) + (pastUsage * 0.2) + (Math.random() * 0.1);
    
    return {
      id: `tpl-${i + 1}`,
      name: `${sport} ${type} ${String(i + 1).padStart(3, "0")}`,
      type,
      sport,
      gradient,
      popularity: Math.floor(popularity * 10000),
      recency,
      pastUsage,
      rankScore,
      isNew: i > 580,
      isPro: i % 7 === 0,
      usageCount: Math.floor(Math.random() * 5000),
      aiConfidence: 75 + Math.floor(Math.random() * 25),
    };
  });
};

const ALL_TEMPLATES = generateTemplates();

// Ranking simulation (Multi-Armed Bandit + LTR)
const getRecommendations = (templates, count = 8) => {
  return [...templates]
    .sort((a, b) => b.rankScore - a.rankScore)
    .slice(0, count);
};

const getTrending = (templates, count = 6) => {
  return [...templates]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, count);
};

// ─── Shared Components ────────────────────────────────────────────────────────
const Panel = ({ children, style = {}, className = "" }) => (
  <div className={className} style={{
    background: C.panel,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    ...style,
  }}>
    {children}
  </div>
);

const Badge = ({ children, color = C.accent, bg = C.accentDim }) => (
  <span className="tag" style={{ color, background: bg }}>
    {children}
  </span>
);

const Spinner = ({ size = 18 }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid rgba(99,102,241,0.2)`,
    borderTop: `2px solid ${C.accent}`,
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  }} />
);

const AIBadge = ({ text = "AI" }) => (
  <span className="tag" style={{ color: C.ai, background: C.aiDim, border: `1px solid rgba(34,211,238,0.2)` }}>
    ✦ {text}
  </span>
);

// ─── Template Card ─────────────────────────────────────────────────────────────
const TemplateCard = memo(({ template, onUse, onPreview, index }) => {
  const [hovered, setHovered] = useState(false);
  const delay = `${(index % 12) * 30}ms`;

  return (
    <div
      className="card-hover fade-in"
      style={{ animationDelay: delay, cursor: "pointer", position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "16/10" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPreview(template)}
    >
      {/* Gradient Preview */}
      <div style={{
        width: "100%", height: "100%",
        background: `linear-gradient(135deg, ${template.gradient[0]}, ${template.gradient[1]})`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 8, padding: 20, position: "relative",
      }}>
        {/* Abstract sport graphic */}
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: `rgba(255,255,255,0.06)`,
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24,
        }}>
          {template.sport === "Cricket" ? "🏏" : template.sport === "Football" ? "⚽" : template.sport === "Basketball" ? "🏀" : template.sport === "Tennis" ? "🎾" : template.sport === "Formula 1" ? "🏎️" : "⚾"}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{template.type}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>{template.sport}</div>
        </div>
        {template.isNew && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <Badge color={C.success} bg="rgba(16,185,129,0.15)">New</Badge>
          </div>
        )}
        {template.isPro && (
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <Badge color={C.warning} bg="rgba(245,158,11,0.15)">Pro</Badge>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(10,14,30,0.92)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 10, padding: 20,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: "center", marginBottom: 4 }}>
          {template.name}
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>
          {template.usageCount.toLocaleString()} uses • {template.aiConfidence}% AI match
        </div>
        <button className="btn-primary" style={{ width: "100%", padding: "9px 16px" }}
          onClick={e => { e.stopPropagation(); onUse(template); }}>
          Use Template
        </button>
        <button className="btn-ghost" style={{ width: "100%", padding: "8px 16px" }}
          onClick={e => { e.stopPropagation(); onPreview(template); }}>
          Preview
        </button>
      </div>
    </div>
  );
});

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="skeleton" style={{ borderRadius: 12, aspectRatio: "16/10" }} />
);

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
const TopNav = ({ currentPage, setPage, sidebarOpen, setSidebarOpen }) => (
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
      <span style={{ color: C.textMuted, fontSize: 13 }}>
        {currentPage === "home" ? "Dashboard" : currentPage === "templates" ? "Templates" : currentPage === "preview" ? "AI Preview" : currentPage === "editor" ? "Editor" : "Analytics"}
      </span>
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

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ currentPage, setPage, open }) => {
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
        <div style={{ marginTop: "auto", padding: "12px 8px", marginTop: 32 }}>
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

// ─── HOME / DASHBOARD ─────────────────────────────────────────────────────────
const HomePage = ({ setPage, setSelectedTemplate }) => {
  const stats = [
    { label: "Templates Used", value: "1,284", change: "+12%", color: C.accent },
    { label: "Time Saved", value: "47.3h", change: "+8%", color: C.ai },
    { label: "AI Acceptance", value: "89.2%", change: "+3.1%", color: C.success },
    { label: "Designs Created", value: "342", change: "+21%", color: C.warning },
  ];

  const recommended = useMemo(() => getRecommendations(ALL_TEMPLATES, 6), []);

  return (
    <div className="fade-in" style={{ padding: "32px 36px", overflowY: "auto", height: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* Hero */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <AIBadge text="AI Studio" />
          <span style={{ fontSize: 12, color: C.textMuted }}>Powered by Grafiq-LTR v2</span>
        </div>
        <h1 className="syne" style={{ fontSize: 36, fontWeight: 800, color: C.text, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 8 }}>
          Good morning, Jordan.
        </h1>
        <p style={{ fontSize: 15, color: C.textMuted }}>Your AI has 6 template recommendations waiting based on Cricket Finals.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {stats.map((s, i) => (
          <Panel key={i} style={{ padding: "20px 24px" }} className="fade-in">
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12, fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.success, marginTop: 6, fontWeight: 600 }}>{s.change} this week</div>
          </Panel>
        ))}
      </div>

      {/* AI Recommendations */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AIBadge text="Recommended for You" />
            <span style={{ fontSize: 12, color: C.textMuted }}>Based on Cricket Finals · XGBoost LTR</span>
          </div>
          <button className="btn-ghost" style={{ fontSize: 13, padding: "6px 14px", display: "flex", alignItems: "center", gap: 4 }}
            onClick={() => setPage("templates")}>
            View All <Icon.ChevronRight />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
          {recommended.map((t, i) => (
            <TemplateCard key={t.id} template={t} index={i}
              onUse={(tpl) => { setSelectedTemplate(tpl); setPage("preview"); }}
              onPreview={(tpl) => { setSelectedTemplate(tpl); setPage("preview"); }}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel style={{ padding: "24px", cursor: "pointer", background: `linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))` }}
          className="card-hover" onClick={() => setPage("templates")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
              <Icon.Grid />
            </div>
            <span className="syne" style={{ fontSize: 16, fontWeight: 700 }}>Browse Templates</span>
          </div>
          <p style={{ fontSize: 13, color: C.textMuted }}>Explore 620+ AI-curated sports templates with smart recommendations.</p>
        </Panel>
        <Panel style={{ padding: "24px", cursor: "pointer", background: `linear-gradient(135deg, rgba(34,211,238,0.08), rgba(34,211,238,0.02))` }}
          className="card-hover" onClick={() => setPage("editor")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.aiDim, display: "flex", alignItems: "center", justifyContent: "center", color: C.ai }}>
              <Icon.Edit />
            </div>
            <span className="syne" style={{ fontSize: 16, fontWeight: 700 }}>Open Editor</span>
          </div>
          <p style={{ fontSize: 13, color: C.textMuted }}>Professional canvas editor with AI layout suggestions and smart guides.</p>
        </Panel>
      </div>
    </div>
  );
};

// ─── TEMPLATES PAGE ───────────────────────────────────────────────────────────
const TemplatesPage = ({ setPage, setSelectedTemplate }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(48);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const debounceRef = useRef(null);

  const categories = ["All", "Match", "Player", "Team", "Season"];

  useEffect(() => {
    setTimeout(() => setInitialLoad(false), 600);
  }, []);

  // Debounced search (300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const filtered = useMemo(() => {
    let result = ALL_TEMPLATES;
    if (activeCategory !== "All") result = result.filter(t => t.type === activeCategory);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.sport.toLowerCase().includes(q) || t.type.toLowerCase().includes(q));
    }
    return result;
  }, [debouncedSearch, activeCategory]);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const recommended = useMemo(() => getRecommendations(ALL_TEMPLATES, 6), []);
  const trending = useMemo(() => getTrending(ALL_TEMPLATES, 6), []);

  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => { setVisibleCount(c => c + 24); setLoading(false); }, 500);
  }, []);

  return (
    <div className="fade-in" style={{ height: "100%", overflowY: "auto", padding: "28px 36px", display: "flex", flexDirection: "column", gap: 28 }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2 className="syne" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>Template Gallery</h2>
          <p style={{ color: C.textMuted, fontSize: 14 }}>{filtered.length.toLocaleString()} templates · AI-ranked</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search 620+ templates…"
              style={{
                background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "9px 14px 9px 38px",
                color: C.text, fontSize: 13, width: 260, outline: "none",
              }}
            />
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textMuted }}>
              <Icon.Search />
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 6 }}>
        {categories.map(cat => (
          <button key={cat}
            onClick={() => { setActiveCategory(cat); setVisibleCount(48); }}
            style={{
              padding: "8px 18px", borderRadius: 10, border: "1px solid",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s ease",
              background: activeCategory === cat ? C.accentDim : "transparent",
              color: activeCategory === cat ? C.accent : C.textMuted,
              borderColor: activeCategory === cat ? "rgba(99,102,241,0.3)" : C.border,
            }}
          >{cat}</button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ color: C.textMuted, fontSize: 13, display: "flex", alignItems: "center" }}>
          Showing {Math.min(visibleCount, filtered.length).toLocaleString()} of {filtered.length.toLocaleString()}
        </span>
      </div>

      {/* AI Recommended */}
      {activeCategory === "All" && !debouncedSearch && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <AIBadge text="AI Picks" />
            <span style={{ fontSize: 12, color: C.textMuted }}>Recommended for You · Cricket Finals</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 8 }}>
            {initialLoad
              ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : recommended.map((t, i) => (
                  <TemplateCard key={t.id} template={t} index={i}
                    onUse={(tpl) => { setSelectedTemplate(tpl); setPage("preview"); }}
                    onPreview={(tpl) => { setSelectedTemplate(tpl); setPage("preview"); }}
                  />
                ))}
          </div>
        </div>
      )}

      {/* Trending */}
      {activeCategory === "All" && !debouncedSearch && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ color: C.warning, display: "flex", alignItems: "center", gap: 4 }}>
              <Icon.Trending /><span style={{ fontSize: 12, fontWeight: 700 }}>Trending Now</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
            {initialLoad
              ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : trending.map((t, i) => (
                  <TemplateCard key={t.id} template={t} index={i}
                    onUse={(tpl) => { setSelectedTemplate(tpl); setPage("preview"); }}
                    onPreview={(tpl) => { setSelectedTemplate(tpl); setPage("preview"); }}
                  />
                ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 16, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {debouncedSearch ? `Results for "${debouncedSearch}"` : activeCategory === "All" ? "All Templates" : `${activeCategory} Templates`}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div className="syne" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No templates found</div>
            <div style={{ color: C.textMuted, fontSize: 14 }}>Try a different search or category</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
            {initialLoad
              ? Array(24).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : visible.map((t, i) => (
                  <TemplateCard key={t.id} template={t} index={i}
                    onUse={(tpl) => { setSelectedTemplate(tpl); setPage("preview"); }}
                    onPreview={(tpl) => { setSelectedTemplate(tpl); setPage("preview"); }}
                  />
                ))}
          </div>
        )}

        {visible.length < filtered.length && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button className="btn-ghost" style={{ padding: "12px 32px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}
              onClick={loadMore} disabled={loading}>
              {loading ? <Spinner size={16} /> : null}
              {loading ? "Loading…" : `Load More (${filtered.length - visible.length} remaining)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── AI PREVIEW PAGE ──────────────────────────────────────────────────────────
const PreviewPage = ({ template, setPage }) => {
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState({});
  const [activeHeadline, setActiveHeadline] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const aiFields = useMemo(() => ({
    headline: template?.sport === "Cricket" ? "India Clinches Historic Finals Victory" : `${template?.sport} Match Highlights`,
    subtitle: `${template?.type} Graphic · ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    teamA: "Mumbai Indians",
    teamB: "Chennai Super Kings",
    score: "187 / 4",
    matchType: "IPL Final 2025",
  }), [template]);

  const headlines = [
    aiFields.headline,
    `${template?.sport || "Sports"} Season Finale: The Ultimate Showdown`,
    "Record-Breaking Performance Stuns the Stadium",
  ];

  const confidence = template?.aiConfidence || 92;

  const handleAccept = (field) => setAccepted(p => ({ ...p, [field]: true }));

  const AIField = ({ label, value, field }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{
        background: accepted[field] ? "rgba(16,185,129,0.06)" : C.aiDim,
        border: `1px solid ${accepted[field] ? "rgba(16,185,129,0.25)" : "rgba(34,211,238,0.25)"}`,
        borderRadius: 10, padding: "10px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        ...(loading ? {} : { boxShadow: accepted[field] ? "none" : "0 0 12px rgba(34,211,238,0.1)" }),
      }}>
        {loading ? (
          <div className="skeleton" style={{ height: 18, flex: 1, borderRadius: 4 }} />
        ) : (
          <>
            <span style={{ fontSize: 14, color: accepted[field] ? C.success : C.ai, fontWeight: 500 }}>{value}</span>
            {accepted[field]
              ? <div style={{ color: C.success }}><Icon.Check /></div>
              : <button onClick={() => handleAccept(field)} style={{ background: "none", border: "none", cursor: "pointer", color: C.ai, fontSize: 11, fontWeight: 700 }}>ACCEPT</button>
            }
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="fade-in" style={{ height: "100%", overflowY: "auto", padding: "28px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button className="btn-ghost" style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => setPage("templates")}>
          <Icon.ChevronLeft /> Back
        </button>
        <div style={{ fontSize: 13, color: C.textMuted }}>AI Preview</div>
        <div style={{ flex: 1 }} />
        <AIBadge text={`${confidence}% Confidence`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24 }}>
        
        {/* Preview Canvas */}
        <Panel style={{ padding: 0, overflow: "hidden" }}>
          <div style={{
            height: 420,
            background: template ? `linear-gradient(135deg, ${template.gradient[0]}, ${template.gradient[1]})` : `linear-gradient(135deg, #1a1a2e, #16213e)`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            position: "relative", gap: 20,
          }}>
            {loading ? (
              <Spinner size={36} />
            ) : (
              <div className="fade-in" style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                  {aiFields.matchType}
                </div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: "white", marginBottom: 12, lineHeight: 1.2, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                  {headlines[activeHeadline]}
                </h2>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 28 }}>{aiFields.subtitle}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Team A</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{aiFields.teamA}</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.ai, fontFamily: "Syne, sans-serif" }}>vs</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Team B</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{aiFields.teamB}</div>
                  </div>
                </div>
                {/* AI glow indicator */}
                <div style={{ position: "absolute", inset: 0, border: `1px solid rgba(34,211,238,0.2)`, borderRadius: 12, pointerEvents: "none", boxShadow: "inset 0 0 40px rgba(34,211,238,0.05)" }} />
              </div>
            )}
          </div>

          {/* Headline suggestions */}
          <div style={{ padding: 24, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <AIBadge text="Headline Suggestions" />
              <span style={{ fontSize: 11, color: C.textMuted }}>Transformer-generated</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {headlines.map((h, i) => (
                <div key={i} onClick={() => setActiveHeadline(i)} style={{
                  padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${activeHeadline === i ? "rgba(34,211,238,0.3)" : C.border}`,
                  background: activeHeadline === i ? C.aiDim : "transparent",
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: activeHeadline === i ? C.ai : C.textMuted, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: activeHeadline === i ? C.ai : C.textSub }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* AI Fields Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>AI-Filled Fields</div>
              <p style={{ fontSize: 12, color: C.textMuted }}>Review and accept AI-generated content. Cyan fields are AI-filled.</p>
            </div>
            
            <AIField label="Main Headline" value={headlines[activeHeadline]} field="headline" />
            <AIField label="Subtitle" value={aiFields.subtitle} field="subtitle" />
            <AIField label="Team A" value={aiFields.teamA} field="teamA" />
            <AIField label="Team B" value={aiFields.teamB} field="teamB" />
            <AIField label="Score" value={aiFields.score} field="score" />
            <AIField label="Match Type" value={aiFields.matchType} field="matchType" />
          </Panel>

          {/* Confidence Meter */}
          <Panel style={{ padding: 20 }}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12, fontWeight: 600 }}>AI CONFIDENCE</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${confidence}%`,
                  background: `linear-gradient(90deg, ${C.accent}, ${C.ai})`,
                  borderRadius: 4, transition: "width 1s ease",
                }} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: C.ai, fontFamily: "Syne, sans-serif" }}>{confidence}%</span>
            </div>
          </Panel>

          <button className="btn-primary" style={{ padding: "14px 24px", fontSize: 15, fontWeight: 700 }}
            onClick={() => setPage("editor")}>
            Proceed to Editor →
          </button>
          <button className="btn-ghost" style={{ padding: "12px 24px" }}>
            Regenerate AI Suggestions
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── EDITOR PAGE ──────────────────────────────────────────────────────────────
const EditorPage = ({ template }) => {
  const [leftTab, setLeftTab] = useState("layers");
  const [rightTab, setRightTab] = useState("style");
  const [selectedEl, setSelectedEl] = useState("headline");
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [dragging, setDragging] = useState(false);

  const layers = [
    { id: "background", label: "Background", type: "rect", locked: false },
    { id: "logo", label: "Team Logo", type: "image", locked: false },
    { id: "headline", label: "Main Headline", type: "text", locked: false },
    { id: "subtitle", label: "Subtitle", type: "text", locked: false },
    { id: "score", label: "Score Block", type: "group", locked: false },
    { id: "badge", label: "Match Badge", type: "image", locked: true },
  ];

  const elements = [
    { id: "headline", x: 60, y: 80, w: 360, h: 60, label: "India Clinches Historic Victory", type: "text", fontSize: 28, color: "#FFFFFF" },
    { id: "subtitle", x: 60, y: 150, w: 260, h: 32, label: "IPL Final 2025", type: "text", fontSize: 14, color: "#94A3B8" },
    { id: "score", x: 280, y: 200, w: 120, h: 48, label: "187 / 4", type: "text", fontSize: 24, color: "#22D3EE" },
  ];

  const aiSuggestions = [
    "Add gradient overlay for depth",
    "Increase headline contrast",
    "Align elements to 12-col grid",
    "Add team color accents",
  ];

  const ToolbarBtn = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} title={label} style={{
      width: 36, height: 36, borderRadius: 8,
      background: active ? C.accentDim : "transparent",
      border: `1px solid ${active ? "rgba(99,102,241,0.3)" : "transparent"}`,
      color: active ? C.accent : C.textMuted,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "all 0.15s",
    }}>
      {icon}
    </button>
  );

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      
      {/* Left Panel */}
      <div style={{ width: 240, background: C.panelAlt, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {[{id:"layers", icon:<Icon.Layers />, label:"Layers"},{id:"assets", icon:<Icon.Image />, label:"Assets"},{id:"ai", icon:<Icon.Sparkle />, label:"AI"}].map(tab => (
            <button key={tab.id} onClick={() => setLeftTab(tab.id)} style={{
              flex: 1, padding: "12px 8px",
              background: leftTab === tab.id ? "rgba(99,102,241,0.1)" : "transparent",
              border: "none", color: leftTab === tab.id ? C.accent : C.textMuted,
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              borderBottom: leftTab === tab.id ? `2px solid ${C.accent}` : "2px solid transparent",
              letterSpacing: "0.05em", textTransform: "uppercase",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
          {leftTab === "layers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {layers.map((layer, i) => (
                <div key={layer.id} onClick={() => setSelectedEl(layer.id)}
                  style={{
                    padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                    background: selectedEl === layer.id ? C.accentDim : "transparent",
                    border: `1px solid ${selectedEl === layer.id ? "rgba(99,102,241,0.25)" : "transparent"}`,
                    display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
                  }}>
                  <div style={{ color: selectedEl === layer.id ? C.accent : C.textMuted, opacity: 0.7, fontSize: 12 }}>
                    {layer.type === "text" ? <Icon.Type /> : <Icon.Image />}
                  </div>
                  <span style={{ fontSize: 13, color: selectedEl === layer.id ? C.text : C.textSub, flex: 1 }}>{layer.label}</span>
                  {layer.locked && <span style={{ fontSize: 10, color: C.textMuted }}>🔒</span>}
                </div>
              ))}
            </div>
          )}
          {leftTab === "ai" && (
            <div style={{ padding: "8px 4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                <AIBadge text="Suggestions" />
              </div>
              {aiSuggestions.map((s, i) => (
                <div key={i} style={{
                  padding: "10px 12px", borderRadius: 10, background: C.aiDim,
                  border: `1px solid rgba(34,211,238,0.15)`, marginBottom: 8, cursor: "pointer",
                  fontSize: 12, color: C.textSub, lineHeight: 1.5,
                  transition: "border-color 0.15s",
                }}>✦ {s}</div>
              ))}
            </div>
          )}
          {leftTab === "assets" && (
            <div style={{ padding: "8px 4px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {["Shapes", "Icons", "Photos", "Vectors"].map(a => (
                  <div key={a} style={{ aspectRatio: "1", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.textMuted, cursor: "pointer" }}>{a}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Canvas */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#080D1A", overflow: "hidden" }}>
        
        {/* Canvas Toolbar */}
        <div style={{ height: 48, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 4, background: C.panelAlt, flexShrink: 0 }}>
          <ToolbarBtn icon={<Icon.Move />} label="Move" active />
          <ToolbarBtn icon={<Icon.Type />} label="Text" />
          <ToolbarBtn icon={<Icon.Image />} label="Image" />
          <div style={{ width: 1, height: 20, background: C.border, margin: "0 6px" }} />
          <ToolbarBtn icon={<Icon.Eye />} label="Grid" active={showGrid} onClick={() => setShowGrid(g => !g)} />
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setZoom(z => Math.max(25, z - 25))}>−</button>
            <span style={{ fontSize: 12, color: C.textSub, width: 48, textAlign: "center" }}>{zoom}%</span>
            <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setZoom(z => Math.min(200, z + 25))}>+</button>
          </div>
          <div style={{ width: 1, height: 20, background: C.border, margin: "0 6px" }} />
          <button className="btn-primary" style={{ padding: "7px 16px", fontSize: 12 }}>Export</button>
        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, position: "relative", overflow: "hidden" }}>
          {/* Grid pattern */}
          {showGrid && (
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }} />
          )}
          
          {/* Canvas */}
          <div style={{
            width: `${480 * zoom / 100}px`, height: `${270 * zoom / 100}px`,
            background: template ? `linear-gradient(135deg, ${template.gradient[0]}, ${template.gradient[1]})` : "linear-gradient(135deg, #1a1a2e, #16213e)",
            borderRadius: 8, boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            position: "relative", overflow: "hidden", cursor: "crosshair",
            transition: "width 0.15s, height 0.15s",
          }}>
            {elements.map(el => (
              <div key={el.id} onClick={() => setSelectedEl(el.id)} style={{
                position: "absolute",
                left: `${el.x * zoom / 100}px`, top: `${el.y * zoom / 100}px`,
                width: `${el.w * zoom / 100}px`,
                fontFamily: "Syne, sans-serif",
                fontSize: `${el.fontSize * zoom / 100}px`,
                color: el.color, fontWeight: 700, cursor: "move",
                padding: "2px 4px",
                border: selectedEl === el.id ? `1px dashed rgba(99,102,241,0.8)` : "1px dashed transparent",
                borderRadius: 4,
                userSelect: "none",
                display: "flex", alignItems: "center",
              }}>
                {el.label}
                {selectedEl === el.id && (
                  <div style={{ position: "absolute", top: -6, left: -6, right: -6, bottom: -6, border: `2px solid ${C.accent}`, borderRadius: 6, pointerEvents: "none", boxShadow: `0 0 12px rgba(99,102,241,0.4)` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: 260, background: C.panelAlt, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {[{id:"style", label:"Style"},{id:"layout", label:"Layout"},{id:"ai", label:"AI"}].map(tab => (
            <button key={tab.id} onClick={() => setRightTab(tab.id)} style={{
              flex: 1, padding: "12px 4px",
              background: "transparent",
              border: "none", color: rightTab === tab.id ? C.accent : C.textMuted,
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              borderBottom: rightTab === tab.id ? `2px solid ${C.accent}` : "2px solid transparent",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {rightTab === "style" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Typography</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <select style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none" }}>
                    <option>Syne</option><option>DM Sans</option><option>Inter</option>
                  </select>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <input type="number" defaultValue="28" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 13, outline: "none" }} />
                    <select style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 13, outline: "none" }}>
                      <option>Bold</option><option>SemiBold</option><option>Regular</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Colors</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["#FFFFFF", "#6366F1", "#22D3EE", "#10B981", "#F59E0B", "#EF4444", "#1E40AF", "#7C3AED"].map(color => (
                    <div key={color} style={{
                      width: 28, height: 28, borderRadius: 6, background: color,
                      cursor: "pointer", border: "2px solid transparent",
                      transition: "border-color 0.15s",
                    }} />
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Spacing</div>
                {["Padding", "Margin", "Gap"].map(prop => (
                  <div key={prop} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: C.textSub }}>{prop}</span>
                    <input type="number" defaultValue={prop === "Gap" ? 8 : 16} style={{ width: 64, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 8px", color: C.text, fontSize: 12, outline: "none" }} />
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Shadow</div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 24, background: "#1a1a2e", borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }} />
                  <span style={{ fontSize: 12, color: C.textSub }}>0 4px 12px rgba(0,0,0,0.5)</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Border Radius</div>
                <input type="range" min="0" max="24" defaultValue="8" style={{ width: "100%", accentColor: C.accent }} />
              </div>
            </div>
          )}

          {rightTab === "ai" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <AIBadge text="Layout AI" />
              </div>
              {[
                { label: "Balance layout", desc: "Distribute elements evenly" },
                { label: "Boost hierarchy", desc: "Scale headline prominence" },
                { label: "Color harmony", desc: "Auto-match team colors" },
                { label: "Brand alignment", desc: "Apply brand guidelines" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, marginBottom: 8, cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{s.desc}</div>
                </div>
              ))}
            </div>
          )}

          {rightTab === "layout" && (
            <div>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Alignment</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 20 }}>
                {["⬛ Left", "⬛ Center", "⬛ Right", "⬛ Top", "⬛ Mid", "⬛ Bottom"].map(a => (
                  <button key={a} style={{ padding: "8px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 10, cursor: "pointer" }}>{a}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Position</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["X", 60], ["Y", 80], ["W", 360], ["H", 60]].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{label}</div>
                    <input type="number" defaultValue={val} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px", color: C.text, fontSize: 12, outline: "none" }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  const usageData = [42, 68, 55, 89, 103, 77, 120, 134];
  const aiData = [72, 78, 81, 84, 87, 85, 89, 92];
  const maxUsage = Math.max(...usageData);

  const heatmapData = Array.from({ length: 7 * 24 }, (_, i) => ({
    val: Math.random(),
    day: Math.floor(i / 24),
    hour: i % 24,
  }));

  return (
    <div className="fade-in" style={{ padding: "28px 36px", overflowY: "auto", height: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h2 className="syne" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>Analytics</h2>
        <p style={{ color: C.textMuted, fontSize: 14 }}>AI performance and template usage insights</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Time Saved", value: "47.3h", sub: "This month", color: C.ai },
          { label: "AI Acceptance Rate", value: "89.2%", sub: "+3.1% vs last month", color: C.success },
          { label: "Templates Used", value: "1,284", sub: "620 available", color: C.accent },
          { label: "Designs Exported", value: "342", sub: "This month", color: C.warning },
        ].map((kpi, i) => (
          <Panel key={i} style={{ padding: "22px 24px" }}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, fontWeight: 500 }}>{kpi.label}</div>
            <div className="syne" style={{ fontSize: 30, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{kpi.sub}</div>
          </Panel>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Usage Chart */}
        <Panel style={{ padding: "24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Weekly Template Usage</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Last 8 weeks</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {usageData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: "100%", height: `${(v / maxUsage) * 100}px`,
                  background: `linear-gradient(180deg, ${C.accent}, rgba(99,102,241,0.4))`,
                  borderRadius: "4px 4px 0 0", transition: "height 0.5s ease",
                }} />
                <span style={{ fontSize: 9, color: C.textMuted }}>{weeks[i]}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* AI Acceptance */}
        <Panel style={{ padding: "24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>AI Acceptance Rate</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Weekly trend</div>
          <div style={{ position: "relative", height: 120 }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${(aiData.length - 1) * 50 + 10} 100`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.ai} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={C.ai} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M ${aiData.map((v, i) => `${i * 50 + 5} ${100 - (v - 70) * 5}`).join(" L ")}`}
                stroke={C.ai} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d={`M ${aiData.map((v, i) => `${i * 50 + 5} ${100 - (v - 70) * 5}`).join(" L ")} L ${(aiData.length - 1) * 50 + 5} 100 L 5 100 Z`}
                fill="url(#lineGrad)"
              />
            </svg>
          </div>
        </Panel>
      </div>

      {/* Heatmap */}
      <Panel style={{ padding: "24px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Template Usage Heatmap</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Hour of day × Day of week</div>
        <div style={{ display: "flex", gap: 2 }}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, di) => (
            <div key={day} style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: C.textMuted, textAlign: "center", marginBottom: 4 }}>{day}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}>
                {Array.from({length:24}, (_, hi) => {
                  const cell = heatmapData[di * 24 + hi];
                  return (
                    <div key={hi} style={{
                      aspectRatio: "1", borderRadius: 2,
                      background: `rgba(99,102,241,${cell.val * 0.8})`,
                    }} title={`${day} ${hi}:00`} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* AI Model Performance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { label: "LTR Model", sub: "XGBoost v2.1", score: 94, color: C.accent },
          { label: "Headline Gen", sub: "Transformer v1.8", score: 88, color: C.ai },
          { label: "MAB Explore", sub: "ε-greedy 0.15", score: 91, color: C.success },
        ].map((m, i) => (
          <Panel key={i} style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14 }}>{m.sub}</div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${m.score}%`, background: m.color, borderRadius: 3 }} />
            </div>
            <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.score}%</div>
          </Panel>
        ))}
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(ALL_TEMPLATES[0]);
  const [notification, setNotification] = useState(null);

  const navigate = useCallback((p) => {
    setPage(p);
  }, []);

  const handleSetTemplate = useCallback((tpl) => {
    setSelectedTemplate(tpl);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={navigate} setSelectedTemplate={handleSetTemplate} />;
      case "templates": return <TemplatesPage setPage={navigate} setSelectedTemplate={handleSetTemplate} />;
      case "preview": return <PreviewPage template={selectedTemplate} setPage={navigate} />;
      case "editor": return <EditorPage template={selectedTemplate} />;
      case "analytics": return <AnalyticsPage />;
      default: return <HomePage setPage={navigate} setSelectedTemplate={handleSetTemplate} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "DM Sans, sans-serif", overflow: "hidden" }}>
        
        {/* Top Nav */}
        <TopNav currentPage={page} setPage={navigate} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <Sidebar currentPage={page} setPage={navigate} open={sidebarOpen} />
          <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {renderPage()}
          </main>
        </div>

        {/* Notification toast */}
        {notification && (
          <div style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 1000,
            background: C.panel, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "14px 20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", gap: 10,
          }} className="fade-in">
            <div style={{ color: C.success }}><Icon.Check /></div>
            <span style={{ fontSize: 14 }}>{notification}</span>
          </div>
        )}
      </div>
    </>
  );
}