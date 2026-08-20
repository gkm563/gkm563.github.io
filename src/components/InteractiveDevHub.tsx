import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Cpu, Zap, Activity, Sparkles, Code2, 
  Layers, CheckCircle2, Copy, Check, Play, CornerDownLeft, 
  ExternalLink, Github, Database, Radio, Server, Shield, BrainCircuit,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArchNode {
  id: string;
  name: string;
  type: 'client' | 'network' | 'ai' | 'vector' | 'storage' | 'security';
  description: string;
  latency?: string;
  specs: string;
}

interface ProjectArch {
  id: string;
  title: string;
  badge: string;
  category: string;
  summary: string;
  nodes: ArchNode[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const ARCHITECTURES: ProjectArch[] = [
  {
    id: 'voxrag',
    title: 'VoxRAG — Sub-200ms Voice-Enabled Conversational RAG',
    badge: 'Flagship AI Architecture',
    category: 'Agentic AI / Voice RAG',
    summary: 'Ultra-low-latency voice conversational AI pipeline with multi-turn memory, FastEmbed 384-d vector embeddings, and real-time FAISS FlatIP grounding verification.',
    techStack: ['Python', 'FastEmbed', 'FAISS FlatIP', 'WebSockets', 'ElevenLabs Streaming', 'Whisper VAD'],
    githubUrl: 'https://github.com/gkm563/VoxRAG',
    nodes: [
      { id: 'n1', name: '16kHz PCM Audio Capture', type: 'client', description: 'Real-time client microphone capture with client-side VAD silence gating', latency: '15ms', specs: 'Web Audio API / PCM 16-bit' },
      { id: 'n2', name: 'Bi-Directional WebSocket Stream', type: 'network', description: 'Duplex streaming protocol transmitting binary audio chunks with backpressure handling', latency: '22ms', specs: 'Async WebSockets / Binary Frame' },
      { id: 'n3', name: 'Silero VAD & Fast Whisper STT', type: 'ai', description: 'Edge voice activity segmentation and sub-second speech-to-text token transcription', latency: '48ms', specs: 'Whisper-base.en / ONNX Runtime' },
      { id: 'n4', name: 'FastEmbed Tensor Encoding', type: 'vector', description: 'Dense query vectorization generating 384-dimensional normalized latent embeddings', latency: '12ms', specs: 'BAAI/bge-small-en-v1.5 / 384-dim' },
      { id: 'n5', name: 'FAISS FlatIP Similarity Index', type: 'vector', description: 'Exhaustive inner product vector search across 48,995 document passage chunks', latency: '8ms', specs: 'FAISS FlatIP (Inner Product) / Top-K=5' },
      { id: 'n6', name: 'Grounding Verification & LLM Core', type: 'ai', description: 'Multi-turn conversational context assembly with hallucination suppression guardrails', latency: '65ms TTFT', specs: 'Llama-3 / Groq / OpenAI LLM' },
      { id: 'n7', name: 'Streaming TTS Audio Buffer', type: 'client', description: 'Chunked audio synthesis stream played directly to speaker before full text completion', latency: '20ms', specs: 'ElevenLabs Streaming TTS / Opus' },
    ]
  },
  {
    id: 'intervai',
    title: 'IntervAI — Dynamic AI Mock Interview Simulator',
    badge: 'EdTech AI Platform',
    category: 'Full-Stack AI',
    summary: 'Full-stack automated technical mock interview platform with live AST code execution, voice prompt evaluation, and multidimensional feedback rubrics.',
    techStack: ['TypeScript', 'Next.js', 'React', 'Web Speech API', 'Monaco Editor', 'Node.js'],
    githubUrl: 'https://github.com/gkm563/IntervAI',
    nodes: [
      { id: 'i1', name: 'Monaco Code & Audio Input', type: 'client', description: 'Interactive browser IDE with syntax highlighting and simultaneous voice recording', latency: 'Real-time', specs: 'Monaco Editor / MediaRecorder' },
      { id: 'i2', name: 'AST Syntax & Complexity Parser', type: 'ai', description: 'Abstract syntax tree parsing for Big-O time and space complexity heuristic check', latency: '35ms', specs: 'Babel AST / Heuristic Analyzer' },
      { id: 'i3', name: 'Sandboxed Code Runner Engine', type: 'storage', description: 'Isolated execution container testing algorithmic edge cases against hidden test suites', latency: '90ms', specs: 'Docker Sandboxed Runner / Node VM' },
      { id: 'i4', name: 'Multi-Criteria Grading Agent', type: 'ai', description: 'Evaluates problem-solving logic, communication clarity, and code correctness', latency: '120ms', specs: 'GPT-4o / Claude 3.5 Sonnet Rubrics' },
      { id: 'i5', name: 'Dynamic Follow-up Questioner', type: 'ai', description: 'Generates progressive follow-up interview questions tailored to candidate mistakes', latency: '80ms', specs: 'Adaptive Interview Graph / Next.js' }
    ]
  },
  {
    id: 'prayagrajrooms',
    title: 'PrayagrajRooms — Hyper-Local Verified Student Housing',
    badge: 'PropTech Startup Platform',
    category: 'Full-Stack Web',
    summary: 'PropTech platform built to eliminate predatory broker fees for 5,000+ university students in Prayagraj with verified geo-listings and direct owner connectivity.',
    techStack: ['React', 'TypeScript', 'Firebase Firestore', 'Node.js', 'Tailwind CSS'],
    liveUrl: 'https://prayagrajrooms.in',
    githubUrl: 'https://github.com/gkm563/PrayagrajRooms',
    nodes: [
      { id: 'p1', name: 'Student Search & Filter Client', type: 'client', description: 'High-performance responsive search UI with budget sliders, distance radius, and amenities', latency: '10ms', specs: 'React 18 / Tailwind CSS / PWA' },
      { id: 'p2', name: 'Geo-Proximity Spatial Indexing', type: 'storage', description: 'Location querying indexing rooms near MNNIT, UIT, UGI, and Allahabad University', latency: '25ms', specs: 'Firestore GeoPoint / GeoHash Queries' },
      { id: 'p3', name: 'Owner Verification Gatekeeper', type: 'security', description: 'Manual and automated credential check to prevent deceptive broker listings', latency: 'Async', specs: 'Admin Verification Portal' },
      { id: 'p4', name: 'WhatsApp Direct Connect Engine', type: 'network', description: 'Instant click-to-chat settlement with pre-populated room ID and verified status tokens', latency: 'Instant', specs: 'WhatsApp Cloud API / Deep Links' }
    ]
  },
  {
    id: 'nhai',
    title: 'NHAI Offline Biometric Face Recognition & Liveness System',
    badge: 'Government AI & Edge ML',
    category: 'Computer Vision / Edge ML',
    summary: 'Offline edge facial recognition and anti-spoofing liveness detection system engineered for NHAI highway toll operations without continuous cloud connectivity.',
    techStack: ['Python', 'OpenCV', 'FaceNet', 'YOLOv8', 'SQLite Edge', 'Edge ML'],
    githubUrl: 'https://github.com/gkm563/NHAI-offline-biometrics',
    nodes: [
      { id: 'b1', name: 'CCTV RTSP Video Ingestion', type: 'client', description: 'Multi-threaded RTSP frame capture buffer with auto-reconnect and frame-drop prevention', latency: '12ms', specs: 'OpenCV C++ backend / 30 FPS' },
      { id: 'b2', name: 'YOLOv8-Face Detection Engine', type: 'ai', description: 'Ultra-fast single-shot bounding box detector localizing faces in diverse illumination', latency: '18ms', specs: 'YOLOv8-Face TensorRT / FP16' },
      { id: 'b3', name: 'Texture & Micro-Motion Liveness AI', type: 'security', description: 'Frequency-domain anti-spoofing model preventing photo, screen, or mask spoof attacks', latency: '22ms', specs: 'MiniVision Anti-Spoofing / PyTorch' },
      { id: 'b4', name: 'FaceNet 512-D Latent Matching', type: 'vector', description: 'Metric learning embedding matching query face against local authorized personnel database', latency: '14ms', specs: 'Inception-ResNet-v1 / Euclidean < 0.6' },
      { id: 'b5', name: 'Offline SQLite Local WAL Sync', type: 'storage', description: 'Write-Ahead-Log database recording entry events with eventual background cloud sync', latency: '4ms', specs: 'SQLite WAL Mode / Encrypted DB' }
    ]
  }
];

export const InteractiveDevHub: React.FC = () => {
  const [selectedArchId, setSelectedArchId] = useState<string>('voxrag');
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [activeTab, setActiveTab] = useState<'architecture' | 'terminal'>('architecture');
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: React.ReactNode; isError?: boolean }>>([
    {
      cmd: 'init portfolio --dev',
      output: (
        <div className="space-y-1">
          <p className="text-emerald-400 font-bold">✨ Gautam Kumar Maurya (gkm563) — Interactive React + TypeScript Architecture Engine v2.4.0</p>
          <p className="text-slate-400 text-xs">Type <span className="text-blue-400 font-mono font-bold">help</span> to view available interactive CLI commands.</p>
        </div>
      )
    }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const currentArch = ARCHITECTURES.find(a => a.id === selectedArchId) || ARCHITECTURES[0];

  useEffect(() => {
    if (currentArch && currentArch.nodes.length > 0) {
      setSelectedNode(currentArch.nodes[0]);
    }
  }, [selectedArchId]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#38bdf8', '#a855f7', '#10b981', '#f59e0b']
    });
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const lowerCmd = cmd.toLowerCase();
    let response: React.ReactNode = null;
    let isError = false;

    switch (lowerCmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-xs">
            <p className="text-blue-400 font-bold">Available Interactive Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-300">
              <div><span className="text-emerald-400 font-mono">whoami</span> — Profile & credentials</div>
              <div><span className="text-emerald-400 font-mono">skills</span> — Full stack & AI skills matrix</div>
              <div><span className="text-emerald-400 font-mono">projects</span> — Flagship production projects</div>
              <div><span className="text-emerald-400 font-mono">awards</span> — Academic & government honors</div>
              <div><span className="text-emerald-400 font-mono">arch voxrag</span> — Inspect VoxRAG live specs</div>
              <div><span className="text-emerald-400 font-mono">confetti</span> — Trigger celebratory fireworks</div>
              <div><span className="text-emerald-400 font-mono">contact</span> — Reach Gautam directly</div>
              <div><span className="text-emerald-400 font-mono">clear</span> — Reset terminal output</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        response = (
          <div className="text-xs space-y-1 font-mono text-slate-300">
            <p><span className="text-blue-400 font-bold">Name:</span> Gautam Kumar Maurya (gkm563)</p>
            <p><span className="text-blue-400 font-bold">Role:</span> Full-Stack AI Engineer, Data Scientist, Cybersecurity Researcher</p>
            <p><span className="text-blue-400 font-bold">Education:</span> B.Tech CSE (Data Science) @ United Institute of Technology, Prayagraj</p>
            <p><span className="text-blue-400 font-bold">Standing:</span> Academic Rank 1 CSE (Data Science) & AKTU Rank 5 Topper</p>
            <p><span className="text-blue-400 font-bold">Fellowships:</span> AIT Bangkok GIIP-2026, UP Police APCSIP-2026 Fellow</p>
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="text-xs space-y-2">
            <p className="text-purple-400 font-bold">Core Engineering Tech Stack:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-blue-400 font-bold">Frontend & Frameworks:</span> React 18, TypeScript, Next.js, Tailwind CSS, Framer Motion, HTML5/CSS3
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">Backend & Databases:</span> Python, Django, FastAPI, Node.js, PostgreSQL, MySQL, Redis, SQLite
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-purple-400 font-bold">AI, ML & RAG:</span> PyTorch, FAISS FlatIP, FastEmbed, LangChain, LlamaIndex, Whisper, OpenCV
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-rose-400 font-bold">Security & Forensics:</span> OSINT Frameworks, Wireshark, Burp Suite, Anti-Spoofing AI, MediaWiki Gerrit
              </div>
            </div>
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="text-xs space-y-1.5 font-mono text-slate-300">
            <p className="text-amber-400 font-bold">🚀 Top Flagship Projects:</p>
            <p>1. <span className="text-blue-400 font-bold">VoxRAG:</span> Sub-200ms Voice RAG (FAISS + FastEmbed) — <a href="https://github.com/gkm563/VoxRAG" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">github.com/gkm563/VoxRAG</a></p>
            <p>2. <span className="text-blue-400 font-bold">IntervAI:</span> AI Mock Interview Platform — <a href="https://github.com/gkm563/IntervAI" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">github.com/gkm563/IntervAI</a></p>
            <p>3. <span className="text-blue-400 font-bold">PrayagrajRooms:</span> Student Room Finder (5,000+ users) — <a href="https://prayagrajrooms.in" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">prayagrajrooms.in</a></p>
            <p>4. <span className="text-blue-400 font-bold">HH-GOA:</span> Hacker House Goa 2026 Frame Generator — <a href="https://github.com/gkm563/HH-GOA" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">github.com/gkm563/HH-GOA</a></p>
            <p>5. <span className="text-blue-400 font-bold">NHAI Biometrics:</span> Offline Liveness & Face AI — <a href="https://github.com/gkm563/NHAI-offline-biometrics" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">github.com/gkm563/NHAI-offline-biometrics</a></p>
          </div>
        );
        break;

      case 'awards':
        response = (
          <div className="text-xs space-y-1 text-slate-300">
            <p className="text-amber-400 font-bold">🏆 Verified Honors & Distinctions:</p>
            <p>• 🥇 <strong className="text-white">Academic Rank 1 Topper</strong> — B.Tech CSE (Data Science) 2nd Year (SGPA 8.5) @ UIT Prayagraj</p>
            <p>• 🎖️ <strong className="text-white">AKTU Rank 5 Overall College Topper</strong> — Dr. A.P.J. Abdul Kalam Technical University</p>
            <p>• 🛡️ <strong className="text-white">Best Content Creator Award</strong> — Awarded by DSP Anjali Kataria (UP Police APCSIP-2026)</p>
            <p>• 🌏 <strong className="text-white">GIIP International Research Fellow 2026</strong> — Asian Institute of Technology (AIT Bangkok)</p>
            <p>• 📜 <strong className="text-white">UP Board District Topper Honor</strong> — Awarded by Chairman & Secretary of UP Board</p>
          </div>
        );
        break;

      case 'arch voxrag':
      case 'voxrag':
        setSelectedArchId('voxrag');
        response = (
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <p className="text-emerald-400 font-bold">✅ Loaded VoxRAG Architecture into Live Visualizer.</p>
            <p>Latency Benchmark: &lt; 180ms TTFT | Embeddings: 48,995 Passages | FAISS FlatIP</p>
          </div>
        );
        break;

      case 'confetti':
        triggerCelebration();
        response = <p className="text-emerald-400 font-bold text-xs">🎉 Fired celebratory fireworks on screen!</p>;
        break;

      case 'contact':
        response = (
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <p className="text-blue-400 font-bold">Direct Communication Channels:</p>
            <p>📧 Email: <a href="mailto:gkmwin563@gmail.com" className="text-sky-400 underline">gkmwin563@gmail.com</a></p>
            <p>📱 WhatsApp / Call: <span className="text-white">+91-9125563563</span></p>
            <p>💼 LinkedIn: <a href="https://www.linkedin.com/in/gkm563" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">linkedin.com/in/gkm563</a></p>
            <p>🐙 GitHub: <a href="https://github.com/gkm563" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">github.com/gkm563</a></p>
          </div>
        );
        break;

      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;

      default:
        isError = true;
        response = (
          <p className="text-rose-400 text-xs">
            Command not recognized: "{cmd}". Type <span className="text-blue-400 underline cursor-pointer" onClick={() => setTerminalInput('help')}>help</span> to view available commands.
          </p>
        );
        break;
    }

    setTerminalHistory(prev => [...prev, { cmd, output: response, isError }]);
    setTerminalInput('');
  };

  return (
    <section className="relative my-12" id="interactive-dev-hub">
      <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[2px]"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>React 18 + TypeScript Interactive Architecture Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive AI Systems & Engineering Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-medium mt-1">
              Explore real-time data flow pipelines, latency telemetry, and interact with the live developer terminal built with React 18, TypeScript, and Framer Motion.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'architecture'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Live Architecture</span>
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'terminal'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Interactive CLI</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ARCHITECTURE VISUALIZER */}
        {activeTab === 'architecture' && (
          <div className="mt-6 space-y-6">
            
            {/* Project Architecture Selector Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {ARCHITECTURES.map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => setSelectedArchId(arch.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
                    selectedArchId === arch.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{arch.title.split('—')[0].trim()}</span>
                </button>
              ))}
            </div>

            {/* Architecture Overview Card */}
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-extrabold">
                    {currentArch.badge}
                  </span>
                  <span className="text-xs text-slate-400">{currentArch.category}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{currentArch.title}</h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{currentArch.summary}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {currentArch.githubUrl && (
                  <a
                    href={currentArch.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source Code</span>
                  </a>
                )}
                {currentArch.liveUrl && (
                  <a
                    href={currentArch.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            {/* Live Interactive Node Pipeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>Interactive Data Flow Pipeline (Click nodes for telemetry)</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>Pipeline Live</span>
                </span>
              </div>

              {/* Sequential Node Chain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {currentArch.nodes.map((node, index) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-blue-600/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]'
                          : 'bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold">
                            {index + 1}
                          </span>
                          {node.latency && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                              ⚡ {node.latency}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors leading-snug mb-1">
                          {node.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {node.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span className="truncate">{node.specs}</span>
                        {isSelected && <span className="text-blue-400 font-bold shrink-0">Active</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Node Telemetry Inspector */}
            {selectedNode && (
              <div className="bg-slate-950/80 rounded-2xl p-5 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Cpu className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs text-slate-400 font-mono uppercase">Node Telemetry Inspector</span>
                      <h4 className="text-base font-bold text-white">{selectedNode.name}</h4>
                    </div>
                  </div>
                  {selectedNode.latency && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Benchmark Latency</span>
                      <span className="text-sm font-extrabold text-emerald-400 font-mono">{selectedNode.latency}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedNode.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
                  <span className="text-slate-400">Specification:</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 text-blue-300 border border-slate-800">
                    {selectedNode.specs}
                  </span>
                  <span className="text-slate-400">Component Type:</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 text-purple-300 border border-slate-800 uppercase">
                    {selectedNode.type}
                  </span>
                </div>
              </div>
            )}

            {/* Tech Stack Badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-bold">Integrated Stack:</span>
              {currentArch.techStack.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 border border-slate-800 font-mono text-[11px]"
                >
                  {t}
                </span>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE DEVELOPER TERMINAL */}
        {activeTab === 'terminal' && (
          <div className="mt-6 space-y-4 font-mono">
            
            {/* Quick Command Action Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-slate-500 font-bold shrink-0">Quick Commands:</span>
              {['help', 'whoami', 'skills', 'projects', 'awards', 'voxrag', 'confetti', 'contact', 'clear'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setTerminalInput(c);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700 text-[11px] shrink-0 transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Terminal Window */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              
              {/* Terminal Titlebar */}
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="text-xs text-slate-400 font-mono ml-2">gautam@prayagraj: ~/portfolio</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Interactive Node Session</span>
                </div>
              </div>

              {/* Terminal Output Area */}
              <div className="p-4 sm:p-5 max-h-[380px] overflow-y-auto space-y-4 text-xs font-mono">
                {terminalHistory.map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-emerald-400 font-bold">gkm563@portfolio:~$</span>
                      <span className="text-white font-semibold">{item.cmd}</span>
                    </div>
                    <div className="pl-4">{item.output}</div>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Input Form */}
              <form
                onSubmit={handleCommandSubmit}
                className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center gap-2"
              >
                <span className="text-emerald-400 font-bold text-xs shrink-0">gkm563@portfolio:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type a command (e.g. 'help', 'skills', 'projects', 'confetti')..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Run</span>
                  <CornerDownLeft className="w-3 h-3" />
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
