import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Upload,
  Trash2,
  Eye,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  Globe,
  X,
  FileCheck,
  Layers,
  ChevronRight,
  ShieldCheck,
  HardDrive,
  RotateCcw
} from 'lucide-react';

// --- Native IndexedDB Helper for Large PDF & Image Persistence ---
const DB_NAME = 'FolioForgeVaultDB';
const DB_VERSION = 1;
const STORE_NAME = 'credentials';

const openVaultDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveDocsToDB = async (docsObject) => {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(docsObject, 'uploaded_documents');
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Could not save documents to IndexedDB:', err);
  }
};

const loadDocsFromDB = async () => {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('uploaded_documents');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not load documents from IndexedDB:', err);
    return null;
  }
};

const clearDocsFromDB = async () => {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete('uploaded_documents');
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Could not clear IndexedDB:', err);
  }
};

const THEMES = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Luxe',
    bg: 'bg-zinc-950 text-zinc-100',
    card: 'bg-zinc-900/80 border border-zinc-800/80 shadow-2xl backdrop-blur-md',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    button: 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold',
    muted: 'text-zinc-400',
    border: 'border-zinc-800',
    badge: 'bg-zinc-800 text-zinc-200 border-zinc-700'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Blueprint',
    bg: 'bg-slate-950 text-cyan-50',
    card: 'bg-slate-900/75 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.08)] backdrop-blur-md',
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300',
    button: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold',
    muted: 'text-slate-400',
    border: 'border-cyan-500/25',
    badge: 'bg-slate-800/90 text-cyan-300 border-cyan-500/30'
  },
  minimal: {
    id: 'minimal',
    name: 'Swiss Minimal',
    bg: 'bg-stone-50 text-stone-900',
    card: 'bg-white border border-stone-200/90 shadow-sm',
    accent: 'text-emerald-700',
    accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    button: 'bg-stone-900 hover:bg-stone-800 text-white font-medium',
    muted: 'text-stone-500',
    border: 'border-stone-200',
    badge: 'bg-stone-100 text-stone-700 border-stone-200'
  },
  brutalist: {
    id: 'brutalist',
    name: 'Neo Brutalist',
    bg: 'bg-yellow-50 text-black',
    card: 'bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    accent: 'text-indigo-600',
    accentBg: 'bg-indigo-100 border-2 border-black text-black font-bold',
    button: 'bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold',
    muted: 'text-zinc-700',
    border: 'border-black',
    badge: 'bg-yellow-200 text-black border-2 border-black font-semibold'
  }
};

const DOCUMENT_CATEGORIES = [
  {
    id: 'degrees',
    label: 'Degrees & Diplomas',
    icon: GraduationCap,
    placeholder: 'e.g., Master of Computer Science Degree',
    issuerPlaceholder: 'e.g., Fergusson College / Modern College'
  },
  {
    id: 'transcripts',
    label: 'Academic Transcripts',
    icon: FileText,
    placeholder: 'e.g., Official Final Semester Marksheet',
    issuerPlaceholder: 'e.g., Savitribai Phule Pune University'
  },
  {
    id: 'certificates',
    label: 'Technical Certifications',
    icon: Award,
    placeholder: 'e.g., CCNA / Palo Alto / CEH Certificate',
    issuerPlaceholder: 'e.g., Cisco / EC-Council'
  },
  {
    id: 'experience',
    label: 'Experience & Recommendation Letters',
    icon: Briefcase,
    placeholder: 'e.g., Head of Technology Experience Letter',
    issuerPlaceholder: 'e.g., AFEX Consultancy'
  }
];

