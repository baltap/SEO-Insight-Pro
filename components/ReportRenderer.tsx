import React, { useMemo, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Link as LinkIcon, CheckCircle, AlertTriangle, Info, Zap, Layout as LayoutIcon, FileText, Search as SearchIcon, Globe, Check } from 'lucide-react';
import { GroundingSource, AnalysisMetrics, AnalysisMetric, SEOAnalysisRequest } from '../types';

interface ReportRendererProps {
  markdown: string;
  sources: GroundingSource[];
  targetUrl: string;
  metrics?: AnalysisMetrics;
  analysisRequest: SEOAnalysisRequest | null;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

interface ReportSection {
  id: string;
  title: string;
  content: string;
}

const DonutChart: React.FC<{ value: number; color: string; label: string }> = ({ value, color, label }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-[140px] h-[140px] group" role="img" aria-label={`${label} Score: ${value} out of 100`}>
      <svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className="text-slate-100 dark:text-slate-700 transition-colors"
        />
        {/* Progress Circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="chart-progress transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none transition-colors">{value}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mt-1 transition-colors">/ 100</span>
      </div>
      
      {/* Custom Tooltip */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none mb-2 z-10 shadow-lg font-medium">
        {label}: {value}%
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; metric: AnalysisMetric; icon: React.ReactNode }> = ({ label, metric, icon }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return { 
        bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
        text: 'text-emerald-900 dark:text-emerald-300', 
        border: 'border-emerald-200 dark:border-emerald-800', 
        hex: '#10b981' 
      };
      case 'Good': return { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-900 dark:text-green-300', 
        border: 'border-green-200 dark:border-green-800', 
        hex: '#22c55e' 
      };
      case 'Fair': return { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-900 dark:text-yellow-300', 
        border: 'border-yellow-200 dark:border-yellow-800', 
        hex: '#eab308' 
      };
      case 'Poor': return { 
        bg: 'bg-orange-100 dark:bg-orange-900/30', 
        text: 'text-orange-900 dark:text-orange-300', 
        border: 'border-orange-200 dark:border-orange-800', 
        hex: '#f97316' 
      };
      case 'Critical': return { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-900 dark:text-red-300', 
        border: 'border-red-200 dark:border-red-800', 
        hex: '#ef4444' 
      };
      default: return { 
        bg: 'bg-slate-100 dark:bg-slate-800', 
        text: 'text-slate-800 dark:text-slate-200', 
        border: 'border-slate-200 dark:border-slate-700', 
        hex: '#64748b' 
      };
    }
  };

  const colors = getStatusColor(metric.status);

  return (
    <div className="metric-card p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col h-full transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
          {icon}
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
          {metric.status}
        </span>
      </div>
      
      <div className="flex-grow flex items-center justify-center pb-2">
        <DonutChart value={metric.score} color={colors.hex} label={label} />
      </div>
    </div>
  );
};

