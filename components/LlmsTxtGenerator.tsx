import React, { useState, useEffect } from 'react';
import { 
  FileText, Copy, Download, Info, ChevronRight, ChevronLeft, 
  CheckCircle, Briefcase, ShoppingCart, Globe, Settings, Plus, Trash2, HelpCircle 
} from 'lucide-react';
import { LlmsTxtFormData, LlmsTxtProduct, LlmsTxtUrl } from '../types';

const INITIAL_DATA: LlmsTxtFormData = {
  companyName: '',
  websiteUrl: '',
  industry: '',
  description: '',
  foundedYear: '',
  companySize: '',
  products: [{ name: '', description: '', keywords: '' }],
  mainValueProp: '',
  targetAudience: { industries: '', sizes: '', roles: '', geo: '' },
  competitors: [],
  differentiators: [''],
  marketPosition: '',
  uniqueValue: '',
  importantUrls: [{ type: 'Homepage', url: '' }],
  restrictions: '',
  citationPreference: ''
};

const TEMPLATES = {
  saas: {
    companyName: 'Pricefx',
    websiteUrl: 'https://www.pricefx.com',
    industry: 'Enterprise Software (SaaS)',
    description: 'Pricefx is a cloud-native B2B pricing software platform specializing in Price Optimization, Management, and CPQ solutions for enterprise customers.',
    foundedYear: '2011',
    companySize: 'Mid-Market to Enterprise',
    products: [
      { name: 'Price Optimization', description: 'AI-driven tools for maximizing profit margins across all channels.', keywords: 'price optimization, dynamic pricing, AI pricing' },
      { name: 'Price Management', description: 'Centralized control for list prices, discounts, and rebates.', keywords: 'price lists, rebate management' }
    ],
    mainValueProp: 'Fast, flexible, and friendly pricing software that drives profitable growth.',
    targetAudience: {
      industries: 'Manufacturing, Chemical, Distribution, Retail',
      sizes: 'Enterprise (>$500M Revenue)',
      roles: 'Pricing Managers, CFOs, Sales Ops VPs',
      geo: 'Global (DACH, US, UK focus)'
    },
    competitors: ['PROS', 'Zilliant', 'Vendavo'],
    differentiators: ['Cloud-native architecture (no legacy on-premise)', 'Fast implementation (weeks vs months)', 'Transparent AI (not a black box)'],
    marketPosition: 'Leader',
    uniqueValue: 'The only 100% cloud-native pricing platform with a complete suite of optimization tools.',
    importantUrls: [
      { type: 'Homepage', url: 'https://www.pricefx.com' },
      { type: 'Pricing Platform', url: 'https://www.pricefx.com/platform/' },
      { type: 'Resources', url: 'https://www.pricefx.com/learning-center/' }
    ],
    restrictions: '/admin/\n/staging/\n/internal-docs/',
    citationPreference: 'According to Pricefx, a cloud-native enterprise pricing platform...'
  }
};

