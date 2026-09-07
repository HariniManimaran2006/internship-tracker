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
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';

const ManageCompanies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [companies, setCompanies] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', website: '', email: '', description: '' });

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

  const fetchCompanies = () => {
    fetch(`${API_BASE}/companies`)
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error('Error loading companies:', err));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.name.substring(0, 2).toUpperCase(),
          ...formData,
          listings: 1
        })
      });
      if (res.ok) {
        setIsAdding(false);
        fetchCompanies();
      }
    } catch (err) {
      console.error('Error adding company:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${API_BASE}/companies/${deletingId}`, { method: 'DELETE' });
      if (res.ok) {
        setCompanies(companies.filter(c => c.id !== deletingId));
        setDeletingId(null);
      }
    } catch (err) {
      console.error('Error deleting company:', err);
    }
  };

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
          <div style={{ position: 'relative', width: '26rem' }}><Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '0.6rem', color: '#94a3b8' }} /><input type="text" placeholder="Search companies..." style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.75rem', outline: 'none' }} /></div>
        </header>

        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#059669' }}>Manage</span>
              <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0 0' }}>Companies</h1>
            </div>
            <button onClick={() => { setIsAdding(true); setFormData({ name: '', website: '', email: '', description: '' }); }} style={{ backgroundColor: '#d97706', color: '#221503', border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Plus size={16} /> Add company</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.25rem' }}>
            {companies.map(company => (
              <div key={company.id} style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{company.code || 'CO'}</div>
                    <div><h3 style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{company.name}</h3><p style={{ fontSize: '0.75rem', color: '#0284c7', margin: 0 }}>{company.website}</p></div>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.875rem' }}>{company.description}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <button onClick={() => setDeletingId(company.id)} style={{ backgroundColor: '#ffffff', color: '#ef4444', border: '1px solid #e2e8f0', padding: '0.25rem 0.625rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {isAdding && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <form onSubmit={handleSave} style={{ backgroundColor: '#fff', width: '500px', padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>Add new company</h2>
            <input type="text" placeholder="Company Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} required />
            <input type="text" placeholder="Website" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} required />
            <input type="email" placeholder="Contact Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} required />
            <textarea placeholder="Description" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} required />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setIsAdding(false)} style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ background: '#d97706', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Save</button>
            </div>
          </form>
        </div>
      )}

      {deletingId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', width: '400px' }}>
            <h3>Delete company?</h3>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => setDeletingId(null)} style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDeleteConfirm} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCompanies;