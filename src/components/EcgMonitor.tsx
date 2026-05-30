/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { Activity, Heart, Volume2, VolumeX, AlertCircle } from "lucide-react";

export function EcgMonitor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [leadStatus, setLeadStatus] = useState<string>("OK - Lead II");
  const [ecgMode, setEcgMode] = useState<"standard" | "tachycardia" | "bradycardia">("standard");

  // Audio Context for the ECG "beep" sound
  const audioContextRef = useRef<AudioContext | null>(null);

  const triggerBeep = () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(950, ctx.currentTime); // Standard high pitch monitor beep
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("AudioContext failed to trigger:", e);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth ? canvas.parentElement.clientWidth * 2 : 800;
    let height = canvas.height = 240;

    // Handle high DPI
    canvas.style.width = "100%";
    canvas.style.height = "120px";

    let x = 0;
    const points: { x: number; y: number }[] = [];
    const maxPoints = width;

    // ECG wave parameters
    let t = 0;
    let lastBeepTime = 0;

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(13, 148, 136, 0.08)"; // Clinical teal grid lines
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Major grid lines
      ctx.strokeStyle = "rgba(13, 148, 136, 0.18)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 100) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
    };

    const getEcgOffset = (xVal: number) => {
      // Simulate real-life ECG components: P-wave, QRS-complex, T-wave
      const rateFactor = ecgMode === "tachycardia" ? 1.4 : ecgMode === "bradycardia" ? 0.7 : 1.0;
      const period = 300 / rateFactor; // length of beat block
      const phase = xVal % period;

      const midY = height / 2;

      // Flatline baseline with subtle noise
      let y = midY + (Math.sin(xVal * 0.1) * 1.0);

      // P wave (small upward hump)
      if (phase > 40 && phase < 60) {
        const pPhase = (phase - 40) / 20;
        y -= Math.sin(pPhase * Math.PI) * 12;
      }
      // PR segment (flat)
      
      // QRS complex (the famous sharp spike)
      if (phase >= 75 && phase <= 95) {
        if (phase < 79) {
          // Q wave - downward spike
          const qPhase = (phase - 75) / 4;
          y += qPhase * 18;
        } else if (phase >= 79 && phase < 87) {
          // R wave - enormous upward spike
          const rPhase = (phase - 79) / 8;
          y -= (1 - Math.abs(2 * rPhase - 1)) * 90;
          
          // Trigger heart sound/beep at R wave crest
          const now = Date.now();
          if (now - lastBeepTime > 300) {
            triggerBeep();
            lastBeepTime = now;
          }
        } else {
          // S wave - deep downward spike
          const sPhase = (phase - 87) / 8;
          y += (1 - Math.abs(2 * sPhase - 1)) * 30;
        }
      }

      // T wave (moderate upward hump)
      if (phase > 120 && phase < 160) {
        const tPhase = (phase - 120) / 40;
        y -= Math.sin(tPhase * Math.PI) * 20;
      }

      // U wave (very small hump)
      if (phase > 185 && phase < 205) {
        const uPhase = (phase - 185) / 20;
        y -= Math.sin(uPhase * Math.PI) * 4;
      }

      return y;
    };

    const animate = () => {
      if (!isPlaying) return;

      ctx.fillStyle = "#0f172a"; // Match deep navy theme slate-900
      ctx.fillRect(0, 0, width, height);

      drawGrid();

      // Standard sweep velocity
      const speed = ecgMode === "tachycardia" ? 4.5 : ecgMode === "bradycardia" ? 2.2 : 3.0;
      x = (x + speed) % width;

      // Add a sweeping gap like a real CRT cardiac monitor
      const sweepGap = 40;

      // Draw historical points using a sweeping buffer mechanism
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Use absolute glowing gradients for maximum biotech feel
      const neonGradient = ctx.createLinearGradient(0, 0, width, 0);
      neonGradient.addColorStop(0, "#0d9488"); // Teal
      neonGradient.addColorStop(0.5, "#14b8a6"); // Bright Teal
      neonGradient.addColorStop(1, "#2dd4bf"); // Turquoise

      ctx.strokeStyle = neonGradient;

      for (let i = 0; i < width; i++) {
        // Skip rendering points inside the sweeping gap
        const dist = (i - x + width) % width;
        if (dist > width - sweepGap) {
          continue;
        }

        const yValue = getEcgOffset(i);
        if (dist === 1 || i === 0) {
          ctx.beginPath();
          ctx.moveTo(i, yValue);
        } else {
          ctx.lineTo(i, yValue);
        }
      }
      ctx.stroke();

      // Emit glowing green sweep cursor
      ctx.beginPath();
      ctx.arc(x, getEcgOffset(x), 5, 0, Math.PI * 2);
      ctx.fillStyle = "#2dd4bf";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#14b8a6";
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Dynamic heartbeat updates
      t += 0.05;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth * 2;
      canvas.style.width = "100%";
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isPlaying, ecgMode, soundEnabled]);

  const changeMode = (mode: "standard" | "tachycardia" | "bradycardia") => {
    setEcgMode(mode);
    if (mode === "standard") setHeartRate(72);
    if (mode === "tachycardia") setHeartRate(124);
    if (mode === "bradycardia") setHeartRate(48);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-5 text-slate-100 font-mono relative">
      {/* Top Monitor Deck */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 animate-pulse">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wider text-slate-300 uppercase">Madiyan Biotech Diagnostics</h4>
            <p className="text-xs text-slate-400">High Precision Cardiac ECG Simulator</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-teal-400">{leadStatus}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 hover:text-slate-100 transition-colors pointer-events-auto">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-all border ${
                soundEnabled 
                  ? "bg-teal-500/10 text-teal-400 border-teal-500/30" 
                  : "bg-slate-800 text-slate-500 border-slate-700"
              }`}
              title={soundEnabled ? "Mute audio beep" : "Unmute audio beep"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary ECG Display Screen */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950 p-1 mb-4 shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
        
        {/* Heart Rate Block Overlay */}
        <div className="absolute top-3 right-3 bg-slate-950/95 border border-slate-800/80 rounded-xl p-3 flex items-center gap-4 z-10">
          <AnimatedHeart isTachy={ecgMode === "tachycardia"} />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">HR (BPM)</div>
            <div className="text-3xl font-bold font-mono tracking-tighter text-teal-400 leading-none mt-1">
              {heartRate}
            </div>
          </div>
        </div>

        {/* Technical Calibration Overlay */}
        <div className="absolute bottom-3 left-3 text-[10px] text-slate-500 space-y-0.5 leading-none bg-slate-950/80 px-2 py-1 rounded">
          <div>SPEED: 25 mm/s</div>
          <div>AMP: 10 mm/mV</div>
          <div>FILT: 0.5-40 Hz</div>
        </div>
      </div>

      {/* Diagnostics Simulator Board */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase tracking-widest font-bold">Simulator Patient Rate:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => changeMode("bradycardia")}
              className={`px-3 py-1 rounded-lg font-bold border transition ${
                ecgMode === "bradycardia"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-sm"
                  : "bg-slate-800/50 text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              48 BPM (Brady)
            </button>
            <button
              onClick={() => changeMode("standard")}
              className={`px-3 py-1 rounded-lg font-bold border transition ${
                ecgMode === "standard"
                  ? "bg-teal-500/10 text-teal-400 border-teal-500/30 shadow-sm"
                  : "bg-slate-800/50 text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              72 BPM (Normal)
            </button>
            <button
              onClick={() => changeMode("tachycardia")}
              className={`px-3 py-1 rounded-lg font-bold border transition ${
                ecgMode === "tachycardia"
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm"
                  : "bg-slate-800/50 text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              124 BPM (Tachy)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-teal-500/5 px-3 py-1 rounded-lg border border-teal-500/10">
          <AlertCircle className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Real-time clinical ECG tests are conducted on our advanced 12-lead machines in-lab or via home visits.</span>
        </div>
      </div>
    </div>
  );
}

function AnimatedHeart({ isTachy }: { isTachy: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <Heart 
        className={`w-7 h-7 text-rose-500 fill-rose-500/90 pulse-glow ${
          isTachy ? "animate-pulse" : ""
        }`} 
        style={{
          animationDuration: isTachy ? "0.45s" : "0.85s"
        }}
      />
    </div>
  );
}
