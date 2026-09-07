import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar, 
  FolderKanban, 
  Bell, 
  User, 
  Search, 
  LogOut,
  Eye, 
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';

const Applications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [applicationsData, setApplicationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Dynamic Logged-in User State
  const [currentUser, setCurrentUser] = useState({ full_name: 'Student', email: 'student@waypoint.edu' });

  // Security check & Load User from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('waypoint_user');
    if (!stored) {
      navigate('/');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setCurrentUser(parsed);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }, [navigate]);

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Fetch live applications from Node.js backend
  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE}/applications`);
      const data = await res.json();
      
      const formatted = data.map(item => ({
        ...item,
        code: item.company ? item.company.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'IN',
        internship: item.internship_title || item.internship || 'Internship Role',
        appliedDate: item.applied_date || 'Today',
        deadline: item.deadline || 'Soon',
        location: item.location || 'On-site',
        duration: item.duration || '12 weeks',
        stipend: item.stipend || '₹10,000/mo',
        skills: ['Python', 'SQL', 'React'],
        updated: item.updated || 'Just now'
      }));
      
      setApplicationsData(formatted);
    } catch (err) {
      console.error('Error fetching student applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Applied': return { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' };
      case 'Shortlisted': return { bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' };
      case 'Interview': return { bg: '#f3e8ff', color: '#7e22ce', dot: '#a855f7' };
      case 'Selected': return { bg: '#ecfdf5', color: '#047857', dot: '#10b981' };
      case 'Rejected': return { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' };
      default: return { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' };
    }
  };

  const filteredApplications = activeTab === 'All' 
    ? applicationsData 
    : applicationsData.filter(item => (item.status || '').toLowerCase() === activeTab.toLowerCase());

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F8F9FC', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', overflow: 'hidden' }}>
      
      {/* ================= STUDENT SIDEBAR ================= */}
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
            <button onClick={() => navigate('/dashboard')} style={getLinkStyle(path === '/dashboard')}><LayoutDashboard size={20} /><span>Dashboard</span></button>
            <button onClick={() => navigate('/internships')} style={getLinkStyle(path === '/internships')}><Briefcase size={20} /><span>Internships</span></button>
            <button onClick={() => navigate('/applications')} style={getLinkStyle(path === '/applications')}><FileText size={20} /><span>Applications</span></button>
            <button onClick={() => navigate('/interviews')} style={getLinkStyle(path === '/interviews')}><Calendar size={20} /><span>Interviews</span></button>
            <button onClick={() => navigate('/documents')} style={getLinkStyle(path === '/documents')}><FolderKanban size={20} /><span>Documents</span></button>
            <button onClick={() => navigate('/notifications')} style={getLinkStyle(path === '/notifications')}><Bell size={20} /><span>Notifications</span></button>
            <button onClick={() => navigate('/profile')} style={getLinkStyle(path === '/profile')}><User size={20} /><span>Profile</span></button>
          </nav>
        </div>

        {/* Dynamic User Profile & Logout */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', backgroundColor: '#d97706', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>
              {getInitials(currentUser.full_name || currentUser.name)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                {currentUser.full_name || currentUser.name || 'Student'}
              </p>
              <p style={{ fontSize: '0.6875rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }} title={currentUser.email}>
                {currentUser.email}
              </p>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('waypoint_user'); navigate('/'); }} title="Log out" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}><LogOut size={20} /></button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ position: 'relative', width: '24rem', maxWidth: '100%' }}>
            <span style={{ position: 'absolute', insetY: 0, left: 0, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', pointerEvents: 'none', color: '#94a3b8' }}><Search size={18} /></span>
            <input type="text" placeholder="Search internships, companies, skills..." style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ padding: '0.5rem', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '9999px' }}><Bell size={20} /></button>
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#e2e8f0', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', border: '1px solid #cbd5e1' }}><User size={20} /></div>
          </div>
        </header>

        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669' }}>Track</span>
              <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>My applications</h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.125rem' }}>Every internship you have applied to, with live database status updates.</p>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
              {loading ? 'Loading...' : `${filteredApplications.length} applications`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {['All', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.375rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: isActive ? '#0f172a' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    boxShadow: isActive ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Internship</th>
                  <th style={{ padding: '1rem 1rem' }}>Company</th>
                  <th style={{ padding: '1rem 1rem' }}>Applied</th>
                  <th style={{ padding: '1rem 1rem' }}>Deadline</th>
                  <th style={{ padding: '1rem 1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1rem' }}>Updated</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((item) => {
                    const badge = getStatusBadge(item.status);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a' }}>{item.internship}</td>
                        <td style={{ padding: '1rem 1rem', color: '#475569' }}>{item.company}</td>
                        <td style={{ padding: '1rem 1rem', color: '#64748b' }}>{item.appliedDate}</td>
                        <td style={{ padding: '1rem 1rem', color: '#64748b' }}>{item.deadline}</td>
                        <td style={{ padding: '1rem 1rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: badge.bg, color: badge.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: badge.dot }}></span>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1rem', color: '#64748b', fontSize: '0.8125rem' }}>{item.updated}</td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                          <button onClick={() => setSelectedApplication(item)} style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      {loading ? 'Loading applications from database...' : 'No applications found under this status.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* ================= APPLICATION DETAILS MODAL ================= */}
      {selectedApplication && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '600px', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <button onClick={() => setSelectedApplication(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}>
                {selectedApplication.code}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedApplication.internship}</h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>{selectedApplication.company}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Location</span>
                <p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedApplication.location}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Stipend</span>
                <p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedApplication.stipend}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Duration</span>
                <p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedApplication.duration}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Deadline</span>
                <p style={{ fontWeight: 600, color: '#dc2626', marginTop: '0.125rem' }}>{selectedApplication.deadline}</p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Required Skills</h4>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {selectedApplication.skills.map((skill, index) => (
                  <span key={index} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 500, border: '1px solid #e2e8f0' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button onClick={() => setSelectedApplication(null)} style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#334155' }}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Applications;