import React, { useState, useEffect } from 'react';
import { Search, Building2, Globe, MapPin, Sparkles, History } from 'lucide-react';

export default function SearchForm({ onScan, loading, user, onOpenHistory, historyCount }) {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [region, setRegion] = useState('AR');
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    fetch('/api/osint/samples')
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    onScan({ companyName, website, region });
  };

  const handleSelectSample = (sample) => {
    setCompanyName(sample.name);
    setWebsite(sample.website || '');
  };

  return (
    <div className="search-panel">
      <form onSubmit={handleSubmit}>
        <div className="search-grid">
          <div>
            <label className="field-label">
              <Building2 size={15} style={{ color: 'var(--accent-primary)' }} />
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="Ej: Baigorria Industrial, Mercado Libre, PyME Local..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="field-label">
              <Globe size={15} style={{ color: 'var(--accent-primary)' }} />
              Sitio Web Oficial (Opcional)
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="Ej: baigorriaindustrial.com o https://empresa.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">
              <MapPin size={15} style={{ color: 'var(--accent-primary)' }} />
              Región OSINT
            </label>
            <select
              className="input-control"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="AR">🇦🇷 Argentina / BCRA / AFIP</option>
              <option value="LATAM">🌎 América Latina</option>
              <option value="GLOBAL">🌐 Global / Internacional</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading || !companyName.trim()}>
            {loading ? (
              <>Analizando OSINT...</>
            ) : (
              <>
                <Search size={18} /> Investigar Empresa
              </>
            )}
          </button>
        </div>
      </form>

      <div className="sample-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} style={{ color: 'var(--accent-amber)' }} /> Consultas frecuentes:
          </span>
          {samples.map((s, idx) => (
            <button key={idx} type="button" className="sample-pill" onClick={() => handleSelectSample(s)}>
              {s.name}
            </button>
          ))}
        </div>

        {/* Hero History Button ONLY for logged-in users */}
        {user && (
          <button
            type="button"
            onClick={onOpenHistory}
            style={{
              background: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.35)',
              color: '#60a5fa',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <History size={14} /> Ver mi historial ({historyCount})
          </button>
        )}
      </div>
    </div>
  );
}
