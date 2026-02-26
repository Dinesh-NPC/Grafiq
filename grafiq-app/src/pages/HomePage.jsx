import { useMemo } from 'react';
import { C } from '../styles/designTokens';
import { Panel, AIBadge } from '../components/shared';
import { TemplateCard } from '../components/TemplateCard';
import { Icon } from '../components/Icons';
import { getRecommendations, ALL_TEMPLATES } from '../data/mockData';

// Home / Dashboard Page
export const HomePage = ({ setPage, setSelectedTemplate }) => {
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
