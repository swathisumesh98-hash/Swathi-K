/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { NEBULIZATION_INFO, SERVICE_DETAILS } from "../data";
import { Check, Info, Wind, ShieldAlert, Thermometer, UserCheck } from "lucide-react";

export function NebulizerCare() {
  const [activeTab, setActiveTab ] = useState<"indications" | "benefits" | "guide">("indications");

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header and Core Branding */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-bold font-sans uppercase">
            <Wind className="w-3.5 h-3.5" /> High-Efficiency Inhalation Therapy
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Nebulization Lounge</h3>
          <p className="text-sm text-slate-500">
            Professional pulmonary aerosol therapy at MK Complex, Madiyan. Engineered for pediatric and adult respiratory relief.
          </p>
        </div>

        {/* Dynamic status badge */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-2xl shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider">No appointment required for SOS care</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        {/* Navigation Tabs and Content */}
        <div className="md:col-span-8 space-y-5">
          <div className="flex gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("indications")}
              className={`px-4 py-2 text-xs font-bold tracking-wider rounded-xl cursor-pointer transition whitespace-nowrap uppercase ${
                activeTab === "indications"
                  ? "bg-slate-900 text-teal-400"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Medical Indications
            </button>
            <button
              onClick={() => setActiveTab("benefits")}
              className={`px-4 py-2 text-xs font-bold tracking-wider rounded-xl cursor-pointer transition whitespace-nowrap uppercase ${
                activeTab === "benefits"
                  ? "bg-slate-900 text-teal-400"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Benefits & Safe Equipment
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`px-4 py-2 text-xs font-bold tracking-wider rounded-xl cursor-pointer transition whitespace-nowrap uppercase ${
                activeTab === "guide"
                  ? "bg-slate-900 text-teal-400"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Patient Safety Protocols
            </button>
          </div>

          <div className="min-h-[160px] bg-slate-50/50 p-5 rounded-2xl border border-slate-100/80">
            {activeTab === "indications" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-slate-400">Clinical Conditions Relieved by Aerosols:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {NEBULIZATION_INFO.indications.map((ind, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="text-sm font-semibold text-slate-800">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Why choose Madiyan Biotech Nebulization Lounge?</p>
                <div className="space-y-2.5">
                  {NEBULIZATION_INFO.benefits.map((ben, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="p-1 bg-teal-100 text-teal-700 rounded-full shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-sm text-slate-700 leading-normal">{ben}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "guide" && (
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Aerosol Hygiene & Medication Delivery Guidelines:</p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Thermometer className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Sterile Single-Use Masks</h5>
                      <span className="text-xs text-slate-500">Every mask kit is fully sterilized or unsealed fresh from protective packaging under patient observation.</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <UserCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Technician Supervised</h5>
                      <span className="text-xs text-slate-500">Your inhalation flow rate is calculated meticulously based on physician-prescribed bronchodilator doses.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Banner (Right) */}
        <div className="md:col-span-4 bg-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glowing absolute element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>

          <div className="space-y-4 relative z-10">
            <h4 className="text-sm font-black uppercase tracking-wider text-teal-400">SOS Emergency Support</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Facing immediate pediatric coughing, bronchial chest tightness, asthma exacerbation, or wheezing? Skip scheduling and walk directly into our lounge.
            </p>
            
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Emergency Contact Desk</div>
              <div className="text-sm font-bold text-teal-300">{SERVICE_DETAILS.phone}</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1.5 leading-tight">
            <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>Madiyan Biotech uses clinical-grade pharmaceutical compressor technology.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
