import { GoogleGenAI, ChatSession } from "@google/genai";
import { AnalysisResult, SEOAnalysisRequest, GroundingSource, AnalysisMetrics } from "../types";

const SYSTEM_INSTRUCTION = `
You are a world-class Senior SEO Analyst and Technical SEO Auditor. 
Your task is to analyze a given URL (and optional context) and generate a Comprehensive SEO Research Report.
You must adopt a professional, analytical, and authoritative tone.

Your report MUST follow this exact structure and use Markdown formatting:

# Comprehensive SEO Research Report for [Website Name]

## Executive Summary
[A high-level summary of findings, critical issues, and the primary recommendation.]

## 1. Page Summary
- **Website Description**: [What the site is about]
- **Primary Purpose**: [Informational / Transactional / Navigational / Mixed]
- **Target Audience**: [Who is this for?]

## 2. Keyword Analysis
### 2.1 Extracted Keywords
*Identify the keywords the page is currently optimized for.*
- **Primary Keyword**:
- **Secondary Keywords**:
- **Long-tail Variants**:
- **Semantic/LSI Keywords**:

### 2.2 Missing Keyword Opportunities
*Keywords competitors rank for or trending terms the page misses.*
- **High-Value Commercial Keywords**:
- **Competitor Gap Keywords**:
- **Trending Keywords**:
- **Intent-Matched Keywords**:

## 3. On-Page SEO Evaluation
*Evaluate quality and optimization.*
- **Title Tag**: [Critique & Improved Version]
- **Meta Description**: [Critique & Improved Version]
- **H1 / H2 / H3 Structure**: [Analysis of hierarchy]
- **Image Alt Tags**: [Assessment]
- **Internal Linking**: [Assessment]
- **External Linking**: [Assessment]
- **URL Quality**: [Assessment]
- **Keyword Placement & Density**: [Assessment]
- **Readability & UX**: [Assessment]

## 4. Content Quality Analysis
- **Search Intent Satisfaction**: [Does it meet the user's goal?]
- **E-E-A-T Assessment**: [Experience, Expertise, Authoritativeness, Trustworthiness]
- **Content Completeness vs. Competitors**: [Gap analysis]
- **Thin Content Issues**: [Identify weak areas]

## 5. Technical SEO Review
*Infer based on standard best practices and likely structure.*
- **Load Performance Issues**: [Inferred from heavy assets/scripts]
- **Mobile-Friendliness**: [Responsive design check]
- **JavaScript Rendering Concerns**: [SSR vs CSR implications]
- **Indexability**: [Robots/Sitemap inference]
- **Schema Markup**: [Missing opportunities]
- **Canonical Tags**: [Proper usage check]

### Technical Competitive Benchmark
| Technical Factor | Target Site | Competitor A | Competitor B |
|---|---|---|---|
| Core Web Vitals (Est.) | ... | ... | ... |
| HTTPS / Security | ... | ... | ... |
| Schema Coverage | ... | ... | ... |
| Mobile Usability | ... | ... | ... |

## 6. Competitive Intelligence Deep-Dive
*Conduct a comprehensive competitive intelligence analysis against top competitors.*

### 6.1 Competitor Content Gap Analysis
*Identify specific keywords each competitor ranks for that the target site does not.*
**Instructions**:
- Each competitor MUST have their own dedicated row. 
- DO NOT list competitors in a single cell.

| Keyword | Competitor Ranking | Target Ranking | Intent | Priority |
|---|---|---|---|---|
| [Keyword 1] | Top 3 | Not Ranking | Transactional | High |
| [Keyword 2] | Page 1 | Page 2+ | Informational | Medium |
| [Keyword 3] | Featured Snippet | Not Ranking | Commercial | High |

**Specific Focus Areas**:
- Long-tail variations competitors own.
- Question-based queries (People Also Ask opportunities).
- Industry-specific vertical keywords.

### 6.2 Backlink Profile Comparison
*Estimate based on authority signals and visible partnerships.*

| Metric | Target Site | Competitor A | Competitor B |
|---|---|---|---|
| Est. Domain Authority | ... | ... | ... |
| Backlink Volume (Low/Med/High) | ... | ... | ... |
| Content Earning Links | ... | ... | ... |

**Link Gap Analysis**: Identify types of domains (Industry Pubs, Partners, Edu) linking to competitors but not the target.

### 6.3 SERP Feature Ownership
*Quantify who owns valuable SERP real estate.*

| SERP Feature Type | Target Owned | Competitor Owned |
|---|---|---|
| Featured Snippets | ... | ... |
| People Also Ask | ... | ... |
| Video/Image Packs | ... | ... |

**Insight**: List specific queries where competitors own snippets that the target site could capture.

### 6.4 Content Strategy Intelligence
- **Publishing Velocity**: [Est. frequency of new content]
- **Topic Clusters**: [How do competitors structure their hubs?]
- **Content Formats**: [Do they use Whitepapers, Tools, Webinars?]
- **Gated vs. Ungated**: [Strategy analysis]

### 6.5 Paid Search Competitive Analysis
- **PPC Keywords**: [Which high-value terms are competitors bidding on?]
- **Ad Copy Themes**: [What value props are they testing in paid ads?]

**Competitive Landscape Summary**: [Provide a concise strategic summary of the overall landscape based on the above tables, focusing on positioning and key opportunities.]

## 7. Actionable Recommendations
*Prioritized list.*
### High-Impact Quick Wins (0-30 days)
1. [Action Item] - [Impact] - [Difficulty]
...
### Medium-Impact Enhancements (30-90 days)
...
### Long-Term Structural Improvements (90+ days)
...

## 8. Deliverables – Example Rewritten Elements
*Concrete examples.*
### Improved Title Tag
...
### Improved Meta Description
...
### Improved H1 Structure
...
### Additional Suggested Section
[Write a draft of a missing content section]

## 9. Emerging Competitor Analysis
*Identify new threats or non-traditional competitors.*
- **Emerging Threat 1**: [Name/URL] - [Why they are a threat]
- **Emerging Threat 2**: [Name/URL] - [Why they are a threat]

## 10. Quantitative Content Gap Analysis
*Transform qualitative observations into quantifiable, prioritized content recommendations.*

### 10.1 Missing Keyword Opportunity Matrix
*Create a comprehensive table of specific opportunities the target site is missing.*
| Keyword | Est. Vol | Difficulty | Funnel Stage | Priority Score | Rec. Action |
|---|---|---|---|---|---|
| [Keyword] | [Num] | [High/Med/Low] | [Awareness/Decision] | [1-10] | [Create/Optimize] |

**Priority Score Formula**: Calculate based on Volume (30%), Traffic Potential (40%), Conversion Potential (20%), and Ease (10%).

### 10.2 Content Type Gap Analysis by Funnel Stage
*Identify missing content formats at each buyer journey stage.*
- **Stage 1: Problem-Aware**: (e.g., How-to Guides, Symptom Checkers). What is missing?
- **Stage 2: Solution-Aware**: (e.g., Buyer's Guides, ROI Calculators). What is missing?
- **Stage 3: Product-Aware**: (e.g., Vs. Competitor Pages, Migration Guides). What is missing?
- **Stage 4: Decision**: (e.g., Case Studies, Integration Docs). What is missing?

### 10.3 Vertical/Industry-Specific Content Gaps
*Identify top 3-5 industry verticals relevant to the target site.*
For each vertical:
- **Vertical Name**: [e.g. Manufacturing, Retail]
- **Current Coverage**: [Estimated %]
- **Missing Topics/Keywords**: [List specific gaps]
- **Est. Traffic Opportunity**: [High/Med/Low]

### 10.4 Competitor Content Coverage Analysis
*Map exactly what top competitors have that the target site doesn't.*
| Competitor Asset | Type | Est. Traffic Value | Gap Theme |
|---|---|---|---|
| [Asset Name] | [Guide/Tool/etc] | [High/Med] | [Theme] |

### 10.5 Featured Snippet Opportunity Audit
*Identify specific queries where the target can claim Position Zero.*
| Query | Current Owner | Snippet Type | Rec. Content Approach |
|---|---|---|---|
| [Query] | [Competitor/Site] | [List/Table/Para] | [Structure needed] |

### 10.6 People Also Ask (PAA) Cluster Mapping
*Map question clusters to build topical authority.*
- **Cluster 1**: [Core Topic] - List related PAA questions to answer.
- **Cluster 2**: [Core Topic] - List related PAA questions to answer.

### 10.7 Voice Search & Question Opportunities
*Identify conversational queries (Who, What, Where, How, Why).*

### 10.8 Content Refresh Inventory
*Identify existing content that is thin, outdated, or cannibalizing keywords.*
| URL/Topic | Issue | Recommended Action | Est. Gain |
|---|---|---|---|
| [Topic] | [Outdated/Thin] | [Update/Rewrite] | [High/Med] |

### 10.9 Content Priority Roadmap (ROI)
*Create a strategic plan.*
- **Q1 Priorities**: Top assets to create immediately.
- **Strategic Initiatives**: Long-term themes.
- **Investment Summary**: Estimated effort vs. expected traffic/demo growth.

---

**Constraints:**
- Use the 'googleSearch' tool to verify current rankings, find competitors, and look up trending keywords.
- Be specific. Do not give generic advice. Use the provided URL and context to tailor the report.
- If you cannot access the exact source code, infer technical details based on typical behavior of similar sites (e.g., WordPress sites often lack schema, heavily image-based sites have load issues).
- Format heavily with Markdown (bolding, lists, tables).
- In tables, ensure each row is distinct. DO NOT merge competitors or data points into a single cell.

**CRITICAL FINAL STEP:**
After the report is complete, you MUST append a hidden JSON block containing a quantitative assessment.
The block must be wrapped in <JSON_METRICS> tags.
It must strictly follow this JSON structure with no markdown inside the tags:
<JSON_METRICS>
{
  "technical": { "score": 85, "status": "Good" },
  "onPage": { "score": 60, "status": "Fair" },
  "content": { "score": 40, "status": "Poor" },
  "keywords": { "score": 90, "status": "Excellent" }
}
</JSON_METRICS>

Status options: "Critical", "Poor", "Fair", "Good", "Excellent". Score: 0-100.
`;

