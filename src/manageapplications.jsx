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
  LogOut,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';

const ManageApplications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [managingApp, setManagingApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Applied');

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

  const fetchApplications = () => {
    fetch(`${API_BASE}/api/applications`)
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error('Error fetching admin applications:', err));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!managingApp) return;
    try {
      const res = await fetch(`${API_BASE}/applications/${managingApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplications(applications.map(a => a.id === managingApp.id ? { ...a, status: newStatus } : a));
        setManagingApp(null);
      }
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

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

  const filteredApplications = activeTab === 'All' ? applications : applications.filter(item => item.status === activeTab);

  const getLinkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', backgroundColor: isActive ? '#1F2937' : 'transparent', color: isActive ? '#ffffff' : '#cbd5e1', textDecoration: 'none', borderRadius: '0.75rem', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left'
  });

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F8F9FC', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', overflow: 'hidden' }}>
      
      <aside style={{ width: '16rem', backgroundColor: '#111827', color: '#cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, height: '100vh' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', color: '#ffffff', fontSize: '1.25rem', fontWeight: 700 }}>
            <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#f59e0b', transform: 'rotate(45deg)' }}></div>
            <span>Waypoint</span>
          </div>
          <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8' }}>Admin Console</div>
          <nav style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem' }}>
            <button onClick={() => navigate('/admin')} style={getLinkStyle(path === '/admin')}><LayoutDashboard size={20} /><span>Dashboard</span></button>
            <button onClick={() => navigate('/managestudents')} style={getLinkStyle(path === '/managestudents')}><Users size={20} /><span>Manage Students</span></button>
            <button onClick={() => navigate('/manageinternships')} style={getLinkStyle(path === '/manageinternships')}><Briefcase size={20} /><span>Manage Internships</span></button>
            <button onClick={() => navigate('/managecompanies')} style={getLinkStyle(path === '/managecompanies')}><Building2 size={20} /><span>Manage Companies</span></button>
            <button onClick={() => navigate('/manageapplications')} style={getLinkStyle(path === '/manageapplications')}><FileText size={20} /><span>Manage Applications</span></button>
            <button onClick={() => navigate('/report')} style={getLinkStyle(path === '/report')}><BarChart3 size={20} /><span>Reports</span></button>
          </nav>
        </div>
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', backgroundColor: '#d97706', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>PA</div>
            <div><p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>Placement Admin</p></div>
          </div>
          <button onClick={() => { localStorage.removeItem('waypoint_user'); navigate('/'); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><LogOut size={20} /></button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ position: 'relative', width: '26rem' }}><Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '0.6rem', color: '#94a3b8' }} /><input type="text" placeholder="Search applications..." style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.75rem', outline: 'none' }} /></div>
        </header>

        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#059669' }}>Manage</span>
              <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0 0' }}>Applications</h1>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{filteredApplications.length} applications</div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.375rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, border: 'none', background: activeTab === tab ? '#0f172a' : '#fff', color: activeTab === tab ? '#fff' : '#475569', cursor: 'pointer' }}>{tab}</button>
            ))}
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Student</th>
                  <th style={{ padding: '1rem 1rem' }}>Internship</th>
                  <th style={{ padding: '1rem 1rem' }}>Company</th>
                  <th style={{ padding: '1rem 1rem' }}>Applied</th>
                  <th style={{ padding: '1rem 1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(item => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a' }}>{item.student_name || 'Ananya Rajaram'}</td>
                      <td style={{ padding: '1rem 1rem', color: '#475569' }}>{item.internship_title}</td>
                      <td style={{ padding: '1rem 1rem', color: '#475569' }}>{item.company}</td>
                      <td style={{ padding: '1rem 1rem', color: '#64748b' }}>{item.applied_date}</td>
                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: badge.bg, color: badge.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                          <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: badge.dot }}></span>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button onClick={() => { setManagingApp(item); setNewStatus(item.status); }} style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '0.25rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Manage</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {managingApp && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <form onSubmit={handleUpdateStatus} style={{ backgroundColor: '#fff', width: '500px', padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
            <button type="button" onClick={() => setManagingApp(null)} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ margin: 0 }}>Manage application</h2>
            <div><strong>Internship:</strong> {managingApp.internship_title}</div>
            <div><strong>Company:</strong> {managingApp.company}</div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Update Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }}>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setManagingApp(null)} style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ background: '#d97706', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Update</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default ManageApplications;