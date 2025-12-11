import React from 'react';
import { Search, Cpu, FileText, Zap, HelpCircle, Activity, Globe, FileCode, CheckCircle } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Documentation & User Guide</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to know about getting the most out of SEO Insight Pro.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8 md:p-12 prose prose-slate dark:prose-invert max-w-none">
          {/* Introduction */}
          <h2>Introduction</h2>
          <p>
            SEO Insight Pro is an advanced, AI-powered analysis tool designed to audit websites, uncover competitive gaps, and provide actionable optimization strategies. 
            Powered by Google's <strong>Gemini 2.0</strong> models, it simulates the workflow of a senior human SEO consultant by browsing the live web and reasoning through complex data.
          </p>

          <hr className="my-8 border-slate-200 dark:border-slate-700" />

          {/* How to Run an Analysis */}
          <div className="not-prose mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="p-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg">
                <Search className="w-5 h-5" />
              </span>
              How to Run an Analysis
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                To start, simply enter the URL you want to analyze on the homepage. While the URL is the only required field, providing optional data yields significantly better results:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 min-w-[20px] text-brand-600 dark:text-brand-400 font-bold">•</div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Target Keywords:</strong> 
                    <span className="text-slate-600 dark:text-slate-400 block text-sm mt-1">Specific terms you are trying to rank for. This helps the AI measure your relevance.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 min-w-[20px] text-brand-600 dark:text-brand-400 font-bold">•</div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Main Competitors:</strong> 
                    <span className="text-slate-600 dark:text-slate-400 block text-sm mt-1">Domains you want to benchmark against. If left blank, the AI will identify competitors via search.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 min-w-[20px] text-brand-600 dark:text-brand-400 font-bold">•</div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Additional Context:</strong> 
                    <span className="text-slate-600 dark:text-slate-400 block text-sm mt-1">Specific goals (e.g., "Improving conversion for B2B leads" or "Local SEO for a bakery").</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

           {/* Understanding Metrics */}
          <div className="not-prose mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <Activity className="w-5 h-5" />
              </span>
              Understanding the Scores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> Technical SEO
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Evaluates site speed factors, mobile-friendliness, HTTPS security, schema markup usage, and canonical tag implementation.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Content Quality
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Assesses content depth, E-E-A-T signals (Expertise, Experience, Authoritativeness, Trust), relevance to search intent, and formatting.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-emerald-500" /> On-Page SEO
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Analyzes title tags, meta descriptions, header hierarchy (H1-H6), internal linking structure, and image alt text.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-indigo-500" /> Keyword Strategy
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Identifies keyword gaps, long-tail opportunities, semantic relevance, and competitive positioning in SERPs.
                </p>
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200 dark:border-slate-700" />

          {/* New Section: What is llms.txt */}
          <div className="not-prose mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <FileCode className="w-5 h-5" />
              </span>
              The llms.txt Standard
            </h2>
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                 <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>llms.txt</strong> is a proposed standard for website owners to provide a "README" file specifically for Large Language Models (LLMs) and AI agents. 
                    While traditional SEO focuses on humans and keyword matching, <strong>AIO (Artificial Intelligence Optimization)</strong> focuses on context, semantic clarity, and factual density.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Why it matters for SEO</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                       <li className="flex gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span><strong>Training Data Control:</strong> Influence how foundation models learn about your brand during training.</span>
                       </li>
                       <li className="flex gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span><strong>RAG Optimization:</strong> Provide clean, structured text for "Retrieval-Augmented Generation" systems (like ChatGPT Search or Perplexity).</span>
                       </li>
                       <li className="flex gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span><strong>Hallucination Reduction:</strong> Providing explicit facts helps prevent AI from inventing details about your pricing or features.</span>
                       </li>
                    </ul>
                 </div>
                 
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">File Structure</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                       The file should be placed at <code>yourdomain.com/llms.txt</code>. It typically uses Markdown formatting.
                    </p>
                    <div className="bg-slate-900 rounded p-3 text-xs font-mono text-slate-300 overflow-x-auto">
                       <div># Project Name</div>
                       <div className="text-slate-500"># Summary</div>
                       <div>A brief description of the project...</div>
                       <br/>
                       <div className="text-slate-500"># Core Info</div>
                       <div>- Pricing: ...</div>
                       <div>- Features: ...</div>
                    </div>
                 </div>
              </div>

              <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white p-6 rounded-xl shadow-md">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                       <h3 className="text-xl font-bold mb-2">Create yours in minutes</h3>
                       <p className="text-brand-100">
                          Use our built-in generator (available in the top navigation) to build a perfectly formatted llms.txt file tailored to your industry.
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200 dark:border-slate-700" />

          {/* FAQ */}
          <div className="not-prose">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                <HelpCircle className="w-5 h-5" />
              </span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">How long does an analysis take?</h3>
                <p className="text-slate-600 dark:text-slate-400">Typically 30-60 seconds. The AI performs multiple live searches to gather real-time data before synthesizing the report.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Is the data real-time?</h3>
                <p className="text-slate-600 dark:text-slate-400">Yes. We use Google Search grounding to fetch the live search results, ranking positions, and competitor information at the moment of your request.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Can I download the report?</h3>
                <p className="text-slate-600 dark:text-slate-400">Yes, you can export the full report as a PDF using the "Export PDF" button at the top of the results page.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">What happens if I lose my connection?</h3>
                <p className="text-slate-600 dark:text-slate-400">If the analysis is interrupted, you will need to start over. However, once a report is generated, it remains available in your browser tab until you refresh or navigate away.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;