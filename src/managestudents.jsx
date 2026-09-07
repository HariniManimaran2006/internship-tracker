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

const ManageStudents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
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

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleStudentStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`${API_BASE}/students/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setStudents(students.map(s => s.id === id ? { ...s, status: nextStatus } : s));
      }
    } catch (err) {
      console.error('Error updating student status:', err);
    }
  };

  const filteredStudents = students.filter(s => 
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.college || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    return (name || '').split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
              <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Students</h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.125rem' }}>Search, review and manage database student accounts.</p>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
              {loading ? 'Loading...' : `${filteredStudents.length} students`}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', width: '380px', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: '#94a3b8' }}><Search size={16} /></span>
              <input type="text" placeholder="Search by name or college" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.25rem', paddingRight: '0.75rem', paddingTop: '0.45rem', paddingBottom: '0.45rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.8125rem', outline: 'none' }} />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Name</th>
                  <th style={{ padding: '1rem 1rem' }}>College</th>
                  <th style={{ padding: '1rem 1rem' }}>Department</th>
                  <th style={{ padding: '1rem 1rem' }}>Year</th>
                  <th style={{ padding: '1rem 1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isActive = student.status === 'Active';
                    return (
                      <tr key={student.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{student.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>{student.email}</p>
                        </td>
                        <td style={{ padding: '1rem 1rem', color: '#475569' }}>{student.college}</td>
                        <td style={{ padding: '1rem 1rem', color: '#475569' }}>{student.department}</td>
                        <td style={{ padding: '1rem 1rem', color: '#64748b' }}>{student.year}</td>
                        <td style={{ padding: '1rem 1rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: isActive ? '#ecfdf5' : '#f1f5f9', color: isActive ? '#047857' : '#475569', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: isActive ? '#10b981' : '#94a3b8' }}></span>
                            {student.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button onClick={() => setSelectedStudent(student)} style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>View</button>
                            <button onClick={() => toggleStudentStatus(student.id, student.status)} style={{ backgroundColor: '#ffffff', color: isActive ? '#dc2626' : '#047857', border: '1px solid #e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', width: '80px' }}>
                              {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No students found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '650px', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setSelectedStudent(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Student profile</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#d97706', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem', flexShrink: 0 }}>{getInitials(selectedStudent.name)}</div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedStudent.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>{selectedStudent.email} · {selectedStudent.phone}</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
              <div><span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>College</span><p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedStudent.college}</p></div>
              <div><span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Department</span><p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedStudent.department}</p></div>
              <div><span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Year</span><p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedStudent.year}</p></div>
              <div><span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>CGPA</span><p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedStudent.cgpa}</p></div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Skills</h4>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {selectedStudent.skills && selectedStudent.skills.map((skill, index) => (
                  <span key={index} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 500, border: '1px solid #e2e8f0' }}>{skill}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button onClick={() => setSelectedStudent(null)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageStudents;