// src/components/common/dropdown/DropdownSection.jsx
import React from "react";

export default function DropdownSection({ title, children }) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      {title && (
        <div className="px-4 pt-2 pb-1 text-[11px] uppercase text-violet-600">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
