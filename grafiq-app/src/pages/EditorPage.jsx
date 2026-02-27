import { useState } from 'react';
import { C } from '../styles/designTokens';
import { Panel, AIBadge } from '../components/shared';
import { Icon } from '../components/Icons';

export const EditorPage = ({ template }) => {
  const [leftTab, setLeftTab] = useState("layers");
  const [rightTab, setRightTab] = useState("style");
  const [selectedEl, setSelectedEl] = useState("headline");
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);

  // Element styles state - tracks style properties for each element
  const [elementStyles, setElementStyles] = useState({
    headline: {
      fontFamily: "Syne",
      fontSize: 28,
      fontWeight: 700,
      color: "#FFFFFF",
      padding: 4,
      margin: 0,
      gap: 0,
      borderRadius: 4,
      shadow: "0 4px 12px rgba(0,0,0,0.5)",
      textAlign: "left",
    },
    subtitle: {
      fontFamily: "Syne",
      fontSize: 14,
      fontWeight: 400,
      color: "#94A3B8",
      padding: 4,
      margin: 0,
      gap: 0,
      borderRadius: 4,
      shadow: "none",
      textAlign: "left",
    },
    score: {
      fontFamily: "Syne",
      fontSize: 24,
      fontWeight: 700,
      color: "#22D3EE",
      padding: 4,
      margin: 0,
      gap: 0,
      borderRadius: 4,
      shadow: "none",
      textAlign: "center",
    },
  });

  const layers = [
    { id: "background", label: "Background", type: "rect", locked: false },
    { id: "logo", label: "Team Logo", type: "image", locked: false },
    { id: "headline", label: "Main Headline", type: "text", locked: false },
    { id: "subtitle", label: "Subtitle", type: "text", locked: false },
    { id: "score", label: "Score Block", type: "group", locked: false },
    { id: "badge", label: "Match Badge", type: "image", locked: true },
  ];

  const elements = [
    { id: "headline", x: 60, y: 80, w: 360, h: 60, label: "India Clinches Historic Victory", type: "text" },
    { id: "subtitle", x: 60, y: 150, w: 260, h: 32, label: "IPL Final 2025", type: "text" },
    { id: "score", x: 280, y: 200, w: 120, h: 48, label: "187 / 4", type: "text" },
  ];

  // Get current element's style
  const currentStyle = elementStyles[selectedEl] || elementStyles.headline;

  // Update style property for selected element
  const updateStyle = (property, value) => {
    setElementStyles(prev => ({
      ...prev,
      [selectedEl]: {
        ...prev[selectedEl],
        [property]: value,
      },
    }));
  };

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
              {layers.map((layer) => (
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
            {elements.map(el => {
              const style = elementStyles[el.id] || elementStyles.headline;
              return (
              <div key={el.id} onClick={() => setSelectedEl(el.id)} style={{
                position: "absolute",
                left: `${el.x * zoom / 100}px`, top: `${el.y * zoom / 100}px`,
                width: `${el.w * zoom / 100}px`,
                fontFamily: `${style.fontFamily}, sans-serif`,
                fontSize: `${style.fontSize * zoom / 100}px`,
                color: style.color, fontWeight: style.fontWeight, cursor: "move",
                padding: `${style.padding * zoom / 100}px`,
                border: selectedEl === el.id ? `1px dashed rgba(99,102,241,0.8)` : "1px dashed transparent",
                borderRadius: style.borderRadius,
                boxShadow: style.shadow,
                textAlign: style.textAlign,
                userSelect: "none",
                display: "flex", alignItems: "center",
              }}>
                {el.label}
                {selectedEl === el.id && (
                  <div style={{ position: "absolute", top: -6, left: -6, right: -6, bottom: -6, border: `2px solid ${C.accent}`, borderRadius: 6, pointerEvents: "none", boxShadow: `0 0 12px rgba(99,102,241,0.4)` }} />
                )}
              </div>
              );
            })}
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
                  <select 
                    value={currentStyle.fontFamily} 
                    onChange={(e) => updateStyle('fontFamily', e.target.value)}
                    style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none" }}>
                    <option value="Syne">Syne</option>
                    <option value="DM Sans">DM Sans</option>
                    <option value="Inter">Inter</option>
                  </select>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <input 
                      type="number" 
                      value={currentStyle.fontSize} 
                      onChange={(e) => updateStyle('fontSize', parseInt(e.target.value) || 16)}
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 13, outline: "none" }} 
                    />
                    <select 
                      value={currentStyle.fontWeight} 
                      onChange={(e) => updateStyle('fontWeight', parseInt(e.target.value))}
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 13, outline: "none" }}>
                      <option value="700">Bold</option>
                      <option value="600">SemiBold</option>
                      <option value="400">Regular</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Colors</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["#FFFFFF", "#6366F1", "#22D3EE", "#10B981", "#F59E0B", "#EF4444", "#1E40AF", "#7C3AED"].map(color => (
                    <div 
                      key={color} 
                      onClick={() => updateStyle('color', color)}
                      style={{
                        width: 28, height: 28, borderRadius: 6, background: color,
                        cursor: "pointer", border: currentStyle.color === color ? `2px solid ${C.accent}` : "2px solid transparent",
                      }} 
                    />
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Spacing</div>
                {[
                  { label: "Padding", prop: "padding" }, 
                  { label: "Margin", prop: "margin" }, 
                  { label: "Gap", prop: "gap" }
                ].map(({ label, prop }) => (
                  <div key={prop} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: C.textSub }}>{label}</span>
                    <input 
                      type="number" 
                      value={currentStyle[prop]} 
                      onChange={(e) => updateStyle(prop, parseInt(e.target.value) || 0)}
                      style={{ width: 64, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 8px", color: C.text, fontSize: 12, outline: "none" }} 
                    />
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Shadow</div>
                <div 
                  onClick={() => updateStyle('shadow', currentStyle.shadow === 'none' ? '0 4px 12px rgba(0,0,0,0.5)' : 'none')}
                  style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <div style={{ width: 32, height: 24, background: "#1a1a2e", borderRadius: 4, boxShadow: currentStyle.shadow }} />
                  <span style={{ fontSize: 12, color: C.textSub }}>{currentStyle.shadow === 'none' ? 'None' : '0 4px 12px rgba(0,0,0,0.5)'}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Border Radius</div>
                <input 
                  type="range" 
                  min="0" 
                  max="24" 
                  value={currentStyle.borderRadius} 
                  onChange={(e) => updateStyle('borderRadius', parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: C.accent }} 
                />
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
                <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, marginBottom: 8, cursor: "pointer" }}>
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
                {["Left", "Center", "Right", "Top", "Mid", "Bottom"].map(a => (
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
