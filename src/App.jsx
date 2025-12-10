// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import PromptForm from "./components/PromptForm";
import PreviewPanel from "./components/PreviewPanel";
import buildPreview from "./utils/buildPreview";

const API_URL = "http://localhost:8000/generate-basic-prompt";

export default function App() {
  const [form, setForm] = useState({
    persona: "",
    task: "",
    goal: "",
    tone: "",
    output: "",
  });
  const [cot, setCot] = useState(false);
  const [jsonMode, setJsonMode] = useState(false);
  const [status, setStatus] = useState("");
  const [savedPrompts, setSavedPrompts] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        window.localStorage.getItem("saved_prompts") || "[]"
      );
      setSavedPrompts(stored);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "saved_prompts",
        JSON.stringify(savedPrompts)
      );
    } catch {
      // ignore
    }
  }, [savedPrompts]);

  const preview = useMemo(
    () => buildPreview(form, cot, jsonMode),
    [form, cot, jsonMode]
  );

  const handleClear = () => {
    setForm({
      persona: "",
      task: "",
      goal: "",
      tone: [],
      output: [],
    });
    setCot(false);
    setStatus("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(preview.trim());
      setStatus("Prompt skopírovaný.");
    } catch {
      setStatus("Nepodarilo sa skopírovať.");
    }
  };

  const handleSave = () => {
    if (!form.task.trim()) {
      setStatus("Task musí byť vyplnený na uloženie.");
      return;
    }
    const id = crypto.randomUUID();
    const title =
      form.task.length > 50 ? form.task.slice(0, 50) + "…" : form.task;

    const entry = {
      id,
      title,
      ...form,
      cot,
    };

    setSavedPrompts((prev) => [...prev, entry]);
    setStatus("Prompt uložený.");
  };

  const handleLoadPrompt = (p) => {
    setForm({
      persona: p.persona || "",
      task: p.task || "",
      goal: p.goal || "",
      tone: p.tone || "",
      output: p.output || "",
    });
    setCot(!!p.cot);
    setStatus("Prompt načítaný.");
  };

  const handleDeletePrompt = (id) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleGenerateFromApi = async () => {
    setStatus("Generujem prompt…");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cot,
          format: jsonMode ? "json" : "text",
        }),
      });
      const json = await res.json();
      const prompt = json.prompt || preview;
      await navigator.clipboard.writeText(prompt);
      setStatus("Prompt vygenerovaný a skopírovaný z API.");
    } catch (e) {
      console.error(e);
      setStatus("Nepodarilo sa kontaktovať server.");
    }
  };

  const [favorites, setFavorites] = useState(() => {
  try {
    const stored = JSON.parse(localStorage.getItem("favorites"));
    return stored ?? { personas: [], tones: [] };
  } catch {
    return { personas: [], tones: [] };
  }
});

useEffect(() => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}, [favorites]);


useEffect(() => {
  try {
    const stored = JSON.parse(localStorage.getItem("favorites") || "{}");
    setFavorites({
      personas: stored.personas || [],
      tones: stored.tones || []
    });
  } catch {}
}, []);

useEffect(() => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}, [favorites]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-4">
      <div className="w-full max-w-[1600px] mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] overflow-visible">
        <Sidebar />
        <main className="bg-slate-50 p-4 md:p-5 grid grid-rows-[auto_minmax(0,1fr)] gap-3">
          <header className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-base font-semibold">
                  Vytvor si jasný a opakovateľný prompt
                </h1>
                <p className="text-xs text-slate-500">
                  Vyplň bloky vľavo – vpravo okamžite vidíš finálny prompt.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-500">
                Mode: Basic
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full min-h-[400px]">
            <PromptForm
              form={form}
              setForm={setForm}
              cot={cot}
              setCot={setCot}
              jsonMode={jsonMode}
              setJsonMode={setJsonMode}
              status={status}
              onClear={handleClear}
              onGenerateFromApi={handleGenerateFromApi}
              favorites={favorites}
              setFavorites={setFavorites}
            />
            <PreviewPanel
              preview={preview}
              cot={cot}
              jsonMode={jsonMode}
              setJsonMode={setJsonMode}
              onCopy={handleCopy}
              onSave={handleSave}
              savedPrompts={savedPrompts}
              onLoadPrompt={handleLoadPrompt}
              onDeletePrompt={handleDeletePrompt}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
