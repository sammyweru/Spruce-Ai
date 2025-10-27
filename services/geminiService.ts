


import { GoogleGenAI, Modality, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage, ImageFile, StyleProfile, HomeProfile, InventoryItem } from '../types';

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error("NEXT_PUBLIC_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY });

const fileToGenerativePart = (file: ImageFile) => {
  return {
    inlineData: {
      data: file.base64,
      mimeType: file.mimeType,
    },
  };
};

interface ConversationalDesignResponse {
    text: string;
    image?: ImageFile;
    style?: string;
}

const KENYA_CONTEXT = "You are an expert AI design assistant for a Kenyan user, specifically in Nairobi. All your suggestions for furniture, decor, plants, and materials must be things that are commonly available in Kenya. When suggesting plants, consider the Nairobi climate. For style, incorporate local aesthetics like Afro-modern, coastal (Lamu), contemporary Nairobi, or classic farmhouse, alongside international styles.";

const INTERIOR_SYSTEM_PROMPT = `${KENYA_CONTEXT} You are Spruce, an AI interior designer. Your goal is to help users visualize changes to their room.
- If asked for a style change, you MUST generate a new image.
- If asked for a minor edit, you MUST generate a new image.
- If asked a question, answer in text and DO NOT generate an image.
- If you generate an image, describe the changes. The output MUST be photorealistic.`;

const EXTERIOR_SYSTEM_PROMPT = `${KENYA_CONTEXT} You are Spruce, an AI exterior and landscape designer. Your goal is to help users visualize changes to their home's exterior and yard.
- For curb appeal or landscaping changes, you MUST generate a new image.
- If you generate an image, describe the changes. The output MUST be photorealistic.`;

const DOCTOR_SYSTEM_PROMPT = `${KENYA_CONTEXT} You are "Spruce Home Doctor," an AI diagnostic assistant. The user has uploaded a photo of a problem in or around their home (e.g., a crack, a leak, a sick plant).
1.  Identify the most likely problem in the image.
2.  Provide a clear, concise diagnosis.
3.  Offer a simple, step-by-step DIY solution if it's a minor issue. Include a list of necessary tools/materials.
4.  If it's a serious problem (e.g., structural crack, major leak, pest infestation), strongly advise them to consult a professional fundi (e.g., a structural engineer, plumber, or pest control expert in Nairobi).
5.  DO NOT generate an image. Your response must be text-only.`;

export const conversationaLDesign = async (
    image: ImageFile, 
    prompt: string, 
    styleProfile: StyleProfile,
    designMode: 'interior' | 'exterior' | 'doctor' | 'upcycle',
    homeProfile: HomeProfile | null,
    taskBudget?: 'low' | 'mid' | 'high',
    inventoryItems?: InventoryItem[],
): Promise<ConversationalDesignResponse> => {
    
    let systemPrompt = '';
    switch(designMode) {
        case 'interior': systemPrompt = INTERIOR_SYSTEM_PROMPT; break;
        case 'exterior': systemPrompt = EXTERIOR_SYSTEM_PROMPT; break;
        case 'doctor': systemPrompt = DOCTOR_SYSTEM_PROMPT; break;
        case 'upcycle':
            // This mode is handled by generateUpcyclePlan
            return generateUpcyclePlan(image, prompt);
    }
    
    const styleProfileDescription = Object.entries(styleProfile)
        .sort(([, a], [, b]) => b - a)
        .map(([style, count]) => `${style} (used ${count} times)`)
        .join(', ');

    let fullPrompt = `User request: "${prompt}"`;

    // Add context from Home Profile if available
    if (homeProfile) {
        let profileContext = `\n\nUSER'S HOME PROFILE:
- House Type: ${homeProfile.houseType}
- Main Goal: ${homeProfile.projectGoal}
- Overall Renovation Budget: ${homeProfile.budget.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
- Main Frustrations: ${homeProfile.painPoints}`;
        fullPrompt += profileContext;
    }
    
    if (taskBudget) {
        const budgetDescription = taskBudget === 'low' ? 'a small budget for this specific task (under 20,000 KES - focus on paint, decor, textiles)' : taskBudget === 'mid' ? 'a medium budget for this task (under 100,000 KES - can replace one or two key furniture items)' : 'a high budget for this task (250,000+ KES - major changes are okay)';
        fullPrompt += `\n\nBudget Constraint for this request: ${budgetDescription}. All suggestions must adhere to this task budget.`;
    }

    const imageParts = [fileToGenerativePart(image)];

    if (inventoryItems && inventoryItems.length > 0) {
        fullPrompt += `\nCrucially, you MUST include the following existing items in your design:`;
        inventoryItems.forEach(item => {
            fullPrompt += `\n- ${item.name}`;
            imageParts.push(fileToGenerativePart(item.image));
        });
        fullPrompt += `\nDesign the rest of the room around these pieces.`
    }
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [...imageParts, { text: fullPrompt }] },
        config: {
            systemInstruction: `${systemPrompt}\nUSER'S STYLE PROFILE: ${styleProfileDescription || 'None yet'}.`,
            // FIX: Corrected responseModalities to align with Gemini API guidelines.
            // Text-only responses (doctor mode) don't need a modality, and image responses
            // should only specify [Modality.IMAGE].
            responseModalities: designMode !== 'doctor' ? [Modality.IMAGE] : undefined,
        }
    });

    let textResponse = "Sorry, I couldn't process that request.";
    let imageResponse: ImageFile | undefined = undefined;

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.text) {
            textResponse = part.text;
        } else if (part.inlineData) {
            imageResponse = {
                base64: part.inlineData.data,
                mimeType: part.inlineData.mimeType,
                name: 'generated-design.png'
            };
        }
    }
    
    const styleMatch = textResponse.match(/(?:style is|in a|the)\s+([\w\s-]+)\s+style/i);
    const style = styleMatch ? styleMatch[1].trim() : 'Custom';

    return { text: textResponse, image: imageResponse, style };
};