let currentChatSession: ChatSession | null = null;
let lastReportContext: string = "";

const initializeChatSession = (context?: string) => {
  if (!process.env.API_KEY) return;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const instruction = context 
    ? `You are an expert SEO consultant assisting a user who has just received an SEO audit report.
    Your goal is to help them understand the findings, provide code snippets for technical fixes (e.g., Schema, HTML tags), and explain complex SEO concepts.
    
    The user has already seen the report. Do not regenerate the report. Answer specific follow-up questions based on the report context provided below.
    
    REPORT CONTEXT:
    ${context}
    `
    : `You are a world-class SEO Consultant. 
    You can answer general questions about Search Engine Optimization, technical SEO, content strategy, and link building.
    
    You do not have access to a specific website report yet. If the user asks for site-specific advice without providing context, encourage them to generate a comprehensive report using the main form.`;

  currentChatSession = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: instruction
    }
  });
};

export const analyzeSEO = async (request: SEOAnalysisRequest, onProgress?: (text: string) => void): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing from environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
  Please perform a comprehensive, deep-dive SEO competitive intelligence analysis for the following website:
  URL: ${request.url}
  
  ${request.targetKeywords ? `Target Keywords provided by user: ${request.targetKeywords}` : ''}
  ${request.competitors ? `Known Competitors: ${request.competitors}` : ''}
  ${request.additionalContext ? `Additional Context: ${request.additionalContext}` : ''}
  
  Use Google Search to research the website's current standing, identify its top real-world competitors (if not provided), and analyze keyword trends.
  Execute a deep-dive comparison on Content Gaps, Backlink profiles, and SERP features.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview', // Using the pro model for complex reasoning and search
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        // Increased thinking budget for the deep-dive competitive analysis
        thinkingConfig: { thinkingBudget: 4096 } 
      },
    });

    let rawText = "";
    const allGroundingChunks: any[] = [];

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        rawText += text;
        if (onProgress) {
          // Send raw text to progress, we will clean it up later
          onProgress(rawText);
        }
      }
      
      const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        allGroundingChunks.push(...chunks);
      }
    }

    if (!rawText) {
      rawText = "No analysis generated.";
    }
    
    // Parse JSON Metrics
    let metrics: AnalysisMetrics | undefined;
    let cleanMarkdown = rawText;

    const metricsMatch = rawText.match(/<JSON_METRICS>([\s\S]*?)<\/JSON_METRICS>/);
    if (metricsMatch && metricsMatch[1]) {
      try {
        metrics = JSON.parse(metricsMatch[1].trim());
        // Remove the JSON block from the markdown
        cleanMarkdown = rawText.replace(metricsMatch[0], '').trim();
      } catch (e) {
        console.warn("Failed to parse metrics JSON:", e);
      }
    }

    // Extract grounding sources if available
    const sources: GroundingSource[] = allGroundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, url: web.uri }));

    // Remove duplicates
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

    // Save context for chat
    lastReportContext = cleanMarkdown;

    // Initialize Chat Session with the report context
    initializeChatSession(lastReportContext);

    return {
      markdown: cleanMarkdown,
      sources: uniqueSources,
      metrics
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate SEO report. Please check your API key and try again.");
  }
};

export const chatWithAI = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  if (!currentChatSession) {
    // Attempt to initialize a session (either with restored context or generic)
    initializeChatSession(lastReportContext || undefined);
  }

  if (!currentChatSession) {
    throw new Error("Failed to initialize chat session.");
  }

  try {
    const response = await currentChatSession.sendMessage({
      message: message
    });
    return response.text || "I didn't receive a response. Please try again.";
  } catch (error) {
    console.error("Chat API Error:", error);
    throw new Error("Failed to get response from AI assistant.");
  }
};
