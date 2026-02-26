// Mock Data Generation
export const SPORT_CATEGORIES = ["Cricket", "Football", "Basketball", "Tennis", "Formula 1", "Baseball"];
export const TEMPLATE_TYPES = ["Match", "Player", "Team", "Season", "Highlight", "Stats"];
export const GRADIENT_PRESETS = [
  ["#1e3a5f","#0f2027"],["#1a1a2e","#16213e"],["#0d1b2a","#1b263b"],
  ["#1a0533","#2d1b69"],["#003049","#023e5c"],["#1a2f1a","#0d1f0d"],
  ["#2d1515","#1a0a0a"],["#1f1a2e","#2d1b4e"],["#0a1628","#162032"],
  ["#1e1e2e","#2a2a3e"],["#0f1923","#1a2840"],["#1a1f2e","#252b3d"],
];

export const generateTemplates = () => {
  return Array.from({ length: 620 }, (_, i) => {
    const type = TEMPLATE_TYPES[i % TEMPLATE_TYPES.length];
    const sport = SPORT_CATEGORIES[Math.floor(i / 20) % SPORT_CATEGORIES.length];
    const gradient = GRADIENT_PRESETS[i % GRADIENT_PRESETS.length];
    const popularity = Math.random();
    const recency = Math.random();
    const pastUsage = Math.random();
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

export const ALL_TEMPLATES = generateTemplates();

// Ranking simulation (Multi-Armed Bandit + LTR)
export const getRecommendations = (templates, count = 8) => {
  return [...templates]
    .sort((a, b) => b.rankScore - a.rankScore)
    .slice(0, count);
};

export const getTrending = (templates, count = 6) => {
  return [...templates]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, count);
};
