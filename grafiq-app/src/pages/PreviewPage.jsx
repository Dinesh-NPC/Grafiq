import { useState, useMemo, useEffect } from 'react';
import { C } from '../styles/designTokens';
import { Panel, Spinner, AIBadge } from '../components/shared';
import { Icon } from '../components/Icons';

// AI Preview Page
export const PreviewPage = ({ template, setPage }) => {
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
