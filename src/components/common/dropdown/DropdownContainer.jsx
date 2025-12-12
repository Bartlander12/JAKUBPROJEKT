// src/components/common/dropdown/DropdownContainer.jsx
import React, { useEffect, useRef } from "react";

export default function DropdownContainer({
  open,
  onClose,
  children,
  containerRef,
  activeIndex,
  setActiveIndex,
  itemCount,
  onSelectIndex,
}) {
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !containerRef?.current?.contains(e.target)
      ) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, containerRef]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    function handleKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev + 1 < itemCount ? prev + 1 : 0
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev - 1 >= 0 ? prev - 1 : itemCount - 1
        );
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0) onSelectIndex(activeIndex);
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, itemCount, activeIndex, onClose, onSelectIndex, setActiveIndex]);

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute left-3 right-3 mt-1 top-full bg-white border border-slate-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto text-sm z-20"
    >
      {children}
    </div>
  );
}
