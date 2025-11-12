import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { BusinessInfo, WebsiteData } from "../types";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateWebsiteContent = async (info: BusinessInfo): Promise<WebsiteData> => {
  try {
    const prompt = `
      You are Sonasite AI, an expert website designer and copywriter.
      Generate a complete JSON structure for a professional, industry-specific website.
      The business is a "${info.type}" called "${info.name}" in "${info.location}".
      Generate all content in the following language: "${info.language}".
      The JSON output MUST conform to the responseSchema. Do not add extra fields.
      - Create a complete website structure with the following sections in this order: 'header', 'hero', 'about', 'services', 'testimonials', 'gallery', 'contact', and 'footer'.
      - For the 'header' section: provide a list of navLinks (e.g., Home, About, Services, Contact) and a ctaButton with text.
      - Write persuasive, high-converting copy for all text fields.
      - For all 'imageUrl' or 'logoUrl' fields, provide a realistic and high-quality image URL from Unsplash or Pexels. Use specific keywords related to the business type and location. Example: https://images.pexels.com/photos/12345/example.jpg.
      - For 'services' items, include a title, a short description, and a realistic price.
      - For 'gallery', provide at least 4 image URLs.
      - For 'testimonials', create 3 realistic testimonials. Use the 'title' field for the person's name and the 'description' field for their quote.
      - For the 'footer', generate a copyright notice in the 'text' field with the current year and business name, and include social media links (e.g., Facebook, Instagram, Twitter) in the 'links' field.
      - For the 'theme': provide a 'primaryColor' (in hex), a complementary 'secondaryColor' (in hex), and a 'fontFamily' from Google Fonts (e.g., 'Inter', 'Poppins', 'Lato').
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING },
            language: { type: Type.STRING },
            pages: {
              type: Type.OBJECT,
              properties: {
                home: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      type: { type: Type.STRING },
                      content: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING, nullable: true },
                          subtitle: { type: Type.STRING, nullable: true },
                          text: { type: Type.STRING, nullable: true },
                          imageUrl: { type: Type.STRING, nullable: true },
                          logoUrl: { type: Type.STRING, nullable: true },
                          items: {
                            type: Type.ARRAY,
                            nullable: true,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                price: { type: Type.STRING, nullable: true },
                                imageUrl: { type: Type.STRING, nullable: true },
                              },
                            },
                          },
                          images: { type: Type.ARRAY, nullable: true, items: { type: Type.STRING } },
                          links: {
                              type: Type.ARRAY,
                              nullable: true,
                              items: {
                                  type: Type.OBJECT,
                                  properties: {
                                      name: { type: Type.STRING },
                                      url: { type: Type.STRING }
                                  }
                              }
                          },
                          navLinks: {
                              type: Type.ARRAY,
                              nullable: true,
                              items: {
                                  type: Type.OBJECT,
                                  properties: {
                                      name: { type: Type.STRING },
                                      url: { type: Type.STRING }
                                  }
                              }
                          },
                          ctaButton: {
                              type: Type.OBJECT,
                              nullable: true,
                              properties: {
                                text: { type: Type.STRING },
                                url: { type: Type.STRING },
                              }
                          }
                        },
                      },
                    },
                  },
                },
              },
            },
            theme: {
              type: Type.OBJECT,
              properties: {
                primaryColor: { type: Type.STRING },
                secondaryColor: { type: Type.STRING },
                fontFamily: { type: Type.STRING },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const cleanJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    const generatedData = JSON.parse(cleanJsonText);
    
    return generatedData as WebsiteData;
  } catch (error) {
    console.error("Error generating website content:", error);
    return {
      businessName: info.name,
      language: info.language,
      theme: { primaryColor: "#7c3aed", secondaryColor: "#4c1d95", fontFamily: "Inter" },
      pages: {
        home: [
          { id: 'header', type: 'header', content: { logoUrl: 'https://picsum.photos/150/50', navLinks: [{name: 'Home', url: '#'}], ctaButton: { text: 'Contact Us', url: '#' } } },
          { id: 'hero', type: 'hero', content: { title: `Welcome to ${info.name}`, subtitle: 'Error generating content. Please try again.', imageUrl: 'https://picsum.photos/1920/1080' } },
          { id: 'contact', type: 'contact', content: { title: 'Contact Us', text: 'We hit a snag. Please provide your details below.' } }
        ]
      }
    };
  }
};

const generateMarketingCampaign = async (businessInfo: BusinessInfo, campaignGoal: string) => {
    const prompt = `
    You are a marketing expert AI. Generate a complete, ready-to-use marketing campaign for a ${businessInfo.type} called "${businessInfo.name}".
    The campaign goal is: "${campaignGoal}".
    The campaign should be in this language: ${businessInfo.language}.

    Generate a JSON object with three keys: "googleAd", "facebookPost", and "email".
    - "googleAd": provide a "headline" (max 30 chars), "description" (max 90 chars), and "cta" (Call To Action).
    - "facebookPost": provide "text" (engaging and friendly, with emojis) and an "imageDescription" for an AI image generator.
    - "email": provide a "subject" and a "body" in plain text. The body should be concise and persuasive.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    googleAd: {
                        type: Type.OBJECT,
                        properties: {
                            headline: { type: Type.STRING },
                            description: { type: Type.STRING },
                            cta: { type: Type.STRING }
                        }
                    },
                    facebookPost: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            imageDescription: { type: Type.STRING }
                        }
                    },
                    email: {
                        type: Type.OBJECT,
                        properties: {
                            subject: { type: Type.STRING },
                            body: { type: Type.STRING }
                        }
                    }
                }
            }
        }
    });
    
    const jsonText = response.text.trim().replace(/^```json\s*|```$/g, '');
    return JSON.parse(jsonText);
};


export const sonasiteAiService = {
  generateWebsiteContent,
  generateMarketingCampaign
};