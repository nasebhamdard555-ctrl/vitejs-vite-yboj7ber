import React, { useState, useRef } from 'react';

export default function FolioForgeStudio() {
  // --- STATE: Candidate Intake & Credentials ---
  const [candidate, setCandidate] = useState({
    fullName: 'ELENA ROSTOVA',
    fatherName: 'VIKTOR ROSTOV',
    age: '28',
    location: 'ZURICH',
    educationLevel: "Master's Degree (M.Sc / M.A / MBA)",
    educationBackground: 'M.Sc. in Computational Design & AI Systems, ETH Zurich (GPA 3.92/4.0). B.Sc. in Computer Science & Engineering. Dean\'s Honor List.',
    targetVacancy: 'Principal Product Architect & AI Systems Lead',
    website: 'https://rostova-systems.dev'
  });

  const [documents, setDocuments] = useState({
    educational: 'M.Sc. in Computational Design & AI Systems, ETH Zurich (GPA 3.92/4.0). B.Sc. in Computer Science & Engineering. Dean\'s Honor List.',
    experience: 'Principal Systems Architect at Helvetia Neural Labs (2022-Present): Led 28 engineers, launched AetherFlow Neural Studio (80k+ users, 99.98% uptime). Senior Staff Engineer at Vanguard Spatial (2019-2022): Reduced latency by...',
    recommendation: 'Recommended by Dr. Marcus Vance (VP of Engineering): "Top 0.1% systems architect combining mathematical rigor with extraordinary visual polish and executive delivery."'
  });

  const [photoUrl, setPhotoUrl] = useState('');
  const [theme, setTheme] = useState('blueprint'); // obsidian, brutalist, minimal, blueprint

  // --- REFS for PDF and HTML Export ---
  const portfolioRef = useRef(null);

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
      case 'blueprint':
        return 'bg-[#0b1329] text-[#64ffda] font-mono border border-[#00a8ff]';
      default:
        return 'bg-gray-900 text-white font-sans'; // Obsidian
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* LEFT PANEL: Builder Studio (Hidden when printing) */}
      <div className="w-full lg:w-1/3 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 no-print flex flex-col gap-6 h-fit text-white">
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">FolioForge Studio</h2>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-400">1. Required Information</h3>
          <input
            className="p-2 border rounded bg-gray-950 border-gray-700 text-white"
            name="fullName"
            placeholder="Full Name *"
            value={candidate.fullName}
            onChange={handleInputChange}
            required
          />
          <input
            className="p-2 border rounded bg-gray-950 border-gray-700 text-white"
            name="fatherName"
            placeholder="Father's Name *"
            value={candidate.fatherName}
            onChange={handleInputChange}
            required
          />
          <div className="flex gap-2">
            <input
              className="p-2 border rounded w-1/3 bg-gray-950 border-gray-700 text-white"
              name="age"
              type="number"
              placeholder="Age *"
              value={candidate.age}
              onChange={handleInputChange}
              required
            />
            <input
              className="p-2 border rounded w-2/3 bg-gray-950 border-gray-700 text-white"
              name="location"
              placeholder="Location *"
              value={candidate.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <select
            className="p-2 border rounded bg-gray-950 border-gray-700 text-white"
            name="educationLevel"
            value={candidate.educationLevel}
            onChange={handleInputChange}
          >
            <option value="High School">High School</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree (M.Sc / M.A / MBA)">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
          <textarea
            className="p-2 border rounded bg-gray-950 border-gray-700 text-white"
            name="educationBackground"
            placeholder="Education Background Details *"
            value={candidate.educationBackground}
            onChange={handleInputChange}
            rows="3"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-400">2. Target Role & Photo (Optional)</h3>
          <input
            className="p-2 border rounded bg-gray-950 border-gray-700 text-white"
            name="targetVacancy"
            placeholder="Target Vacancy (e.g., Software Engineer)"
            value={candidate.targetVacancy}
            onChange={handleInputChange}
          />
          <input
            className="p-2 border rounded bg-gray-950 border-gray-700 text-white"
            name="website"
            placeholder="Portfolio Link / Website"
            value={candidate.website}
            onChange={handleInputChange}
          />
          <label className="p-2 border rounded bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer text-center text-sm font-medium text-white">
            {photoUrl ? 'Change Profile Photo' : 'Upload Profile Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-400">3. Credentials & Alignment</h3>
          <textarea
            className="p-2 border rounded text-sm bg-gray-950 border-gray-700 text-white"
            name="educational"
            rows="2"
            placeholder="Paste Educational Documents/Transcripts..."
            value={documents.educational}
            onChange={handleDocChange}
          />
          <textarea
            className="p-2 border rounded text-sm bg-gray-950 border-gray-700 text-white"
            name="experience"
            rows="2"
            placeholder="Paste Experience Letters..."
            value={documents.experience}
            onChange={handleDocChange}
          />
          <textarea
            className="p-2 border rounded text-sm bg-gray-950 border-gray-700 text-white"
            name="recommendation"
            rows="2"
            placeholder="Paste Recommendation Letters..."
            value={documents.recommendation}
            onChange={handleDocChange}
          />
        </div>
      </div>

      {/* RIGHT PANEL: Live Portfolio Preview */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="bg-gray-800 p-4 rounded-xl shadow border border-gray-700 flex justify-between items-center no-print text-white">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-bold text-gray-400">THEME:</span>
            <select
              className="p-1 border rounded text-sm bg-gray-950 border-gray-700 text-white"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="obsidian">Kinetic Obsidian</option>
              <option value="brutalist">Swiss Brutalist</option>
              <option value="minimal">Editorial Minimal</option>
              <option value="blueprint">Cyber Blueprint</option>
            </select>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="bg-[#00a8ff] text-white px-4 py-2 rounded font-medium text-sm hover:bg-[#0097e6] transition-colors"
          >
            Download .PDF
          </button>
        </div>

        {/* Portfolio Canvas */}
        <div
          ref={portfolioRef}
          className={`p-8 md:p-10 rounded-xl shadow-2xl min-h-[700px] transition-all print-avoid-break ${getThemeStyles()}`}
        >
          <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-8 border-[#00a8ff] border-opacity-20">
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#00a8ff] shadow-md"
                />
              )}
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 uppercase tracking-tight">
                  {candidate.fullName}
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
              <h3 className="text-lg font-bold uppercase tracking-widest mb-3 opacity-60">
                Educational Documents
              </h3>
              <div className="p-4 border rounded border-[#00a8ff] border-opacity-20 bg-black/10">
                <p className="font-semibold text-lg">{candidate.educationLevel}</p>
                <p className="mt-2 opacity-85 whitespace-pre-wrap leading-relaxed">
                  {candidate.educationBackground}
                </p>
                {documents.educational && (
                  <div className="mt-4 pt-4 border-t border-[#00a8ff] border-opacity-10 text-sm opacity-80">
                    <strong>Transcripts:</strong> {documents.educational}
                  </div>
                )}
              </div>
            </div>

            {/* Experience Letters & Recommendations */}
            <div className="grid md:grid-cols-2 gap-6 print-avoid-break">
              <div className="p-5 border rounded border-[#00a8ff] border-opacity-20 bg-black/10">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-3 opacity-60">
                  Experience Letters
                </h3>
                <p className="opacity-80 text-sm whitespace-pre-wrap leading-relaxed">
                  {documents.experience}
                </p>
              </div>
              <div className="p-5 border rounded border-[#00a8ff] border-opacity-20 bg-black/10">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-3 opacity-60">
                  Recommendation Letters
                </h3>
                <p className="opacity-80 text-sm italic whitespace-pre-wrap leading-relaxed">
                  {documents.recommendation}
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
