"use client";

import { useEffect, useRef, useState } from "react";

type AutocompleteProps = {
  value: string;
  onChange: (v: string) => void;
  onSelect?: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
  maxShown?: number;
  id?: string;
  className?: string;
};

export default function Autocomplete({
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder,
  maxShown = 8,
  id,
  className,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [serverSuggestions, setServerSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const merged = [...suggestions, ...serverSuggestions];

  const filtered = merged
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, maxShown);

  useEffect(() => {
    setHighlight(null);
  }, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // debounced async suggestions from /api/movies?q=
  useEffect(() => {
    // don't fetch for very short queries
    if (!value || value.trim().length < 2) {
      setServerSuggestions([]);
      setLoading(false);
      abortRef.current?.abort();
      abortRef.current = null;
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const timer = window.setTimeout(() => {
      const q = encodeURIComponent(value.trim());
      fetch(`/api/movies?q=${q}&limit=${maxShown}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data)) return;
          const titles = data.map((m: any) => (m.title ? String(m.title) : "")).filter(Boolean);
          setServerSuggestions(titles.slice(0, maxShown));
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error("Autocomplete fetch error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  function acceptSelection(sel: string) {
    onChange(sel);
    onSelect?.(sel);
    setOpen(false);
  }

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={id ? `${id}-listbox` : undefined}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setHighlight((h) => (h === null ? 0 : Math.min(filtered.length - 1, h + 1)));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            setHighlight((h) => (h === null ? filtered.length - 1 : Math.max(0, h - 1)));
          } else if (e.key === "Enter") {
            if (open && highlight !== null) {
              e.preventDefault();
              acceptSelection(filtered[highlight]);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />

      {open && (filtered.length > 0 || loading) && (
        <ul
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          className="absolute z-40 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-white/10 bg-slate-900/90 p-1 text-sm shadow-lg"
        >
          {loading && (
            <li className="px-3 py-2 text-white/60">Loading…</li>
          )}
          {filtered.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={highlight === i}
              onMouseDown={(ev) => {
                // prevent input blur before click
                ev.preventDefault();
                acceptSelection(s);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`cursor-pointer rounded px-3 py-2 ${
                highlight === i ? "bg-amber-400/10 text-amber-300" : "text-white/90"
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
