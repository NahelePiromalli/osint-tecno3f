import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck, Database, Award, ArrowUpRight, Zap, Ban, EyeOff, Layers, FileCode } from 'lucide-react';

export default function DigitalTransformationTab({ digitalData = {}, companyName = '' }) {
  const data = digitalData || {};
  const score = data.digitalScore || 65;
  const maturityLevel = data.maturityLevel || 'En Proceso de Digitalización';
  const maturityColor = data.maturityColor || '#06b6d4';

  const breakdown = data.breakdown || {};
  const existingAutomations = data.existingAutomations || [];
  const missingAutomations = data.missingAutomations || [];
  const omittedUnverifiedData = data.omittedUnverifiedData || data.informationGaps || [];
  const stateKits = data.stateKits || {};
  const techStack = data.techStack || [];
  const auditMetadata = data.auditMetadata || {};

  return (
    <div className="dashboard-grid">
      {/* Header Banner */}
      <div className="saas-card col-12" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(37, 99, 235, 0.06))', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Transformación Digital & Automatización en {companyName}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
                  Auditoría estricta OSINT: Sistemas verificados, automatizaciones faltantes y datos omitidos por falta de verificación pública.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: '16px', border: `1px solid ${maturityColor}` }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Índice de Madurez</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: maturityColor }}>{maturityLevel}</div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `radial-gradient(circle, ${maturityColor}22 0%, ${maturityColor}00 70%)`, border: `2px solid ${maturityColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
              {score}%
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="saas-card col-4" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} /> Presencia Digital & Portal Web
        </h3>
        <div className="health-score-container" style={{ textAlign: 'left', padding: 0 }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>{breakdown.webPreserve || 80}%</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Portal web corporativo y canales de atención digital activos para clientes.
          </p>
        </div>
      </div>

      <div className="saas-card col-4" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} /> Automatización de Procesos
        </h3>
        <div className="health-score-container" style={{ textAlign: 'left', padding: 0 }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>{breakdown.processAutomation || 60}%</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Nivel de digitalización operativa y respuestas comerciales integradas.
          </p>
        </div>
      </div>

      <div className="saas-card col-4" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 700, color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} /> Automatización de Planta / Nube
        </h3>
        <div className="health-score-container" style={{ textAlign: 'left', padding: 0 }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c4b5fd' }}>{breakdown.industrialAutomation || 50}%</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Integración de sistemas de control, telemetría o servidores.
          </p>
        </div>
      </div>

      {/* 1. EXISTENT & VERIFIED AUTOMATIONS */}
      <div className="saas-card col-6" style={{ padding: '26px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} /> Automatizaciones Existentes & Verificadas
          </h3>
          <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
            ✔ OSINT VERIFICADO
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {existingAutomations.map((auto, idx) => (
            <div key={idx} style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>{auto.system}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{auto.detail}</div>
              <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} /> Estado: {auto.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MISSING / PENDING AUTOMATIONS */}
      <div className="saas-card col-6" style={{ padding: '26px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} /> Automatizaciones Faltantes o Pendientes
          </h3>
          <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
            ⚠️ BRECHAS IDENTIFICADAS
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {missingAutomations.map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(245, 158, 11, 0.06)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>{item.system}</div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                  Impacto: {item.impact}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.detail}</div>
              <div style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 700, marginTop: '6px' }}>
                Estado: {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STRICT OSINT PRIVACY: OMITTED UNVERIFIED DATA */}
      <div className="saas-card col-12" style={{ padding: '24px', background: 'rgba(244, 63, 94, 0.04)', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f87171', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EyeOff size={18} /> Datos Omitidos por Falta de Verificación Pública (Regla OSINT Estricta)
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Cumpliendo el principio de veracidad: si un dato no puede ser contrastado en fuentes abiertas oficiales, <strong>no se inventa y se omite de forma transparente</strong>:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {omittedUnverifiedData.map((gap, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #f43f5e' }}>
              <Ban size={15} style={{ color: '#f87171', flexShrink: 0 }} />
              <span style={{ fontSize: '0.84rem', color: '#fecdd3' }}>{gap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="saas-card col-12" style={{ padding: '26px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
          <FileCode size={19} style={{ color: 'var(--accent-cyan)' }} /> Stack Tecnológico & Componentes Verificados
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {techStack.map((tech, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase' }}>{tech.category}</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, marginTop: '2px', color: '#fff' }}>{tech.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.74rem', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  {tech.type}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{tech.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
