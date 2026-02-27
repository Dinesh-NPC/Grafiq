import { C } from './designTokens';

// Global Styles
export const GlobalStyle = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      background: ${C.bg};
      color: ${C.text};
      font-family: 'Plus Jakarta Sans', sans-serif;
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
      font-family: 'Plus Jakarta Sans', sans-serif;
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
      font-family: 'Plus Jakarta Sans', sans-serif;
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
    
    input, textarea, select {
      font-family: 'Plus Jakarta Sans', sans-serif;
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
