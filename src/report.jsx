import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Building2, 
  FileText, 
  BarChart3, 
  Bell, 
  User, 
  Search, 
  LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [studentsCount, setStudentsCount] = useState(0);
  const [internshipsCount, setInternshipsCount] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Security check: Redirect to login if user is not authenticated as admin
  useEffect(() => {
    const stored = localStorage.getItem('waypoint_user');
    if (!stored) {
      navigate('/');
      return;
    }
    try {
      const user = JSON.parse(stored);
      if (user.role !== 'admin' && user.email !== 'admin@waypoint.edu') {
        navigate('/dashboard');
      }
    } catch {
      navigate('/');
    }
  }, [navigate]);

  // Fetch live stats from backend database endpoints
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [studentsRes, internshipsRes, appsRes] = await Promise.all([
          fetch(`${API_BASE}/students`),
          fetch(`${API_BASE}/internships`),
          fetch(`${API_BASE}/applications`)
        ]);

        const studentsData = await studentsRes.json();
        const internshipsData = await internshipsRes.json();
        const appsData = await appsRes.json();

        setStudentsCount(studentsData.length);
        setInternshipsCount(internshipsData.length);
        setApplications(appsData);
      } catch (err) {
        console.error('Error loading report analytics from DB:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const totalApplications = applications.length;
  const selectedCount = applications.filter(a => (a.status || '').toLowerCase() === 'selected').length;
  const pendingCount = applications.filter(a => {
    const s = (a.status || '').toLowerCase();
    return s !== 'selected' && s !== 'rejected';
  }).length;
  const interviewCount = applications.filter(a => {
    const s = (a.status || '').toLowerCase();
    return s === 'interview' || s === 'scheduled';
  }).length;

  // Compute dynamic company-wise application counts from database records
  const companyCounts = applications.reduce((acc, app) => {
    const compName = app.company || 'Unknown Company';
    acc[compName] = (acc[compName] || 0) + 1;
    return acc;
  }, {});

  // Compute dynamic internship-wise application counts from database records
  const internshipCounts = applications.reduce((acc, app) => {
    const title = app.internship_title || app.internship || 'Unknown Role';
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

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
      
      {/* ================= ADMIN SIDEBAR ================= */}
      <aside style={{ width: '16rem', backgroundColor: '#111827', color: '#cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, height: '100vh' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', color: '#ffffff', fontSize: '1.25rem', fontWeight: 700 }}>
            <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#f59e0b', transform: 'rotate(45deg)' }}></div>
            <span>Waypoint</span>
          </div>

          <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
            Admin Console
          </div>

          <nav style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem' }}>
            <button onClick={() => navigate('/admin')} style={getLinkStyle(path === '/admin' || path === '/admin/dashboard')}><LayoutDashboard size={20} /><span>Dashboard</span></button>
            <button onClick={() => navigate('/managestudents')} style={getLinkStyle(path === '/managestudents' || path === '/admin/students')}><Users size={20} /><span>Manage Students</span></button>
            <button onClick={() => navigate('/manageinternships')} style={getLinkStyle(path === '/manageinternships' || path === '/admin/internships')}><Briefcase size={20} /><span>Manage Internships</span></button>
            <button onClick={() => navigate('/managecompanies')} style={getLinkStyle(path === '/managecompanies' || path === '/admin/companies')}><Building2 size={20} /><span>Manage Companies</span></button>
            <button onClick={() => navigate('/manageapplications')} style={getLinkStyle(path === '/manageapplications' || path === '/admin/applications')}><FileText size={20} /><span>Manage Applications</span></button>
            <button onClick={() => navigate('/report')} style={getLinkStyle(path === '/report' || path === '/admin/reports')}><BarChart3 size={20} /><span>Reports</span></button>
          </nav>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', backgroundColor: '#d97706', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>PA</div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>Placement Admin</p>
              <p style={{ fontSize: '0.6875rem', color: '#94a3b8', margin: 0 }}>admin@waypoint.edu</p>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('waypoint_user'); navigate('/'); }} title="Log out" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}><LogOut size={20} /></button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ position: 'relative', width: '26rem', maxWidth: '100%' }}>
            <span style={{ position: 'absolute', insetY: 0, left: 0, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', pointerEvents: 'none', color: '#94a3b8' }}><Search size={18} /></span>
            <input type="text" placeholder="Search students, internships, companies..." style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ padding: '0.5rem', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '9999px' }}><Bell size={20} /></button>
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#e2e8f0', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', border: '1px solid #cbd5e1' }}><User size={20} /></div>
          </div>
        </header>

        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669' }}>Insights</span>
            <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Reports</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.125rem' }}>Placement performance metrics pulled directly from your database.</p>
          </div>

          {/* Metric Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '1rem' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>TOTAL STUDENTS</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : studentsCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}><div style={{ backgroundColor: '#d97706', height: '100%', width: '100%' }}></div></div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>TOTAL INTERNSHIPS</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : internshipsCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}><div style={{ backgroundColor: '#d97706', height: '100%', width: '100%' }}></div></div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>TOTAL APPLICATIONS</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : totalApplications}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}><div style={{ backgroundColor: '#d97706', height: '100%', width: '100%' }}></div></div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>SELECTED</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : selectedCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}><div style={{ backgroundColor: '#d97706', height: '100%', width: selectedCount ? '100%' : '0%' }}></div></div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>PENDING</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : pendingCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}><div style={{ backgroundColor: '#d97706', height: '100%', width: '40%' }}></div></div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>UPCOMING INTERVIEWS</span>
              <div style={{ margin: '0.5rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>{loading ? '...' : interviewCount}</div>
              <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.25rem', borderRadius: '9999px', overflow: 'hidden' }}><div style={{ backgroundColor: '#d97706', height: '100%', width: '66%' }}></div></div>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem', margin: 0 }}>Company-wise applications (DB)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {Object.keys(companyCounts).length > 0 ? (
                  Object.entries(companyCounts).map(([company, count], idx, arr) => (
                    <div key={company} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9375rem', paddingBottom: idx === arr.length - 1 ? 0 : '0.875rem', borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      <span style={{ color: '#0f172a', fontWeight: 500 }}>{company}</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{count} {count === 1 ? 'app' : 'apps'}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>No application data found.</p>
                )}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem', margin: 0 }}>Outcome breakdown (DB)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((status, idx, arr) => {
                  const count = applications.filter(a => (a.status || '').toLowerCase() === status.toLowerCase()).length;
                  return (
                    <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9375rem', paddingBottom: idx === arr.length - 1 ? 0 : '0.875rem', borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      <span style={{ color: '#475569', fontWeight: 500 }}>{status}</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default Report;