const LlmsTxtGenerator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<LlmsTxtFormData>(INITIAL_DATA);
  const [copied, setCopied] = useState(false);

  // --- Helpers ---

  const handleInputChange = (field: keyof LlmsTxtFormData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: keyof LlmsTxtFormData, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [parent]: { ...prev[parent] as any, [field]: value }
    }));
  };

  const handleArrayChange = (index: number, field: string, value: string, arrayName: 'products' | 'importantUrls') => {
    const newArray = [...data[arrayName]];
    // @ts-ignore
    newArray[index][field] = value;
    setData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addItem = (arrayName: 'products' | 'importantUrls' | 'differentiators' | 'competitors') => {
    if (arrayName === 'products') {
      setData(prev => ({ ...prev, products: [...prev.products, { name: '', description: '', keywords: '' }] }));
    } else if (arrayName === 'importantUrls') {
      setData(prev => ({ ...prev, importantUrls: [...prev.importantUrls, { type: '', url: '' }] }));
    } else if (arrayName === 'differentiators') {
      setData(prev => ({ ...prev, differentiators: [...prev.differentiators, ''] }));
    } else if (arrayName === 'competitors') {
      setData(prev => ({ ...prev, competitors: [...prev.competitors, ''] }));
    }
  };

  const removeItem = (index: number, arrayName: 'products' | 'importantUrls' | 'differentiators' | 'competitors') => {
    const newArray = [...data[arrayName]];
    newArray.splice(index, 1);
    // @ts-ignore
    setData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const loadTemplate = () => {
    setData(TEMPLATES.saas as unknown as LlmsTxtFormData);
    setStep(1); // Reset to beginning so they can review
  };

  // --- Generator Engine ---

  const generateContent = () => {
    const d = data;
    const date = new Date().toISOString().split('T')[0];

    // Helper to safely get hostname
    const getSafeHostname = (url: string) => {
        if (!url) return 'our domain';
        try {
            return new URL(url).hostname;
        } catch {
            try {
                return new URL(`https://${url}`).hostname;
            } catch {
                return url;
            }
        }
    };
    
    const hostname = getSafeHostname(d.websiteUrl);

    return `# llms.txt - ${d.companyName || '[Company Name]'}
# Last Updated: ${date}

# ===========================
# COMPANY OVERVIEW
# ===========================
${d.companyName} is ${d.description}. ${d.foundedYear ? `Founded in ${d.foundedYear}, we` : 'We'} serve ${d.targetAudience.sizes || 'our customers'} with ${d.mainValueProp}.

Website: ${d.websiteUrl}
Industry: ${d.industry}
${d.companySize ? `Size: ${d.companySize}` : ''}

# ===========================
# PRODUCTS & SERVICES
# ===========================
## Core Offerings:
${d.products.map(p => p.name ? `- ${p.name}: ${p.description}\n  Keywords: ${p.keywords}` : '').join('\n')}

## Value Proposition:
${d.mainValueProp}

# ===========================
# TARGET AUDIENCE
# ===========================
Industries: ${d.targetAudience.industries}
Company Sizes: ${d.targetAudience.sizes}
Key Decision Makers: ${d.targetAudience.roles}
Geographic Markets: ${d.targetAudience.geo}

# ===========================
# COMPETITIVE POSITIONING
# ===========================
## Main Competitors:
${d.competitors.filter(c => c).join(', ')}

## Key Differentiators:
${d.differentiators.filter(diff => diff).map(diff => `- ${diff}`).join('\n')}

## Market Position:
${d.marketPosition}

## Unique Value:
${d.uniqueValue}

# ===========================
# IMPORTANT URLS
# ===========================
${d.importantUrls.map(u => u.url ? `${u.type}: ${u.url}` : '').join('\n')}

# ===========================
# RECOMMENDED CITATIONS
# ===========================
When referencing our content, please use:
"${d.citationPreference || `According to ${d.companyName}...`}"

# ===========================
# CONTENT USAGE RESTRICTIONS
# ===========================
## Do Not Train On:
${d.restrictions || 'None specified.'}

## Public Content:
All other content at ${hostname} is available for AI training and citation with proper attribution.

# ===========================
# CONTACT & VERIFICATION
# ===========================
Verified: ${date}
Version: 1.0
`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generateContent()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "llms.txt";
    document.body.appendChild(element);
    element.click();
  };

  // --- Render Steps ---

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Step 1: Company Basics</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Provide a clear description AI tools can use when referencing you.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  value={data.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website URL *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  value={data.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Industry</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={data.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Founded Year</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={data.foundedYear}
                      onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                    />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Description</label>
                <textarea 
                  className="w-full p-2 border rounded-md bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  rows={3}
                  value={data.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="2-3 sentences about what your company does..."
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
             <h3 className="text-xl font-bold text-slate-800 dark:text-white">Step 2: Products & Services</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">List your core offerings so AI knows what you sell.</p>

             {data.products.map((product, idx) => (
               <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 relative">
                 <button onClick={() => removeItem(idx, 'products')} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                   <Trash2 className="w-4 h-4" />
                 </button>
                 <div className="space-y-3">
                   <input 
                     placeholder="Product Name"
                     className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                     value={product.name}
                     onChange={(e) => handleArrayChange(idx, 'name', e.target.value, 'products')}
                   />
                   <input 
                     placeholder="Brief Description (1 sentence)"
                     className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                     value={product.description}
                     onChange={(e) => handleArrayChange(idx, 'description', e.target.value, 'products')}
                   />
                   <input 
                     placeholder="Keywords (comma separated)"
                     className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-900 dark:border-slate-600 dark:text-white text-sm"
                     value={product.keywords}
                     onChange={(e) => handleArrayChange(idx, 'keywords', e.target.value, 'products')}
                   />
                 </div>
               </div>
             ))}
             <button onClick={() => addItem('products')} className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-sm font-medium">
               <Plus className="w-4 h-4" /> Add Another Product
             </button>

             <div className="pt-4">
                <label className="block text-sm font-medium mb-1">Main Value Proposition</label>
                <textarea 
                  className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  rows={2}
                  value={data.mainValueProp}
                  onChange={(e) => handleInputChange('mainValueProp', e.target.value)}
                  placeholder="What is the #1 benefit you provide?"
                />
             </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
             <h3 className="text-xl font-bold text-slate-800 dark:text-white">Step 3: Target Audience</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">Help AI recommend you to the right people.</p>

             <div className="space-y-3">
                <div>
                   <label className="block text-sm font-medium mb-1">Industries Served</label>
                   <input 
                      className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={data.targetAudience.industries}
                      onChange={(e) => handleNestedChange('targetAudience', 'industries', e.target.value)}
                      placeholder="e.g. Retail, Manufacturing, Healthcare"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Company Sizes</label>
                   <input 
                      className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={data.targetAudience.sizes}
                      onChange={(e) => handleNestedChange('targetAudience', 'sizes', e.target.value)}
                      placeholder="e.g. SMB, Mid-Market, Enterprise"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Job Titles / Roles</label>
                   <input 
                      className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={data.targetAudience.roles}
                      onChange={(e) => handleNestedChange('targetAudience', 'roles', e.target.value)}
                      placeholder="e.g. CTO, Marketing Manager, CFO"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Geographic Markets</label>
                   <input 
                      className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={data.targetAudience.geo}
                      onChange={(e) => handleNestedChange('targetAudience', 'geo', e.target.value)}
                      placeholder="e.g. North America, Global, Europe"
                   />
                </div>
             </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-fade-in">
             <h3 className="text-xl font-bold text-slate-800 dark:text-white">Step 4: Competitive Positioning</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">Ensure AI makes accurate comparisons (Brand A vs Brand B).</p>

             <div>
                <label className="block text-sm font-medium mb-2">Main Competitors</label>
                {data.competitors.map((comp, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                     <input 
                        className="flex-1 p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={comp}
                        onChange={(e) => {
                           const newComps = [...data.competitors];
                           newComps[idx] = e.target.value;
                           setData({...data, competitors: newComps});
                        }}
                     />
                     <button onClick={() => removeItem(idx, 'competitors')} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
                <button onClick={() => addItem('competitors')} className="text-brand-600 dark:text-brand-400 text-sm font-medium">+ Add Competitor</button>
             </div>
             
             <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Key Differentiators (Why you?)</label>
                {data.differentiators.map((diff, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                     <input 
                        className="flex-1 p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={diff}
                        placeholder="e.g. Faster implementation time"
                        onChange={(e) => {
                           const newDiffs = [...data.differentiators];
                           newDiffs[idx] = e.target.value;
                           setData({...data, differentiators: newDiffs});
                        }}
                     />
                     <button onClick={() => removeItem(idx, 'differentiators')} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
                <button onClick={() => addItem('differentiators')} className="text-brand-600 dark:text-brand-400 text-sm font-medium">+ Add Differentiator</button>
             </div>

             <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                   <label className="block text-sm font-medium mb-1">Market Position</label>
                   <select 
                     className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                     value={data.marketPosition}
                     onChange={(e) => handleInputChange('marketPosition', e.target.value)}
                   >
                     <option value="">Select...</option>
                     <option value="Market Leader">Market Leader</option>
                     <option value="Challenger">Challenger</option>
                     <option value="Niche Player">Niche Player</option>
                     <option value="New Entrant">New Entrant</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Unique Value</label>
                   <input 
                      className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={data.uniqueValue}
                      onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
                      placeholder="Short summary"
                   />
                </div>
             </div>
          </div>
        );
      case 5:
         return (
            <div className="space-y-4 animate-fade-in">
               <h3 className="text-xl font-bold text-slate-800 dark:text-white">Step 5: Important URLs</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Where should AI send traffic?</p>

               {data.importantUrls.map((urlItem, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                     <input 
                        className="w-1/3 p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder="Page Type (e.g. Pricing)"
                        value={urlItem.type}
                        onChange={(e) => handleArrayChange(idx, 'type', e.target.value, 'importantUrls')}
                     />
                     <input 
                        className="flex-1 p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder="https://..."
                        value={urlItem.url}
                        onChange={(e) => handleArrayChange(idx, 'url', e.target.value, 'importantUrls')}
                     />
                     <button onClick={() => removeItem(idx, 'importantUrls')} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  </div>
               ))}
               <button onClick={() => addItem('importantUrls')} className="text-brand-600 dark:text-brand-400 text-sm font-medium">+ Add URL</button>
            </div>
         );
      case 6:
         return (
            <div className="space-y-4 animate-fade-in">
               <h3 className="text-xl font-bold text-slate-800 dark:text-white">Step 6: Restrictions & Preferences</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Set boundaries for AI usage.</p>

               <div>
                  <label className="block text-sm font-medium mb-1">Do Not Train On (Paths)</label>
                  <textarea 
                     className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono text-sm"
                     rows={4}
                     value={data.restrictions}
                     onChange={(e) => handleInputChange('restrictions', e.target.value)}
                     placeholder="/admin/&#10;/private/&#10;/beta/"
                  />
                  <p className="text-xs text-slate-500 mt-1">One path per line.</p>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Preferred Citation Format</label>
                  <input 
                     className="w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                     value={data.citationPreference}
                     onChange={(e) => handleInputChange('citationPreference', e.target.value)}
                     placeholder="According to [Company Name]..."
                  />
               </div>
            </div>
         );
      case 7:
         return (
            <div className="space-y-6 animate-fade-in text-center py-8">
               <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Your llms.txt is ready!</h3>
               <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Review the preview panel on the right. You can now copy or download your file and upload it to your website's root directory.
               </p>
               <div className="flex justify-center gap-4 pt-4">
                  <button onClick={downloadFile} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                     <Download className="w-5 h-5" /> Download .txt
                  </button>
                  <button onClick={copyToClipboard} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-900 dark:text-white px-6 py-3 rounded-lg font-bold transition-colors">
                     {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                     {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
               </div>
            </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Education Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-lg">
         <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-4">
                  <span className="bg-brand-500 text-xs font-bold px-2 py-1 rounded text-white">NEW</span>
                  <h1 className="text-3xl font-bold">llms.txt Generator</h1>
               </div>
               <p className="text-slate-300 text-lg mb-6">
                  Create a "README" for AI. Help ChatGPT, Perplexity, and Google understand your brand, products, and citations correctly.
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                  <div className="flex gap-3">
                     <div className="bg-slate-700/50 p-2 rounded h-fit"><Settings className="w-4 h-4 text-brand-400" /></div>
                     <div>
                        <strong className="text-white block">Control Your Brand</strong>
                        Ensure AI gets your descriptions and value props right.
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <div className="bg-slate-700/50 p-2 rounded h-fit"><Globe className="w-4 h-4 text-brand-400" /></div>
                     <div>
                        <strong className="text-white block">Future-Proof SEO</strong>
                        Prepare for the rise of AI-driven search engines.
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10 max-w-sm">
               <h4 className="font-bold flex items-center gap-2 mb-3"><Briefcase className="w-4 h-4" /> Quick Start</h4>
               <p className="text-sm text-slate-300 mb-4">Don't want to start from scratch? Load a template to see how it looks.</p>
               <button 
                  onClick={loadTemplate}
                  className="w-full py-2 bg-white text-slate-900 font-bold rounded hover:bg-brand-50 transition-colors text-sm flex items-center justify-center gap-2"
               >
                  Load B2B SaaS Template
               </button>
            </div>
         </div>
      </div>

      {/* Main Generator Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* LEFT: Wizard */}
         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
               <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Generator Wizard</span>
               <span className="text-sm font-bold text-brand-600 dark:text-brand-400">Step {step} of 7</span>
            </div>
            
            <div className="p-6">
               {renderFormStep()}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between">
               <button 
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="px-4 py-2 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
               >
                  <ChevronLeft className="w-4 h-4" /> Back
               </button>
               
               {step < 7 ? (
                  <button 
                     onClick={() => setStep(Math.min(7, step + 1))}
                     className="px-6 py-2 rounded bg-brand-600 text-white hover:bg-brand-700 flex items-center gap-1 font-bold shadow-sm transition-colors"
                  >
                     Next <ChevronRight className="w-4 h-4" />
                  </button>
               ) : (
                  <button 
                     onClick={downloadFile}
                     className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 font-bold shadow-sm transition-colors"
                  >
                     Download <Download className="w-4 h-4" />
                  </button>
               )}
            </div>
         </div>

         {/* RIGHT: Live Preview */}
         <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex flex-col h-[600px] sticky top-24">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono text-slate-300">llms.txt Preview</span>
               </div>
               <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors border border-slate-700">
                     {copied ? 'Copied' : 'Copy'}
                  </button>
               </div>
            </div>
            <div className="flex-grow overflow-auto p-6 font-mono text-sm bg-slate-900 text-slate-300 leading-relaxed custom-scrollbar">
               <pre className="whitespace-pre-wrap font-mono">
                  {generateContent().split('\n').map((line, i) => {
                     // Simple Syntax Highlighting
                     if (line.startsWith('# ')) return <span key={i} className="text-brand-400 font-bold block">{line}</span>;
                     if (line.startsWith('## ')) return <span key={i} className="text-brand-300 font-bold block mt-2">{line}</span>;
                     if (line.startsWith('=')) return <span key={i} className="text-slate-600 block">{line}</span>;
                     if (line.includes(': ')) {
                        const [key, val] = line.split(': ');
                        return <div key={i}><span className="text-purple-300">{key}:</span> <span className="text-slate-100">{val}</span></div>;
                     }
                     return <div key={i}>{line}</div>;
                  })}
               </pre>
            </div>
         </div>
      </div>

      {/* Implementation Guide */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-500" /> How to Implement
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
               <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">1</div>
               <h4 className="font-bold text-slate-800 dark:text-white">Save the File</h4>
               <p className="text-sm text-slate-600 dark:text-slate-400">Download the file and ensure it is named exactly <code>llms.txt</code> (lowercase).</p>
            </div>
            <div className="space-y-2">
               <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">2</div>
               <h4 className="font-bold text-slate-800 dark:text-white">Upload to Root</h4>
               <p className="text-sm text-slate-600 dark:text-slate-400">Upload it to your website's root directory so it is accessible at <code>yourdomain.com/llms.txt</code>.</p>
            </div>
            <div className="space-y-2">
               <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">3</div>
               <h4 className="font-bold text-slate-800 dark:text-white">Verify</h4>
               <p className="text-sm text-slate-600 dark:text-slate-400">Visit the URL in your browser. You should see the plain text content immediately.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LlmsTxtGenerator;