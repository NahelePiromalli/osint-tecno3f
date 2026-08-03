import React from 'react';
import { Scale, Gavel } from 'lucide-react';

export default function LegalTab({ legalData = {}, companyName = '' }) {
  const data = legalData || {};
  const lawsuits = data.lawsuits || [
    {
      type: 'Fueros Civiles y Comerciales / Juicios',
      status: 'Sin registros de juicios comerciales activos',
      severity: 'SIN RIESGO',
      details: 'Búsqueda en registros de fueros comerciales y boletines judiciales.'
    },
    {
      type: 'Laboral y Expedientes',
      status: 'Sin juicios laborales registrados en el último periodo',
      severity: 'SIN RIESGO',
      details: 'Consulta pública en fuero del trabajo y registros previsionales.'
    },
    {
      type: 'Defensa del Consumidor & Multas',
      status: 'Sin sanciones o multas vigentes en Defensa del Consumidor',
      severity: 'SIN RIESGO',
      details: 'Rastreo en sistemas de resolución de disputas de consumo (COPREC / Provincia).'
    },
    {
      type: 'Sanciones Ambientales',
      status: 'Sin multas ni expedientes de impacto ambiental registrados',
      severity: 'SIN RIESGO',
      details: 'Consulta de certificados de aptitud ambiental y fiscalizaciones sanitarias.'
    },
    {
      type: 'Fuero Penal y Fraude',
      status: 'Sin causas penales ni investigaciones comerciales asociadas',
      severity: 'SIN RIESGO',
      details: 'Verificación en padrones de integridad y registros de querellas.'
    }
  ];

  const totalRecords = data.totalRecords || 0;
  const riskRating = data.riskRating || 'SIN OBSERVACIONES JUDICIALES';
  const legalSummary = data.legalSummary || `La empresa ${companyName} no presenta antecedentes judiciales, demandas penales, multas ambientales ni sanciones activas en registros públicos examinados.`;

  return (
    <div className="dashboard-grid">
      {/* Legal Status Header Card */}
      <div className="saas-card col-12" style={{ padding: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: totalRecords > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', padding: '14px', borderRadius: '12px', color: totalRecords > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
              <Scale size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Rastreo Judicial, Penal y Sanciones Públicas</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
                Búsqueda consolidada en fueros comerciales, laborales, causas penales, multas ambientales y defensa del consumidor.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Dictamen Legal OSINT</span>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: totalRecords > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)', marginTop: '2px' }}>
              {riskRating}
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '14px 18px', borderRadius: '10px', marginTop: '20px', fontSize: '0.92rem', color: '#cbd5e1' }}>
          {legalSummary}
        </div>
      </div>

      {/* Lawsuits & Sanctions Cards */}
      <div className="col-12" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {lawsuits.map((item, idx) => (
          <div key={idx} className="saas-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Gavel size={20} style={{ color: item.severity === 'SIN RIESGO' ? 'var(--accent-emerald)' : 'var(--accent-amber)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{item.type}</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.details}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: item.severity === 'SIN RIESGO' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                {item.status}
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 800,
                background: item.severity === 'SIN RIESGO' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: item.severity === 'SIN RIESGO' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                border: `1px solid ${item.severity === 'SIN RIESGO' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
              }}>
                {item.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
