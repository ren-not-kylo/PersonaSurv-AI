
import { GoogleGenAI, Type } from "@google/genai";
import { SurveyTemplate, UserProfile, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSurveyQuestions = async (
  template: SurveyTemplate,
  user: UserProfile
): Promise<Question[]> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Create a highly personalized survey based on this template and user profile.
    
    RESEARCH TOPIC: ${template.topic}
    NUMBER OF QUESTIONS: ${template.questionCount}
    POSSIBLE OUTCOMES: ${template.outcomes.map(o => `${o.name} (Traits: ${o.traits.join(', ')})`).join('; ')}
    
    USER PROFILE:
    Name: ${user.name}
    Interests: ${user.interests.join(', ')}
    Demographics: ${user.demographics}
    Past Results: ${JSON.stringify(user.history)}
    
    INSTRUCTION:
    1. Tailor the tone and context of the questions to the user's interests. If they like sci-fi, use sci-fi metaphors.
    2. Each question should have 4 options. 
    3. Each option must map to one of the possible outcome IDs provided below.
    4. Ensure the survey feels cohesive and professional yet engaging.

    OUTCOME MAPPING IDs:
    ${template.outcomes.map(o => `${o.id}: ${o.name}`).join('\n')}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            text: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  outcomeId: { type: Type.STRING }
                },
                required: ["text", "outcomeId"]
              }
            }
          },
          required: ["id", "text", "options"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};

export const analyzeSurveyResult = async (
  template: SurveyTemplate,
  answers: { questionId: number; outcomeId: string }[]
): Promise<string> => {
  // Simple tally logic for this version, but we could use AI to be more nuanced
  const counts: Record<string, number> = {};
  answers.forEach(a => {
    counts[a.outcomeId] = (counts[a.outcomeId] || 0) + 1;
  });

  const winnerId = Object.entries(counts).reduce((a, b) => b[1] > a[1] ? b : a)[0];
  const outcome = template.outcomes.find(o => o.id === winnerId);
  return outcome ? outcome.name : "Unknown";
};
