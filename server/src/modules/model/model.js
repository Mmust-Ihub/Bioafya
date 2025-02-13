
import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
  } from "@google/generative-ai";
  import config from "../../config/config.js"
  import logger from "../../config/logger.js";

  const genAI = new GoogleGenerativeAI(config.gemini.api_key);
  const model = genAI.getGenerativeModel({
    model: config.gemini.model,
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  
  export const modelPredict = async (file, mimeType, prompt) => {
    try {
      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: Buffer.from(file).toString("base64"),
                  mimeType,
                },
              },
            ],
          },
        ],
      });
      const result = await chatSession.sendMessage("Analyze this image");
      let responseText = result.response.text();
      const jsonMatch = responseText.match(/{.*}/s); // Match the JSON structure
      if (jsonMatch) {
        responseText = jsonMatch[0];
      } else {
        logger.info("Invalid response format, no JSON found");
        return {};
      }
      return JSON.parse(responseText);
    } catch (error) {
      logger.error("Error during model prediction or JSON parsing:", error);
      return {};
    }
  };
  
  export const chatModel = async (userQuery) => {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [
            {
              text: queryPrompt,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: modelPrompt,
            },
          ],
        },
      ],
    });
    try {
      const resp = await chatSession.sendMessage(userQuery);
      return resp.response.text();
    } catch (error) {
      logger.error(`Error during user query processing: ${error.message}`);
      return "Sorry, I can only help with farming-related questions.";
    }
  };