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
  File,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Dynamic Profile Form States
  const [fullName, setFullName] = useState('Student');
  const [email, setEmail] = useState('student@waypoint.edu');
  const [phone, setPhone] = useState('+91 00000 00000');
  const [about, setAbout] = useState('Third-year student interested in engineering roles and data-driven design.');
  const [college, setCollege] = useState('PSG College of Technology');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');
  const [cgpa, setCgpa] = useState('8.5');

  // Dynamic Skills State
  const [skills, setSkills] = useState(['Python', 'React', 'SQL', 'Problem Solving']);
  const [newSkill, setNewSkill] = useState('');

  // Dynamic Resume State
  const [resumeName, setResumeName] = useState('Resume.pdf');

  // Load Logged-in User from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('waypoint_user');
    if (!stored) {
      navigate('/');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setFullName(parsed.full_name || parsed.name || 'Student');
      setEmail(parsed.email || 'student@waypoint.edu');
      setPhone(parsed.phone || '+91 98765 43210');
      if (parsed.about) setAbout(parsed.about);
      if (parsed.college) setCollege(parsed.college);
      if (parsed.department) setDepartment(parsed.department);
      if (parsed.year_of_study) setYearOfStudy(parsed.year_of_study);
      if (parsed.cgpa) setCgpa(parsed.cgpa);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }, [navigate]);

  // Helper for Sidebar Initials (e.g. "Harini M" -> "HM")
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

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    // Update localStorage user info to keep sync across pages
    const stored = localStorage.getItem('waypoint_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updatedUser = { 
          ...parsed, 
          full_name: fullName, 
          email, 
          phone, 
          about, 
          college, 
          department, 
          year_of_study: yearOfStudy, 
          cgpa 
        };
        localStorage.setItem('waypoint_user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error('Error updating storage:', err);
      }
    }
    alert('Profile details updated and saved successfully!');
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
              <span style={{ backgroundColor: '#f59e0b', color: '#030712', fontSize: '0.75rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>3</span>
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
              {getInitials(fullName)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{fullName}</p>
              <p style={{ fontSize: '0.6875rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }} title={email}>{email}</p>
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
            <button style={{ padding: '0.5rem', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '9999px' }}>
              <Bell size={20} />
            </button>
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#e2e8f0', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', border: '1px solid #cbd5e1' }}>
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Section */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669' }}>You</span>
            <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Profile</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.125rem' }}>Keep your details current so companies see accurate information.</p>
          </div>

          {/* Two-Column Grid Form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left Column: Personal & Educational Information */}
            <form onSubmit={handleSaveChanges} style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Personal information</h3>

              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }}
                />
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }}
                />
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }}
                />
              </div>

              {/* About */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>About</label>
                <textarea 
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.5rem 0' }} />

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Education</h3>

              {/* College / University */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>College / University</label>
                <input 
                  type="text" 
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }}
                />
              </div>

              {/* Department */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</label>
                <input 
                  type="text" 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }}
                />
              </div>

              {/* Year of Study & CGPA Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year of Study</label>
                  <select 
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none', cursor: 'pointer' }}
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CGPA / Percentage</label>
                  <input 
                    type="text" 
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Save Changes Button */}
              <button 
                type="submit"
                style={{ marginTop: '0.5rem', backgroundColor: '#d97706', color: '#221503', border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', width: 'fit-content' }}
              >
                Save changes
              </button>

            </form>

            {/* Right Column: Avatar Card, Skills & Resume */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Dynamic User Avatar Card */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '4.5rem', height: '4.5rem', backgroundColor: '#d97706', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1rem' }}>
                  {getInitials(fullName)}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{fullName}</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>{department} · {yearOfStudy}</p>
              </div>

              {/* Dynamic Skills Box */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Skills</h3>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {skills.map((skill, index) => (
                    <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 500, border: '1px solid #e2e8f0' }}>
                      {skill}
                      <button 
                        type="button"
                        onClick={() => removeSkill(skill)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <input 
                  type="text" 
                  placeholder="Add a skill, press Enter" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.8125rem', color: '#334155', outline: 'none' }}
                />
              </div>

              {/* Resume & Password Box */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Resume</h3>

                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '0.75rem', padding: '1.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#fcfcfc' }}>
                  <div style={{ color: '#64748b' }}>
                    <File size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Upload latest resume</p>
                    <p style={{ fontSize: '0.6875rem', color: '#94a3b8', margin: '0.125rem 0 0 0' }}>PDF or DOCX</p>
                  </div>
                  <input 
                    type="file" 
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setResumeName(e.target.files[0].name);
                      }
                    }}
                    style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }} 
                  />
                </div>

                <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, fontWeight: 500 }}>
                  Current: <span style={{ color: '#0f172a', fontWeight: 600 }}>{resumeName}</span>
                </p>

                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.25rem 0' }} />

                <button 
                  type="button"
                  onClick={() => alert('Password change modal triggered!')}
                  style={{ backgroundColor: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.625rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'center', transition: 'background 0.2s' }}
                >
                  Change password
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default Profile;