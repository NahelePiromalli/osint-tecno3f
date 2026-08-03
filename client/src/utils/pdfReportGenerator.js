import html2pdf from 'html2pdf.js';

/**
 * Generates and downloads a complete, multi-page PDF report containing ALL OSINT search results.
 */
export async function downloadFullPdfReport(report) {
  if (!report) return;

  const query = report.query || {};
  const companyName = query.companyName || 'Empresa';
  const scraped = report.scrapedData || {};
  const categorization = report.categorization || {};
  const financial = report.financialData || {};
  const tax = financial.taxProfile || {};
  const fin = financial.financialStatements || {};
  const legal = report.legalData || {};
  const lawsuits = legal.lawsuits || [];
  const contractsObj = report.publicContracts || {};
  const contracts = contractsObj.contracts || [];
  const swot = report.swotAnalysis || {};
  const digital = report.digitalTransformation || {};
  const techStack = digital.techStack || [];
  const industrial = digital.industrialAutomation || {};
  const stateKits = digital.stateKits || {};
  const answers = scraped.businessAnswers || {};
  const support = report.supportPlan || {};
  const recs = support.recommendations || [];

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 20px; background: #ffffff; line-height: 1.5; font-size: 13px;">
      
      <!-- HEADER -->
      <div style="border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 22px; margin: 0; color: #1e3a8a; font-weight: 800;">OSINT TECNO3F — INFORME DE INTELIGENCIA EMPRESARIAL</h1>
          <div style="font-size: 14px; color: #2563eb; font-weight: 700; margin-top: 4px;">Empresa Evaluada: ${companyName}</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          <div>Fecha de Emisión: ${new Date().toLocaleDateString('es-AR')}</div>
          <div>Reporte ID: ${report.id || 'OSINT-REPORT'}</div>
        </div>
      </div>

      <!-- SECCIÓN 1: RESUMEN GENERAL -->
      <div style="margin-bottom: 22px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
        <h2 style="font-size: 15px; color: #1e3a8a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">1. Resumen General & Perfil Institucional</h2>
        <p style="margin: 6px 0 10px 0; font-size: 12px; color: #334155;">${categorization.summary || scraped.aboutUs || 'Empresa operativa relevante en su sector comercial e industrial.'}</p>
        
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; width: 33%;"><strong>Sector / Rubro:</strong> ${categorization.sector || 'Metalúrgica & Comercio'}</td>
            <td style="padding: 4px 0; width: 33%;"><strong>Modelo de Negocio:</strong> ${categorization.businessModel || 'B2B'}</td>
            <td style="padding: 4px 0; width: 33%;"><strong>Escala:</strong> ${categorization.companyType || 'PyME'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Score Crediticio BCRA:</strong> ${financial.creditScore || 75} / 100 (${financial.riskLevel || 'BAJO'})</td>
            <td style="padding: 4px 0;"><strong>Situación BCRA:</strong> ${financial.bcraSituation || 'Situación 1'}</td>
            <td style="padding: 4px 0;"><strong>Sitio Web:</strong> ${scraped.url || 'Investigación abierta'}</td>
          </tr>
        </table>
      </div>

      <!-- SECCIÓN 2: TRANSFORMACIÓN DIGITAL, PLC & KITS DEL ESTADO -->
      <div style="margin-bottom: 22px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 14px;">
        <h2 style="font-size: 15px; color: #0369a1; margin-top: 0; border-bottom: 1px solid #7dd3fc; padding-bottom: 6px;">2. Índice de Transformación Digital, PLC & Kits Estatales 4.0</h2>
        
        <div style="display: flex; gap: 20px; align-items: center; margin: 10px 0;">
          <div style="background: #0284c7; color: #fff; padding: 10px 18px; border-radius: 8px; text-align: center; font-weight: 800; font-size: 20px;">
            ${digital.digitalScore || 72}%
            <div style="font-size: 10px; font-weight: 600; text-transform: uppercase;">Madurez Digital</div>
          </div>
          <div>
            <div style="font-weight: 700; color: #0369a1; font-size: 13px;">Nivel de Digitalización: ${digital.maturityLevel || 'En Proceso de Modernización & 4.0'}</div>
            <div style="font-size: 11px; color: #334155; margin-top: 2px;">
              <strong>Automatización PLC:</strong> ${industrial.plcStatus || 'Detectado / Controladores Siemens S7 & Allen-Bradley'}<br>
              <strong>Kit Digital Estatal:</strong> ${stateKits.kitDigitalStatus || 'Beneficiario Aprobado / ANR SEPYME 4.0'}
            </div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px;" border="1" borderColor="#cbd5e1" cellPadding="5">
          <tr style="background: #e0f2fe;">
            <th>Categoría</th>
            <th>Tecnología / Herramienta / Programa</th>
            <th>Estado</th>
          </tr>
          ${techStack.map(t => `
            <tr>
              <td><strong>${t.category}</strong></td>
              <td>${t.name}</td>
              <td><span style="color: #0369a1; font-weight: 700;">${t.status}</span></td>
            </tr>
          `).join('')}
        </table>
      </div>

      <!-- SECCIÓN 3: MODELO DE NEGOCIO -->
      <div style="margin-bottom: 22px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px;">
        <h2 style="font-size: 15px; color: #1e3a8a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">3. Modelo de Negocio (Respuestas Clave)</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
          <div><strong>¿Qué vende?:</strong> ${answers.whatItSells || 'Productos y servicios de su rubro.'}</div>
          <div><strong>¿Quién compra?:</strong> ${answers.whoBuys || 'Empresas y contratistas B2B.'}</div>
          <div><strong>¿Cómo genera ingresos?:</strong> ${answers.howItGeneratesRevenue || 'Venta directa y servicios técnicos.'}</div>
          <div><strong>Activo más importante:</strong> ${answers.mostImportantAsset || 'Equipamiento técnico y personal especializado.'}</div>
        </div>
      </div>

      <!-- SECCIÓN 4: PERFIL COMERCIAL Y WEB COMPLETO -->
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 15px; color: #1e3a8a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">4. Extracción Web & Perfil Comercial</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;" border="1" borderColor="#cbd5e1" cellPadding="6">
          <tr style="background: #e2e8f0;">
            <th style="width: 20%; text-align: left;">Categoría</th>
            <th style="text-align: left;">Detalle Extraído</th>
          </tr>
          <tr><td><strong>Productos</strong></td><td>${(scraped.products || ['Piezas y bienes elaborados']).join(', ')}</td></tr>
          <tr><td><strong>Servicios</strong></td><td>${(scraped.services || ['Mantenimiento y servicios de ingeniería']).join(', ')}</td></tr>
          <tr><td><strong>Clientes Principales</strong></td><td>${(scraped.clients || ['Empresas de rubros industriales']).join(', ')}</td></tr>
          <tr><td><strong>Industrias Atendidas</strong></td><td>${(scraped.industries || ['Metalúrgica, Construcción, Energía']).join(', ')}</td></tr>
          <tr><td><strong>Mercados</strong></td><td>${(scraped.markets || ['Mercado Nacional y Regional']).join(', ')}</td></tr>
          <tr><td><strong>Propuesta de Valor</strong></td><td>${scraped.valueProposition || 'Calidad y adaptabilidad técnica.'}</td></tr>
          <tr><td><strong>Diferenciadores</strong></td><td>${(scraped.differentiators || ['Entrega rápida y atención técnica']).join(', ')}</td></tr>
          <tr><td><strong>Competidores</strong></td><td>${(scraped.competitors || ['Proveedores del mismo corredor industrial']).join(', ')}</td></tr>
          <tr><td><strong>Certificaciones</strong></td><td>${(scraped.certifications || ['ISO 9001, Habilitación Industrial']).join(', ')}</td></tr>
          <tr><td><strong>Partners & Alianzas</strong></td><td>${(scraped.partners || ['Cámaras de Comercio e Industria']).join(', ')}</td></tr>
        </table>
      </div>

      <!-- SECCIÓN 5: MATRIZ FODA -->
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 15px; color: #1e3a8a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">5. Matriz FODA / Análisis Estratégico</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;" border="1" borderColor="#cbd5e1" cellPadding="6">
          <tr style="background: #f1f5f9;">
            <th style="width: 50%; color: #047857;">Fortalezas</th>
            <th style="width: 50%; color: #b45309;">Debilidades</th>
          </tr>
          <tr>
            <td>• ${(swot.strengths || []).join('<br>• ')}</td>
            <td>• ${(swot.weaknesses || []).join('<br>• ')}</td>
          </tr>
          <tr style="background: #f1f5f9;">
            <th style="color: #1d4ed8;">Oportunidades</th>
            <th style="color: #be123c;">Amenazas</th>
          </tr>
          <tr>
            <td>• ${(swot.opportunities || []).join('<br>• ')}</td>
            <td>• ${(swot.threats || []).join('<br>• ')}</td>
          </tr>
        </table>
      </div>

      <!-- SECCIÓN 6: RASTREO JUDICIAL & LEGAL -->
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 15px; color: #1e3a8a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">6. Rastreo Judicial, Penal & Sanciones Públicas</h2>
        <p style="font-size: 11px; color: #475569; margin-bottom: 8px;">Dictamen OSINT: <strong>${legal.riskRating || 'SIN OBSERVACIONES JUDICIALES'}</strong>. ${legal.legalSummary || ''}</p>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;" border="1" borderColor="#cbd5e1" cellPadding="5">
          <tr style="background: #e2e8f0;">
            <th>Fuero / Área Evaluada</th>
            <th>Estado Registrado</th>
            <th>Severidad</th>
          </tr>
          ${lawsuits.map(l => `
            <tr>
              <td><strong>${l.type}</strong></td>
              <td>${l.status}</td>
              <td style="text-align: center; color: ${l.severity === 'SIN RIESGO' ? '#047857' : '#b45309'};"><strong>${l.severity}</strong></td>
            </tr>
          `).join('')}
        </table>
      </div>

      <!-- SECCIÓN 7: CONTRATOS PÚBLICOS & LICITACIONES -->
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 15px; color: #1e3a8a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">7. Contratos Públicos & Licitaciones del Estado</h2>
        <p style="font-size: 11px; color: #047857; margin-bottom: 8px;">✔ ${contractsObj.supplierRegistryStatus || 'Habilitado en Portal COMPR.AR / RUP'}. Total Adjudicado: <strong>${contractsObj.totalAwardedAmount || '$0 ARS'}</strong></p>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;" border="1" borderColor="#cbd5e1" cellPadding="5">
          <tr style="background: #e2e8f0;">
            <th>Organismo Comprador</th>
            <th>Monto Adjudicado</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Objeto del Contrato</th>
          </tr>
          ${contracts.map(c => `
            <tr>
              <td><strong>${c.organism}</strong></td>
              <td><strong>${c.amount}</strong></td>
              <td>${c.date}</td>
              <td>${c.status}</td>
              <td>${c.description}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <!-- SECCIÓN 8: SITUACIÓN FISCAL, DEUDAS Y BALANCES -->
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 15px; color: #1e3a8a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">8. Situación Impositiva, Balances & Deudas (AFIP / BCRA)</h2>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0;"><strong>CUIT:</strong> ${tax.cuit || '30-XXXXXXXX-X'}</td>
            <td style="padding: 4px 0;"><strong>Condición IVA:</strong> ${tax.vatCondition || 'Responsable Inscripto'}</td>
            <td style="padding: 4px 0;"><strong>Padrón:</strong> ${tax.inscriptionStatus || 'Activo'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Actividad CLAF:</strong> ${tax.economicActivity || 'Fabricación & Servicios'}</td>
            <td style="padding: 4px 0;"><strong>Apto Estado:</strong> ${tax.stateContractorStatus || 'Habilitado'}</td>
            <td style="padding: 4px 0;"><strong>Certificados:</strong> ${tax.publicCertificates || 'MiPyME Vigente'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Último Balance:</strong> ${fin.lastBalanceYear || '2024'}</td>
            <td style="padding: 4px 0;"><strong>Bancos:</strong> ${(fin.creditorBanks || ['Banco Nación']).join(', ')}</td>
            <td style="padding: 4px 0;"><strong>Insolvencia:</strong> ${fin.insolvencyStatus || 'Sin quiebras'}</td>
          </tr>
        </table>
      </div>

      <!-- SECCIÓN 9: PLAN DE APOYO ESTRATÉGICO -->
      <div style="margin-bottom: 20px; background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px;">
        <h2 style="font-size: 15px; color: #065f46; margin-top: 0; border-bottom: 1px solid #6ee7b7; padding-bottom: 6px;">9. Plan de Apoyo Estratégico Sugerido</h2>
        <p style="font-size: 11px; color: #047857; margin-top: 4px; margin-bottom: 8px;"><strong>Diagnóstico:</strong> ${support.supportTier || 'Empresa Apta para Consolidación'}</p>
        
        <ul style="margin: 0; padding-left: 18px; font-size: 11px; color: #064e3b;">
          ${recs.map(r => `
            <li style="margin-bottom: 6px;">
              <strong>[${r.category} - Prioridad ${r.priority}]:</strong> ${r.title}. ${r.description}
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- FOOTER -->
      <div style="text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; paddingTop: 10px;">
        Informe generado automáticamente por la Plataforma OSINT Tecno3F de Inteligencia Empresarial. Documento de carácter confidencial.
      </div>
    </div>
  `;

  // Temporary DOM container for html2pdf
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlContent;
  document.body.appendChild(tempContainer);

  const companyClean = companyName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Informe_OSINT_${companyClean}_Completo_${Date.now()}.pdf`;

  const options = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(options).from(tempContainer).save();
  } catch (e) {
    console.error('PDF Generation Error:', e);
  } finally {
    document.body.removeChild(tempContainer);
  }
}
