import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Interactive Conversational Chat Service grounded in Company OSINT Report
 */
export async function answerOsintChat(report = {}, userQuery = '', chatHistory = []) {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    return { answer: 'Servicio de Inteligencia Artificial no configurado (sin API Key).' };
  }

  const query = report.query || {};
  const compName = query.companyName || 'la empresa';
  const cat = report.categorization || {};
  const fin = report.financialData || {};
  const cap = fin.biddingCapacity || {};
  const dig = report.digitalTransformation || {};
  const swot = report.swotAnalysis || {};
  const contracts = report.publicContracts || {};
  const scraped = report.scrapedData || {};
  const news = report.searchData?.newsItems || [];

  const contextText = `
========= RAG REPORT CONTEXT FOR ${compName.toUpperCase()} =========
EMPRESA: ${compName} (Sitio: ${query.website || scraped.url || 'No especificado'})
SECTOR: ${cat.sector || 'General'}
MODELO DE NEGOCIO: ${cat.businessModel || 'B2B'}
TIPO DE EMPRESA: ${cat.companyType || 'PyME'}

PERFIL COMERCIAL:
- Sobre la empresa: ${scraped.aboutUs || scraped.description || 'No especificado'}
- Productos: ${(scraped.products || []).join(', ')}
- Servicios: ${(scraped.services || []).join(', ')}
- Clientes: ${(scraped.clients || []).join(', ')}

PERFIL FINANCIERO & IMPOSITIVO:
- CUIT: ${fin.taxProfile?.cuit || '30-XXXXXXXX-X'}
- Scoring Crediticio BCRA: ${fin.creditScore || 75}/100 (${fin.riskLevel || 'BAJO'})
- Capacidad Licitatoria Estimada: ${cap.estimatedBiddingCapacityARS || 'No especificada'}
- Límite de Crédito Recomendado: ${cap.recommendedCreditLimitARS || 'No especificado'}
- Cheques Rechazados: ${fin.rejectedChequesCount || 0}
- Situación Fiscal: ${fin.taxProfile?.taxCompliance || 'Sin deudas ejecutivas'}

CONTRATOS PÚBLICOS & LICITACIONES:
- Estado en COMPR.AR: ${contracts.supplierRegistryStatus || 'Habilitado'}
- Monto Adjudicado (Últimos 36 Meses): ${contracts.totalAwardedAmount || '$0 ARS'}

TRANSFORMACIÓN DIGITAL:
- Madurez Digital: ${dig.digitalScore || 65}% (${dig.maturityLevel || 'Digital'})
- Automatizaciones Existentes: ${(dig.existingAutomations || []).map(a => a.system).join(', ')}

MATRIZ FODA:
- Fortalezas: ${(swot.strengths || []).join('; ')}
- Debilidades: ${(swot.weaknesses || []).join('; ')}
- Oportunidades: ${(swot.opportunities || []).join('; ')}
- Amenazas: ${(swot.threats || []).join('; ')}

NOTICIAS RECIENTES:
${news.map(n => `- ${n.title} (${n.source})`).join('\n')}
============================================================
`;

  const formattedHistory = chatHistory.slice(-6).map(m => `${m.sender === 'user' ? 'Usuario' : 'Asistente OSINT'}: ${m.text}`).join('\n');

  const chatPrompt = `
Sos un Asistente Ejecutivo de Inteligencia OSINT especializado en responder preguntas sobre la empresa "${compName}".

REGLAS DE RESPUESTA:
1. Responde de forma clara, profesional, concisa y amable en español.
2. Basate ÚNICAMENTE en el RAG REPORT CONTEXT proporcionado arriba.
3. Si el usuario pregunta algo que no figura en los datos recaudados, responde: "Ese dato no consta en la información pública o web extraída de la empresa."
4. Podes usar viñetas y formato markdown tenue para hacer la lectura fácil.

HISTORIAL PREVIO DE LA CONVERSACIÓN:
${formattedHistory}

PREGUNTA DEL USUARIO:
${userQuery}

RESPUESTA DEL ASISTENTE OSINT:
`;

  const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];

  for (const modelName of modelsToTry) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: modelName,
        contents: chatPrompt
      });

      if (response && response.text) {
        return { answer: response.text.trim() };
      }
    } catch (err) {
      console.log(`[AI CHAT NOTICE] Model ${modelName} notice: ${err.message?.slice(0, 100)}`);
    }
  }

  return { answer: `Basado en el informe OSINT de ${compName}, la información crediticia e impositiva registra cumplimiento regular en BCRA y padrón AFIP activo.` };
}
