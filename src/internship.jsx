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
  Clock,
  LogOut,
  X,
  CheckCircle2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';

const Internship = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Data & Loading States
  const [internshipsData, setInternshipsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Logged-in User State & Unread Notifications Count
  const [currentUser, setCurrentUser] = useState({ full_name: 'Student', email: 'student@waypoint.edu' });
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('All companies');
  const [locationFilter, setLocationFilter] = useState('All locations');
  const [skillFilter, setSkillFilter] = useState('All skills');
  const [stipendFilter, setStipendFilter] = useState('Any stipend');
  const [sortFilter, setSortFilter] = useState('Sort: deadline soonest');

  // Modal State
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Load Logged-in User from localStorage, Fetch Internships & Notifications Count
  useEffect(() => {
    const storedUser = localStorage.getItem('waypoint_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    fetch(`${API_BASE}/api/internships`)
      .then(res => res.json())
      .then(data => {
        setInternshipsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching internships:', err);
        setLoading(false);
      });

    fetchNotificationsCount();
  }, []);

  const fetchNotificationsCount = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const unread = data.filter(n => n.unread).length;
        setUnreadNotificationsCount(unread);
      }
    } catch (err) {
      console.error('Error fetching notifications count:', err);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
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

  // Handle Apply Action with dynamic user name
  const handleApply = async (item) => {
    try {
      const studentName = currentUser.full_name || currentUser.name || 'Student';
      
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName,
          internship_title: item.title,
          company: item.company,
          applied_date: '01 Sept 2026',
          deadline: item.deadline_date || '15 Sept 2026',
          status: 'Applied',
          updated: 'Just now'
        })
      });

      if (res.ok) {
        setInternshipsData(internshipsData.map(i => i.id === item.id ? { ...i, applied: true } : i));
        alert(`Successfully applied for ${item.title}!`);
        setSelectedInternship(null);
      } else {
        alert('Failed to submit application.');
      }
    } catch (err) {
      console.error('Error applying:', err);
      alert('Could not connect to server.');
    }
  };

  // Filtering Logic
  const filteredInternships = internshipsData.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.skills && item.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCompany = companyFilter === 'All companies' || item.company === companyFilter;
    const matchesLocation = locationFilter === 'All locations' || item.location === locationFilter;
    const matchesSkill = skillFilter === 'All skills' || (item.skills && item.skills.includes(skillFilter));
    
    let matchesStipend = true;
    if (stipendFilter === '₹8,000+') matchesStipend = item.stipend_val >= 8000;
    else if (stipendFilter === '₹10,000+') matchesStipend = item.stipend_val >= 10000;
    else if (stipendFilter === '₹13,000+') matchesStipend = item.stipend_val >= 13000;

    return matchesSearch && matchesCompany && matchesLocation && matchesSkill && matchesStipend;
  }).sort((a, b) => {
    if (sortFilter === 'Sort: stipend high–low') {
      return (b.stipend_val || 0) - (a.stipend_val || 0);
    }
    return (a.deadline_days || 0) - (b.deadline_days || 0);
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
            <button onClick={() => navigate('/dashboard')} style={getLinkStyle(path === '/dashboard')}><LayoutDashboard size={20} /><span>Dashboard</span></button>
            <button onClick={() => navigate('/internships')} style={getLinkStyle(path === '/internships' || path === '/internship')}><Briefcase size={20} /><span>Internships</span></button>
            <button onClick={() => navigate('/applications')} style={getLinkStyle(path === '/applications')}><FileText size={20} /><span>Applications</span></button>
            <button onClick={() => navigate('/interviews')} style={getLinkStyle(path === '/interviews')}><Calendar size={20} /><span>Interviews</span></button>
            <button onClick={() => navigate('/documents')} style={getLinkStyle(path === '/documents')}><FolderKanban size={20} /><span>Documents</span></button>
            <button onClick={() => navigate('/notifications')} style={{ ...getLinkStyle(path === '/notifications' || path === '/notification'), justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Bell size={20} /><span>Notifications</span></div>
              {unreadNotificationsCount > 0 && (
                <span style={{ backgroundColor: '#f59e0b', color: '#030712', fontSize: '0.75rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
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
          <button 
            onClick={() => { localStorage.removeItem('waypoint_user'); navigate('/'); }} 
            title="Log out" 
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto', position: 'relative' }}>
        
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ position: 'relative', width: '24rem', maxWidth: '100%' }}>
            <span style={{ position: 'absolute', insetY: 0, left: 0, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', pointerEvents: 'none', color: '#94a3b8' }}><Search size={18} /></span>
            <input type="text" placeholder="Search internships, companies, skills..." style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/notifications')} style={{ padding: '0.5rem', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '9999px', position: 'relative' }}>
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
              )}
            </button>
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#e2e8f0', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', border: '1px solid #cbd5e1' }}><User size={20} /></div>
          </div>
        </header>

        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669' }}>Discover</span>
            <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Browse internships</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.125rem' }}>Search and filter openings that match your skills and interests.</p>
          </div>

          {/* Filter Bar */}
          <div style={{ backgroundColor: '#ffffff', padding: '1rem 1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', flex: '1.5', minWidth: '160px', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '0.75rem', color: '#94a3b8' }}><Search size={15} /></span>
              <input type="text" placeholder="Title, company or skill" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.25rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.8125rem', outline: 'none', height: '36px' }} />
            </div>

            <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} style={{ flex: '1', minWidth: '110px', height: '36px', padding: '0 0.5rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.8125rem', outline: 'none', cursor: 'pointer' }}>
              <option>All companies</option>
              <option>Northwind Analytics</option>
              <option>Fernbridge Robotics</option>
              <option>Solace Health</option>
              <option>Cobalt & Finch</option>
              <option>Ledger Point</option>
              <option>Marrow Cloud</option>
              <option>Greenline Logistics</option>
              <option>Auric Studio</option>
            </select>

            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} style={{ flex: '1', minWidth: '110px', height: '36px', padding: '0 0.5rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.8125rem', outline: 'none', cursor: 'pointer' }}>
              <option>All locations</option>
              <option>Chennai</option>
              <option>Bengaluru</option>
              <option>Remote</option>
              <option>Coimbatore</option>
              <option>Hyderabad</option>
              <option>Pune</option>
            </select>

            <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} style={{ flex: '1', minWidth: '95px', height: '36px', padding: '0 0.5rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.8125rem', outline: 'none', cursor: 'pointer' }}>
              <option>All skills</option>
              <option>Python</option>
              <option>SQL</option>
              <option>Power BI</option>
              <option>C++</option>
              <option>Embedded C</option>
              <option>React</option>
              <option>Node.js</option>
              <option>AWS</option>
              <option>Excel</option>
            </select>

            <select value={stipendFilter} onChange={(e) => setStipendFilter(e.target.value)} style={{ flex: '1', minWidth: '105px', height: '36px', padding: '0 0.5rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.8125rem', outline: 'none', cursor: 'pointer' }}>
              <option>Any stipend</option>
              <option>₹8,000+</option>
              <option>₹10,000+</option>
              <option>₹13,000+</option>
            </select>

            <select value={sortFilter} onChange={(e) => setSortFilter(e.target.value)} style={{ flex: '1.2', minWidth: '150px', height: '36px', padding: '0 0.5rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.8125rem', outline: 'none', cursor: 'pointer' }}>
              <option>Sort: deadline soonest</option>
              <option>Sort: stipend high–low</option>
            </select>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right', fontWeight: 500 }}>
            {loading ? 'Loading internships...' : `${filteredInternships.length} internships found`}
          </div>

          {/* Internships Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.25rem' }}>
            {filteredInternships.map((item) => (
              <div 
                key={item.id} 
                style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer' }}
                onClick={() => setSelectedInternship(item)}
              >
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                      {item.code || 'IN'}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', margin: 0 }}>{item.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>{item.company}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>{item.location}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {item.duration}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.stipend}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    {item.skills && item.skills.map((skill, index) => (
                      <span key={index} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.125rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 500 }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.applied ? '#64748b' : '#dc2626' }}>
                    {item.closes || 'Open'}
                  </span>
                  {item.applied ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                      • Applied
                    </span>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedInternship(item); }} 
                      style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      View details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* ================= MODAL ================= */}
      {selectedInternship && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '600px', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <button onClick={() => setSelectedInternship(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}>
                {selectedInternship.code || 'IN'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedInternship.title}</h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>{selectedInternship.company}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Location</span>
                <p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedInternship.location}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Stipend</span>
                <p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedInternship.stipend}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Duration</span>
                <p style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.125rem' }}>{selectedInternship.duration}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Deadline</span>
                <p style={{ fontWeight: 600, color: '#dc2626', marginTop: '0.125rem' }}>{selectedInternship.deadline_date || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Required Skills</h4>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {selectedInternship.skills && selectedInternship.skills.map((skill, index) => (
                  <span key={index} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 500, border: '1px solid #e2e8f0' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Description</h4>
              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>{selectedInternship.description}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button onClick={() => setSelectedInternship(null)} style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#334155' }}>
                Close
              </button>
              {selectedInternship.applied ? (
                <button disabled style={{ padding: '0.5rem 1.25rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'not-allowed' }}>
                  <CheckCircle2 size={16} /> Already applied
                </button>
              ) : (
                <button onClick={() => handleApply(selectedInternship)} style={{ padding: '0.5rem 1.25rem', backgroundColor: '#d97706', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#221503' }}>
                  Apply now
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Internship;