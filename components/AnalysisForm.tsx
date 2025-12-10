import React, { useState } from 'react';
import { Search, Globe, Target, Users, FileText, X } from 'lucide-react';
import { SEOAnalysisRequest } from '../types';

interface AnalysisFormProps {
  onSubmit: (data: SEOAnalysisRequest) => void;
  isLoading: boolean;
  loadingMessage?: string;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit, isLoading, loadingMessage }) => {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [context, setContext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      // Automatically prepend https:// if protocol is missing
      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      onSubmit({
        url: formattedUrl,
        targetKeywords: keywords,
        competitors,
        additionalContext: context
      });
    }
  };

  const handleClear = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Search className="w-6 h-6" />
          Start New Analysis
        </h2>
        <p className="text-brand-100 mt-2">
          Enter a URL to generate a comprehensive SEO audit powered by Gemini 2.0.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-500" />
            Website URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="url"
              type="text"
              required
              placeholder="example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
            />
            {url && (
              <button
                type="button"
                onClick={() => handleClear(setUrl)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                title="Clear URL"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="keywords" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-500" />
              Target Keywords (Optional)
            </label>
            <div className="relative">
              <input
                id="keywords"
                type="text"
                placeholder="e.g., vintage watches, luxury travel"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
              />
              {keywords && (
                <button
                  type="button"
                  onClick={() => handleClear(setKeywords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  title="Clear keywords"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="competitors" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-500" />
              Main Competitors (Optional)
            </label>
            <div className="relative">
              <input
                id="competitors"
                type="text"
                placeholder="e.g., competitor1.com, competitor2.com"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
              />
              {competitors && (
                <button
                  type="button"
                  onClick={() => handleClear(setCompetitors)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  title="Clear competitors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="context" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            Additional Context (Optional)
          </label>
          <div className="relative">
            <textarea
              id="context"
              rows={3}
              placeholder="Any specific goals, target audience details, or known issues..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none resize-none"
            />
            {context && (
              <button
                type="button"
                onClick={() => handleClear(setContext)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                title="Clear context"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-0.5
              ${isLoading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 active:scale-95'
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingMessage || 'Analyzing... This may take up to 60 seconds'}
              </span>
            ) : (
              'Generate SEO Report'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnalysisForm;