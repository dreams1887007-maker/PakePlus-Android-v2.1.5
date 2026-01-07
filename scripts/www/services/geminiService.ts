import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, ReceiptData } from '../types';
import { CATEGORY_NAMES } from '../constants';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Parse receipt image to extract transaction details
export const parseReceiptImage = async (base64Image: string): Promise<ReceiptData> => {
  const ai = getAI();
  
  const categoriesList = CATEGORY_NAMES.expense.join(', ');

  const prompt = `
    请分析这张收据图片。提取总金额（amount）、日期（格式为 ISO YYYY-MM-DD）、
    商户名称（merchant）。
    并从以下主分类中推断最合适的类别（category）：
    [${categoriesList}]。
    请只返回主分类名称。如果找不到某个字段，请返回 null。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Optimized for images
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            merchant: { type: Type.STRING },
            category: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ReceiptData;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini Receipt Parse Error:", error);
    throw error;
  }
};

// Chat with financial advisor
export const getFinancialAdvice = async (
  query: string, 
  history: Transaction[]
): Promise<string> => {
  const ai = getAI();
  
  // Simplify history to save tokens and focus on content
  const contextData = history.map(t => {
      const cat = t.subCategory ? `${t.category}-${t.subCategory}` : t.category;
      return `${t.date}: ${t.type === 'expense' ? '支出' : '收入'} ¥${t.amount}，类别：${cat} (${t.note})`;
  }).join('\n');

  const prompt = `
    你是一位乐于助人且精明的中文财务顾问，名叫 Dream 助手。
    这是用户近期的交易记录：
    ---
    ${contextData}
    ---
    用户问题：${query}
    
    请用中文简洁地回答，并尽可能提供可操作的建议。
    使用 Markdown 格式。金额符号请使用 ¥。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // High speed text model
      contents: prompt,
    });
    return response.text || "我现在无法进行分析。";
  } catch (error) {
    console.error("Gemini Advisor Error:", error);
    return "抱歉，我现在连接财务大脑出现了一些问题，请稍后再试。";
  }
};
