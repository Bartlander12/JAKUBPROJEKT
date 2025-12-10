import React, { useMemo, useRef, useState, useEffect } from "react";

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

// Map for fast lookup
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

export default function OutputFormatSelect({
  id,
  label = "Output format",
  hint,
  value,
  onChange,
  maxSelected = 6,
  favorites = [],
  onToggleFavorite = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [warning, setWarning] = useState("");
  const containerRef = useRef(null);

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

  const selectedValues = Array.isArray(value) ? value : [];

  const selectedCategoryId = useMemo(() => {
    const ids = selectedValues
      .map((v) => OPTION_MAP[v]?.categoryId)
      .filter(Boolean);

    return ids.length ? ids[0] : null;
  }, [selectedValues, OPTION_MAP]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Category filter logic
  const filteredCategories = useMemo(() => {
    const q = query.toLowerCase().trim();

    return OUTPUT_CATEGORIES.filter((cat) => {
      // custom formats accept all categories
      if (selectedCategoryId === "custom") return true;

      if (!selectedCategoryId) return true;
      if (cat.id === selectedCategoryId) return true;

      const selCat = OUTPUT_CATEGORIES.find((c) => c.id === selectedCategoryId);
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

  const favoriteOptions = favorites
    .map((f) => OPTION_MAP[f])
    .filter(Boolean)
    .filter((o) => o.value.toLowerCase().includes(query.toLowerCase()));

  // Toggle format selection
  const handleToggleOption = (opt) => {
    setWarning("");

    const isSelected = selectedValues.includes(opt);

    if (selectedValues.length >= 3 && !isSelected) 
       { setWarning( "Príliš veľa výstupov môže zhoršiť kvalitu odpovede. Odporúčame max 2–3." ); }

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

  // ENTER → add custom format
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

    setCustomOutputs((prev) => [...prev, newItem]);
    onChange([...selectedValues, newItem]);
    setQuery("");
    setOpen(true);
  };

  // Clear selected outputs
  const handleClearAll = () => {
    setQuery("");
    onChange([]);
    setWarning("");
  };

  const showClear = query.length > 0;

  return (
    <div
      ref={containerRef}
      className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col gap-1.5"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-medium">{label}</div>
          {hint && (
            <div className="text-[11px] text-slate-500">{hint}</div>
          )}
        </div>

        {/* Clean X button */}
        <button
          onClick={handleClearAll}
          className="text-slate-400 hover:text-slate-600 text-lg"
        >
          ✕
        </button>
      </div>

      {/* SELECTED TAGS */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 my-1">
          {selectedValues.map((opt) => (
            <span
              key={opt}
              className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs flex items-center gap-1"
            >
              {opt}
              <button
                onClick={() => handleToggleOption(opt)}
                className="text-[11px]"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* INPUT + X CLEAR */}
      <div className="relative">
        <input
          id={id}
          type="text"
          placeholder="Pridaj alebo vyhľadaj…"
          className="w-full bg-white px-3 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {showClear && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-3 right-3 mt-1 top-full bg-white border border-slate-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto text-sm z-20">

          {/* FAVORITES */}
          {favoriteOptions.length > 0 && (
            <div className="border-b border-slate-100">
              <div className="px-4 pt-2 pb-1 text-[11px] uppercase text-amber-600">
                Obľúbené
              </div>

              {favoriteOptions.map((m) => {
                const active = selectedValues.includes(m.value);
                return (
                  <button
                    key={m.value}
                    onClick={() => handleToggleOption(m.value)}
                    className="w-full px-4 py-2 flex justify-between hover:bg-amber-50"
                  >
                    <span>{m.value}</span>
                    {active && <span>✔</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* CUSTOM */}
          {customOutputs.length > 0 && (
            <div className="border-b border-slate-100">
              <div className="px-4 pt-2 pb-1 text-[11px] uppercase text-violet-600">
                Vlastné formáty
              </div>

              {customOutputs.map((opt) => {
                const active = selectedValues.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => handleToggleOption(opt)}
                    className="w-full px-4 py-2 flex justify-between hover:bg-violet-50"
                  >
                    <span>{opt}</span>
                    {active && <span>✔</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* CATEGORIES */}
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="border-b last:border-b-0">
              <div className="px-4 pt-2 pb-1 text-[11px] uppercase text-slate-400">
                {cat.label}
              </div>

              {cat.options.map((opt) => {
                const active = selectedValues.includes(opt);

                return (
                  <button
                    key={opt}
                    onClick={() => handleToggleOption(opt)}
                    className={`w-full px-4 py-2 flex justify-between hover:bg-slate-50`}
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
