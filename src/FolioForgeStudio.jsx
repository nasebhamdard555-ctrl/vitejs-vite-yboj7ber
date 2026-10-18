import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function FolioForgeStudio() {
  const [candidate, setCandidate] = useState({
    fullName: '', fatherName: '', age: '', location: '',
    educationLevel: "Bachelor's Degree", educationBackground: '',
    targetVacancy: '', website: ''
  });

  const [documents, setDocuments] = useState({ educational: '', experience: '', recommendation: '' });
  const [photoUrl, setPhotoUrl] = useState('');
  const [theme, setTheme] = useState('blueprint'); 
  const [isGenerating, setIsGenerating] = useState(false);

  const portfolioRef = useRef(null);
  const canvasRef = useRef(null);

  const handleInputChange = (e) => setCandidate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDocChange = (e) => setDocuments((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoUrl(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);
    
    const seed = candidate.fullName.length || 5;
    const nodeCount = 10 + (seed % 15);
    
    const colors = {
      blueprint: { stroke: 'rgba(100, 255, 218, 0.15)', dot: 'rgba(100, 255, 218, 0.4)' },
      brutalist: { stroke: 'rgba(0, 0, 0, 0.06)', dot: 'rgba(0, 0, 0, 0.1)' },
      minimal:   { stroke: 'rgba(120, 113, 108, 0.08)', dot: 'rgba(120, 113, 108, 0.15)' },
      obsidian:  { stroke: 'rgba(255, 255, 255, 0.06)', dot: 'rgba(255, 255, 255, 0.1)' }
    };
    const c = colors[theme] || colors.obsidian;

    ctx.strokeStyle = c.stroke;
    ctx.lineWidth = 1;
    const step = 50;
    for (let x = 0; x <= width; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y <= height; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({ x: Math.random() * width, y: Math.random() * height, r: 2 + (Math.random() * 3) });
    }
    nodes.forEach((node, i) => {
      ctx.beginPath(); ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2); ctx.fillStyle = c.dot; ctx.fill();
      nodes.slice(i + 1).forEach(other => {
        if (Math.hypot(node.x - other.x, node.y - other.y) < 120) {
          ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y); ctx.stroke();
        }
      });
    });
  }, [theme, candidate.fullName]);

  const handleDownloadPDF = async () => {
    if (!portfolioRef.current) return;
    setIsGenerating(true);
    try {
      const bgColors = { blueprint: '#0b1329', minimal: '#FAF8F5', brutalist: '#ffffff', obsidian: '#111827' };
      const canvas = await html2canvas(portfolioRef.current, {
        scale: 2, useCORS: true, backgroundColor: bgColors[theme] || '#111827',
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(canvas.toDataURL('image/png'));
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, imgHeight);
      const fileName = candidate.fullName ? `${candidate.fullName.replace(/\s+/g, '_')}_Portfolio.pdf` : 'Portfolio.pdf';
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'brutalist': return 'bg-white text-black border-4 border-black font-mono';
      case 'minimal': return 'bg-[#FAF8F5] text-gray-900 font-serif';
      case 'blueprint': return 'bg-[#0b1329] text-[#64ffda] font-mono border border-[#00a8ff]/30';
      default: return 'bg-gray-900 text-gray-100 font-sans border border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 md:p-8 flex flex-col lg:flex-row gap-6 transition-colors duration-500">
      <div className="w-full lg:w-[35%] bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-800 flex flex-col gap-5 h-fit text-white overflow-y-auto max-h-[90vh] lg:sticky lg:top-8">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <div className="w-8 h-8 rounded-lg bg-[#00a8ff] flex items-center justify-center text-lg font-bold text-white">F</div>
          <h2 className="text-xl font-bold tracking-tight">FolioForge Studio</h2>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">1. Required Information</h3>
          <input className="p-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none transition-all" name="fullName" placeholder="Full Name *" value={candidate.fullName} onChange={handleInputChange} />
          <input className="p-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none transition-all" name="fatherName" placeholder="Father's Name *" value={candidate.fatherName} onChange={handleInputChange} />
          <div className="flex gap-2">
            <input className="p-3 rounded-lg w-1/3 bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none" name="age" type="number" placeholder="Age *" value={candidate.age} onChange={handleInputChange} />
            <input className="p-3 rounded-lg w-2/3 bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none" name="location" placeholder="Location *" value={candidate.location} onChange={handleInputChange} />
          </div>
          <select className="p-3 rounded-lg bg-gray-950 border border-gray-700 text-white focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none" name="educationLevel" value={candidate.educationLevel} onChange={handleInputChange}>
            <option value="High School">High School</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
          <textarea className="p-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none resize-none" name="educationBackground" placeholder="Education Background Details *" value={candidate.educationBackground} onChange={handleInputChange} rows="3" />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">2. Target Role & Photo</h3>
          <input className="p-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none transition-all" name="targetVacancy" placeholder="Target Vacancy" value={candidate.targetVacancy} onChange={handleInputChange} />
          <input className="p-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none transition-all" name="website" placeholder="Portfolio Link / Website" value={candidate.website} onChange={handleInputChange} />
          <label className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all cursor-pointer text-center text-sm font-medium text-white">
            {photoUrl ? '✅ Photo Uploaded (Tap to Change)' : '📷 Upload Profile Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">3. Credentials & Alignment</h3>
          <textarea className="p-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none resize-none text-sm" name="educational" rows="2" placeholder="Paste Educational Documents/Transcripts..." value={documents.educational} onChange={handleDocChange} />
          <textarea className="p-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none resize-none text-sm" name="experience" rows="2" placeholder="Paste Experience Letters..." value={documents.experience} onChange={handleDocChange} />
          <textarea className="p-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none resize-none text-sm" name="recommendation" rows="2" placeholder="Paste Recommendation Letters..." value={documents.recommendation} onChange={handleDocChange} />
        </div>
      </div>

      <div className="w-full lg:w-[65%] flex flex-col gap-4">
        <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-white">
          <div className="flex gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Theme:</span>
            <select className="p-2 rounded-lg bg-gray-950 border border-gray-700 text-sm text-white focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="obsidian">Kinetic Obsidian</option>
              <option value="brutalist">Swiss Brutalist</option>
              <option value="minimal">Editorial Minimal</option>
              <option value="blueprint">Cyber Blueprint</option>
            </select>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${isGenerating ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-[#00a8ff] hover:bg-[#0097e6] text-white'}`}
          >
            {isGenerating ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Generating...</>
            ) : '⬇️ Download .PDF'}
          </button>
        </div>

        <div className="flex justify-center bg-gray-950/50 p-4 rounded-2xl border border-gray-800/50">
          <div
            ref={portfolioRef}
            className={`relative w-full max-w-3xl p-8 md:p-12 rounded-xl shadow-2xl min-h-[800px] transition-all duration-500 overflow-hidden ${getThemeStyles()}`}
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-8 border-current/20">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-current/30 shadow-lg bg-gray-700" />
                ) : (
                  <div className="w-28 h-28 rounded-full border-4 border-current/20 flex items-center justify-center text-4xl opacity-30">👤</div>
                )}
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 uppercase tracking-tight">
                    {candidate.fullName || 'Candidate Name'}
                  </h1>
                  <h2 className="text-lg md:text-xl opacity-80 font-medium">
                    {candidate.targetVacancy ? `Aligned for: ${candidate.targetVacancy}` : candidate.educationLevel}
                  </h2>
                  <div className="mt-3 text-sm opacity-70 flex gap-4 flex-wrap justify-center md:justify-start">
                    {candidate.location && <span>📍 {candidate.location}</span>}
                    {candidate.age && <span>👤 Age: {candidate.age}</span>}
                    {candidate.fatherName && <span>👨‍👦 S/O: {candidate.fatherName}</span>}
                    {candidate.website && <span>🌐 {candidate.website}</span>}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-3 opacity-60">Educational Documents</h3>
                <div className="p-5 rounded-xl border border-current/20 bg-black/10 backdrop-blur-sm">
                  <p className="font-semibold text-lg">{candidate.educationLevel}</p>
                  <p className="mt-2 opacity-85 whitespace-pre-wrap leading-relaxed text-sm">
                    {candidate.educationBackground || 'Educational background details will appear here.'}
                  </p>
                  {documents.educational && (
                    <div className="mt-4 pt-3 border-t border-current/10 text-xs opacity-80">
                      <strong>Transcripts:</strong> {documents.educational}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-current/20 bg-black/10 backdrop-blur-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-3 opacity-60">Experience Letters</h3>
                  <p className="opacity-80 text-sm whitespace-pre-wrap leading-relaxed">
                    {documents.experience || 'No experience documents added yet.'}
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-current/20 bg-black/10 backdrop-blur-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-3 opacity-60">Recommendation Letters</h3>
                  <p className="opacity-80 text-sm italic whitespace-pre-wrap leading-relaxed">
                    {documents.recommendation ? `"${documents.recommendation}"` : 'No recommendation letters provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}