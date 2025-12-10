// src/components/OutputFormatSelect.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";

const OUTPUT_CATEGORIES = [
  {
    id: "structure",
    label: "Štruktúra a Základný Formát",
    description: "Základná forma odpovede – vyber jednu ako primárnu.",
    compatibility: ["marketing_comm", "technical_data", "creative_ideation"], // Môže sa kombinovať s týmito
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
    description: "Prvky pre predaj a interakciu – kombinuj s štruktúrou.",
    compatibility: ["structure", "creative_ideation"], // Nie s technickými dátami
    options: [
      "Emailová štruktúra a obsah",
      "Šablóna odpovede pre klienta (Customer Service)",
      "Social media príspevok (Post)",
      "Headline + Subheadline (Nadpis + podnadpis)",
      "Produktový popis (UX Copy)",
      "CTA blok (Call-to-Action)",
      "Value Proposition (Výhody/Benefity)",
    ],
  },
  {
    id: "technical_data",
    label: "Dáta, Reporty & Technické Formáty",
    description: "Štruktúrované dáta – používať samostatne alebo s jednoduchou štruktúrou.",
    compatibility: ["structure"], // Len s základnou štruktúrou, nie s kreatívou
    options: [
      "Výstup v JSON",
      "Porovnávacia tabuľka (formát Markdown)",
      "KPI / Metrický report v bodoch",
      "YAML/XML konfigurácia",
      "CSV export (s hlavičkou, oddelovač čiarka alebo bodkočiarka)",
    ],
  },
  {
    id: "creative_ideation",
    label: "Kreatívne Variácie & Ideácia",
    description: "Pre brainstorm a variácie – kombinuj s marketingom alebo štruktúrou.",
    compatibility: ["structure", "marketing_comm"], // Nie s technickými
    options: [
      "3 kreatívne varianty (A/B/C)",
      "Storytelling / hero text",
      "Krátky scenár / dialóg (pre reklamu)",
      // Navrhujem pridať: "Brainstorm nápadov (5-10 bodov)" pre širšie použitie
    ],
  },
  // Navrhujem pridať novú kategóriu pre univerzálnosť
  {
    id: "advanced",
    label: "Pokročilé & Špecifické Formáty",
    description: "Špecializované výstupy – používať opatrne.",
    compatibility: ["structure"], // Len s základom
    options: [
      "Kódový snippet (napr. Python/JS)",
      "Grafický popis (pre vizuály, napr. UML diagram)",
      "Timeline / Chronológia udalostí",
      "SWOT analýza (Strengths/Weaknesses/Opportunities/Threats)",
    ],
  },
];

// pomocná mapa value -> { value, categoryId, categoryLabel }
const OPTION_MAP = OUTPUT_CATEGORIES.flatMap((cat) =>
  cat.options.map((opt) => ({
    value: opt,
    categoryId: cat.id,
    categoryLabel: cat.label,
  }))
).reduce((acc, item) => {
  acc[item.value] = item;
  return acc;
}, {});

export default function OutputFormatSelect({
  id,
  label = "Output format",
  hint,
  placeholder = "Vyber typ výstupu…",
  value,
  onChange,
  maxSelected = 6,   // 🔥 LIMIT
}) {

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [warning, setWarning] = useState("");
  const containerRef = useRef(null);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  // vybraný categoryId podľa prvého vybratého outputu
  const selectedCategoryId = useMemo(() => {
    const ids = selectedValues
      .map((v) => OPTION_MAP[v]?.categoryId)
      .filter(Boolean);
    return ids.length ? ids[0] : null;
  }, [selectedValues]);

  // close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // options filtrované podľa query
  const filteredCategories = useMemo(() => {
  const q = query.trim().toLowerCase();

  return OUTPUT_CATEGORIES
    .filter((cat) => {
      if (!selectedCategoryId) return true;
      if (cat.id === selectedCategoryId) return true;

      const selectedCat = OUTPUT_CATEGORIES.find(c => c.id === selectedCategoryId);
      return selectedCat.compatibility.includes(cat.id);
    })
    .map((cat) => ({
      ...cat,
      options: cat.options.filter((opt) =>
        opt.toLowerCase().includes(q)
      ),
    }))
    .filter((cat) => cat.options.length > 0);
}, [query, selectedCategoryId]);


  const handleToggleOption = (opt) => {
  setWarning("");

  const optionMeta = OPTION_MAP[opt];
  if (!optionMeta) return;

  // ⚠️ Jemné upozornenie po 3+ vybraných položkách
  if (selectedValues.length >= 3 && !selectedValues.includes(opt)) {
    setWarning("Príliš veľa výstupov môže zhoršiť kvalitu odpovede. Odporúčame max 2–3.");
  }

  // 🚫 Hard limit (6)
  if (!selectedValues.includes(opt) && selectedValues.length >= maxSelected) {
    setWarning(`Môžeš vybrať maximálne ${maxSelected} možností.`);
    return;
  }

  let next = [...selectedValues];
  if (next.includes(opt)) {
    next = next.filter((v) => v !== opt);
  } else {
    next.push(opt);
  }

  onChange(next);
  setOpen(true);
};


  const handleClearAll = () => {
    onChange([]);
    setQuery("");
    setWarning("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5"
    >
      {/* Label */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2 text-sm font-medium text-slate-900">
            <span>{label}</span>
            {hint && (
              <span className="text-xs font-normal text-slate-500">
                {hint}
              </span>
            )}
          </div>
          {selectedCategoryId && (
            <span className="text-[11px] text-slate-500">
              Kategória:{" "}
              {
                OUTPUT_CATEGORIES.find((c) => c.id === selectedCategoryId)
                  ?.label
              }
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleClearAll}
          className="text-sm opacity-70 hover:opacity-100"
          title="Vymazať všetko"
        >
          🧹
        </button>
      </div>

      {/* TAGY vybraných outputov */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {selectedValues.map((opt) => (
            <span
              key={opt}
              className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center gap-1"
            >
              {opt}
              <button
                type="button"
                onClick={() => handleToggleOption(opt)}
                className="text-[11px] hover:text-emerald-950"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input na filtrovanie */}
      <input
        id={id}
        type="text"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
        placeholder={placeholder}
        value={query}
        autoComplete="off"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {/* Dropdown s kategóriami */}
      {open && filteredCategories.length > 0 && (
        <div className="absolute left-3 right-3 top-[100%] mt-1 rounded-2xl border border-slate-200 bg-white shadow-xl max-h-72 overflow-y-auto z-20 text-sm">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="border-b last:border-b-0 border-slate-100">
              <div className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                {cat.label}
              </div>
              {cat.options.map((opt) => {
                const active = selectedValues.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggleOption(opt)}
                    className={`w-full text-left px-4 py-2 flex justify-between items-center hover:bg-slate-50 ${
                      active ? "bg-blue-50 text-blue-700" : ""
                    }`}
                  >
                    <span>{opt}</span>
                    {active && <span>✔</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {warning && (
        <div className="text-[11px] text-amber-600 mt-1">{warning}</div>
      )}
    </div>
  );
}
