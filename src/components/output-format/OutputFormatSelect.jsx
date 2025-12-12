// src/components/output-format/OutputFormatSelect.jsx
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

// pomocná mapka (value → info)
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
  favorites = [],          // stále existuje kvôli App state, ale pre dropdown ho nevyužívame
  onToggleFavorite = () => {},
}) {
  const containerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [warning, setWarning] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1); // pre ↑ ↓

  const selectedValues = Array.isArray(value) ? value : [];

  // --- custom outputs z localStorage ---
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

  // zatváranie pri kliknutí mimo
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // derivované: selected category
  const selectedCategoryId = useMemo(() => {
    const ids = selectedValues
      .map((v) => OPTION_MAP[v]?.categoryId)
      .filter(Boolean);
    return ids.length ? ids[0] : null;
  }, [selectedValues, OPTION_MAP]);

  const q = query.toLowerCase().trim();

  // filtrované custom outputs (podľa query)
  const filteredCustomOutputs = useMemo(
    () =>
      customOutputs.filter((opt) =>
        opt.toLowerCase().includes(q)
      ),
    [customOutputs, q]
  );

  // filtrované kategórie + options (podľa query + compatibility)
  const filteredCategories = useMemo(() => {
    return OUTPUT_CATEGORIES.filter((cat) => {
      if (selectedCategoryId === "custom") return true;
      if (!selectedCategoryId) return true;
      if (cat.id === selectedCategoryId) return true;

      const sel = OUTPUT_CATEGORIES.find((c) => c.id === selectedCategoryId);
      if (!sel) return true;

      return sel.compatibility.includes(cat.id);
    })
      .map((cat) => ({
        ...cat,
        options: cat.options.filter((opt) =>
          opt.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.options.length > 0);
  }, [q, selectedCategoryId]);

  // plochý zoznam položiek pre keyboard navigation
  const flatItems = useMemo(() => {
    const items = [];

    // najprv custom
    filteredCustomOutputs.forEach((opt) =>
      items.push({ source: "custom", value: opt })
    );

    // potom categories
    filteredCategories.forEach((cat) => {
      cat.options.forEach((opt) =>
        items.push({ source: "category", value: opt, categoryId: cat.id })
      );
    });

    return items;
  }, [filteredCustomOutputs, filteredCategories]);

  // keď sa mení zoznam alebo sa zatvorí dropdown, udrž aktívny index v medziach
  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }
    if (flatItems.length === 0) {
      setActiveIndex(-1);
      return;
    }
    if (activeIndex < 0 || activeIndex >= flatItems.length) {
      setActiveIndex(0);
    }
  }, [open, flatItems.length, activeIndex]);

  const activeValue =
    activeIndex >= 0 && activeIndex < flatItems.length
      ? flatItems[activeIndex].value
      : null;

  // --- toggle výberu ---
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

  // --- Enter / Arrow klávesy ---
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      if (flatItems.length === 0) return;

      setActiveIndex((prev) => {
        if (prev < 0) return 0;
        const next = prev + 1;
        return next >= flatItems.length ? 0 : next;
      });
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      if (flatItems.length === 0) return;

      setActiveIndex((prev) => {
        if (prev < 0) return flatItems.length - 1;
        const next = prev - 1;
        return next < 0 ? flatItems.length - 1 : next;
      });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      // 1) ak je niečo aktívne (↑ ↓), Enter toggluje túto položku
      if (open && activeValue) {
        handleToggleOption(activeValue);
        return;
      }

      // 2) inak sa správa ako doteraz: vytvorí nový custom, ak neexistuje
      const newItem = query.trim();
      if (!newItem) return;

      if (OPTION_MAP[newItem]) {
        handleToggleOption(newItem);
        setQuery("");
        return;
      }

      setCustomOutputs((prev) => [...prev, newItem]);
      onChange([...selectedValues, newItem]);
      onToggleFavorite(newItem); // nech sa to drží aj v parent favorites.outputs
      setQuery("");
      setOpen(true);
    }
  };

  const handleClearAll = () => {
    setQuery("");
    setWarning("");
    onChange([]);
    setActiveIndex(-1);
  };

  const handleDeleteCustom = (opt) => {
    setCustomOutputs((prev) => prev.filter((c) => c !== opt));
    onToggleFavorite(opt); // ak je aj vo favorites.outputs, odstráni sa aj tam

    if (selectedValues.includes(opt)) {
      onChange(selectedValues.filter((v) => v !== opt));
    }
  };

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

        <button
          type="button"
          onClick={handleClearAll}
          className="text-slate-400 hover:text-slate-600 text-lg"
          title="Vymazať všetky výstupy"
        >
          ✕
        </button>
      </div>

      {/* TAGY */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 my-1">
          {selectedValues.map((opt) => (
            <span
              key={opt}
              className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs flex items-center gap-1"
            >
              {opt}
              <button
                type="button"
                onClick={() => handleToggleOption(opt)}
                className="text-[11px]"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div className="relative">
        <input
          id={id}
          type="text"
          placeholder="Pridaj alebo vyhľadaj…"
          className="w-full bg-white px-3 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto text-sm z-20">
          {/* CUSTOM FORMÁTY */}
          {filteredCustomOutputs.length > 0 && (
            <div className="border-b border-slate-100">
              <div className="px-4 pt-2 pb-1 text-[11px] uppercase text-violet-600">
                Vlastné formáty
              </div>

              {filteredCustomOutputs.map((opt) => {
                const selected = selectedValues.includes(opt);
                const highlighted = activeValue === opt;

                return (
                  <div
                    key={opt}
                    className={`w-full px-4 py-2 flex justify-between items-center cursor-pointer ${
                      highlighted
                        ? "bg-slate-100"
                        : selected
                        ? "bg-orange-50 text-orange-700"
                        : "hover:bg-violet-50"
                    }`}
                    onClick={() => handleToggleOption(opt)}
                  >
                    <span>{opt}</span>
                    <button
                      type="button"
                      className="text-xs text-red-400 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustom(opt);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* KATEGÓRIE */}
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="border-b last:border-b-0">
              <div className="px-4 pt-2 pb-1 text-[11px] uppercase text-slate-400">
                {cat.label}
              </div>

              {cat.options.map((opt) => {
                const selected = selectedValues.includes(opt);
                const highlighted = activeValue === opt;

                return (
                  <div
                    key={opt}
                    className={`w-full px-4 py-2 cursor-pointer ${
                      highlighted
                        ? "bg-slate-100"
                        : selected
                        ? "bg-orange-50 text-orange-700"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => handleToggleOption(opt)}
                  >
                    {opt}
                  </div>
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
