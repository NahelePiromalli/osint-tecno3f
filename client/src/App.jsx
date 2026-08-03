import React, { useState, useEffect, Component } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import OverviewTab from './components/OverviewTab';
import ProjectsTab from './components/ProjectsTab';
import BusinessAnswersTab from './components/BusinessAnswersTab';
import SwotTab from './components/SwotTab';
import DigitalTransformationTab from './components/DigitalTransformationTab';

import LegalTab from './components/LegalTab';
import PublicContractsTab from './components/PublicContractsTab';
import FinancialTab from './components/FinancialTab';
import NewsTab from './components/NewsTab';
import SupportTab from './components/SupportTab';
import HistoryTab from './components/HistoryTab';
import { processClientSideOSINT } from './services/clientOsintEngine';
import { LayoutDashboard, Briefcase, HelpCircle, Target, Scale, Landmark, Newspaper, HeartHandshake, History, AlertCircle, Layers, FileCheck, RefreshCw, Cpu } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="saas-card" style={{ padding: '40px', textAlign: 'center', margin: '20px 0' }}>
          <AlertCircle size={48} style={{ color: 'var(--accent-rose)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Ocurrió un inconveniente al renderizar la vista</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '20px' }}>
            {this.state.error?.message || 'Error interno de renderizado.'}
          </p>
          <button className="btn-primary" onClick={() => this.setState({ hasError: false })}>
            <RefreshCw size={16} /> Reintentar Vista
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);

  // Load User from SessionStorage (temporary tab) or LocalStorage (persistent)
  useEffect(() => {
    try {
      const sessionUser = sessionStorage.getItem('osint_user');
      if (sessionUser) {
        setUser(JSON.parse(sessionUser));
        return;
      }

      const persistentUser = localStorage.getItem('osint_user');
      if (persistentUser) {
        setUser(JSON.parse(persistentUser));
      }
    } catch (e) {}
  }, []);

  // Load History ONLY if user is logged in
  useEffect(() => {
    if (user) {
      try {
        const historyKey = `osint_tecno3f_history_${user.id}`;
        const savedHistory = localStorage.getItem(historyKey);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        } else {
          setHistory([]);
        }
      } catch (e) {
        setHistory([]);
      }
    } else {
      setHistory([]);
      setShowHistoryOnly(false);
    }
  }, [user]);

  const handleLogin = (loggedUser, keepSession) => {
    setUser(loggedUser);
    const userJson = JSON.stringify(loggedUser);

    if (keepSession) {
      localStorage.setItem('osint_user', userJson);
      sessionStorage.removeItem('osint_user');
    } else {
      sessionStorage.setItem('osint_user', userJson);
      localStorage.removeItem('osint_user');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('osint_user');
    sessionStorage.removeItem('osint_user');
    setHistory([]);
    setShowHistoryOnly(false);
    if (activeTab === 'history') setActiveTab('overview');
  };

  // Perform OSINT Scan with COMPLETE STATE WIPE
  const handleScan = async ({ companyName, website, region }) => {
    setLoading(true);
    setError(null);
    setReport(null); // Complete state cleanup before new scan
    setShowHistoryOnly(false);
    let data = null;

    try {
      // 1. Try API backend
      const response = await fetch('/api/osint/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, website, region })
      }).catch(() => null);

      if (response && response.ok) {
        const rawText = await response.text();
        if (rawText && !rawText.trim().startsWith('<')) {
          try {
            data = JSON.parse(rawText);
          } catch (e) {}
        }
      }

      // 2. Fallback to Client-Side OSINT Engine
      if (!data || !data.categorization) {
        console.log('Using Client-Side OSINT Engine fallback...');
        data = await processClientSideOSINT(companyName, website, region);
      }

      setReport(data);
      setActiveTab('overview');

      // Save history ONLY if user is logged in
      if (user) {
        setHistory(prev => {
          const updated = [data, ...prev.filter(h => h.id !== data.id)].slice(0, 25);
          const historyKey = `osint_tecno3f_history_${user.id}`;
          localStorage.setItem(historyKey, JSON.stringify(updated));
          return updated;
        });
      }

    } catch (err) {
      console.error('Scan Error:', err);
      const fallbackReport = await processClientSideOSINT(companyName, website, region);
      setReport(fallbackReport);
      setActiveTab('overview');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (user) {
      const historyKey = `osint_tecno3f_history_${user.id}`;
      localStorage.removeItem(historyKey);
      setHistory([]);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
    setActiveTab('overview');
    setShowHistoryOnly(false);
  };

  const handleOpenHistory = () => {
    if (!user) return;
    if (report) {
      setActiveTab('history');
      setShowHistoryOnly(false);
    } else {
      setShowHistoryOnly(true);
    }
  };

  const companyName = report?.query?.companyName || '';
  const totalRecs = report?.supportPlan?.totalRecommendations || 0;

  return (
    <div className="app-container">
      <Header
        currentReport={report}
        onReset={handleReset}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenHistory={handleOpenHistory}
        historyCount={history.length}
      />

      <SearchForm
        onScan={handleScan}
        loading={loading}
        user={user}
        onOpenHistory={handleOpenHistory}
        historyCount={history.length}
      />

      {error && (
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fecdd3', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={20} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{error}</span>
        </div>
      )}

      {loading && (
        <div className="saas-card loading-box">
          <div className="spinner"></div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Procesando Análisis OSINT Tecno3F...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
              Extrayendo datos de la empresa, analizando modelo de negocio, matriz FODA, transformación digital y situación impositiva.
            </p>
          </div>
        </div>
      )}

      {!loading && report && !showHistoryOnly && (
        <ErrorBoundary>
          <div>
            {/* Navigation Tabs Navbar */}
            <nav className="tab-navbar">
              <button className={`nav-tab-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                <LayoutDashboard size={16} /> Resumen General
              </button>

              <button className={`nav-tab-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
                <Briefcase size={16} /> Perfil Comercial & Web
              </button>
              <button className={`nav-tab-item ${activeTab === 'answers' ? 'active' : ''}`} onClick={() => setActiveTab('answers')}>
                <HelpCircle size={16} /> Modelo de Negocio
              </button>
              <button className={`nav-tab-item ${activeTab === 'swot' ? 'active' : ''}`} onClick={() => setActiveTab('swot')}>
                <Target size={16} /> Matriz FODA
              </button>
              <button className={`nav-tab-item ${activeTab === 'digital' ? 'active' : ''}`} onClick={() => setActiveTab('digital')}>
                <Cpu size={16} /> Transformación Digital
              </button>
              <button className={`nav-tab-item ${activeTab === 'legal' ? 'active' : ''}`} onClick={() => setActiveTab('legal')}>
                <Scale size={16} /> Rastreo Judicial & Legal
              </button>
              <button className={`nav-tab-item ${activeTab === 'contracts' ? 'active' : ''}`} onClick={() => setActiveTab('contracts')}>
                <FileCheck size={16} /> Contratos Públicos
              </button>
              <button className={`nav-tab-item ${activeTab === 'financial' ? 'active' : ''}`} onClick={() => setActiveTab('financial')}>
                <Landmark size={16} /> Deudas, Balances & Fiscal
              </button>
              <button className={`nav-tab-item ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
                <Newspaper size={16} /> Noticias & Prensa
              </button>
              <button className={`nav-tab-item ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
                <HeartHandshake size={16} /> Plan de Apoyo ({totalRecs})
              </button>
              {user && (
                <button className={`nav-tab-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                  <History size={16} /> Historial ({history.length})
                </button>
              )}
            </nav>

            {/* Active Tab Panel */}
            {activeTab === 'overview' && <OverviewTab report={report} onTabChange={setActiveTab} />}

            {activeTab === 'projects' && <ProjectsTab scrapedData={report.scrapedData || {}} categorization={report.categorization || {}} companyName={companyName} />}
            {activeTab === 'answers' && <BusinessAnswersTab businessAnswers={report.scrapedData?.businessAnswers || {}} companyName={companyName} />}
            {activeTab === 'swot' && <SwotTab swotAnalysis={report.swotAnalysis || {}} companyName={companyName} />}
            {activeTab === 'digital' && <DigitalTransformationTab digitalData={report.digitalTransformation || {}} companyName={companyName} />}
            {activeTab === 'legal' && <LegalTab legalData={report.legalData || {}} companyName={companyName} />}
            {activeTab === 'contracts' && <PublicContractsTab publicContracts={report.publicContracts || {}} companyName={companyName} />}
            {activeTab === 'financial' && <FinancialTab financialData={report.financialData || {}} />}
            {activeTab === 'news' && <NewsTab searchData={report.searchData || {}} companyName={companyName} />}
            {activeTab === 'support' && <SupportTab supportPlan={report.supportPlan || {}} companyName={companyName} />}
            {user && activeTab === 'history' && <HistoryTab history={history} onLoadReport={(rep) => { setReport(rep); setActiveTab('overview'); }} onClearHistory={handleClearHistory} />}
          </div>
        </ErrorBoundary>
      )}

      {!loading && (showHistoryOnly || !report) && (
        <div>
          {showHistoryOnly && user ? (
            <div>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Historial de Búsquedas de {user.username || user.name}</h3>
                <button className="btn-secondary" onClick={() => setShowHistoryOnly(false)}>
                  Volver al Inicio
                </button>
              </div>
              <HistoryTab
                history={history}
                onLoadReport={(rep) => {
                  setReport(rep);
                  setActiveTab('overview');
                  setShowHistoryOnly(false);
                }}
                onClearHistory={handleClearHistory}
              />
            </div>
          ) : (
            <div className="saas-card" style={{ padding: '54px 28px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 20px auto' }}>
                <Layers size={32} style={{ margin: 'auto' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Plataforma OSINT Tecno3F de Inteligencia Empresarial</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '12px auto 28px auto', fontSize: '0.96rem', lineHeight: '1.6' }}>
                Ingresa el nombre de cualquier empresa y su sitio web para realizar un diagnóstico completo: matriz FODA, índice de transformación digital, modelo de negocio, juicios, compras del Estado y situación impositiva.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {user && (
                  <button className="btn-secondary" onClick={handleOpenHistory} style={{ borderColor: 'rgba(37, 99, 235, 0.4)', color: '#60a5fa' }}>
                    <History size={16} /> Ver mi historial ({history.length})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
