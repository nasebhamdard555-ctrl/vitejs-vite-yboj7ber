import React, { useState, useRef } from 'react';

export default function FolioForgeStudio() {
  // --- STATE: Candidate Intake & Credentials ---
  const [candidate] = useState({
    fullName: 'NASEEB',
    fatherName: 'SABOOR',
    age: '25',
    location: 'KABUL',
    educationLevel: "Bachelor's Degree",
    educationBackground: 'MSC',
    targetVacancy: 'teaching',
    website: ''
  });

  const [documents] = useState({
    educational: '',
    experience: '',
    recommendation: ''
  });

  const [photoUrl] = useState('');
  const [theme, setTheme] = useState('obsidian'); // obsidian, brutalist, minimal, cyber

  // --- REFS for PDF and HTML Export ---
  const portfolioRef = useRef(null);

  const handleDownloadPDF = () => {
    window.print();
  };

  // --- THEME STYLES ---
  const getThemeStyles = () => {
    switch (theme) {
      case 'brutalist':
        return 'bg-white text-black border-4 border-black font-mono';
      case 'minimal':
        return 'bg-[#FAF8F5] text-gray-900 font-serif';
      case 'cyber':
        return 'bg-gray-900 text-green-400 font-mono border border-green-500';
      default:
        return 'bg-gray-900 text-white font-sans'; // Obsidian
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center">
      {/* Portfolio Container */}
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow border flex justify-between items-center no-print">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-bold text-gray-500">THEME:</span>
            <select
              className="p-1 border rounded text-sm text-gray-800 bg-white"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="obsidian">Kinetic Obsidian</option>
              <option value="brutalist">Swiss Brutalist</option>
              <option value="minimal">Editorial Minimal</option>
              <option value="cyber">Cyber Blueprint</option>
            </select>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="bg-gray-800 text-white px-4 py-2 rounded font-medium text-sm hover:bg-gray-900 transition-colors"
          >
            Download .PDF
          </button>
        </div>

        {/* Portfolio Canvas */}
        <div
          ref={portfolioRef}
          className={`p-10 rounded-xl shadow-2xl min-h-[800px] transition-all print-avoid-break ${getThemeStyles()}`}
        >
          <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-8 border-current border-opacity-20">
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-current"
                />
              )}
              <div>
                <h1 className="text-5xl font-bold mb-2 uppercase tracking-tighter">
                  {candidate.fullName}
                </h1>
                <h2 className="text-2xl opacity-80">
                  {candidate.targetVacancy
                    ? `Aligned for: ${candidate.targetVacancy}`
                    : candidate.educationLevel}
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
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4 opacity-50">
                Educational Background
              </h3>
              <div className="p-4 border rounded border-current border-opacity-20">
                <p className="font-medium">{candidate.educationLevel}</p>
                <p className="mt-2 opacity-80 whitespace-pre-wrap">
                  {candidate.educationBackground}
                </p>
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
                <h3 className="text-xl font-bold uppercase tracking-widest mb-4 opacity-50">
                  Experience Highlights
                </h3>
                <p className="opacity-80 text-sm whitespace-pre-wrap">
                  {documents.experience ||
                    'No experience documents ingested yet. AI will auto-extract key metrics here once provided.'}
                </p>
              </div>
              <div className="p-6 border rounded border-current border-opacity-20">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-4 opacity-50">
                  Recommendations
                </h3>
                <p className="opacity-80 text-sm italic whitespace-pre-wrap">
                  {documents.recommendation
                    ? `"${documents.recommendation}"`
                    : 'No recommendation letters provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS for Print Engine */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
        }
      `,
        }}
      />
    </div>
  );
}