export const findShoppableItems = async (image: ImageFile, budget?: string, clickPosition?: {x: number, y: number}): Promise<GenerateContentResponse> => {
    const imagePart = fileToGenerativePart(image);
    let textPrompt = `A user has clicked on an item in the attached image.`;

    if (clickPosition) {
        textPrompt += ` The click occurred at normalized coordinates x: ${clickPosition.x.toFixed(2)}, y: ${clickPosition.y.toFixed(2)} (where {0,0} is the top-left corner).`;
    }

    textPrompt += ` First, identify the item the user clicked on. Then, use the search tool to find 3-5 links to similar, shoppable products from Kenyan online retailers (e.g., Jumia, House of Leather, Hotpoint Appliances).`;
    
    if (budget && budget !== 'any') {
        const budgetInKES = budget === 'low' ? 'under 20,000 KES' : budget === 'mid' ? '20,000-100,000 KES' : 'over 100,000 KES';
        textPrompt += ` The products should fit a budget of ${budgetInKES}.`;
    }
    
    textPrompt += ` Respond with the item's name followed by a list of the products. You MUST format each product as a markdown link, like this: [Product Name](URL). Do not include any text before the item name.`;
        
    const textPart = { text: textPrompt };
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, textPart] },
        config: { tools: [{googleSearch: {}}] },
    });

    return response;
};

export const generateDIYGuide = async (image: ImageFile): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                fileToGenerativePart(image),
                { text: `Based on the design in this image, generate a step-by-step DIY project guide for a beginner. The guide should include:
                1.  A "You Will Need" section listing all tools and materials.
                2.  A "Step-by-Step" section with clear, numbered instructions.
                Format the output using simple markdown (e.g., ### for headers, * for list items).` }
            ]
        },
    });
    return response.text;
};

