import React from 'react';
import { DollarSign, ShieldAlert, CheckCircle2, AlertCircle, TrendingDown, FileText, Landmark, FileCheck } from 'lucide-react';

export default function FinancialTab({ financialData = {} }) {
  const data = financialData || {};
  const tax = data.taxProfile || {};
  const fin = data.financialStatements || {};
  const flags = data.financialFlags || [];
  const debtHistory = data.debtHistory || [];

  return (
    <div className="dashboard-grid">
      {/* CUIT & Tax Profile Banner */}
      <div className="saas-card col-12" style={{ padding: '26px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(37, 99, 235, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase' }}>Padrón Fiscal AFIP / ARCA</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px' }}>CUIT: {tax.cuit || '30-XXXXXXXX-X'}</h2>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {tax.economicActivity || 'Actividad Comercial e Industrial Inscripta'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
              {tax.vatCondition || 'IVA Inscripto'}
            </span>
            <span style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#60a5fa', border: '1px solid rgba(37, 99, 235, 0.3)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
              {tax.inscriptionStatus || 'Activo'}
            </span>
          </div>
        </div>
      </div>

      {/* Tax & Public Contracting Capabilities */}
      <div className="saas-card col-6" style={{ padding: '26px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
          <FileCheck size={20} /> Situación Tributaria y Certificados
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Certificados Públicos:</span>
            <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>{tax.publicCertificates || 'Certificado MiPyME Vigente'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Contratación con el Estado:</span>
            <div style={{ fontWeight: 600, color: 'var(--accent-emerald)', marginTop: '2px' }}>{tax.stateContractorStatus || 'Habilitado'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Cumplimiento Fiscal:</span>
            <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>{tax.taxCompliance || 'Sin deudas ejecutivas'}</div>
          </div>
        </div>
      </div>

      {/* Balances & Financial Statements */}
      <div className="saas-card col-6" style={{ padding: '26px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
          <FileText size={20} /> Balances y Estados Financieros
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Último Balance Presentado:</span>
            <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>{fin.lastBalanceYear || '2024'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Memoria Anual & Registros:</span>
            <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>{fin.annualReportStatus || 'Presentado en IGJ / Registro'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Bancos y Acreedores Principales:</span>
            <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>{(fin.creditorBanks || ['Bancos de Red Nacional']).join(', ')}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Quiebras, Concursos & Embargos:</span>
            <div style={{ fontWeight: 600, color: 'var(--accent-emerald)', marginTop: '2px' }}>{fin.insolvencyStatus || 'Sin quiebras ni embargos'}</div>
          </div>
        </div>
      </div>

      {/* BCRA Credit Situation & Rejected Cheques */}
      <div className="saas-card col-4" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(37, 99, 235, 0.15)', padding: '14px', borderRadius: '12px', color: '#60a5fa' }}>
            <Landmark size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Situación BCRA</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '3px' }}>{data.bcraSituation || 'Situación 1'}</div>
          </div>
        </div>
      </div>

      <div className="saas-card col-4" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: (data.rejectedChequesCount || 0) > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', padding: '14px', borderRadius: '12px', color: (data.rejectedChequesCount || 0) > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            <FileText size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cheques Rechazados</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '3px', color: (data.rejectedChequesCount || 0) > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
              {data.rejectedChequesCount || 0} Cheques Registrados
            </div>
          </div>
        </div>
      </div>

      <div className="saas-card col-4" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '14px', borderRadius: '12px', color: 'var(--accent-amber)' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Score Crediticio</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '3px' }}>{data.creditScore || 75} / 100</div>
          </div>
        </div>
      </div>

      {/* Debt History Table */}
      <div className="saas-card col-12" style={{ padding: '26px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingDown size={19} style={{ color: 'var(--accent-rose)' }} /> Historial de Obligaciones y Deudas Registradas
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
              <th style={{ padding: '14px' }}>Periodo Evaluado</th>
              <th style={{ padding: '14px' }}>Estado Registrado</th>
              <th style={{ padding: '14px' }}>Monto Estimado</th>
            </tr>
          </thead>
          <tbody>
            {debtHistory.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '14px', fontWeight: 600 }}>{item.period}</td>
                <td style={{ padding: '14px', color: (item.status || '').includes('rechazados') || (item.status || '').includes('atrasos') ? 'var(--accent-rose)' : 'var(--text-primary)' }}>{item.status}</td>
                <td style={{ padding: '14px', fontFamily: 'var(--font-mono)' }}>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
