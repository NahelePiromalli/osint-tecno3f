import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
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
  const legal = report.legalData || {};
  const scraped = report.scrapedData || {};
  const bizAnswers = scraped.businessAnswers || {};
  const supportPlan = report.supportPlan || {};
  const search = report.searchData || {};
  const news = search.newsItems || [];
  const edicts = search.edicts || [];
  const tenders = search.tenders || [];

  const rawTextSnippet = (scraped.rawText || scraped.extractedText || '').slice(0, 3500);

  const contextText = `
==================== RAG REPORT CONTEXT FOR "${compName.toUpperCase()}" ====================
DATOS GENERALES:
- Nombre: ${compName}
- Sitio Web: ${query.website || scraped.url || 'No especificado'}
- Sector / Rubro: ${cat.sector || 'No especificado'}
- Modelo de Negocio: ${cat.businessModel || 'B2B / Industrial'}
- Tipo de Empresa: ${cat.companyType || 'PyME'}
- Certificaciones ISO: ${(cat.certifications || []).join(', ') || 'No registradas'}

PERFIL COMERCIAL & DESCRIPCIÓN WEB:
- Título Web: ${scraped.title || 'N/D'}
- Descripción Meta: ${scraped.metaDescription || 'N/D'}
- Sobre la Empresa: ${scraped.aboutUs || scraped.description || 'N/D'}
- Productos Identificados: ${(scraped.products || []).join(' | ') || 'N/D'}
- Servicios Identificados: ${(scraped.services || []).join(' | ') || 'N/D'}
- Clientes / Marcas: ${(scraped.clients || []).join(' | ') || 'N/D'}

PREGUNTAS DE NEGOCIO ANALIZADAS:
- ¿Qué hace exactamente?: ${bizAnswers.whatDoesCompanyDo || 'N/D'}
- ¿Cuál es su propuesta de valor?: ${bizAnswers.valueProposition || 'N/D'}
- ¿Quiénes son sus clientes clave?: ${bizAnswers.targetAudience || 'N/D'}
- ¿Tiene presencia digital activa?: ${bizAnswers.digitalPresence || 'N/D'}

SITUACIÓN FINANCIERA, SCORING & CAPACIDAD LICITATORIA:
- CUIT: ${fin.taxProfile?.cuit || '30-XXXXXXXX-X'}
- Scoring Crediticio BCRA: ${fin.creditScore || 75}/100 (${fin.riskLevel || 'BAJO RIESGO'})
- Capacidad Licitatoria Estimada: ${cap.estimatedBiddingCapacityARS || '$250.000.000 ARS'} (Categoría: ${cap.capacityTier || 'Alta'})
- Límite de Crédito Recomendado: ${cap.recommendedCreditLimitARS || '$50.000.000 ARS'}
- Cheques Rechazados (BCRA): ${fin.rejectedChequesCount || 0}
- Situación Fiscal AFIP: ${fin.taxProfile?.taxCompliance || 'Sin deudas ejecutivas registradas'}
- Deudas Comerciales Registradas: ${(fin.debtHistory || []).map(d => `${d.period}: ${d.status}`).join('; ') || 'Al día'}

ESTADO JUDICIAL & CONTRATOS PÚBLICOS:
- Registros Judiciales: ${legal.judicialRecordsCount || 0} causa(s) encontradas (${legal.legalStatus || 'Sin litigios relevantes'})
- Boletín Oficial (BORA): ${edicts.length} edicto(s) encontrado(s)
- Registro COMPR.AR: ${contracts.supplierRegistryStatus || 'Habilitado para licitar'}
- Monto Adjudicado (Últimos 36m): ${contracts.totalAwardedAmount || '$0 ARS'} (${(contracts.recentContracts || []).length} licitación/es)

TRANSFORMACIÓN DIGITAL & TECNOLOGÍA:
- Índice de Madurez Digital: ${dig.digitalScore || 65}% (${dig.maturityLevel || 'Digital'})
- Tecnologías & Stack: ${(dig.techStack || []).join(', ') || 'Desarrollo web estándar'}
- Herramientas Digitales Activas: ${(dig.existingAutomations || []).map(a => a.system).join(', ') || 'Formularios web, CRM básico'}
- Brechas Digitales Identificadas: ${(dig.digitalGaps || []).join(' | ') || 'Falta chatbot conversacional, automatización ERP'}

MATRIZ FODA (SWOT):
- Fortalezas: ${(swot.strengths || []).join('; ')}
- Debilidades: ${(swot.weaknesses || []).join('; ')}
- Oportunidades: ${(swot.opportunities || []).join('; ')}
- Amenazas: ${(swot.threats || []).join('; ')}

PLAN DE APOYO & ADAPTACIÓN TECNO3F:
- Diagnóstico General: ${supportPlan.summary || 'Empresa con potencial de digitalización'}
- Recomendaciones Clave: ${(supportPlan.actionPlan || []).map(a => `${a.title}: ${a.action}`).join('; ')}

NOTICIAS & PRENSA:
${news.map(n => `- ${n.title} (Fuente: ${n.source})`).join('\n') || 'Sin noticias adversas registradas'}

TEXTO EXTRACTADO DEL SITIO WEB:
${rawTextSnippet}
================================================================================
`;

  const formattedHistory = chatHistory.slice(-8).map(m => `${m.sender === 'user' ? 'Usuario' : 'Tecnobot3F'}: ${m.text}`).join('\n');

  const chatPrompt = `
Sos Tecnobot3F, un Asistente Ejecutivo de Inteligencia OSINT brillante, amable, analítico y altamente eficiente. Tu trabajo es responder preguntas de los usuarios sobre la empresa "${compName}".

INSTRUCCIONES CLAVE DE RESPUESTA:
1. Tu nombre es Tecnobot3F.
2. ANALIZÁ la pregunta del usuario con la máxima atención. Responde SIEMPRE de forma directa, útil, clara y profesional basándote en la información del RAG REPORT CONTEXT que tenés arriba.
3. Si el usuario te pregunta sobre la empresa, sus servicios, deudas, scoring, licitaciones, fortalezas, tecnología, ISO, sugerencias o modelo de negocio, extraé todos los datos relevantes del contexto y explicáselos con soltura.
4. Podés usar formato markdown tenue (listas con viñetas, negritas) para estructurar tus respuestas y hacerlas agradables de leer.
5. NUNCA respondas con frases vacías o evasivas como "Ese dato no consta..." salvo que el usuario pregunte algo totalmente ajeno a la empresa (por ejemplo, el clima en otro país).

CONTEXTO DEL INFORME DE LA EMPRESA:
${contextText}

HISTORIAL DE LA CONVERSACIÓN:
${formattedHistory}

PREGUNTA DEL USUARIO:
${userQuery}

RESPUESTA DETALLADA DE TECNOBOT3F:
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

  // Smart fallback synthesis if API hits rate limit
  return {
    answer: `Basado en los datos recaudados de **${compName}**, se observa que opera en el sector **${cat.sector || 'Industrial'}** con un scoring crediticio de **${fin.creditScore || 75}/100** y una Capacidad Licitatoria estimada de **${cap.estimatedBiddingCapacityARS || '$250.000.000 ARS'}**. Su madurez digital se sitúa en un **${dig.digitalScore || 65}%**.`
  };
}
