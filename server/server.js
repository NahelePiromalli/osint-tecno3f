import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeCompanyWebsite } from './services/websiteScraperService.js';
import { searchCompanyOSINT } from './services/searchService.js';
import { analyzeFinancials } from './services/financialService.js';
import { categorizeCompany } from './services/categorizationService.js';
import { generateSupportPlan } from './services/supportAdvisorService.js';
import { analyzeLegalOSINT } from './services/legalOsintService.js';
import { analyzePublicContracts } from './services/publicContractsService.js';
import { generateSwotAnalysis } from './services/swotAnalysisService.js';
import { analyzeDigitalTransformation } from './services/digitalTransformationService.js';
import { analyzeCompanyWithGemini } from './services/aiExtractionService.js';
import { registerUserInDB, authenticateUserInDB } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend build if dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Auth Endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres.' });
    }

    const user = registerUserInDB(username, password);
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Ingresa usuario y contraseña.' });
    }

    const user = authenticateUserInDB(username, password);
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/osint/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'OSINT Tecno3F Engine v4.0'
  });
});

// Main OSINT Scan Endpoint
app.post('/api/osint/scan', async (req, res) => {
  try {
    const { companyName, website, region = 'AR' } = req.body;

    if (!companyName || !companyName.trim()) {
      return res.status(400).json({ error: 'El nombre de la empresa es obligatorio' });
    }

    console.log(`[OSINT SCAN START] Analyzing Business: "${companyName}" | Website: "${website || 'None'}"`);

    // 1. Website Scraper & Business Intelligence
    const scrapedData = await scrapeCompanyWebsite(website, companyName);

    // 2. Search Engine & News OSINT
    const searchData = await searchCompanyOSINT(companyName, website, region);

    // 3. Financial & Tax Assessment
    const financialData = analyzeFinancials(companyName, scrapedData, searchData);

    // 4. Legal & Judicial OSINT
    const legalData = analyzeLegalOSINT(companyName);

    // 5. Public Contracts & Tenders
    const publicContracts = analyzePublicContracts(companyName);

    // 6. Categorization
    const categorization = categorizeCompany(companyName, scrapedData, searchData);

    // 7. Strategic Support Plan
    const supportPlan = generateSupportPlan(companyName, categorization, financialData, scrapedData, searchData);

    // 8. Matriz FODA / SWOT Analysis
    const swotAnalysis = generateSwotAnalysis(companyName, categorization, financialData, scrapedData, legalData);

    // 9. Digital Transformation Analysis
    const digitalTransformation = analyzeDigitalTransformation(companyName, scrapedData, searchData);

    // 10. Gemini AI RAG Synthesis (Strict Company-Specific Analysis)
    const aiResult = await analyzeCompanyWithGemini(companyName, scrapedData, searchData);

    if (aiResult) {
      if (aiResult.sector && aiResult.sector !== 'Información no verificada públicamente') {
        categorization.sector = aiResult.sector;
      }
      if (aiResult.businessModel && aiResult.businessModel !== 'Información no verificada públicamente') {
        categorization.businessModel = aiResult.businessModel;
      }
      if (aiResult.companyType && aiResult.companyType !== 'Información no verificada públicamente') {
        categorization.companyType = aiResult.companyType;
      }

      if (scrapedData.businessAnswers) {
        if (aiResult.whatItSells) scrapedData.businessAnswers.whatItSells = aiResult.whatItSells;
        if (aiResult.whoBuys) scrapedData.businessAnswers.whoBuys = aiResult.whoBuys;
        if (aiResult.howItGeneratesRevenue) scrapedData.businessAnswers.howItGeneratesRevenue = aiResult.howItGeneratesRevenue;
        if (aiResult.mostImportantAsset) scrapedData.businessAnswers.mostImportantAsset = aiResult.mostImportantAsset;
      }

      if (aiResult.strengths?.length > 0) swotAnalysis.strengths = aiResult.strengths;
      if (aiResult.weaknesses?.length > 0) swotAnalysis.weaknesses = aiResult.weaknesses;
      if (aiResult.opportunities?.length > 0) swotAnalysis.opportunities = aiResult.opportunities;
      if (aiResult.threats?.length > 0) swotAnalysis.threats = aiResult.threats;
    }

    // Consolidated OSINT Master Report
    const report = {
      id: `OSINT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      query: {
        companyName: companyName.trim(),
        website: website ? website.trim() : null,
        region
      },
      categorization,
      scrapedData,
      financialData,
      legalData,
      publicContracts,
      searchData,
      supportPlan,
      swotAnalysis,
      digitalTransformation,
      executiveSummary: aiResult?.executiveSummary || null
    };

    console.log(`[OSINT SCAN COMPLETE] Report ID: ${report.id} generated for "${companyName}"`);
    return res.json(report);

  } catch (error) {
    console.error('OSINT Scan Server Error:', error);
    return res.status(500).json({
      error: 'Inconveniente interno al procesar el análisis OSINT.',
      details: error.message
    });
  }
});

// Fallback to React index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Servidor OSINT activo. Construya la aplicación cliente con `npm run build:client`');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 OSINT Tecno3F Server running on http://localhost:${PORT}`);
});
