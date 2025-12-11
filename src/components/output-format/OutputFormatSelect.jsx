// src/components/output-format/OutputFormatSelect.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";

import {
  OutputFormatHeader,
  OutputFormatTags,
  OutputFormatInput,
  OutputFormatDropdown,
} from "./index";

// --- STATIC OUTPUT FORMAT DEFINITION -------------------

const OUTPUT_CATEGORIES = [
  {
    id: "structure",
    label: "Štruktúra a Základný Formát",
    compatibility: ["marketing_comm", "technical_data", "creative_ideation"],
    options: [
      "Stručné zhrnutie (do 100 slov)",
      "Detailný text v odsekoch (Esej)",
      "Zoznam bodov (Bullet Points)",
      "Prehľad / Executive Summary (Odseky + Body)",
      "FAQ sekcia (Otázka/Odpoveď)",
      "Postup krok za krokom (How-to)",
    ],
  },
  {
    id: "marketing_comm",
    label: "Marketing & Komunikácia",
    compatibility: ["structure", "creative_ideation"],
    options: [
      "Emailová štruktúra a obsah",
      "Šablóna odpovede pre klienta",
      "Social media príspevok (Post)",
      "Headline + Subheadline",
      "Produktový popis (UX Copy)",
      "CTA blok (Call-to-Action)",
      "Value Proposition",
    ],
  },
  {
    id: "technical_data",
    label: "Dáta a Technické výstupy",
    compatibility: ["structure"],
    options: [
      "Výstup v JSON",
      "Porovnávacia tabuľka (Markdown)",
      "KPI report",
      "YAML alebo XML",
      "CSV export",
    ],
  },
  {
    id: "creative_ideation",
    label: "Kreatívne",
    compatibility: ["structure", "marketing_comm"],
    options: [
      "3 kreatívne varianty (A/B/C)",
      "Storytelling",
      "Krátky scenár / dialóg",
    ],
  },
  {
    id: "advanced",
    label: "Pokročilé",
    compatibility: ["structure"],
    options: [
      "Kódový snippet",
      "Grafický popis (napr. UML)",
      "Timeline",
      "SWOT analýza",
    ],
  },
];

// --- MAP BUILDER -------------------

function buildOptionMap(customOptions = []) {
  const base = OUTPUT_CATEGORIES.flatMap((cat) =>
    cat.options.map((opt) => ({
      value: opt,
      categoryId: cat.id,
      categoryLabel: cat.label,
    }))
  );

  const custom = customOptions.map((opt) => ({
    value: opt,
    categoryId: "custom",
    categoryLabel: "Vlastné formáty",
  }));

  const map = {};
  [...base, ...custom].forEach((item) => (map[item.value] = item));
  return map;
}

// --- MAIN COMPONENT -------------------

export default function OutputFormatSelect({
  id,
  label = "Output format",
  hint,
  value,
  onChange,
  maxSelected = 6,
  favorites = [],          // still supported
  onToggleFavorite = () => {},
}) {
  const containerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [warning, setWarning] = useState("");

  const selectedValues = Array.isArray(value) ? value : [];

  // --- Load custom outputs from localStorage ---

  const [customOutputs, setCustomOutputs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("custom_outputs") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("custom_outputs", JSON.stringify(customOutputs));
  }, [customOutputs]);

  const OPTION_MAP = useMemo(
    () => buildOptionMap(customOutputs),
    [customOutputs]
  );

  // --- Close dropdown when clicking outside ---
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // --- Category Filtering Logic ---

  const selectedCategoryId = useMemo(() => {
    const ids = selectedValues
      .map((v) => OPTION_MAP[v]?.categoryId)
      .filter(Boolean);

    return ids.length ? ids[0] : null;
  }, [selectedValues, OPTION_MAP]);

  const filteredCategories = useMemo(() => {
    const q = query.toLowerCase().trim();

    return OUTPUT_CATEGORIES.filter((cat) => {
      if (selectedCategoryId === "custom") return true;
      if (!selectedCategoryId) return true;
      if (cat.id === selectedCategoryId) return true;

      const selCat = OUTPUT_CATEGORIES.find(
        (c) => c.id === selectedCategoryId
      );
      if (!selCat) return true;

      return selCat.compatibility.includes(cat.id);
    })
      .map((cat) => ({
        ...cat,
        options: cat.options.filter((opt) =>
          opt.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.options.length > 0);
  }, [query, selectedCategoryId]);

  // --- Toggle Options ---

  const handleToggleOption = (opt) => {
    setWarning("");

    const isSelected = selectedValues.includes(opt);

    if (!isSelected && selectedValues.length >= 3) {
      setWarning(
        "Príliš veľa výstupov môže zhoršiť kvalitu odpovede. Odporúčame max 2–3."
      );
    }

    if (!isSelected && selectedValues.length >= maxSelected) {
      setWarning(`Môžeš vybrať maximálne ${maxSelected} možností.`);
      return;
    }

    const next = isSelected
      ? selectedValues.filter((v) => v !== opt)
      : [...selectedValues, opt];

    onChange(next);
    setOpen(true);
  };

  // --- ENTER to add custom output ---

  const handleKeyDown = (e) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key !== "Enter") return;

    e.preventDefault();

    const newItem = query.trim();
    if (!newItem) return;

    if (OPTION_MAP[newItem]) {
      handleToggleOption(newItem);
      setQuery("");
      return;
    }

    // create new custom output
    setCustomOutputs((prev) => [...prev, newItem]);
    onChange([...selectedValues, newItem]);
    setQuery("");
    setOpen(true);
  };

  const handleClearAll = () => {
    setQuery("");
    onChange([]);
    setWarning("");
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col gap-1.5"
    >
      {/* HEADER */}
      <OutputFormatHeader
        label={label}
        hint={hint}
        onClear={handleClearAll}
      />

      {/* TAGS */}
      <OutputFormatTags
        selected={selectedValues}
        onRemove={(opt) => handleToggleOption(opt)}
      />

      {/* INPUT */}
      <OutputFormatInput
        id={id}
        query={query}
        onChange={setQuery}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        onClear={() => setQuery("")}
      />

      {/* DROPDOWN */}
      {open && (
        <OutputFormatDropdown
          customOutputs={customOutputs}
          filteredCategories={filteredCategories}
          selectedValues={selectedValues}
          onSelect={handleToggleOption}
          onDeleteCustom={(opt) =>
            setCustomOutputs((prev) =>
              prev.filter((c) => c !== opt)
            )
          }
        />
      )}

      {warning && (
        <div className="text-[11px] text-amber-600 mt-1">{warning}</div>
      )}
    </div>
  );
}
