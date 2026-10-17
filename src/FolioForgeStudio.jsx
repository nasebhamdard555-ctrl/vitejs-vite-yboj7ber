import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function FolioForgeStudio() {
  // --- STATE: Candidate Intake & Credentials ---
  const [candidate, setCandidate] = useState({
    fullName: '',
    fatherName: '',
    age: '',
    location: '',
    educationLevel: "Bachelor's Degree",
    educationBackground: '',
    targetVacancy: '',
    website: ''
  });

  const [documents, setDocuments] = useState({
    educational: '',
    experience: '',
    recommendation: ''
  });

  const [photoUrl, setPhotoUrl] = useState('');
  const [theme, setTheme] = useState('blueprint'); 
  const [isGenerating, setIsGenerating] = useState(false);

  // --- REFS ---
  const portfolioRef = useRef(null);
  const canvasRef = useRef(null);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidate((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocChange = (e) => {
    const { name, value } = e.target;
    setDocuments((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoUrl(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // --- CANVAS API: Procedural Graphics Generator ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Set canvas resolution to match display size for crisp rendering
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Procedural seed based on name length (makes each portfolio unique)
    const seed = candidate.fullName.length || 5;
    const nodeCount = 10 + (seed % 15);
    
    // Theme-based colors
    const isBlueprint = theme === 'blueprint';
    const isBrutalist = theme === 'brutalist';
    const strokeColor = isBlueprint ? 'rgba(100, 255, 218, 0.15)' : 
                        isBrutalist ? 'rgba(0, 0, 0, 0.06)' : 
                        'rgba(255, 255, 255, 0.06)';
    const dotColor = isBlueprint ? 'rgba(100, 255, 218, 0.4)' : 
                     isBrutalist ? 'rgba(0, 0, 0, 0.1)' : 
                     'rgba(255, 255, 255, 0.1)';

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;

    // Draw procedural geometric grid
    const step = 50;
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw procedural connecting nodes
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 2 + (Math.random() * 3)
      });
    }

    nodes.forEach((node, i) => {
      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      // Connect to nearby nodes
      nodes.slice(i + 1).forEach(otherNode => {
        const dist = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(otherNode.x, otherNode.y);
          ctx.stroke();
        }
      });
    });
  }, [theme, candidate.fullName]);

  // --- JSPDF: Professional PDF Compilation ---
  const handleDownloadPDF = async () => {
    if (!portfolioRef.current) return;
    setIsGenerating(true);

    try {
      // 1. Capture the DOM element as a high-res canvas
      const canvas = await html2canvas(portfolioRef.current, {
        scale: 2, // Higher resolution for crisp text/images
        useCORS: true, // Allow loading cross-origin images (like uploaded photos)
        backgroundColor: theme === 'blueprint' ? '#0b1329' : 
                         theme === 'minimal' ? '#FAF8F5' : 
                         theme === 'brutalist' ? '#ffffff' : '#111827',
      });

      // 2. Initialize jsPDF (A4 portrait)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // 3. Calculate scaling to fit A4 width while maintaining aspect ratio
      const imgProps = pdf.getImageProperties(canvas.toDataURL('image/png'));
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // 4. Add image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, imgHeight);
      
      // 5. Save the file
      const fileName = candidate.fullName ? `${candidate.fullName.replace(/\s+/g, '_')}_Portfolio.pdf` : 'Portfolio.pdf';
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please ensure all images are valid and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- THEME STYLES ---
  const getThemeStyles = () => {
    switch (theme) {
      case 'brutalist':
        return 'bg-white text-black border-4 border-black font-mono';
      case 'minimal':
        return 'bg-[#FAF8F5] text-gray-900 font-serif';
      case 'blueprint':
        return 'bg-[#0b1329] text-[#64ffda] font-mono border border-[#00a8ff]';
      default:
        return 'bg-gray-900 text-white font-sans'; // Obsidian
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 flex flex-col lg:flex-row gap-8 transition-colors duration-500 ${theme === 'blueprint' ? 'bg-[#0b1329]' : 'bg-gray-900'}`}>
      
      {/* LEFT PANEL: Builder Studio (Hidden when printing) */}
      <div className="w-full lg:w-1/3 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 no-print flex flex-col gap-6 h-fit text-white overflow-y-auto max-h-[95vh]">
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">FolioForge Studio</h2>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-400">1. Required Information</h3>
          <input className="p-2 border rounded bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="fullName" placeholder="Full Name *" value={candidate.fullName} onChange={handleInputChange} required />
          <input className="p-2 border rounded bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="fatherName" placeholder="Father's Name *" value={candidate.fatherName} onChange={handleInputChange} required />
          <div className="flex gap-2">
            <input className="p-2 border rounded w-1/3 bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="age" type="number" placeholder="Age *" value={candidate.age} onChange={handleInputChange} required />
            <input className="p-2 border rounded w-2/3 bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="location" placeholder="Location *" value={candidate.location} onChange={handleInputChange} required />
          </div>
          <select className="p-2 border rounded bg-gray-950 border-gray-700 text-white focus:border-[#00a8ff] focus:outline-none" name="educationLevel" value={candidate.educationLevel} onChange={handleInputChange}>
            <option value="High School">High School</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
          <textarea className="p-2 border rounded bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="educationBackground" placeholder="Education Background Details *" value={candidate.educationBackground} onChange={handleInputChange} rows="3" required />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-400">2. Target Role & Photo (Optional)</h3>
          <input className="p-2 border rounded bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="targetVacancy" placeholder="Target Vacancy" value={candidate.targetVacancy} onChange={handleInputChange} />
          <input className="p-2 border rounded bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="website" placeholder="Portfolio Link / Website" value={candidate.website} onChange={handleInputChange} />
          <label className="p-2 border rounded bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer text-center text-sm font-medium text-white">
            {photoUrl ? 'Change Profile Photo' : 'Upload Profile Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-400">3. Credentials & Alignment</h3>
          <textarea className="p-2 border rounded text-sm bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="educational" rows="2" placeholder="Paste Educational Documents/Transcripts..." value={documents.educational} onChange={handleDocChange} />
          <textarea className="p-2 border rounded text-sm bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="experience" rows="2" placeholder="Paste Experience Letters..." value={documents.experience} onChange={handleDocChange} />
          <textarea className="p-2 border rounded text-sm bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-[#00a8ff] focus:outline-none" name="recommendation" rows="2" placeholder="Paste Recommendation Letters..." value={documents.recommendation} onChange={handleDocChange} />
        </div>
      </div>

      {/* RIGHT PANEL: Live Portfolio Preview */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="bg-gray-800 p-4 rounded-xl shadow border border-gray-700 flex justify-between items-center no-print text-white">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-bold text-gray-400">THEME:</span>
            <select className="p-1 border rounded text-sm bg-gray-950 border-gray-700 text-white focus:border-[#00a8ff] focus:outline-none" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="obsidian">Kinetic Obsidian</option>
              <option value="brutalist">Swiss Brutalist</option>
              <option value="minimal">Editorial Minimal</option>
              <option value="blueprint">Cyber Blueprint</option>
            </select>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`px-4 py-2 rounded font-medium text-sm transition-colors flex items-center gap-2 ${isGenerating ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#00a8ff] hover:bg-[#0097e6]'} text-white`}
          >
            {isGenerating ? 'Generating...' : 'Download .PDF'}
          </button>
        </div>

        {/* Portfolio Canvas (The part that gets exported) */}
        <div
          ref={portfolioRef}
          className={`relative p-8 md:p-12 rounded-xl shadow-2xl min-h-[800px] transition-all duration-500 print-avoid-break overflow-hidden ${getThemeStyles()}`}
        >
          {/* PROCEDURAL CANVAS BACKGROUND */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          />

          {/* CONTENT (z-10 to sit above the canvas) */}
          <div className="relative z-10 flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-8 border-current border-opacity-20">
              {photoUrl && (
                <img src={photoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-current shadow-md bg-gray-700" />
              )}
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 uppercase tracking-tight">
                  {candidate.fullName || 'Candidate Name'}
                </h1>
                <h2 className="text-xl md:text-2xl opacity-80 font-medium">
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

            {/* Education Matrix */}
            <div className="print-avoid-break">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-3 opacity-60">Educational Documents</h3>
              <div className="p-4 border rounded border-current border-opacity-20 bg-black/10 backdrop-blur-sm">
                <p className="font-semibold text-lg">{candidate.educationLevel}</p>
                <p className="mt-2 opacity-85 whitespace-pre-wrap leading-relaxed">
                  {candidate.educationBackground || 'Educational background details will appear here.'}
                </p>
                {documents.educational && (
                  <div className="mt-4 pt-4 border-t border-current border-opacity-10 text-sm opacity-80">
                    <strong>Transcripts:</strong> {documents.educational}
                  </div>
                )}
              </div>
            </div>

            {/* Experience Letters & Recommendations */}
            <div className="grid md:grid-cols-2 gap-6 print-avoid-break">
              <div className="p-5 border rounded border-current border-opacity-20 bg-black/10 backdrop-blur-sm">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-3 opacity-60">Experience Letters</h3>
                <p className="opacity-80 text-sm whitespace-pre-wrap leading-relaxed">
                  {documents.experience || 'No experience documents added yet. Input metrics or letters in the studio panel to display here.'}
                </p>
              </div>
              <div className="p-5 border rounded border-current border-opacity-20 bg-black/10 backdrop-blur-sm">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-3 opacity-60">Recommendation Letters</h3>
                <p className="opacity-80 text-sm italic whitespace-pre-wrap leading-relaxed">
                  {documents.recommendation ? `"${documents.recommendation}"` : 'No recommendation letters provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS for Print Engine Fallback */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
        }
      `}} />
    </div>
  );
}