// lib/IA/gemini.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

export async function mejorarComentarioIA(texto: string): Promise<string> {
    const prompt = `
    Corrige el siguiente comentario de auditoría para que suene claro, profesional y directo. 
    Mantén la redacción breve, con lenguaje técnico apropiado para un informe de auditoría. 
    No uses explicaciones, ni devoluciones en formato Markdown. Solo responde con el texto corregido.
    
    Texto original: "${texto}"
    `;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });



        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;


        return text || "⚠️ No se pudo mejorar el comentario.";
    } catch (error) {
        console.error("❌ Error al usar Gemini:", error);
        return "❌ Error al procesar la mejora con IA.";
    }
}
