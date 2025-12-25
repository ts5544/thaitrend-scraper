import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, TrendingItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTrends = async (): Promise<AnalysisResult> => {
  try {
    // We use the googleSearch tool to get real-time info from the specific sites requested.
    const model = "gemini-2.5-flash"; 
    
    const prompt = `
      Act as a data analyst. Perform a Google Search to find the current top news headlines from these specific Thai websites: 
      1. Thairath (thairath.co.th)
      2. Sanook (sanook.com)
      3. Matichon (matichon.co.th)

      Analyze the most frequent topics. Select exactly 3 distinct trending keywords (short phrases, 1-3 words) that are appearing most often right now.
      
      You MUST format your response exactly as follows (replace brackets with content):

      ---START---
      KEYWORD_1: [The 1st trending keyword]
      CONTEXT_1: [Brief explanation of why it is trending]
      SOURCE_1: [The website name where it was found most prominent]
      KEYWORD_2: [The 2nd trending keyword]
      CONTEXT_2: [Brief explanation]
      SOURCE_2: [The website name]
      KEYWORD_3: [The 3rd trending keyword]
      CONTEXT_3: [Brief explanation]
      SOURCE_3: [The website name]
      ---END---
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is NOT set to JSON because we are using Search Grounding.
      },
    });

    const text = response.text || "";
    
    // Parse the structured text response
    const trends: TrendingItem[] = [];
    const lines = text.split('\n');
    
    let currentTrend: Partial<TrendingItem> = {};
    
    // Simple parser for the enforced format
    const keywordRegex = /KEYWORD_(\d): (.*)/;
    const contextRegex = /CONTEXT_(\d): (.*)/;
    const sourceRegex = /SOURCE_(\d): (.*)/;

    // Helper map to build objects
    const itemsMap = new Map<string, Partial<TrendingItem>>();

    lines.forEach(line => {
      const kMatch = line.match(keywordRegex);
      const cMatch = line.match(contextRegex);
      const sMatch = line.match(sourceRegex);

      if (kMatch) {
        const id = kMatch[1];
        if (!itemsMap.has(id)) itemsMap.set(id, { rank: parseInt(id) });
        itemsMap.get(id)!.keyword = kMatch[2].trim();
      }
      if (cMatch) {
        const id = cMatch[1];
        if (!itemsMap.has(id)) itemsMap.set(id, { rank: parseInt(id) });
        itemsMap.get(id)!.context = cMatch[2].trim();
      }
      if (sMatch) {
        const id = sMatch[1];
        if (!itemsMap.has(id)) itemsMap.set(id, { rank: parseInt(id) });
        itemsMap.get(id)!.source = sMatch[2].trim();
      }
    });

    Array.from(itemsMap.values()).forEach(item => {
      if (item.keyword && item.context && item.source) {
        trends.push(item as TrendingItem);
      }
    });

    // Fallback if parsing fails (rare with strict prompting)
    if (trends.length === 0) {
       console.warn("Parsing failed, raw text:", text);
       // Create a dummy error item so the UI shows something
       trends.push({
         keyword: "Analysis Error",
         context: "Could not parse specific keywords from search results.",
         source: "System",
         rank: 1
       });
    }

    return {
      trends: trends.sort((a, b) => a.rank - b.rank).slice(0, 3),
      sources: ["Thairath", "Sanook", "Matichon"],
      rawOutput: text
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
