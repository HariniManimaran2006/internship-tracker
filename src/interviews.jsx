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
  LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';

const upcomingInterviews = [
  {
    id: 1,
    internship: 'Data Analytics Intern',
    company: 'Northwind Analytics',
    dateTime: '02 Sept 2026 · 11:00 AM',
    mode: 'Online',
    status: 'Scheduled',
    notes: 'Panel round with the analytics lead — bring 2 dashboard samples.'
  },
  {
    id: 2,
    internship: 'Frontend Engineering Intern',
    company: 'Solace Health',
    dateTime: '05 Sept 2026 · 3:30 PM',
    mode: 'Online',
    status: 'Scheduled',
    notes: 'Portfolio walkthrough, 30 minutes.'
  }
];

const pastInterviews = [
  {
    id: 3,
    internship: 'Business Intelligence Intern',
    company: 'Northwind Analytics',
    dateTime: '25 Aug 2026 · 10:00 AM',
    mode: 'Offline',
    status: 'Completed',
    notes: 'On-site interview at the Chennai office.'
  }
];

const Interviews = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [currentUser, setCurrentUser] = useState({ full_name: 'Student', email: 'student@waypoint.edu' });
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Load User & Fetch Notifications Count
  useEffect(() => {
    const stored = localStorage.getItem('waypoint_user');
    if (!stored) {
      navigate('/');
      return;
    }
    try {
      setCurrentUser(JSON.parse(stored));
    } catch (e) {
      console.error('Error parsing user data:', e);
    }

    fetchNotificationsCount();
  }, [navigate]);

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
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Scheduled':
        return { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' };
      case 'Completed':
        return { bg: '#ecfdf5', color: '#047857', dot: '#10b981' };
      default:
        return { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' };
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F8F9FC', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', overflow: 'hidden' }}>
      
      {/* ================= SIDEBAR ================= */}
      <aside style={{ width: '16rem', backgroundColor: '#111827', color: '#cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, height: '100vh' }}>
        <div>
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', color: '#ffffff', fontSize: '1.25rem', fontWeight: 700 }}>
            <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#f59e0b', transform: 'rotate(45deg)' }}></div>
            <span>Waypoint</span>
          </div>

          <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
            Student Workspace
          </div>

          {/* Navigation Links */}
          <nav style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem' }}>
            
            <button onClick={() => navigate('/dashboard')} style={getLinkStyle(path === '/dashboard')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>

            <button onClick={() => navigate('/internships')} style={getLinkStyle(path === '/internships' || path === '/internship')}>
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

        {/* Dynamic User Profile & Working Logout Button */}
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
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        
        {/* Top Navbar */}
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ position: 'relative', width: '24rem', maxWidth: '100%' }}>
            <span style={{ position: 'absolute', insetY: 0, left: 0, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', pointerEvents: 'none', color: '#94a3b8' }}>
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Search internships, companies, skills..." 
              style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }}
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

        {/* Content Body */}
        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Section */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669' }}>Prepare</span>
            <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Interviews</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.125rem' }}>Upcoming and past interview schedule across all your applications.</p>
          </div>

          {/* Upcoming Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Upcoming</h3>
            
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '1rem 1.5rem' }}>Internship</th>
                    <th style={{ padding: '1rem 1rem' }}>Company</th>
                    <th style={{ padding: '1rem 1rem' }}>Date & Time</th>
                    <th style={{ padding: '1rem 1rem' }}>Mode</th>
                    <th style={{ padding: '1rem 1rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingInterviews.map((item) => {
                    const badge = getStatusBadge(item.status);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a' }}>{item.internship}</td>
                        <td style={{ padding: '1rem 1rem', color: '#475569' }}>{item.company}</td>
                        <td style={{ padding: '1rem 1rem', color: '#0f172a', fontWeight: 500 }}>{item.dateTime}</td>
                        <td style={{ padding: '1rem 1rem', color: '#475569' }}>{item.mode}</td>
                        <td style={{ padding: '1rem 1rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: badge.bg, color: badge.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: badge.dot }}></span>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.8125rem' }}>{item.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Past Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Past</h3>
            
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '1rem 1.5rem' }}>Internship</th>
                    <th style={{ padding: '1rem 1rem' }}>Company</th>
                    <th style={{ padding: '1rem 1rem' }}>Date & Time</th>
                    <th style={{ padding: '1rem 1rem' }}>Mode</th>
                    <th style={{ padding: '1rem 1rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {pastInterviews.map((item) => {
                    const badge = getStatusBadge(item.status);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a' }}>{item.internship}</td>
                        <td style={{ padding: '1rem 1rem', color: '#475569' }}>{item.company}</td>
                        <td style={{ padding: '1rem 1rem', color: '#64748b' }}>{item.dateTime}</td>
                        <td style={{ padding: '1rem 1rem', color: '#475569' }}>{item.mode}</td>
                        <td style={{ padding: '1rem 1rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: badge.bg, color: badge.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: badge.dot }}></span>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.8125rem' }}>{item.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
};

export default Interviews;