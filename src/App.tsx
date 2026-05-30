/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Dna, 
  Activity, 
  Wind, 
  Bot, 
  Sparkles, 
  Mail,
  Locate,
  ArrowUpRight,
  Syringe,
  Timer
} from "lucide-react";
import { BookingForm } from "./components/BookingForm";
import { EcgMonitor } from "./components/EcgMonitor";
import { LabAdvisor } from "./components/LabAdvisor";
import { NebulizerCare } from "./components/NebulizerCare";
import { SERVICE_DETAILS } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState<"booking" | "ecg" | "nebulization" | "advisor">("booking");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Clinic Universal Announcement Bar */}
      <div id="announcement-bar" className="bg-slate-900 text-slate-300 py-2.5 px-4 text-xs font-semibold border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span>Home Sample Collection Available across Manikoth, Madiyan, and Kanhangad region.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider font-mono">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-teal-400" /> {SERVICE_DETAILS.phone}</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-teal-400" /> Mon-Sat: 6 AM - 8 PM</span>
          </div>
        </div>
      </div>

      {/* Main Clinic Header Nav */}
      <header id="main-header" className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Frame */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-teal-600/10 shrink-0">
              <Dna className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-slate-900 uppercase">Madiyan Biotech</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600 font-mono">Medical Center & Labs</span>
            </div>
          </div>

          {/* Location Fast Navigation Block */}
          <div className="hidden md:flex items-center gap-3 text-xs bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="font-extrabold text-slate-800">MK Complex, Madiyan</p>
              <p className="text-[10px] text-slate-500">First Floor, Manikoth, Kerala</p>
            </div>
          </div>

          {/* Action Call Support */}
          <div>
            <a 
              href={`tel:${SERVICE_DETAILS.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition shadow"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" /> Call Quick Desk
            </a>
          </div>

        </div>
      </header>

      {/* Hero Banner Section */}
      <section id="hero-banner" className="bg-gradient-to-b from-teal-500/5 to-slate-50 border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Message */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 bg-teal-100/50 text-teal-800 border border-teal-200/40 rounded-full px-3.5 py-1 text-xs font-bold font-sans uppercase">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Elite Genomic & Cardiovascular Care
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              State-of-the-Art Diagnostics. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Right At Your Doorstep in Manikoth.
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Madiyan Biotech Medical Center provides premium clinical testing, real-time 12-lead ECG monitor scanning, ultrasonic nebulization therapy, and highly reliable clinical home sample drawing.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs pt-2">
              <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-3.5 py-2 shadow-sm font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Certified Pathologists
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-3.5 py-2 shadow-sm font-semibold">
                <Syringe className="w-4 h-4 text-teal-600" /> Sterile Venous Drawing
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-3.5 py-2 shadow-sm font-semibold">
                <Timer className="w-4 h-4 text-teal-600" /> Fast Clinical Turnover
              </div>
            </div>
          </div>

          {/* Right Hero Image Frame */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-white border border-slate-200 p-2.5 rounded-3xl shadow-xl overflow-hidden">
              <img 
                src="/src/assets/images/blood_collection_1780131898568.png" 
                alt="Madiyan Biotech Sterile Blood Collection" 
                className="w-full h-auto rounded-2xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-5 left-5 bg-slate-900/90 [backdrop-filter:blur(6px)] px-3.5 py-2 rounded-xl text-[10px] text-white space-y-0.5 border border-slate-800/80">
                <p className="font-extrabold uppercase text-teal-400 font-mono tracking-wider">Sterile Blood Collection</p>
                <p className="text-slate-300 font-medium font-sans">Standardized vacuum tube containment assays</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Clinical Navigation Panel & Dashboard */}
      <main id="clinical-panel" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Quick Clinical Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assays Available</p>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">150+</p>
            <p className="text-[10px] text-teal-600 font-bold uppercase mt-1">Full-Body Profiles</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Home Collections</p>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">100% Free</p>
            <p className="text-[10px] text-teal-600 font-bold uppercase mt-1">Madiyan & Manikoth</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">ECG & Inhalation</p>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">Immediate</p>
            <p className="text-[10px] text-teal-600 font-bold uppercase mt-1">SOS Support Active</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consulting Hours</p>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">14 Hrs</p>
            <p className="text-[10px] text-teal-600 font-bold uppercase mt-1">Open 6:00 AM Daily</p>
          </div>
        </div>

        {/* Tab Module Selectors */}
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest text-teal-600 mb-3">Explore Healthcare Services</p>
          <div className="inline-flex flex-wrap p-1.5 bg-slate-100 rounded-2xl border border-slate-200/60 max-w-full">
            <button
              onClick={() => setActiveTab("booking")}
              className={`px-5 py-3 text-xs font-bold tracking-wider rounded-xl uppercase cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "booking"
                  ? "bg-white text-teal-700 shadow-sm font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Syringe className="w-4 h-4 shrink-0" /> Lab Test & Home Draw
            </button>
            <button
              onClick={() => setActiveTab("ecg")}
              className={`px-5 py-3 text-xs font-bold tracking-wider rounded-xl uppercase cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "ecg"
                  ? "bg-white text-teal-700 shadow-sm font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" /> Real-time ECG Scan
            </button>
            <button
              onClick={() => setActiveTab("nebulization")}
              className={`px-5 py-3 text-xs font-bold tracking-wider rounded-xl uppercase cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "nebulization"
                  ? "bg-white text-teal-700 shadow-sm font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wind className="w-4 h-4 shrink-0" /> Nebulizer Care
            </button>
            <button
              onClick={() => setActiveTab("advisor")}
              className={`px-5 py-3 text-xs font-bold tracking-wider rounded-xl uppercase cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "advisor"
                  ? "bg-white text-teal-700 shadow-sm font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Bot className="w-4 h-4 shrink-0" /> AI BioInterpreter™
            </button>
          </div>
        </div>

        {/* Tab Components Render View */}
        <div id="active-tab-container" className="pt-2">
          {activeTab === "booking" && <BookingForm />}
          {activeTab === "ecg" && <EcgMonitor />}
          {activeTab === "nebulization" && <NebulizerCare />}
          {activeTab === "advisor" && <LabAdvisor />}
        </div>

        {/* Dynamic Location & Quick Address Contact Bento Section */}
        <section id="clinic-location-details" className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-teal-600 uppercase tracking-widest font-mono">Bento Location Block</span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-teal-600" /> Madiyan Biotech Clinical HQ
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Located strategically at the primary economic complex in Madiyan, Manikoth. Our facilities house modern automated hematology analyzers, professional cardiac visual monitors, sterile collection vaults, and clinical inhalation bays.
                </p>
              </div>

              {/* Grid Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase">Clinical Address</span>
                  <p className="text-slate-800 font-bold leading-normal">{SERVICE_DETAILS.address}</p>
                  <p className="text-[11px] text-teal-600 font-bold">Landmark: {SERVICE_DETAILS.landmark}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase">Consultation Timings</span>
                  <p className="text-slate-800 font-bold leading-normal">{SERVICE_DETAILS.timings}</p>
                  <p className="text-[11px] text-teal-600 font-bold">Closed on Public Holidays</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase">Surgical Hotlines</span>
                  <p className="text-slate-800 font-bold">{SERVICE_DETAILS.phone}</p>
                  <p className="text-slate-800 font-bold">{SERVICE_DETAILS.secondaryPhone}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase">Digital Enquiries</span>
                  <p className="text-slate-800 font-bold flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-teal-600" /> {SERVICE_DETAILS.email}</p>
                  <p className="text-[11px] text-teal-600 font-bold">Response within 2 hours</p>
                </div>
              </div>
            </div>

            {/* Simulated Live Google Maps Area */}
            <div className="lg:col-span-5 p-2 bg-slate-100 rounded-3xl border border-slate-200">
              <div className="relative h-[250px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between p-5 text-white">
                {/* Abstract geometric green graphic representation of geographic location */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                
                {/* Simulated navigation route drawing card */}
                <div className="absolute top-10 left-10 w-4/5 h-2/3 border-2 border-teal-500/40 rounded-2xl bg-teal-500/5 backdrop-blur-[3px] flex items-center justify-center p-3 animate-pulse">
                  <div className="text-center space-y-2">
                    <Locate className="w-7 h-7 text-teal-400 mx-auto" />
                    <p className="text-[11px] font-extrabold tracking-widest text-teal-300 uppercase">Interactive GPS Center Coordinates</p>
                    <p className="text-[10px] text-slate-300 font-mono">12.3387° N, 75.1098° E (Madiyan Temple Road)</p>
                  </div>
                </div>

                <div className="flex justify-between items-center relative z-10 w-full mt-auto">
                  <div className="text-left">
                    <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Kerala Healthcare Map</p>
                    <p className="text-xs font-bold">MK Complex Block Ground Elevation</p>
                  </div>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="p-2 bg-white text-slate-900 rounded-xl hover:bg-slate-50 transition shadow"
                    title="Open live Google Maps"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Modern High-End Footer */}
      <footer id="clinical-footer" className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-center md:text-left">
          
          <div className="space-y-1">
            <p className="font-extrabold text-white text-sm uppercase tracking-wide">Madiyan Biotech Medical Labs</p>
            <p className="text-slate-500">MK Complex, First Floor, Madiyan, Manikoth, Kerala 671316</p>
            <p className="text-slate-500 text-[11px] mt-1">Licensed Clinical Testing Lab & Inhalation Center | Reg: K-62481-MED</p>
          </div>

          <div className="space-y-2 md:text-right">
            <p className="text-slate-500">© 2026 Madiyan Biotech. All clinical and biotechnology rights reserved.</p>
            <p className="text-[10px] text-slate-600 leading-normal max-w-md md:ml-auto">
              Medical Disclaimer: Information presented across our landing portal is aimed for educational awareness and booking convenience. Clinical decisions must rely on official certified reports interpreted by pathology professionals.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
