import React, { useState } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { downloadFullPdfReport } from '../utils/pdfReportGenerator';
import AuthModal from './AuthModal';

export default function Header({ currentReport, onReset, user, onLogin, onLogout, onOpenHistory, historyCount }) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleExportJSON = () => {
    if (!currentReport) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `OSINT_Tecno3F_${currentReport.query.companyName.replace(/\s+/g, '_')}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Direct PDF Download containing ALL 8 SECTIONS of the report
  const handleDownloadPDF = async () => {
    if (!currentReport) return;
    setDownloadingPdf(true);

    try {
      await downloadFullPdfReport(currentReport);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <header className="header-nav">
      <div className="brand-wrapper">
        <div className="brand-icon-box" style={{ background: 'transparent', border: 'none', padding: 0, width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/logo.png"
            alt="Tecno3F Logo"
            style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '8px' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <div>
          <h1 className="brand-name">
            {'OSINT '}<span style={{ whiteSpace: 'nowrap' }}><span style={{ color: '#a78bfa' }}>{'Tecno'}</span><span style={{ color: '#2dd4bf' }}>{'3F'}</span></span>
          </h1>
          <p className="brand-subtitle">
            Plataforma Profesional de Inteligencia Comercial y Asistencia Empresarial
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        {currentReport && (
          <>
            <button className="btn-secondary" onClick={handleExportJSON}>
              <Download size={15} /> Exportar JSON
            </button>
            <button
              className="btn-secondary"
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
            >
              <FileText size={15} /> {downloadingPdf ? 'Generando PDF...' : 'Descargar PDF Completo'}
            </button>
            <button className="btn-secondary" onClick={onReset}>
              <RefreshCw size={15} /> Nueva Búsqueda
            </button>
          </>
        )}

        <AuthModal
          user={user}
          onLogin={onLogin}
          onLogout={onLogout}
          onOpenHistory={onOpenHistory}
          historyCount={historyCount}
        />
      </div>
    </header>
  );
}
