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
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';

const ManageInternships = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [internships, setInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [editingInternship, setEditingInternship] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({ 
    title: '', 
    company: 'Northwind Analytics', 
    location: '', 
    stipend: '', 
    deadline_date: '', 
    duration: '', 
    skills: '' 
  });

  // Security check: Ensure admin authentication
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

  // Fetch internships from database
  const fetchInternships = async () => {
    try {
      const res = await fetch(`${API_BASE}/internships`);
      const data = await res.json();
      setInternships(data);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleOpenEdit = (item) => {
    setEditingInternship(item);
    setFormData({
      title: item.title || '',
      company: item.company || '',
      location: item.location || '',
      stipend: item.stipend ? item.stipend.replace('₹', '').replace('/mo', '').replace(',', '') : '',
      deadline_date: item.deadline_date || item.deadline || '',
      duration: item.duration || '',
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || '')
    });
  };

  const handleOpenAdd = () => {
    setIsAdding(true);
    setFormData({ 
      title: '', 
      company: 'Northwind Analytics', 
      location: '', 
      stipend: '', 
      deadline_date: '15 Sept 2026', 
      duration: '12 weeks', 
      skills: '' 
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        stipend: `₹${Number(formData.stipend || 0).toLocaleString()}/mo`,
        stipend_val: Number(formData.stipend || 0),
        deadline_date: formData.deadline_date,
        duration: formData.duration,
        skills: formData.skills,
        closes: 'Open',
        deadline_days: 7,
        code: 'IN',
        description: 'Listing managed via Admin console.',
        about: 'Company placement opportunity.'
      };

      if (editingInternship) {
        // Update API call (or delete & re-add if endpoint relies on POST)
        await fetch(`${API_BASE}/internships/${editingInternship.id}`, { method: 'DELETE' });
        await fetch(`${API_BASE}/internships`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setEditingInternship(null);
      } else if (isAdding) {
        await fetch(`${API_BASE}/internships`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setIsAdding(false);
      }
      fetchInternships();
    } catch (err) {
      console.error('Error saving internship:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${API_BASE}/internships/${deletingId}`, { method: 'DELETE' });
      if (res.ok) {
        setInternships(internships.filter(i => i.id !== deletingId));
        setDeletingId(null);
      }
    } catch (err) {
      console.error('Error deleting internship:', err);
    }
  };

  const filteredInternships = internships.filter(i => 
    (i.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto', position: 'relative' }}>
        
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669' }}>Manage</span>
              <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Internships</h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.125rem' }}>Add, edit or remove database internship listings.</p>
            </div>
            
            <button onClick={handleOpenAdd} style={{ backgroundColor: '#d97706', color: '#221503', border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Plus size={16} /> Add internship
            </button>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', width: '380px', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: '#94a3b8' }}><Search size={16} /></span>
              <input type="text" placeholder="Search internships" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.25rem', paddingRight: '0.75rem', paddingTop: '0.45rem', paddingBottom: '0.45rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.8125rem', outline: 'none' }} />
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right', fontWeight: 500 }}>
            {loading ? 'Loading...' : `${filteredInternships.length} internships`}
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Role</th>
                  <th style={{ padding: '1rem 1rem' }}>Company</th>
                  <th style={{ padding: '1rem 1rem' }}>Location</th>
                  <th style={{ padding: '1rem 1rem' }}>Stipend</th>
                  <th style={{ padding: '1rem 1rem' }}>Deadline</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.length > 0 ? (
                  filteredInternships.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a' }}>{item.title}</td>
                      <td style={{ padding: '1rem 1rem', color: '#475569' }}>{item.company}</td>
                      <td style={{ padding: '1rem 1rem', color: '#475569' }}>{item.location}</td>
                      <td style={{ padding: '1rem 1rem', color: '#0f172a', fontWeight: 600 }}>{item.stipend}</td>
                      <td style={{ padding: '1rem 1rem', color: '#64748b' }}>{item.deadline_date || item.deadline}</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button onClick={() => handleOpenEdit(item)} style={{ backgroundColor: '#ffffff', color: '#334155', border: '1px solid #e2e8f0', padding: '0.375rem 0.625rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Pencil size={13} /> Edit</button>
                          <button onClick={() => setDeletingId(item.id)} style={{ backgroundColor: '#ffffff', color: '#ef4444', border: '1px solid #e2e8f0', padding: '0.375rem 0.625rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Trash2 size={13} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No internships found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* ================= EDIT / ADD MODAL ================= */}
      {(editingInternship || isAdding) && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <form onSubmit={handleSave} style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '650px', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            
            <button type="button" onClick={() => { setEditingInternship(null); setIsAdding(false); }} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{isAdding ? 'Add new internship' : 'Edit internship'}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Role Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Company</label>
              <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Location</label>
                <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Duration</label>
                <input type="text" required value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Stipend (Numbers only)</label>
                <input type="text" required value={formData.stipend} onChange={(e) => setFormData({ ...formData, stipend: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Deadline Date</label>
                <input type="text" required value={formData.deadline_date} onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Required Skills</label>
              <input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => { setEditingInternship(null); setIsAdding(false); }} style={{ padding: '0.5rem 1.25rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#d97706', border: 'none', borderRadius: '0.5rem', fontWeight: 600, color: '#221503', cursor: 'pointer' }}>Save changes</button>
            </div>

          </form>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '450px', borderRadius: '1rem', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Delete internship?</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>This removes the listing permanently from the database.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={() => setDeletingId(null)} style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDeleteConfirm} style={{ padding: '0.5rem 1.25rem', backgroundColor: '#dc2626', border: 'none', borderRadius: '0.5rem', fontWeight: 600, color: '#ffffff', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageInternships;