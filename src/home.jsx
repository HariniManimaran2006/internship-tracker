import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STAGES = ['Applied', 'Shortlisted', 'Interview', 'Selected'];
const API_BASE = 'https://waypoint-backend-2.onrender.com';

export default function WaypointAuth() {
  const navigate = useNavigate();

  const [authTab, setAuthTab] = useState('login');
  const [authRole, setAuthRole] = useState('student');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || password.length < 6) {
      setErrorMsg('Please check your credentials.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: authRole }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Login failed.');
        return;
      }

      localStorage.setItem('waypoint_user', JSON.stringify(data.user));
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg('Could not reach the server. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !regEmail || regPassword !== confirmPassword) {
      setErrorMsg('Please fill in all registration fields correctly.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email: regEmail,
          phone,
          college,
          department,
          year_of_study: yearOfStudy,
          password: regPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed.');
        return;
      }

      localStorage.setItem('waypoint_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg('Could not reach the server. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setForgotMsg('');

    if (!forgotEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.');
        return;
      }

      setForgotMsg(data.message);
    } catch (err) {
      setErrorMsg('Could not reach the server. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="app" style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: '#F3F5F7', color: '#141A20' }}>
      <div className="auth-wrap" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}>

        <div className="auth-side" style={{ background: 'radial-gradient(1200px 700px at -10% -10%, #163B41 0%, #0B2027 55%, #081418 100%)', color: '#fff', padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div>
            <div className="brandmark" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '15px', letterSpacing: '.02em' }}>
              <span className="dot" style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#C08A2E', transform: 'rotate(45deg)' }}></span> WAYPOINT
            </div>
            <h1 className="display" style={{ fontFamily: "'Fraunces', serif", fontSize: '34px', lineHeight: 1.2, margin: '34px 0 14px', maxWidth: '420px', fontWeight: 600, letterSpacing: '-.01em' }}>
              Every application, one clear runway to an offer.
            </h1>
            <p style={{ color: '#B9CBC8', fontSize: '14.5px', maxWidth: '400px', lineHeight: 1.6 }}>
              Search internships, track every stage from applied to selected, and keep interviews, documents and deadlines in a single dashboard built for placement season.
            </p>
          </div>
          <div>
            <div className="rail" style={{ display: 'flex', alignItems: 'center', margin: '18px 2px 6px', maxWidth: '360px' }}>
              {STAGES.map((s, i) => (
                <div key={s} className={`rail-step ${i === 0 ? 'done' : i === 1 ? 'current' : ''}`} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                  <div className="node" style={{ width: '26px', height: '26px', borderRadius: '50%', background: i === 0 ? '#1F6F63' : i === 1 ? '#C08A2E' : '#fff', border: '2px solid', borderColor: i === 0 ? '#1F6F63' : i === 1 ? '#C08A2E' : '#E3E7EA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '11px', fontWeight: 700, color: i === 0 ? '#fff' : i === 1 ? '#221503' : '#66727C', position: 'relative', zIndex: 2 }}>
                    {i + 1}
                  </div>
                  <div className="lab" style={{ fontSize: '10.6px', marginTop: '7px', color: i <= 1 ? '#141A20' : '#9db3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.03em' }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: '#7F9490', marginTop: '26px' }}>Demo platform — sample data only, nothing is sent anywhere.</div>
          </div>
        </div>

        <div className="auth-form-side" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', overflowY: 'auto', maxHeight: '100vh' }}>
          <div className="auth-card" style={{ width: '100%', maxWidth: '420px' }}>
            <div className="brandmark" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '15px', letterSpacing: '.02em', color: '#0B2027', marginBottom: '26px', justifyContent: 'center' }}>
              <span className="dot" style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#C08A2E', transform: 'rotate(45deg)' }}></span> WAYPOINT
            </div>

            <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E3E7EA', borderRadius: '10px', boxShadow: '0 1px 2px rgba(15,23,32,.04), 0 8px 24px -12px rgba(15,23,32,.12)', padding: '26px 26px 22px' }}>

              <div className="tabs" style={{ display: 'flex', gap: '4px', background: '#EEF1F3', padding: '4px', borderRadius: '9px', marginBottom: '22px' }}>
                <button type="button" onClick={() => { setAuthTab('login'); setErrorMsg(''); }} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '13.5px', fontWeight: 600, color: authTab === 'login' ? '#141A20' : '#66727C', background: authTab === 'login' ? '#fff' : 'transparent', border: 'none', boxShadow: authTab === 'login' ? '0 1px 2px rgba(15,23,32,.04), 0 8px 24px -12px rgba(15,23,32,.12)' : 'none', cursor: 'pointer' }}>Log in</button>
                <button type="button" onClick={() => { setAuthTab('register'); setErrorMsg(''); }} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '13.5px', fontWeight: 600, color: authTab === 'register' ? '#141A20' : '#66727C', background: authTab === 'register' ? '#fff' : 'transparent', border: 'none', boxShadow: authTab === 'register' ? '0 1px 2px rgba(15,23,32,.04), 0 8px 24px -12px rgba(15,23,32,.12)' : 'none', cursor: 'pointer' }}>Register</button>
                <button type="button" onClick={() => { setAuthTab('forgot'); setErrorMsg(''); setForgotMsg(''); }} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '13.5px', fontWeight: 600, color: authTab === 'forgot' ? '#141A20' : '#66727C', background: authTab === 'forgot' ? '#fff' : 'transparent', border: 'none', boxShadow: authTab === 'forgot' ? '0 1px 2px rgba(15,23,32,.04), 0 8px 24px -12px rgba(15,23,32,.12)' : 'none', cursor: 'pointer' }}>Forgot password</button>
              </div>

              {errorMsg && (
                <div style={{ background: '#FDEDEE', border: '1px solid #F3C2C6', color: '#9A2530', fontSize: '12.5px', padding: '9px 12px', borderRadius: '8px', marginBottom: '16px' }}>
                  {errorMsg}
                </div>
              )}

              {authTab === 'login' && (
                <div>
                  <div className="pill-toggle" style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
                    <button type="button" onClick={() => setAuthRole('student')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', border: '1px solid #E3E7EA', background: authRole === 'student' ? '#0B2027' : '#fff', fontSize: '12.5px', fontWeight: 600, color: authRole === 'student' ? '#fff' : '#66727C', cursor: 'pointer' }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg> Student
                    </button>
                    <button type="button" onClick={() => setAuthRole('admin')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', border: '1px solid #E3E7EA', background: authRole === 'admin' ? '#0B2027' : '#fff', fontSize: '12.5px', fontWeight: 600, color: authRole === 'admin' ? '#fff' : '#66727C', cursor: 'pointer' }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3v18h18"/><path d="M7 15l3-4 3 3 5-7"/></svg> Admin
                    </button>
                  </div>

                  <form onSubmit={handleLogin} noValidate>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#66727C', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Email</label>
                      <input type="email" placeholder={authRole === 'admin' ? "admin@waypoint.edu" : "you@example.com"} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14.5px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#66727C', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Password</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14.5px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    <button type="submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: '1px solid transparent', fontWeight: 600, fontSize: '14px', background: '#C08A2E', color: '#221503', width: '100%', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                      {loading ? 'Logging in…' : `Log in as ${authRole === 'admin' ? 'Admin' : 'Student'}`}
                    </button>
                  </form>
                </div>
              )}

              {authTab === 'register' && (
                <form onSubmit={handleRegister} noValidate>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#66727C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Full Name</label>
                    <input type="text" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#66727C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Email</label>
                    <input type="email" placeholder="you@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#66727C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Phone Number</label>
                    <input type="text" placeholder="+91 90000 00000" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#66727C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>College / Institution</label>
                    <input type="text" placeholder="Your institution" value={college} onChange={(e) => setCollege(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#66727C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Department</label>
                    <input type="text" placeholder="e.g. Computer Science" value={department} onChange={(e) => setDepartment(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#66727C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Year of Study</label>
                    <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }}>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#66727C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Password</label>
                    <input type="password" placeholder="At least 6 characters" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#66727C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Confirm Password</label>
                    <input type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <button type="submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: '1px solid transparent', fontWeight: 600, fontSize: '14px', background: '#C08A2E', color: '#221503', width: '100%', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Creating account…' : 'Create student account'}
                  </button>
                </form>
              )}

              {authTab === 'forgot' && (
                <form onSubmit={handleForgot} noValidate>
                  <p style={{ fontSize: '13.5px', color: '#66727C', marginBottom: '16px', lineHeight: 1.5 }}>
                    Enter the email on your account and we'll simulate sending a reset link.
                  </p>

                  {forgotMsg && (
                    <div style={{ background: '#EAF6EE', border: '1px solid #BEE3C8', color: '#1F6F42', fontSize: '12.5px', padding: '9px 12px', borderRadius: '8px', marginBottom: '16px' }}>
                      {forgotMsg}
                    </div>
                  )}

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#66727C', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Email</label>
                    <input type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E3E7EA', borderRadius: '8px', fontSize: '14.5px', background: '#fff', color: '#141A20', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <button type="submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: '1px solid transparent', fontWeight: 600, fontSize: '14px', background: '#0B2027', color: '#FFFFFF', width: '100%', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}