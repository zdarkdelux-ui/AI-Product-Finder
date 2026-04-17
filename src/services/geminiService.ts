
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SearchParameters {
  category?: string;
  subcategory?: string;
  brand?: string;
  color?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  width?: number;
  hasThermostat?: boolean;
  style?: string;
  intent?: string; // e.g. "buying", "comparing", "researching"
  urgency?: string; // e.g. "budget", "premium", "fast"
  sourceDomain?: string; // e.g. "sanitary-tech.ru"
}

export interface ParseResult {
  parameters: SearchParameters;
  confidence: number;
  clarificationQuestion?: string;
  explanation: string;
}

const safeJsonParse = (text: string) => {
  try {
    // Remove markdown code blocks if the AI included them
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON response from AI:", text);
    // Attempt to fix common issues like trailing commas
    try {
      const fixed = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
        .replace(/,(\s*[\]}])/g, "$1");
      return JSON.parse(fixed);
    } catch (e2) {
      throw e;
    }
  }
};

export const parseUserQuery = async (query: string): Promise<ParseResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this user query for an e-commerce plumbing and home improvement store: "${query}"`,
    config: {
      systemInstruction: `You are an expert shopping assistant. Extract structured parameters from the user's query in Russian.
      If the user is vague, provide a clarificationQuestion.
      If the user specifies a specific website or domain to search on (e.g. "на сайте leroymerlin.ru"), extract it into 'sourceDomain'.
      Return ONLY valid JSON.
      
      Available categories: "Кухня", "Ванная", "Плитка".
      Available subcategories: "Мойки", "Смесители", "Раковины", "Настенная плитка".
      
      Parameters to extract:
      - category (string)
      - subcategory (string)
      - brand (string)
      - color (string)
      - minPrice (number)
      - maxPrice (number)
      - width (number)
      - hasThermostat (boolean)
      - material (string)
      - style (string)
      - intent (string)
      - urgency (string: "budget", "premium", "standard")
      - sourceDomain (string: extracted website domain if provided)
      
      Also provide an 'explanation' field (in Russian) explaining what you understood.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          parameters: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              subcategory: { type: Type.STRING },
              brand: { type: Type.STRING },
              color: { type: Type.STRING },
              minPrice: { type: Type.NUMBER },
              maxPrice: { type: Type.NUMBER },
              width: { type: Type.NUMBER },
              hasThermostat: { type: Type.BOOLEAN },
              material: { type: Type.STRING },
              style: { type: Type.STRING },
              intent: { type: Type.STRING },
              urgency: { type: Type.STRING },
              sourceDomain: { type: Type.STRING }
            }
          },
          confidence: { type: Type.NUMBER },
          clarificationQuestion: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["parameters", "confidence", "explanation"]
      }
    }
  });

  return safeJsonParse(response.text);
};

export const scoutWebProducts = async (domain: string, params: SearchParameters): Promise<any[]> => {
  const query = `Find real products on ${domain} matching: ${params.category} ${params.subcategory} ${params.brand || ""} ${params.color || ""} ${params.material || ""}`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction: `You are a web shopping scout. Use Google Search to find real products ON THE SPECIFIED DOMAIN.
      Return a list of exactly 4 products in JSON format.
      Each product MUST match the local Product interface:
      {
        id: "web-unique-id",
        name: "Full Product Name",
        brand: "Extracted Brand",
        price: number,
        image: "https://picsum.photos/seed/{name}/400/400" (use this placeholder if image URL is not found),
        description: "Brief useful description",
        category: "Matching category",
        subcategory: "Matching subcategory",
        characteristics: { color, material, etc. },
        rating: number (4.0-5.0),
        reviewsCount: number,
        popularity: number (70-100),
        sourceUrl: "The real URL on the site"
      }
      
      BE REALISTIC. If prices are not found, estimate based on domain average.`,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            brand: { type: Type.STRING },
            price: { type: Type.NUMBER },
            image: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            subcategory: { type: Type.STRING },
            characteristics: { type: Type.OBJECT, additionalProperties: { type: Type.STRING } },
            rating: { type: Type.NUMBER },
            reviewsCount: { type: Type.NUMBER },
            popularity: { type: Type.NUMBER },
            sourceUrl: { type: Type.STRING }
          },
          required: ["id", "name", "price", "image", "sourceUrl"]
        }
      }
    }
  });

  return safeJsonParse(response.text);
};

export const explainPerformance = async (product: any, parameters: SearchParameters): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain why product "${product.name}" matches these search parameters: ${JSON.stringify(parameters)}. 
    Product data: ${JSON.stringify(product)}`,
    config: {
      systemInstruction: "You are a helpful salesman. Briefly explain in Russian why this product fits the user's request. Highlight matches and mentions if there's a slight compromise."
    }
  });

  return response.text;
};

export interface ComparisonResult {
  features: {
    name: string;
    values: { [productId: string]: string };
  }[];
  analysis: {
    [productId: string]: {
      pros: string[];
      cons: string[];
      verdict: string;
    }
  };
  summary: string;
}

export const compareProducts = async (products: any[]): Promise<ComparisonResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare these products side-by-side: ${JSON.stringify(products)}`,
    config: {
      systemInstruction: "You are a senior product analyst. Provide a CONCISE technical analysis of differences, pros, and cons. Keep descriptions brief to fit in a summary. Return ONLY JSON in Russian.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          features: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                values: { type: Type.OBJECT, additionalProperties: { type: Type.STRING } }
              },
              required: ["name", "values"]
            }
          },
          analysis: {
            type: Type.OBJECT,
            additionalProperties: {
              type: Type.OBJECT,
              properties: {
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                verdict: { type: Type.STRING }
              },
              required: ["pros", "cons", "verdict"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["features", "analysis", "summary"]
      }
    }
  });

  return safeJsonParse(response.text);
};

export const getRecommendedProducts = async (baseProduct: any, allProducts: any[]): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 3 related product IDs from this catalog that complement "${baseProduct.name}" (${baseProduct.category}). 
    Catalog: ${JSON.stringify(allProducts.map(p => ({ id: p.id, name: p.name, category: p.category, subcategory: p.subcategory })))}`,
    config: {
      systemInstruction: "Return ONLY a JSON array of exactly 3 product IDs that are complementary (e.g., accessories or related items).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return safeJsonParse(response.text);
};
