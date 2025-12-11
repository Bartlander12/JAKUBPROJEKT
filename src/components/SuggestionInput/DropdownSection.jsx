// src/components/SuggestionInput/DropdownSection.jsx
import React from "react";

export default function DropdownSection({ title, color, children }) {
  const colorMap = {
    amber: "text-amber-600",
    violet: "text-violet-600",
    blue: "text-blue-600",
  };

  return (
    <div className="border-b border-slate-100">
      <div className={`px-4 pt-2 pb-1 text-[11px] uppercase ${colorMap[color]}`}>
        {title}
      </div>

      {children}
    </div>
  );
}
