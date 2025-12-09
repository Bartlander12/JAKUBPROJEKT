// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar() {
  return (
    <aside className="bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 p-4 md:p-5 flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-500 shadow-[0_0_14px_rgba(96,165,250,0.55)] relative overflow-hidden">
            <div className="absolute inset-[24%] rounded-full border-2 border-white/70" />
          </div>
          <div>
            <div className="font-semibold text-[17px] tracking-wide">
              PromptMate
            </div>
            <div className="text-xs text-slate-500">
              Business Prompt Builder
            </div>
          </div>
        </div>
        <div className="inline-flex text-[11px] uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-500">
          MVP • Basic mode
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
          Workflow
        </div>
        <nav className="flex flex-col gap-1">
          <button className="flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700 font-medium">
            <span>🧩</span>
            <span>Basic Prompt</span>
          </button>
          <button className="flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition">
            <span>🎭</span>
            <span>Tone &amp; Style (soon)</span>
          </button>
          <button className="flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition">
            <span>📚</span>
            <span>Examples &amp; Rules (soon)</span>
          </button>
          <button className="flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition">
            <span>🧾</span>
            <span>JSON output (soon)</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto text-[11px] text-slate-500 space-y-1">
        <strong className="block text-[11px] font-semibold">Tip:</strong>
        <span>
          Ulož si svoju obľúbenú personu ⭐ a použi ju v každom promte.
        </span>
      </div>
    </aside>
  );
}
