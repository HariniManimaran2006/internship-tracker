import React, { useEffect, useState } from 'react';
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
  Download
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://waypoint-backend-2.onrender.com';
const SERVER_BASE = 'http://localhost:5000';

function formatSize(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return `uploaded ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  } catch {
    return isoString;
  }
}

const Documents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docType, setDocType] = useState('Resume');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Load logged-in user and fetch notifications count
  useEffect(() => {
    const stored = localStorage.getItem('waypoint_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      setLoading(false);
    }

    fetchNotificationsCount();
  }, []);

  const fetchNotificationsCount = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const unread = data.filter(n => n.unread).length;
        setUnreadNotificationsCount(unread);
      }
    } catch (err) {
      console.error('Error fetching notifications count:', err);
    }
  };

  const fetchDocuments = async (userId) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/documents?user_id=${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load documents.');
      setDocuments(data);
    } catch (err) {
      setErrorMsg(err.message || 'Could not reach the server. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchDocuments(user.id);
  }, [user]);

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

  const handleUpload = async () => {
    setErrorMsg('');

    if (!selectedFile) {
      setErrorMsg('Please choose a file to upload.');
      return;
    }
    if (!user?.id) {
      setErrorMsg('You need to be logged in to upload documents.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', docType);
    formData.append('user_id', user.id);

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE}/documents`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Upload failed.');
        return;
      }

      setDocuments(prev => [data.document, ...prev]);
      setSelectedFile(null);
    } catch (err) {
      setErrorMsg('Could not reach the server. Is the backend running on port 5000?');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setErrorMsg('');
    const previous = documents;
    setDocuments(documents.filter(doc => doc.id !== id)); // optimistic update

    try {
      const res = await fetch(`${API_BASE}/documents/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete document.');
      }
    } catch (err) {
      setDocuments(previous); // revert on failure
      setErrorMsg(err.message);
    }
  };

  const handleDownload = (doc) => {
    const link = document.createElement('a');
    link.href = `${SERVER_BASE}${doc.url}`;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const initials = (name) => (name || '').substring(0, 2).toUpperCase() || 'DO';

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

        {/* User Profile & Logout Section */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', backgroundColor: '#d97706', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>
              {user?.full_name ? initials(user.full_name) : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{user?.full_name || 'Guest'}</p>
              <p style={{ fontSize: '0.6875rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{user?.email || 'not logged in'}</p>
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

          {errorMsg && (
            <div style={{ background: '#FDEDEE', border: '1px solid #F3C2C6', color: '#9A2530', fontSize: '0.8125rem', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
              {errorMsg}
            </div>
          )}

          {!user && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E', fontSize: '0.8125rem', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
              You're not logged in — log in to view and upload your documents.
            </div>
          )}

          {/* Two-Column Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left Box: Your Documents */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Your documents</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading && (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0', fontSize: '0.875rem' }}>Loading documents…</p>
                )}

                {!loading && documents.map((doc, idx) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: idx === documents.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                      <div style={{ width: '2.75rem', height: '2.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>
                        {initials(doc.type)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.125rem' }}>
                          {doc.type} · {formatSize(doc.size_bytes)} · {formatDate(doc.uploaded_at)}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button 
                        onClick={() => handleDownload(doc)}
                        title="Download"
                        style={{ padding: '0.375rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        title="Delete"
                        style={{ padding: '0.375rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                ))}

                {!loading && user && documents.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0', fontSize: '0.875rem' }}>No documents uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Right Box: Upload a Document */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Upload a document</h3>

              {/* Document Type Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Type</label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="Resume">Resume</option>
                  <option value="Cover Letter">Cover Letter</option>
                  <option value="Certificate">Certificate</option>
                  <option>Transcript</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Drag and Drop Box */}
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: '0.75rem', padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#fcfcfc' }}>
                <div style={{ color: '#64748b' }}>
                  <File size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Click to choose a file</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.125rem' }}>PDF, DOC, DOCX, JPG or PNG · up to 10MB</p>
                </div>
                <input 
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }} 
                />
              </div>

              {selectedFile && (
                <p style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Selected: {selectedFile.name}</p>
              )}

              {/* Upload Button */}
              <button 
                onClick={handleUpload}
                disabled={uploading || !user}
                style={{ width: '100%', backgroundColor: '#d97706', color: '#221503', border: 'none', borderRadius: '0.5rem', padding: '0.625rem', fontWeight: 600, fontSize: '0.875rem', cursor: uploading || !user ? 'default' : 'pointer', opacity: uploading || !user ? 0.6 : 1, transition: 'background 0.2s' }}
              >
                {uploading ? 'Uploading…' : 'Upload document'}
              </button>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default Documents;