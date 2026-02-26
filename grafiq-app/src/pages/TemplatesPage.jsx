import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { C } from '../styles/designTokens';
import { Panel, Spinner, AIBadge } from '../components/shared';
import { TemplateCard, SkeletonCard } from '../components/TemplateCard';
import { Icon } from '../components/Icons';
import { getRecommendations, getTrending, ALL_TEMPLATES } from '../data/mockData';

// Templates Page
export const TemplatesPage = ({ setPage, setSelectedTemplate }) => {
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
