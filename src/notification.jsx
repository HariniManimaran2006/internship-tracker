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
  Trash2,
  UploadCloud
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';

const Documents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [documents, setDocuments] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [currentUser, setCurrentUser] = useState({ id: 1, full_name: 'Student', email: 'student@waypoint.edu' });
  const [docType, setDocType] = useState('Resume');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load User, Fetch Documents & Unread Notifications Count
  useEffect(() => {
    const stored = localStorage.getItem('waypoint_user');
    if (!stored) {
      navigate('/');
      return;
    }
    try {
      const parsedUser = JSON.parse(stored);
      setCurrentUser(parsedUser);
      fetchDocuments(parsedUser.id || 1);
    } catch (e) {
      console.error('Error parsing user data:', e);
      fetchDocuments(1);
    }

    fetchNotificationsCount();
  }, [navigate]);

  const fetchDocuments = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/documents?user_id=${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDocuments(data);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

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

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', docType);
    formData.append('user_id', currentUser.id || 1);

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE}/documents`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setDocuments([data.document, ...documents]);
        setSelectedFile(null);
        alert('Document uploaded successfully!');
      } else {
        alert(data.error || 'Failed to upload document.');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Server connection error.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`${API_BASE}/documents/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDocuments(documents.filter(doc => doc.id !== id));
      } else {
        alert('Failed to delete document.');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
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
        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Section */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669' }}>Manage</span>
            <h1 style={{ fontSize: '1.875rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Documents</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.125rem' }}>Keep your resume, cover letter and certificates up to date.</p>
          </div>

          {/* Two-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left Column: Uploaded Documents List */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Your documents</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', overflow: 'hidden' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <File size={20} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{doc.name}</h4>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>
                            {doc.type} · {formatBytes(doc.size_bytes)}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <a 
                          href={`http://localhost:5000${doc.url}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ padding: '0.375rem 0.75rem', backgroundColor: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}
                        >
                          View
                        </a>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          style={{ padding: '0.375rem', backgroundColor: '#ffffff', color: '#ef4444', border: '1px solid #cbd5e1', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete document"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                    No documents uploaded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Upload Form */}
            <form onSubmit={handleFileUpload} style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Upload a document</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Type</label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="Resume">Resume</option>
                  <option value="Cover Letter">Cover Letter</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Transcript">Transcript</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select File</label>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '0.75rem', padding: '1.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#fcfcfc' }}>
                  <div style={{ color: '#64748b' }}>
                    <UploadCloud size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Choose file to upload</p>
                    <p style={{ fontSize: '0.6875rem', color: '#94a3b8', margin: '0.125rem 0 0 0' }}>PDF, DOC, DOCX, JPG or PNG · up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                    style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', width: '100%', boxSizing: 'border-box' }} 
                  />
                </div>
                {selectedFile && (
                  <p style={{ fontSize: '0.75rem', color: '#059669', margin: '0.25rem 0 0 0', fontWeight: 600 }}>
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <button 
                type="submit"
                disabled={uploading}
                style={{ backgroundColor: '#d97706', color: '#221503', border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1rem', fontWeight: 600, fontSize: '0.875rem', cursor: uploading ? 'not-allowed' : 'pointer', width: '100%', opacity: uploading ? 0.7 : 1, transition: 'opacity 0.2s' }}
              >
                {uploading ? 'Uploading...' : 'Upload document'}
              </button>
            </form>

          </div>

        </main>
      </div>

    </div>
  );
};

export default Documents;