// Helper to parse markdown into sections based on H2 headers
const parseMarkdownSections = (markdown: string): ReportSection[] => {
  // Split by newline followed by ## space (H2)
  const rawParts = markdown.split(/\n(?=##\s)/);
  
  return rawParts.map((part, index) => {
    let title = 'Introduction';
    const trimmed = part.trim();
    
    if (trimmed.startsWith('## ')) {
      const match = trimmed.match(/^##\s+(.+)$/m);
      if (match) {
        title = match[1].replace(/\*\*/g, '').trim();
      }
    } else if (trimmed.startsWith('# ')) {
      title = 'Report Header & Summary';
    }

    return {
      id: `section-${index}`,
      title,
      content: part
    };
  });
};

const ReportRenderer: React.FC<ReportRendererProps> = ({ markdown, sources, targetUrl, metrics, analysisRequest, isDarkMode, setIsDarkMode }) => {
  // Memoize sections to avoid re-parsing on every render
  const sections = useMemo(() => parseMarkdownSections(markdown), [markdown]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    const element = document.getElementById('report-content');
    
    if (!element) {
      console.error("Report content not found");
      setIsGeneratingPDF(false);
      return;
    }

    const opt = {
      margin: [10, 10, 10, 10], 
      filename: `SEO_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollY: 0,
        windowWidth: 1280 // Ensure desktop layout is captured
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Temporarily disable dark mode for PDF generation to ensure print consistency
    const wasDark = isDarkMode;
    if (wasDark) setIsDarkMode(false);

    // Use a timeout to ensure any state updates are rendered before capture
    setTimeout(() => {
        // @ts-ignore
        if (window.html2pdf) {
          // @ts-ignore
          window.html2pdf().set(opt).from(element).save().then(() => {
            setIsGeneratingPDF(false);
            if (wasDark) setIsDarkMode(true);
          }).catch((err: any) => {
            console.error("PDF generation failed:", err);
            setIsGeneratingPDF(false);
            if (wasDark) setIsDarkMode(true);
          });
        } else {
          console.error("html2pdf library not loaded");
          alert("PDF generation library not loaded. Please try again.");
          setIsGeneratingPDF(false);
          if (wasDark) setIsDarkMode(true);
        }
    }, 200);
  };

  const handleShare = async () => {
    try {
      if (analysisRequest) {
        // Encode the full request to a Base64 string for persistence
        const jsonString = JSON.stringify(analysisRequest);
        const encoded = btoa(jsonString);
        
        // Construct absolute URL with ?q=...
        const baseUrl = window.location.href.split('?')[0].replace(/^blob:/, ''); // Strip blob and existing params
        
        // Handle local/blob URLs by attempting to use origin if available, otherwise just use the raw path
        const cleanBase = baseUrl.startsWith('http') ? baseUrl : window.location.origin + window.location.pathname;
        
        const shareUrl = `${cleanBase}?q=${encoded}`;

        await navigator.clipboard.writeText(shareUrl);
        
        if (window.location.protocol === 'blob:') {
           console.warn("Blob URL detected. Share link might only work if the app is deployed.");
        }
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const isExternalSource = (sourceUrl: string, baseUrl: string) => {
    try {
      const sourceHost = new URL(sourceUrl).hostname.replace(/^www\./, '');
      const baseHost = new URL(baseUrl).hostname.replace(/^www\./, '');
      return !sourceHost.includes(baseHost) && !baseHost.includes(sourceHost);
    } catch {
      return true;
    }
  };

  return (
    <div className="transition-colors duration-300">
      <div className="space-y-8 animate-fade-in relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm print:hidden transition-colors">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Analysis Report</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Target: <a href={targetUrl} target="_blank" rel="noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">{targetUrl}</a>
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              aria-label="Export report as PDF"
              className={`flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors ${isGeneratingPDF ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-600 dark:border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export PDF
                </>
              )}
            </button>
            <button 
              onClick={handleShare}
              aria-label="Copy share link to clipboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isCopied 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200' 
                  : 'bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-300'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied Link!
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4" />
                  Share Link
                </>
              )}
            </button>
          </div>
        </div>

        <div id="report-content" ref={reportRef} className="space-y-8">
          {/* Inject print-specific styles for html2pdf to pick up */}
          <style>{`
            .metric-card { page-break-inside: avoid; margin-bottom: 0; }
            .section-container { page-break-inside: avoid; margin-bottom: 2rem; }
            /* Ensure images fit within PDF page */
            .prose img { max-width: 100% !important; height: auto !important; page-break-inside: avoid; border-radius: 8px; border: 1px solid #e2e8f0; display: block; margin: 1.5rem auto; }
            /* Better table styling for PDF */
            .prose table { width: 100% !important; border-collapse: collapse; page-break-inside: avoid; margin-bottom: 1.5rem; table-layout: auto; }
            .prose th, .prose td { padding: 10px; border: 1px solid #cbd5e1; font-size: 0.8rem; vertical-align: top; }
            .prose th { background-color: #f1f5f9; font-weight: 700; text-align: left; color: #1e293b; white-space: nowrap; }
            .prose td { color: #334155; word-wrap: break-word; }
            /* Code blocks */
            .prose pre { white-space: pre-wrap; word-wrap: break-word; background-color: #f8fafc; border-radius: 8px; padding: 1rem; border: 1px solid #e2e8f0; font-size: 0.85rem; }
          `}</style>
          
          {metrics && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard 
                  label="Technical SEO" 
                  metric={metrics.technical} 
                  icon={<Zap className="w-4 h-4 text-brand-600 dark:text-brand-400" />} 
                />
                <MetricCard 
                  label="On-Page SEO" 
                  metric={metrics.onPage} 
                  icon={<LayoutIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />} 
                />
                <MetricCard 
                  label="Content Quality" 
                  metric={metrics.content} 
                  icon={<FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />} 
                />
                <MetricCard 
                  label="Keyword Strategy" 
                  metric={metrics.keywords} 
                  icon={<SearchIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />} 
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-8 md:p-12 overflow-visible print:shadow-none print:border-none print:p-0 transition-colors">
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:text-brand-700 dark:prose-h2:text-brand-400 prose-a:text-brand-600 dark:prose-a:text-brand-400 hover:prose-a:text-brand-800 dark:hover:prose-a:text-brand-300 prose-img:rounded-xl prose-hr:border-slate-200 dark:prose-hr:border-slate-700">
                   {sections.map((section) => (
                     <div key={section.id} className="section-container">
                       <ReactMarkdown
                         remarkPlugins={[remarkGfm]}
                         components={{
                           h1: ({node, ...props}) => <h1 className="flex items-center gap-3 border-b-2 border-brand-100 dark:border-brand-900 pb-4 mb-8 text-3xl font-bold text-slate-900 dark:text-white" {...props} />,
                           h2: ({node, ...props}) => <h2 className="mt-8 mb-6 text-brand-800 dark:text-brand-400" {...props} />,
                           h3: ({node, ...props}) => <h3 className="mt-6 mb-4 text-slate-700 dark:text-slate-200" {...props} />,
                           p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300" {...props} />,
                           strong: ({node, ...props}) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
                           ul: ({node, ...props}) => <ul className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-100 dark:border-slate-700 my-6 space-y-2 print:bg-transparent print:p-0 print:border-none" {...props} />,
                           li: ({node, ...props}) => <li className="marker:text-brand-500 dark:marker:text-brand-400 text-slate-700 dark:text-slate-300" {...props} />,
                           blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-brand-500 bg-brand-50 dark:bg-brand-900/20 p-4 rounded-r-lg not-italic text-slate-700 dark:text-slate-300 my-6 print:bg-transparent" {...props} />,
                           table: ({node, ...props}) => (
                             <div className="overflow-x-auto my-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm print:shadow-none print:border-slate-300">
                               <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 table-auto" {...props} />
                             </div>
                           ),
                           thead: ({node, ...props}) => <thead className="bg-slate-100 dark:bg-slate-900 print:bg-slate-100" {...props} />,
                           tbody: ({node, ...props}) => <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800" {...props} />,
                           tr: ({node, ...props}) => <tr className="even:bg-slate-50/60 dark:even:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-colors" {...props} />,
                           th: ({node, ...props}) => <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider align-top border-b border-slate-200 dark:border-slate-700 min-w-[140px]" {...props} />,
                           td: ({node, ...props}) => <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 align-top whitespace-normal break-words min-w-[160px]" {...props} />,
                           img: ({node, ...props}) => <img className="rounded-lg max-w-full h-auto my-6 border border-slate-100 dark:border-slate-700 shadow-sm" {...props} />,
                         }}
                       >
                         {section.content}
                       </ReactMarkdown>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
               {/* Summary Cards */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-6 print:static print:shadow-none print:border print:border-slate-300 section-container transition-colors">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-lg">Analysis Sources</h3>
                {sources.length > 0 ? (
                  <ul className="space-y-3">
                    {sources.map((source, idx) => {
                      const isExternal = isExternalSource(source.url, targetUrl);
                      return (
                        <li key={idx}>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label={`${source.title} (${isExternal ? 'External link' : 'Internal link'})`}
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-start gap-2 group transition-colors"
                          >
                            {isExternal ? (
                              <Globe className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 dark:group-hover:text-brand-400" />
                            ) : (
                              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 dark:group-hover:text-brand-400" />
                            )}
                            <span className="line-clamp-2">{source.title}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-500 italic">No external sources cited directly.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportRenderer;