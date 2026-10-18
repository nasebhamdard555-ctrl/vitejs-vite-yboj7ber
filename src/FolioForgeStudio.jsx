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

  // --- CANVAS API: Procedural Background ---
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
