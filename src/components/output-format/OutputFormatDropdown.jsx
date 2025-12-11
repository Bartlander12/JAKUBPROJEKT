// src/components/output-format/OutputFormatDropdown.jsx
import React from "react";
import OutputFormatSection from "./OutputFormatSection";
import OutputFormatOption from "./OutputFormatOption";

export default function OutputFormatDropdown({
  customOutputs,
  filteredCategories,
  selectedValues,
  onSelect,
  onDeleteCustom,
}) {
  return (
    <div className="absolute left-3 right-3 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto text-sm z-20">

      {/* CUSTOM FORMATS */}
      {customOutputs.length > 0 && (
        <OutputFormatSection title="Vlastné formáty" color="text-violet-600">
          {customOutputs.map((opt) => (
            <OutputFormatOption
              key={opt}
              label={opt}
              active={selectedValues.includes(opt)}
              onClick={() => onSelect(opt)}
              deletable={true}
              onDelete={onDeleteCustom}
              hoverClass="hover:bg-violet-50"
            />
          ))}
        </OutputFormatSection>
      )}

      {/* CATEGORY GROUPS */}
      {filteredCategories.map((cat) => (
        <OutputFormatSection key={cat.id} title={cat.label}>
          {cat.options.map((opt) => (
            <OutputFormatOption
              key={opt}
              label={opt}
              active={selectedValues.includes(opt)}
              onClick={() => onSelect(opt)}
            />
          ))}
        </OutputFormatSection>
      ))}
    </div>
  );
}
