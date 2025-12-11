import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AnalysisForm from './components/AnalysisForm';
import ReportRenderer from './components/ReportRenderer';
import ChatAssistant from './components/ChatAssistant';
import Documentation from './components/Documentation';
import LlmsTxtGenerator from './components/LlmsTxtGenerator';
import { analyzeSEO } from './services/geminiService';
import { AnalysisStatus, AnalysisResult, SEOAnalysisRequest } from './types';
import { AlertCircle } from 'lucide-react';

type ViewState = 'home' | 'docs' | 'llms-generator';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing analysis...');
  const [currentRequest, setCurrentRequest] = useState<SEOAnalysisRequest | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Manage Dark Mode Global Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check for URL parameters on mount to support sharing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');

    if (urlParam && status === AnalysisStatus.IDLE) {
      const request: SEOAnalysisRequest = {
        url: urlParam,
        targetKeywords: params.get('keywords') || undefined,
        competitors: params.get('competitors') || undefined,
        additionalContext: params.get('context') || undefined,
      };
      // Auto-trigger analysis
      handleAnalysisSubmit(request);
    }
  }, []);

  const handleAnalysisSubmit = async (request: SEOAnalysisRequest) => {
    // Ensure we are on the home view when starting analysis
    setCurrentView('home');
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setResult(null);
    setTargetUrl(request.url);
    setCurrentRequest(request);
    setLoadingMessage('Initializing SEO agents...');

    try {
      // Scroll to top to show loading state nicely
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const analysisResult = await analyzeSEO(request, (streamedText) => {
        const lines = streamedText.split('\n');
        // Look for headings to update status (reverse to find the latest)
        const latestHeader = lines.slice().reverse().find(line => line.trim().match(/^#{1,3}\s/));
        
        if (latestHeader) {
           const sectionName = latestHeader.replace(/^#{1,3}\s+(\d+(\.\d+)?\s*)?/, '').trim();
           // Keep it short
           const shortName = sectionName.length > 40 ? sectionName.substring(0, 37) + '...' : sectionName;
           setLoadingMessage(`Analyzing: ${shortName}`);
        } else if (streamedText.length > 20) {
           setLoadingMessage('Generating report content...');
        }
      });
      
      setResult(analysisResult);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleNavigation = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (currentView === 'docs') {
      return <Documentation />;
    }
    
    if (currentView === 'llms-generator') {
      return <LlmsTxtGenerator />;
    }

    // Home View
    return (
      <div className="space-y-12">
        {/* Hero Section */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Unlock Your Website's <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-cyan-500">Search Potential</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
              Generate professional, AI-powered SEO audit reports in seconds. Identify technical issues, keyword gaps, and competitor opportunities.
            </p>
          </div>
        )}

        {/* Form Section - Hide when completed to focus on report, or keep for re-analysis */}
        <div className={`transition-all duration-500 ${status === AnalysisStatus.COMPLETED ? 'opacity-0 h-0 overflow-hidden hidden' : 'opacity-100'}`}>
            <div className="max-w-2xl mx-auto">
              <AnalysisForm 
                onSubmit={handleAnalysisSubmit} 
                isLoading={status === AnalysisStatus.ANALYZING} 
                loadingMessage={loadingMessage}
              />
            </div>
        </div>

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="max-w-2xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 text-red-700 dark:text-red-400 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Analysis Failed</h3>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={() => setStatus(AnalysisStatus.IDLE)}
                className="mt-3 text-sm font-medium underline hover:text-red-800 dark:hover:text-red-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {status === AnalysisStatus.COMPLETED && result && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => setStatus(AnalysisStatus.IDLE)}
                  className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium flex items-center gap-1"
                >
                  ← Start New Analysis
                </button>
            </div>
            <ReportRenderer 
              markdown={result.markdown} 
              sources={result.sources}
              targetUrl={targetUrl}
              metrics={result.metrics}
              analysisRequest={currentRequest}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              onCreateLlmsTxt={() => handleNavigation('llms-generator')}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout 
      onChatToggle={() => setIsChatOpen(!isChatOpen)} 
      onNavigate={handleNavigation}
      currentView={currentView}
      isDarkMode={isDarkMode}
      onThemeToggle={() => setIsDarkMode(!isDarkMode)}
    >
      {renderContent()}

      {/* Global Chat Assistant */}
      <ChatAssistant isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </Layout>
  );
};

export default App;