import React, { useState, useRef } from 'react';

export default function FolioForgeStudio() {
  // --- STATE: Candidate Intake & Credentials ---
  const [candidate, setCandidate] = useState({
    fullName: 'NASEEB',
    fatherName: 'SABOOR',
    age: '25',
    location: 'KABUL',
    educationLevel: 'Bachelor\'s Degree',
    educationBackground: 'MSC',
    targetVacancy: 'teaching',
    website: ''
  });

  const [documents, setDocuments] = useState({
    educational: '',
    experience: '',
    recommendation: ''
  });

  const [photoUrl, setPhotoUrl] = useState('');
  const [theme, setTheme] = useState('obsidian'); // obsidian, brutalist, minimal, cyber
  const [isGenerated, setIsGenerated] = useState(true);

  // --- REFS for PDF and HTML Export ---
  const portfolioRef = useRef(null);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidate(prev => ({ ...prev, [name]: value }));
  };

  const handleDocChange = (e) => {
    const { name, value } = e.target;
    setDocuments(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoUrl(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!candidate.fullName || !candidate.fatherName || !candidate.age || !candidate.location || !candidate.educationLevel) {
      alert("Please fill in all required fields (Name, Father's Name, Age, Location, Education Level).");
      return;
    }
    setIsGenerated(true);
  };

  const handleDownloadPDF = () => {
    window.print(); 
    // In a production environment, you would import jsPDF here:
    // const doc = new jsPDF('p', 'pt', 'a4');
    // doc.html(portfolioRef.current, { callback: function (doc) { doc.save('Portfolio.pdf'); } });
  };

  // --- THEME STYLES ---
  const getThemeStyles = () => {
    switch (theme) {
      case 'brutalist': return 'bg-white text-black border-4 border-black font-mono';
      case 'minimal': return 'bg-[#FAF8F5] text-gray-900 font-serif';
      case 'cyber': return 'bg-gray-900 text-green-400 font-mono border border-green-500';
      default: return 'bg-gray-900 text-white font-sans'; // Obsidian
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col md:flex-row gap-8">
      
      {/* LEFT PANEL: Builder Studio (Hidden when printing) */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-xl border border-gray-200 no-print flex flex-col gap-6 h-fit">
        <h2 className="text-2xl font-bold border-b pb-2">FolioForge Studio</h2>
        
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-700">1. Required Information</h3>
          <input className="p-2 border rounded" name="fullName" placeholder="Full Name *" onChange={handleInputChange} required />
          <input className="p-2 border rounded" name="fatherName" placeholder="Father's Name *" onChange={handleInputChange} required />
          <div className="flex gap-2">
            <input className="p-2 border rounded w-1/3" name="age" type="number" placeholder="Age *" onChange={handleInputChange} required />
            <input className="p-2 border rounded w-2/3" name="location" placeholder="Location *" onChange={handleInputChange} required />
          </div>
          <select className="p-2 border rounded" name="educationLevel" onChange={handleInputChange}>
            <option value="High School">High School</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
          <textarea className="p-2 border rounded" name="educationBackground" placeholder="Education Background Details *" onChange={handleInputChange} required />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-700">2. Target Role & Photo (Optional)</h3>
          <input className="p-2 border rounded" name="targetVacancy" placeholder="Target Vacancy (e.g., Senior Engineer)" onChange={handleInputChange} />
          <input className="p-2 border rounded" name="website" placeholder="Portfolio Link / Website" onChange={handleInputChange} />
          <label className="p-2 border rounded bg-gray-50 cursor-pointer text-center text-sm font-medium">
            Upload Profile Photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-700">3. Credentials & Alignment</h3>
          <textarea className="p-2 border rounded text-sm" name="educational" rows="2" placeholder="Paste Educational Documents/Transcripts..." onChange={handleDocChange} />
          <textarea className="p-2 border rounded text-sm" name="experience" rows="2" placeholder="Paste Experience Letters..." onChange={handleDocChange} />
          <textarea className="p-2 border rounded text-sm" name="recommendation" rows="2" placeholder="Paste Recommendation Letters..." onChange={handleDocChange} />
        </div>

        <button 
          onClick={handleGenerate}
          className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate AI Portfolio
        </button>
      </div>

      {/* RIGHT PANEL: Live Portfolio Preview */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow border flex justify-between items-center no-print">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-bold text-gray-500">THEME:</span>
            <select className="p-1 border rounded text-sm" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="obsidian">Kinetic Obsidian</option>
              <option value="brutalist">Swiss Brutalist</option>
              <option value="minimal">Editorial Minimal</option>
              <option value="cyber">Cyber Blueprint</option>
            </select>
          </div>
          <button onClick={handleDownloadPDF} className="bg-gray-800 text-white px-4 py-2 rounded font-medium text-sm">
            Download .PDF
          </button>
        </div>

        {/* Portfolio Canvas */}
        <div 
          ref={portfolioRef} 
          className={`p-10 rounded-xl shadow-2xl min-h-[800px] transition-all print-avoid-break ${getThemeStyles()}`}
        >
          {isGenerated ? (
            <div className="flex flex-col gap-8">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-8 border-current border-opacity-20">
                {photoUrl && (
                  <img src={photoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-current" />
                )}
                <div>
                  <h1 className="text-5xl font-bold mb-2 uppercase tracking-tighter">
                    {candidate.fullName}
                  </h1>
                  <h2 className="text-2xl opacity-80">
                    {candidate.targetVacancy ? `Aligned for: ${candidate.targetVacancy}` : candidate.educationLevel}
                  </h2>
                  <div className="mt-2 text-sm opacity-70 flex gap-4 flex-wrap">
                    <span>📍 {candidate.location}</span>
                    <span>👤 Age: {candidate.age}</span>
                    <span>👨‍👦 S/O: {candidate.fatherName}</span>
                    {candidate.website && <span>🌐 {candidate.website}</span>}
                  </div>
                </div>
              </div>

              {/* Education Matrix */}
              <div className="print-avoid-break">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-4 opacity-50">Educational Background</h3>
                <div className="p-4 border rounded border-current border-opacity-20">
                  <p className="font-medium">{candidate.educationLevel}</p>
                  <p className="mt-2 opacity-80 whitespace-pre-wrap">{candidate.educationBackground}</p>
                  {documents.educational && (
                    <div className="mt-4 pt-4 border-t border-current border-opacity-10 text-sm opacity-70">
                      <strong>Transcripts:</strong> {documents.educational}
                    </div>
                  )}
                </div>
              </div>

              {/* Extracted Experience & Recommendations */}
              <div className="grid md:grid-cols-2 gap-6 print-avoid-break">
                <div className="p-6 border rounded border-current border-opacity-20">
                   <h3 className="text-xl font-bold uppercase tracking-widest mb-4 opacity-50">Experience Highlights</h3>
                   <p className="opacity-80 text-sm whitespace-pre-wrap">
                     {documents.experience || "No experience documents ingested yet. AI will auto-extract key metrics here once provided."}
                   </p>
                </div>
                <div className="p-6 border rounded border-current border-opacity-20">
                   <h3 className="text-xl font-bold uppercase tracking-widest mb-4 opacity-50">Recommendations</h3>
                   <p className="opacity-80 text-sm italic whitespace-pre-wrap">
                     {documents.recommendation ? `"${documents.recommendation}"` : "No recommendation letters provided."}
                   </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center opacity-40">
              <div>
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                <p className="text-xl font-medium">Awaiting Candidate Data...</p>
                <p className="text-sm">Fill out the left panel and click Generate.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded CSS for Print Engine */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
        }
      `}} />
    </div>
  );
}
