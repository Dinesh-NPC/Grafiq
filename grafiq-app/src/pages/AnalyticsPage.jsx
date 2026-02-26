import { useMemo } from 'react';
import { C } from '../styles/designTokens';
import { Panel } from '../components/shared';

// Analytics Page
export const AnalyticsPage = () => {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  const usageData = [42, 68, 55, 89, 103, 77, 120, 134];
  const aiData = [72, 78, 81, 84, 87, 85, 89, 92];
  const maxUsage = Math.max(...usageData);

  const heatmapData = useMemo(() => 
    Array.from({ length: 7 * 24 }, (_, i) => ({
      val: Math.random(),
      day: Math.floor(i / 24),
      hour: i % 24,
    })), 
  []);

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
