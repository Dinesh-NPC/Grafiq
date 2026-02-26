import { useState, memo } from 'react';
import { C } from '../styles/designTokens';
import { Badge } from './shared';

export const TemplateCard = memo(({ template, onUse, onPreview, index }) => {
  const [hovered, setHovered] = useState(false);
  const delay = `${(index % 12) * 30}ms`;

  const getSportEmoji = (sport) => {
    switch(sport) {
      case "Cricket": return "🏏";
      case "Football": return "⚽";
      case "Basketball": return "🏀";
      case "Tennis": return "🎾";
      case "Formula 1": return "🏎️";
      default: return "⚾";
    }
  };

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
          {getSportEmoji(template.sport)}
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

// Skeleton Card
export const SkeletonCard = () => (
  <div className="skeleton" style={{ borderRadius: 12, aspectRatio: "16/10" }} />
);
