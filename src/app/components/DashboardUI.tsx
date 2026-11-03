"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { STATUS, type AssignmentStatus } from "../dashboard-data";

export function Panel({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-green-950/35 sm:justify-end">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <aside
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-2xl border border-green-100 bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 shadow-2xl focus:outline-none sm:h-full sm:max-h-none sm:max-w-md sm:rounded-none sm:px-7 sm:py-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 min-h-11 rounded-lg px-3 text-sm font-medium text-green-800 hover:bg-green-50 sm:right-6 sm:top-6"
        >
          Close
        </button>
        {children}
      </aside>
    </div>
  );
}

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  const style = STATUS[status];
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}>{style.label}</span>;
}

export function Progress({ value, className = "bg-green-600" }: { value: number; className?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-green-100">
      <div className={`h-full rounded-full transition-all ${className}`} style={{ width: `${value}%` }} />
    </div>
  );
}
