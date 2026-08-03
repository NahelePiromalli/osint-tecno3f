import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { LogIn, UserPlus, X, ShieldCheck, Lock, User, CheckCircle2, History, LogOut, AlertCircle, BookmarkCheck } from 'lucide-react';

export default function AuthModal({ user, onLogin, onLogout, onOpenHistory, historyCount }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  // Form Fields (Username & Password)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keepSession, setKeepSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setKeepSession(false);
    setErrorMsg(null);
  };

  // REGISTER USER WITH USERNAME & PASSWORD
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setErrorMsg('Ingresa un nombre de usuario.');
      return;
    }

    if (password.length < 3) {
      setErrorMsg('La contraseña debe tener al menos 3 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Verifícalas.');
      return;
    }

    setLoading(true);

    try {
      let data = null;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password })
      }).catch(() => null);

      if (res) {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al registrar.');
        data = json;
      }

      // Fallback
      if (!data) {
        const saved = JSON.parse(localStorage.getItem('osint_db_users') || '[]');
        if (saved.some(u => (u.username || '').toLowerCase() === cleanUsername.toLowerCase())) {
          throw new Error('Ese nombre de usuario ya se encuentra registrado.');
        }
        const newUser = { id: `usr-${Date.now()}`, username: cleanUsername, password };
        saved.push(newUser);
        localStorage.setItem('osint_db_users', JSON.stringify(saved));
        data = { success: true, user: { id: newUser.id, username: cleanUsername } };
      }

      onLogin(data.user, keepSession);
      setShowModal(false);
      resetForm();

    } catch (err) {
      setErrorMsg(err.message || 'Error al registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  // LOGIN USER WITH USERNAME & PASSWORD
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = username.trim();
    if (!cleanUsername || !password.trim()) {
      setErrorMsg('Ingresa tu nombre de usuario y contraseña.');
      return;
    }

    setLoading(true);

    try {
      let data = null;
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password })
      }).catch(() => null);

      if (res) {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al iniciar sesión.');
        data = json;
      }

      // Fallback
      if (!data) {
        const saved = JSON.parse(localStorage.getItem('osint_db_users') || '[]');
        const found = saved.find(u => (u.username || '').toLowerCase() === cleanUsername.toLowerCase());

        if (!found) throw new Error('El usuario no existe. Por favor regístrate primero.');
        if (found.password !== password) throw new Error('Contraseña incorrecta. Verifica tus datos.');

        data = { success: true, user: { id: found.id, username: found.username } };
      }

      onLogin(data.user, keepSession);
      setShowModal(false);
      resetForm();

    } catch (err) {
      setErrorMsg(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const modalJSX = showModal ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483647,
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '32px 30px',
          position: 'relative',
          background: '#111827',
          borderRadius: '20px',
          border: '1px solid rgba(37, 99, 235, 0.4)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: '#f8fafc',
          zIndex: 2147483647
        }}
      >
        <button
          onClick={() => setShowModal(false)}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px'
          }}
        >
          <X size={22} />
        </button>

        {/* Header Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: activeTab === 'login' ? '#60a5fa' : 'var(--text-muted)',
              cursor: 'pointer',
              borderBottom: activeTab === 'login' ? '2px solid #60a5fa' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(null); }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: activeTab === 'register' ? '#60a5fa' : 'var(--text-muted)',
              cursor: 'pointer',
              borderBottom: activeTab === 'register' ? '2px solid #60a5fa' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            Crear Cuenta
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fecdd3', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} /> {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label className="field-label" style={{ marginBottom: '6px' }}>
                <User size={15} /> Nombre de Usuario *
              </label>
              <input
                type="text"
                className="input-control"
                placeholder="Ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label className="field-label" style={{ marginBottom: '6px' }}>
                <Lock size={15} /> Contraseña *
              </label>
              <input
                type="password"
                className="input-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Checkbox: Mantener Sesion Activa */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={keepSession}
                  onChange={(e) => setKeepSession(e.target.checked)}
                  style={{ accentColor: '#2563eb', width: '17px', height: '17px', cursor: 'pointer' }}
                />
                <span>Mantener sesión activa en este navegador</span>
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? 'Verificando...' : <><LogIn size={18} /> Entrar a mi Cuenta</>}
            </button>

            <p style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '16px',
              lineHeight: '1.4'
            }}>
              💡 Iniciar sesión te permite acceder a tu historial privado de búsquedas sincronizado.
            </p>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '16px' }}>
              <label className="field-label" style={{ marginBottom: '6px' }}>
                <User size={15} /> Nombre de Usuario *
              </label>
              <input
                type="text"
                className="input-control"
                placeholder="Elige un nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label" style={{ marginBottom: '6px' }}>
                <Lock size={15} /> Contraseña *
              </label>
              <input
                type="password"
                className="input-control"
                placeholder="Mínimo 3 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label className="field-label" style={{ marginBottom: '6px' }}>
                <Lock size={15} /> Confirmar Contraseña *
              </label>
              <input
                type="password"
                className="input-control"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Checkbox: Mantener Sesion Activa */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={keepSession}
                  onChange={(e) => setKeepSession(e.target.checked)}
                  style={{ accentColor: '#2563eb', width: '17px', height: '17px', cursor: 'pointer' }}
                />
                <span>Mantener sesión activa al ingresar</span>
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? 'Guardando...' : <><UserPlus size={18} /> Crear mi Cuenta</>}
            </button>

            <p style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '16px',
              lineHeight: '1.4'
            }}>
              💡 La creación de una cuenta sirve únicamente para guardar y consultar tu historial privado de búsquedas.
            </p>
          </form>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
      {/* History Shortcut Button ONLY for logged-in users */}
      {user && (
        <button
          onClick={onOpenHistory}
          className="btn-secondary"
          style={{ borderColor: 'rgba(37, 99, 235, 0.35)', color: '#60a5fa' }}
        >
          <History size={16} /> Ver mi Historial ({historyCount})
        </button>
      )}

      {user ? (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              padding: '6px 16px',
              borderRadius: '30px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
              {(user.username || user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{user.username || user.name}</span>
            <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald)' }} />
          </button>

          {showDropdown && (
            <div className="saas-card" style={{
              position: 'absolute',
              right: 0,
              top: '46px',
              width: '260px',
              padding: '18px',
              zIndex: 100,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>Usuario: {user.username || user.name}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 10px', borderRadius: '6px', margin: '10px 0 14px 0', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} /> Sesión activa • Historial guardado
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <button
                  onClick={() => { setShowDropdown(false); onLogout(); }}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-rose)',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <LogOut size={15} /> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-secondary"
            onClick={() => { setActiveTab('login'); resetForm(); setShowModal(true); }}
            style={{ fontSize: '0.85rem' }}
          >
            <LogIn size={15} /> Iniciar Sesión
          </button>
          <button
            className="btn-primary"
            onClick={() => { setActiveTab('register'); resetForm(); setShowModal(true); }}
            style={{ fontSize: '0.85rem', padding: '8px 16px', borderRadius: '8px' }}
          >
            <UserPlus size={15} /> Registrarse
          </button>
        </div>
      )}

      {/* Render Modal directly on document.body using React Portal */}
      {modalJSX && ReactDOM.createPortal(modalJSX, document.body)}
    </div>
  );
}
