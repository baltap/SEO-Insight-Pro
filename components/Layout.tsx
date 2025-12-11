import React from 'react';
import { BarChart3, Github, Bot, Sun, Moon, FileCode } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onChatToggle?: () => void;
  onNavigate: (view: 'home' | 'docs' | 'llms-generator') => void;
  currentView: 'home' | 'docs' | 'llms-generator';
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onChatToggle, onNavigate, currentView, isDarkMode, onThemeToggle }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              SEO Insight Pro
            </span>
          </div>
          <div className="flex items-center gap-4">
             {onThemeToggle && (
               <button
                 onClick={onThemeToggle}
                 className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                 aria-label="Toggle dark mode"
               >
                 {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>
             )}
             {onChatToggle && (
               <button
                 onClick={onChatToggle}
                 className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-slate-600"
               >
                 <Bot className="w-4 h-4" />
                 <span className="hidden sm:inline">SEO Assistant</span>
               </button>
             )}
             <button
               onClick={() => onNavigate('llms-generator')}
               className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                 currentView === 'llms-generator'
                   ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                   : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
               }`}
             >
               <FileCode className="w-4 h-4" />
               <span className="hidden sm:inline">llms.txt Generator</span>
             </button>
             <button
               onClick={() => onNavigate('docs')}
               className={`text-sm font-medium transition-colors ${
                 currentView === 'docs' 
                   ? 'text-brand-600 dark:text-brand-400 font-bold' 
                   : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
               }`}
             >
               Documentation
             </button>
             <a 
               href="https://github.com/baltap/SEO-Insight-Pro" 
               target="_blank"
               rel="noreferrer"
               className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
               aria-label="GitHub Repository"
             >
               <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} SEO Insight Pro. Powered by Gemini 2.0.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;