import { useState, useCallback } from 'react';
import { C } from './styles/designTokens';
import { GlobalStyle } from './styles/GlobalStyles';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PreviewPage } from './pages/PreviewPage';
import { EditorPage } from './pages/EditorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ALL_TEMPLATES } from './data/mockData';

// Main App Component
export default function App() {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(ALL_TEMPLATES[0]);

  const navigate = useCallback((p) => {
    setPage(p);
  }, []);

  const handleSetTemplate = useCallback((tpl) => {
    setSelectedTemplate(tpl);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home": 
        return <HomePage setPage={navigate} setSelectedTemplate={handleSetTemplate} />;
      case "templates": 
        return <TemplatesPage setPage={navigate} setSelectedTemplate={handleSetTemplate} />;
      case "preview": 
        return <PreviewPage template={selectedTemplate} setPage={navigate} />;
      case "editor": 
        return <EditorPage template={selectedTemplate} />;
      case "analytics": 
        return <AnalyticsPage />;
      default: 
        return <HomePage setPage={navigate} setSelectedTemplate={handleSetTemplate} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ 
        width: "100vw", 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        background: C.bg, 
        fontFamily: "DM Sans, sans-serif", 
        overflow: "hidden" 
      }}>
        
        {/* Top Nav */}
        <TopNav 
          currentPage={page} 
          setPage={navigate} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <Sidebar 
            currentPage={page} 
            setPage={navigate} 
            open={sidebarOpen} 
          />
          <main style={{ 
            flex: 1, 
            overflow: "hidden", 
            display: "flex", 
            flexDirection: "column" 
          }}>
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
