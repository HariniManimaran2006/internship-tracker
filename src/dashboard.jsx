import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar, 
  FolderKanban, 
  Bell, 
  User, 
  Search, 
  Video 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';

const STATUS_STYLES = {
  Applied: { bg: '#eff6ff', color: '#1d4ed8' },
  Shortlisted: { bg: '#fef3c7', color: '#b45309' },
  Interview: { bg: '#f3e8ff', color: '#7e22ce' },
  Selected: { bg: '#ecfdf5', color: '#047857' },
  Rejected: { bg: '#fef2f2', color: '#b91c1c' }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [internshipsCount, setInternshipsCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('waypoint_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        // Fetching apps and internships independently to prevent a single missing endpoint from failing the whole dashboard
        const appsRes = await fetch(`${API_BASE}/api/applications`);
        const internshipsRes = await fetch(`${API_BASE}/api/internships`);
        
        // Notifications is optional for now if the table doesn't exist yet
        let notifsData = [];
        try {
          const notifsRes = await fetch(`${API_BASE}/api/notifications`);
          if (notifsRes.ok) {
            notifsData = await notifsRes.json();
          }
        } catch {
          // Ignore notification fetch errors if table isn't set up
        }

        if (!appsRes.ok || !internshipsRes.ok) {
          throw new Error('Failed to fetch primary dashboard data.');
        }

        const appsData = await appsRes.json();
        const internshipsData = await internshipsRes.json();

        setApplications(appsData);
        setInternshipsCount(internshipsData.length);

        if (Array.isArray(notifsData)) {
          const unread = notifsData.filter(n => n.unread).length;
          setUnreadNotificationsCount(unread);
        }
      } catch (err) {
        setErrorMsg('Could not reach the server. Is the backend running on port 5000?');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const appliedCount = applications.length;
  const selectedCount = applications.filter(a => a.status === 'Selected').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;
  const interviewCount = applications.filter(a => a.status === 'Interview').length;
  const recentApplications = [...applications].slice(-4).reverse();
  const displayName = user?.full_name ? user.full_name.split(' ')[0] : 'there';

  const getLinkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: isActive ? '#1F2937' : 'transparent',
    color: isActive ? '#ffffff' : '#cbd5e1',
    textDecoration: 'none',
    borderRadius: '0.75rem',
    fontWeight: 500,
    fontSize: '0.875rem',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    textAlign: 'left'
  });

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F8F9FC', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', overflow: 'hidden' }}>
      
      {/* ================= SIDEBAR ================= */}
      <aside style={{ width: '16rem', backgroundColor: '#111827', color: '#cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, height: '100vh' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', color: '#ffffff', fontSize: '1.25rem', fontWeight: 700 }}>
            <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#f59e0b', transform: 'rotate(45deg)' }}></div>
            <span>Waypoint</span>
          </div>

          <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
            Student Workspace
          </div>

          <nav style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem' }}>
            <button onClick={() => navigate('/dashboard')} style={getLinkStyle(path === '/dashboard')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button onClick={() => navigate('/internships')} style={getLinkStyle(path === '/internships')}>
              <Briefcase size={20} />
              <span>Internships</span>
            </button>
            <button onClick={() => navigate('/applications')} style={getLinkStyle(path === '/applications')}>
              <FileText size={20} />
              <span>Applications</span>
            </button>
            <button onClick={() => navigate('/interviews')} style={getLinkStyle(path === '/interviews')}>
              <Calendar size={20} />
              <span>Interviews</span>
            </button>
            <button onClick={() => navigate('/documents')} style={getLinkStyle(path === '/documents')}>
              <FolderKanban size={20} />
              <span>Documents</span>
            </button>
            <button onClick={() => navigate('/notifications')} style={{ ...getLinkStyle(path === '/notifications' || path === '/notification'), justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={20} />
                <span>Notifications</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span style={{ backgroundColor: '#f59e0b', color: '#030712', fontSize: '0.75rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/profile')} style={getLinkStyle(path === '/profile')}>
              <User size={20} />
              <span>Profile</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ position: 'relative', width: '24rem', maxWidth: '100%' }}>
            <span style={{ position: 'absolute', insetY: 0, left: 0, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', pointerEvents: 'none', color: '#94a3b8' }}>
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Search internships, companies, skills..." 
              style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/notifications')} style={{ padding: '0.5rem', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '9999px', position: 'relative' }}>
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
              )}
            </button>
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#e2e8f0', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', border: '1px solid #cbd5e1' }}>
              <User size={20} />
            </div>
          </div>
        </header>

        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669' }}>Overview</span>
            <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Welcome back, {displayName}</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.125rem' }}>Here's where your internship search stands today.</p>
          </div>

          {errorMsg && (
            <div style={{ background: '#FDEDEE', border: '1px solid #F3C2C6', color: '#9A2530', fontSize: '0.8125rem', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Metric Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '1rem' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>TOTAL INTERNSHIPS</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : internshipsCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#d97706', height: '100%', width: '100%' }}></div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>APPLIED</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : appliedCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#d97706', height: '100%', width: appliedCount ? '40%' : '0%' }}></div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>SELECTED</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : selectedCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#d97706', height: '100%', width: selectedCount ? '8%' : '0%' }}></div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>REJECTED</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : rejectedCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#d97706', height: '100%', width: rejectedCount ? '8%' : '0%' }}></div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>IN INTERVIEW STAGE</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : interviewCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#d97706', height: '100%', width: interviewCount ? '66%' : '0%' }}></div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>TOTAL APPLICATIONS</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : appliedCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#d97706', height: '100%', width: appliedCount ? '75%' : '0%' }}></div>
              </div>
            </div>

          </div>

          {/* Lower Two-Column Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem', marginBottom: '1rem' }}>Application status overview</h3>
                <div style={{ height: '12rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                  [Chart Placeholder]
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem' }}>Recent applications</h3>
                  <button onClick={() => navigate('/applications')} style={{ color: '#059669', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                        <th style={{ paddingBottom: '0.75rem' }}>Internship</th>
                        <th style={{ paddingBottom: '0.75rem' }}>Company</th>
                        <th style={{ paddingBottom: '0.75rem' }}>Status</th>
                        <th style={{ paddingBottom: '0.75rem', textAlign: 'right' }}>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td colSpan={4} style={{ padding: '1.5rem 0', textAlign: 'center', color: '#94a3b8' }}>Loading applications...</td>
                        </tr>
                      )}
                      {!loading && recentApplications.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ padding: '1.5rem 0', textAlign: 'center', color: '#94a3b8' }}>No applications yet.</td>
                        </tr>
                      )}
                      {!loading && recentApplications.map((app, idx) => {
                        const style = STATUS_STYLES[app.status] || { bg: '#f1f5f9', color: '#475569' };
                        return (
                          <tr key={app.id ?? idx} style={{ borderBottom: idx === recentApplications.length - 1 ? 'none' : '1px solid #f8fafc' }}>
                            <td style={{ padding: '0.75rem 0', fontWeight: 600, color: '#0f172a' }}>{app.internship_title}</td>
                            <td style={{ padding: '0.75rem 0', color: '#475569' }}>{app.company}</td>
                            <td style={{ padding: '0.75rem 0' }}>
                              <span style={{ backgroundColor: style.bg, color: style.color, padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                                {app.status}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#64748b', fontSize: '0.75rem' }}>{app.updated}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem' }}>Upcoming interviews</h3>
                  <button onClick={() => navigate('/interviews')} style={{ color: '#059669', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {applications.filter(a => a.status === 'Interview').length === 0 && !loading && (
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>No interviews scheduled right now.</p>
                  )}
                  {applications.filter(a => a.status === 'Interview').map((app, idx) => (
                    <div key={app.id ?? idx} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem', backgroundColor: '#d1fae5', color: '#047857', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {app.company ? app.company.slice(0, 2).toUpperCase() : 'IN'}
                          </span>
                          <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{app.internship_title}</h4>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 600, backgroundColor: '#f0f9ff', color: '#0284c7' }}><Video size={10} /> Online</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>{app.company} · {app.deadline}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.125rem' }}>Notifications</h3>
                  <button onClick={() => navigate('/notifications')} style={{ color: '#059669', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.75rem' }}>
                  {applications.slice(-3).reverse().map((app, idx, arr) => (
                    <div
                      key={app.id ?? idx}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        paddingBottom: idx === arr.length - 1 ? 0 : '0.75rem',
                        borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #f1f5f9'
                      }}
                    >
                      <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: idx === 0 ? '#f59e0b' : '#cbd5e1', marginTop: '0.25rem', flexShrink: 0 }}></span>
                      <div>
                        <p style={{ fontWeight: 600, color: '#0f172a' }}>{app.status} - {app.internship_title}</p>
                        <p style={{ color: '#475569', marginTop: '0.125rem' }}>{app.company} status updated to "{app.status}".</p>
                        <span style={{ fontSize: '0.625rem', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>{app.updated}</span>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && !loading && (
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>No notifications yet.</p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default Dashboard;