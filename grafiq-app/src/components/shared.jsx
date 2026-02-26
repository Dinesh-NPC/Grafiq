import { C } from '../styles/designTokens';

// Shared Components
export const Panel = ({ children, style = {}, className = "" }) => (
  <div className={className} style={{
    background: C.panel,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    ...style,
  }}>
    {children}
  </div>
);

export const Badge = ({ children, color = C.accent, bg = C.accentDim }) => (
  <span className="tag" style={{ color, background: bg }}>
    {children}
  </span>
);

export const Spinner = ({ size = 18 }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid rgba(99,102,241,0.2)`,
    borderTop: `2px solid ${C.accent}`,
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  }} />
);

export const AIBadge = ({ text = "AI" }) => (
  <span className="tag" style={{ color: C.ai, background: C.aiDim, border: `1px solid rgba(34,211,238,0.2)` }}>
    ✦ {text}
  </span>
);
