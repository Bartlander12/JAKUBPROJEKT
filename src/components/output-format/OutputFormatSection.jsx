// src/components/output-format/OutputFormatSection.jsx
import React from "react";

export default function OutputFormatSection({ title, color = "text-slate-400", children }) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <div className={`px-4 pt-2 pb-1 text-[11px] uppercase ${color}`}>
        {title}
      </div>
      {children}
    </div>
  );
}