export const generateUpcyclePlan = async (image: ImageFile, prompt: string): Promise<ConversationalDesignResponse> => {
    const systemInstruction = `${KENYA_CONTEXT} You are the "Spruce Upcycle Coach". The user has provided an image of a piece of furniture they want to upcycle and a text prompt.
    Your task is to provide a complete upcycling plan.
    1.  **Identify the Item:** Start by identifying the furniture (e.g., "This looks like a 6-drawer wooden dresser.").
    2.  **Generate Inspiration:** Based on the user's prompt (e.g., "make it modern"), generate ONE 'after' image showing a potential finished look.
    3.  **Create a DIY Plan:** In your text response, provide a detailed, step-by-step DIY guide including:
        - A "Shopping List" of materials needed (sandpaper, primer, paint, brushes, new hardware, etc.), keeping Kenyan availability in mind.
        - A "Step-by-Step Guide" on how to achieve the look in the generated image (e.g., 1. Clean, 2. Sand, 3. Prime, 4. Paint).
    The final output MUST include both the generated 'after' image and the detailed text plan.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                fileToGenerativePart(image),
                { text: `User's idea: "${prompt}"` }
            ]
        },
        config: {
            systemInstruction,
            // FIX: Corrected responseModalities to align with Gemini API guidelines.
            // It should be an array with a single Modality.IMAGE element.
            responseModalities: [Modality.IMAGE],
        }
    });

    let textResponse = "Sorry, I couldn't process that request.";
    let imageResponse: ImageFile | undefined = undefined;

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.text) {
            textResponse = part.text;
        } else if (part.inlineData) {
            imageResponse = {
                base64: part.inlineData.data,
                mimeType: part.inlineData.mimeType,
                name: 'generated-upcycle.png'
            };
        }
    }
    return { text: textResponse, image: imageResponse, style: 'Upcycled' };
};

export const generateVirtualStaging = async (image: ImageFile, style: string): Promise<ImageFile> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                fileToGenerativePart(image),
                { text: `This is a photo of an empty or sparsely furnished room. Perform AI virtual staging on it. Fully furnish the room in a photorealistic "${style}" style. Make it look appealing for a real estate listing. The output must ONLY be the final image.` }
            ]
        },
        config: { responseModalities: [Modality.IMAGE] }
    });
    
    const firstPart = response.candidates?.[0]?.content?.parts[0];
    if (firstPart && firstPart.inlineData) {
        return {
            base64: firstPart.inlineData.data,
            mimeType: firstPart.inlineData.mimeType,
            name: `staged-${style.toLowerCase()}.png`
        };
    }
    throw new Error("Virtual staging image was not generated.");
};

export const generateConciergeTip = async (profile: HomeProfile): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI Home Concierge for a user in Nairobi, Kenya. Here is their profile:
        - House Type: ${profile.houseType}
        - Primary Goal: ${profile.projectGoal}
        - General Budget: ${profile.budget.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
        - Pain Points: ${profile.painPoints}
        
        Generate a single, short, proactive, and helpful tip for them. It could be a maintenance reminder relevant to the Nairobi climate, a decor tip, or a suggestion to solve one of their pain points within their budget. Be friendly and conversational. Start with "Hi there,".`
    });
    return response.text;
};

export const extractColorPalette = async (image: ImageFile): Promise<string[]> => {
    const imagePart = fileToGenerativePart(image);
    const textPart = { text: "Analyze this image and identify the 5 most prominent colors. Return them as an array of hex codes." };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    colors: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['colors']
            }
        },
    });

    try {
        const parsed = JSON.parse(response.text);
        if (parsed.colors && Array.isArray(parsed.colors) && parsed.colors.length > 0) return parsed.colors;
    } catch (e) {
        console.error("Failed to parse color palette:", e);
    }
    return ["#cccccc", "#aaaaaa", "#888888", "#666666", "#444444"];
};

export const generateSeasonalLandscape = async (image: ImageFile, season: string): Promise<ImageFile> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                fileToGenerativePart(image),
                { text: `This is a photo of a house's exterior and yard. Transform ONLY the landscaping, plants, trees, and lighting to realistically show what this scene would look like in the middle of ${season}. Do NOT change the architecture of the house, any cars, or patio furniture. The output must ONLY be the final, photorealistic image.` }
            ]
        },
        config: { 
            systemInstruction: "You are an AI landscape visualizer. Your task is to alter the season in a provided image.",
            responseModalities: [Modality.IMAGE] 
        }
    });

    const firstPart = response.candidates?.[0]?.content?.parts[0];
    if (firstPart && firstPart.inlineData) {
        return {
            base64: firstPart.inlineData.data,
            mimeType: firstPart.inlineData.mimeType,
            name: `landscape-${season.toLowerCase()}.png`
        };
    }
    throw new Error("Seasonal landscape image was not generated.");
};