const DEFAULT_CANDIDATE = {
  fullName: 'Naseebullah Safi',
  headline: 'Head of Technology & Computer Science Specialist',
  age: '25',
  location: 'Kabul, Afghanistan',
  email: 'naseeb@afexconsultancy.com',
  phone: '+93 70 000 0000',
  website: 'github.com/nasebhamdard555-ctrl',
  summary:
    'Computer Science postgraduate (M.Sc. & B.Sc.) and Head of Technology experienced in full-stack web architecture, AI automation workflows, network security (CCNA, Palo Alto, CEH), and scalable e-commerce systems.',
  skills: 'React, JavaScript, Python, AI Prompt Engineering, CCNA, Palo Alto Firewall, CEH, WordPress/Elementor'
};

const EMPTY_DOCUMENTS = {
  degrees: [],
  transcripts: [],
  certificates: [],
  experience: []
};

export default function FolioForgeStudio() {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('folioforge_theme') || 'obsidian';
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [draggingCat, setDraggingCat] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const [savePulse, setSavePulse] = useState(false);

  // Candidate Profile State (Loaded from localStorage)
  const [candidate, setCandidate] = useState(() => {
    try {
      const saved = localStorage.getItem('folioforge_candidate');
      return saved ? JSON.parse(saved) : DEFAULT_CANDIDATE;
    } catch {
      return DEFAULT_CANDIDATE;
    }
  });

  // Uploaded Document Credentials State (Loaded from IndexedDB)
  const [documents, setDocuments] = useState(EMPTY_DOCUMENTS);

  // Pending metadata per category before/during upload
  const [docMeta, setDocMeta] = useState({
    degrees: { title: '', issuer: '', year: '2026' },
    transcripts: { title: '', issuer: '', year: '2026' },
    certificates: { title: '', issuer: '', year: '2026' },
    experience: { title: '', issuer: '', year: '2026' }
  });

  const fileInputRefs = useRef({});
  const theme = THEMES[activeTheme] || THEMES.obsidian;

  // 1. Load persisted documents from IndexedDB on initial mount
  useEffect(() => {
    let isMounted = true;
    loadDocsFromDB().then((savedDocs) => {
      if (isMounted) {
        if (savedDocs) {
          setDocuments({
            degrees: savedDocs.degrees || [],
            transcripts: savedDocs.transcripts || [],
            certificates: savedDocs.certificates || [],
            experience: savedDocs.experience || []
          });
        }
        setStorageReady(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Save candidate profile & theme to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('folioforge_candidate', JSON.stringify(candidate));
      localStorage.setItem('folioforge_theme', activeTheme);
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }, [candidate, activeTheme]);

  // 3. Save uploaded files to IndexedDB whenever documents change
  useEffect(() => {
    if (!storageReady) return;
    saveDocsToDB(documents).then(() => {
      setSavePulse(true);
      const timer = setTimeout(() => setSavePulse(false), 1200);
      return () => clearTimeout(timer);
    });
  }, [documents, storageReady]);

  const handleCandidateChange = (e) => {
    const { name, value } = e.target;
    setCandidate((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetaChange = (catId, field, value) => {
    setDocMeta((prev) => ({
      ...prev,
      [catId]: { ...prev[catId], [field]: value }
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  const processFiles = (catId, fileList) => {
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isPdf) {
        alert(`"${file.name}" is not supported. Please upload a PDF, PNG, JPG, or WEBP file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const currentMeta = docMeta[catId];

        const newDoc = {
          id: `${catId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: currentMeta.title.trim() || cleanFileName,
          issuer: currentMeta.issuer.trim() || 'Verified Institution',
          year: currentMeta.year || new Date().getFullYear().toString(),
          fileName: file.name,
          fileType: file.type,
          isImage,
          isPdf,
          size: formatFileSize(file.size),
          dataUrl: event.target.result,
          uploadedAt: new Date().toLocaleDateString()
        };

        setDocuments((prev) => ({
          ...prev,
          [catId]: [newDoc, ...prev[catId]]
        }));

        setDocMeta((prev) => ({
          ...prev,
          [catId]: { ...prev[catId], title: '' }
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e, catId) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCat(null);
    processFiles(catId, e.dataTransfer.files);
  };

  const removeDocument = (catId, docId) => {
    setDocuments((prev) => ({
      ...prev,
      [catId]: prev[catId].filter((doc) => doc.id !== docId)
    }));
    if (previewDoc?.id === docId) {
      setPreviewDoc(null);
    }
  };

  const handleResetVault = async () => {
    if (!window.confirm('Reset all uploaded documents and restore default profile settings?')) {
      return;
    }
    setDocuments(EMPTY_DOCUMENTS);
    setCandidate(DEFAULT_CANDIDATE);
    localStorage.removeItem('folioforge_candidate');
    await clearDocsFromDB();
  };

  const totalUploadedDocs = Object.values(documents).reduce((acc, list) => acc + list.length, 0);

  return (
    <div className={`min-h-screen transition-colors duration-700 ease-out ${theme.bg}`}>
      {/* Smooth Spring Motion & Print Styles */}
      <style>{`
        @keyframes fadeUpSpring {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes modalPop {
          0% {
            opacity: 0;
            transform: scale(0.94) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-spring-in {
          animation: fadeUpSpring 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-modal-pop {
          animation: modalPop 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .smooth-card {
          transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.42s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.3s ease;
        }
        .smooth-card:hover {
          transform: translateY(-4px);
        }
        @media print {
          .no-print {
            display: none !important;
          }
          .print-full {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className={`no-print sticky top-0 z-30 border-b ${theme.border} backdrop-blur-xl bg-opacity-80 px-6 py-4 transition-all duration-500`}>
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${theme.accentBg} transition-transform duration-500 hover:rotate-6`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg font-bold tracking-tight">FolioForge Studio</h1>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 transition-all duration-300 ${theme.badge}`}>
                  <HardDrive className={`w-3 h-3 ${savePulse ? 'animate-bounce' : ''}`} />
                  {savePulse ? 'Saved to Vault' : 'Auto-Saved Locally'}
                </span>
              </div>
              <p className={`text-xs ${theme.muted}`}>
                Interactive Educational & Professional Document Portfolio Builder
              </p>
            </div>
          </div>

          {/* Theme Switcher, Reset & Print Action */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className={`flex items-center p-1 rounded-xl border ${theme.border} bg-black/10`}>
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                    activeTheme === t.id
                      ? `${theme.button} shadow-sm scale-[1.02]`
                      : `${theme.muted} hover:opacity-100 opacity-75`
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleResetVault}
              title="Clear saved documents and reset to default"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border ${theme.border} ${theme.muted} hover:opacity-100 opacity-80 transition-all duration-300 active:scale-95`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Vault
            </button>

            <button
              onClick={() => window.print()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs ${theme.button} transition-all duration-300 active:scale-95`}
            >
              <Printer className="w-4 h-4" />
              Export / Print PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Workspace */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
        {/* LEFT PANEL: Builder & Document Uploader */}
        <section className="no-print lg:col-span-5 xl:col-span-5 flex flex-col gap-6">
          {/* Builder Mode Tabs */}
          <div className={`p-1.5 rounded-2xl border ${theme.border} grid grid-cols-2 gap-2 bg-black/5`}>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'profile' ? theme.button : `${theme.muted} hover:opacity-90`
              }`}
            >
              <User className="w-4 h-4" />
              Candidate Info
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'documents' ? theme.button : `${theme.muted} hover:opacity-90`
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Upload Credentials
              {totalUploadedDocs > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-black/20">
                  {totalUploadedDocs}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: Candidate Information Intake */}
          {activeTab === 'profile' && (
            <div className={`p-6 rounded-2xl ${theme.card} animate-spring-in space-y-5`}>
              <div className="flex items-center justify-between border-b pb-4 border-current/10">
                <div>
                  <h2 className="text-base font-bold">Personal & Executive Profile</h2>
                  <p className={`text-xs ${theme.muted}`}>
                    Changes auto-save and update live in your portfolio preview
                  </p>
                </div>
                <Layers className={`w-5 h-5 ${theme.accent}`} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1.5 ${theme.muted}`}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={candidate.fullName}
                    onChange={handleCandidateChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-current/30 transition-all`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1.5 ${theme.muted}`}>Professional Headline</label>
                  <input
                    type="text"
                    name="headline"
                    value={candidate.headline}
                    onChange={handleCandidateChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-current/30 transition-all`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${theme.muted}`}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={candidate.location}
                    onChange={handleCandidateChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-current/30 transition-all`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${theme.muted}`}>Age</label>
                  <input
                    type="text"
                    name="age"
                    value={candidate.age}
                    onChange={handleCandidateChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-current/30 transition-all`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${theme.muted}`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={candidate.email}
                    onChange={handleCandidateChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-current/30 transition-all`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${theme.muted}`}>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={candidate.phone}
                    onChange={handleCandidateChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-current/30 transition-all`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1.5 ${theme.muted}`}>Website / GitHub</label>
                  <input
                    type="text"
                    name="website"
                    value={candidate.website}
                    onChange={handleCandidateChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-current/30 transition-all`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1.5 ${theme.muted}`}>Executive Summary</label>
                  <textarea
                    rows={3}
                    name="summary"
                    value={candidate.summary}
                    onChange={handleCandidateChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-current/30 transition-all`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1.5 ${theme.muted}`}>
                    Core Competencies (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={candidate.skills}
                    onChange={handleCandidateChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-current/30 transition-all`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 ${theme.button} transition-all duration-300`}
                >
                  Proceed to Upload Educational Documents
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Educational & Credential File Uploader */}
          {activeTab === 'documents' && (
            <div className="space-y-5 animate-spring-in">
              {DOCUMENT_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const uploadedList = documents[cat.id] || [];
                const meta = docMeta[cat.id];
                const isDragging = draggingCat === cat.id;

                return (
                  <div key={cat.id} className={`p-5 rounded-2xl ${theme.card} transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl border ${theme.accentBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">{cat.label}</h3>
                          <p className={`text-xs ${theme.muted}`}>
                            Upload official scans (PDF, PNG, JPG) — Stored in browser vault
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${theme.badge}`}>
                        {uploadedList.length} {uploadedList.length === 1 ? 'File' : 'Files'}
                      </span>
                    </div>

                    {/* Optional Metadata Tagging before selecting file */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                      <input
                        type="text"
                        placeholder={cat.placeholder}
                        value={meta.title}
                        onChange={(e) => handleMetaChange(cat.id, 'title', e.target.value)}
                        className={`sm:col-span-2 px-3 py-2 rounded-xl border ${theme.border} bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-current`}
                      />
                      <input
                        type="text"
                        placeholder="Year (e.g. 2026)"
                        value={meta.year}
                        onChange={(e) => handleMetaChange(cat.id, 'year', e.target.value)}
                        className={`px-3 py-2 rounded-xl border ${theme.border} bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-current`}
                      />
                      <input
                        type="text"
                        placeholder={cat.issuerPlaceholder}
                        value={meta.issuer}
                        onChange={(e) => handleMetaChange(cat.id, 'issuer', e.target.value)}
                        className={`sm:col-span-3 px-3 py-2 rounded-xl border ${theme.border} bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-current`}
                      />
                    </div>

                    {/* Interactive Drag & Drop Upload Zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDraggingCat(cat.id);
                      }}
                      onDragLeave={() => setDraggingCat(null)}
                      onDrop={(e) => handleDrop(e, cat.id)}
                      onClick={() => fileInputRefs.current[cat.id]?.click()}
                      className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all duration-300 ${
                        isDragging
                          ? `${theme.accentBg} scale-[1.01]`
                          : `${theme.border} hover:border-current/40 bg-black/5`
                      }`}
                    >
                      <input
                        ref={(el) => (fileInputRefs.current[cat.id] = el)}
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/webp"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          processFiles(cat.id, e.target.files);
                          e.target.value = '';
                        }}
                      />
                      <Upload className={`w-6 h-6 mx-auto mb-2 ${theme.accent}`} />
                      <p className="text-xs font-semibold">
                        Click to upload or drag & drop your {cat.label.toLowerCase()}
                      </p>
                      <p className={`text-[11px] mt-1 ${theme.muted}`}>
                        Supports PDF documents, high-res JPG, PNG, WEBP
                      </p>
                    </div>

                    {/* Uploaded Files List inside Builder */}
                    {uploadedList.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedList.map((doc) => (
                          <div
                            key={doc.id}
                            className={`flex items-center justify-between p-2.5 rounded-xl border ${theme.border} bg-black/10 animate-spring-in`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {doc.isImage ? (
                                <img
                                  src={doc.dataUrl}
                                  alt={doc.title}
                                  className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                                />
                              ) : (
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${theme.accentBg} shrink-0`}>
                                  <FileText className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">{doc.title}</p>
                                <p className={`text-[11px] truncate ${theme.muted}`}>
                                  {doc.issuer} • {doc.year} • {doc.size}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(doc)}
                                className={`p-1.5 rounded-lg border ${theme.border} hover:opacity-80 transition-opacity`}
                                title="Preview Document"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeDocument(cat.id, doc.id)}
                                className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Remove Document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT PANEL: Live Interactive Portfolio & Credential Vault Preview */}
        <section className="lg:col-span-7 xl:col-span-7 print-full">
          <div className={`p-8 sm:p-10 rounded-3xl ${theme.card} transition-all duration-500 space-y-8`}>
            {/* Portfolio Header */}
            <div className={`border-b ${theme.border} pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border mb-1 bg-black/10">
                  <ShieldCheck className={`w-3.5 h-3.5 ${theme.accent}`} />
                  <span>Verified Academic & Professional Dossier</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {candidate.fullName || 'Candidate Name'}
                </h1>
                <p className={`text-base sm:text-lg font-medium ${theme.accent}`}>
                  {candidate.headline || 'Professional Title'}
                </p>
              </div>

              <div className={`text-xs space-y-1.5 ${theme.muted} md:text-right`}>
                {candidate.location && (
                  <div className="flex items-center md:justify-end gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{candidate.location} (Age: {candidate.age})</span>
                  </div>
                )}
                {candidate.email && (
                  <div className="flex items-center md:justify-end gap-2">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>{candidate.email}</span>
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center md:justify-end gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                {candidate.website && (
                  <div className="flex items-center md:justify-end gap-2">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span>{candidate.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Executive Summary */}
            {candidate.summary && (
              <div className="space-y-2 animate-spring-in">
                <h2 className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Executive Summary
                </h2>
                <p className="text-sm leading-relaxed opacity-90">{candidate.summary}</p>
              </div>
            )}

            {/* Skills Pills */}
            {candidate.skills && (
              <div className="space-y-3 animate-spring-in">
                <h2 className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Technical & Core Competencies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-xl text-xs border transition-transform duration-300 hover:scale-105 ${theme.badge}`}
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Uploaded Educational & Professional Credentials Showcase */}
            <div className="space-y-8 pt-2">
              <div className="flex items-center justify-between border-b pb-3 border-current/10">
                <div className="flex items-center gap-2">
                  <GraduationCap className={`w-5 h-5 ${theme.accent}`} />
                  <h2 className="text-base font-bold tracking-tight">
                    Official Educational & Professional Documents
                  </h2>
                </div>
                <span className={`text-xs ${theme.muted}`}>
                  {totalUploadedDocs} Verified {totalUploadedDocs === 1 ? 'Attachment' : 'Attachments'}
                </span>
              </div>

              {totalUploadedDocs === 0 ? (
                <div
                  onClick={() => setActiveTab('documents')}
                  className={`cursor-pointer rounded-2xl border border-dashed ${theme.border} p-10 text-center transition-all duration-300 hover:border-current/40`}
                >
                  <FileCheck className={`w-10 h-10 mx-auto mb-3 ${theme.accent} opacity-80`} />
                  <h3 className="text-sm font-bold">No Educational Documents Uploaded Yet</h3>
                  <p className={`text-xs mt-1 max-w-md mx-auto ${theme.muted}`}>
                    Switch to the &ldquo;Upload Credentials&rdquo; tab on the left panel to upload actual PDFs or images of your degrees, transcripts, and certificates.
                  </p>
                </div>
              ) : (
                DOCUMENT_CATEGORIES.map((cat) => {
                  const items = documents[cat.id];
                  if (!items || items.length === 0) return null;
                  const Icon = cat.icon;

                  return (
                    <div key={cat.id} className="space-y-4 animate-spring-in">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${theme.accent}`} />
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-80">
                          {cat.label}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {items.map((doc) => (
                          <div
                            key={doc.id}
                            onClick={() => setPreviewDoc(doc)}
                            className={`smooth-card group cursor-pointer rounded-2xl border ${theme.border} overflow-hidden bg-black/10 flex flex-col justify-between`}
                          >
                            {/* Visual Preview Header */}
                            <div className="relative h-44 w-full bg-black/25 overflow-hidden flex items-center justify-center">
                              {doc.isImage ? (
                                <img
                                  src={doc.dataUrl}
                                  alt={doc.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                  <div className={`p-4 rounded-2xl border ${theme.accentBg} mb-2 transition-transform duration-300 group-hover:scale-110`}>
                                    <FileText className="w-8 h-8" />
                                  </div>
                                  <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                                    Official PDF Document
                                  </span>
                                  <span className={`text-[11px] mt-0.5 ${theme.muted}`}>
                                    {doc.fileName}
                                  </span>
                                </div>
                              )}

                              {/* Hover Overlay */}
                              <div className="no-print absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                <span className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                                  <Eye className="w-3.5 h-3.5" />
                                  Inspect Document
                                </span>
                              </div>
                            </div>

                            {/* Credential Footer Info */}
                            <div className="p-4 flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${theme.accent}`} />
                                  <h4 className="text-sm font-bold truncate">{doc.title}</h4>
                                </div>
                                <p className={`text-xs mt-1 truncate ${theme.muted}`}>
                                  {doc.issuer}
                                </p>
                              </div>
                              <span className={`text-[11px] px-2.5 py-0.5 rounded-lg border shrink-0 ${theme.badge}`}>
                                {doc.year}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Lightbox Modal for Inspecting Uploaded Degrees/Transcripts */}
      {previewDoc && (
        <div
          onClick={() => setPreviewDoc(null)}
          className="no-print fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`animate-modal-pop w-full max-w-4xl rounded-3xl overflow-hidden border ${theme.border} ${theme.card} flex flex-col max-h-[90vh]`}
          >
            {/* Modal Top Bar */}
            <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between gap-4`}>
              <div className="min-w-0">
                <h3 className="text-base font-bold truncate">{previewDoc.title}</h3>
                <p className={`text-xs ${theme.muted}`}>
                  {previewDoc.issuer} • Issued {previewDoc.year} • {previewDoc.fileName} ({previewDoc.size})
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewDoc.dataUrl}
                  download={previewDoc.fileName}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs ${theme.button} transition-transform active:scale-95`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Original
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className={`p-2 rounded-xl border ${theme.border} hover:opacity-75 transition-opacity`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Document Viewer Body */}
            <div className="flex-1 bg-black/40 overflow-auto p-4 sm:p-6 flex items-center justify-center min-h-[420px]">
              {previewDoc.isImage ? (
                <img
                  src={previewDoc.dataUrl}
                  alt={previewDoc.title}
                  className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <iframe
                  src={previewDoc.dataUrl}
                  title={previewDoc.title}
                  className="w-full h-[72vh] rounded-xl border border-white/10 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}