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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 sm:justify-end">
      <button type="button" aria-label="Close panel" onClick={onClose} className="absolute inset-0 cursor-default" />
      <aside
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-2xl border border-line bg-surface px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 focus:outline-none sm:h-full sm:max-h-none sm:max-w-md sm:rounded-none sm:border-y-0 sm:border-r-0 sm:px-8 sm:py-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 min-h-11 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-tint hover:text-ink sm:right-5 sm:top-5"
        >
          Close
        </button>
        {children}
      </aside>
    </div>
  );
}

export function StatusBadge({ status, overdue = false }: { status: AssignmentStatus; overdue?: boolean }) {
  const style = STATUS[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 text-sm ${overdue ? "font-medium text-alert" : "text-muted"}`}>
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${overdue ? "bg-alert" : style.dot}`} />
      {overdue ? "Overdue" : style.label}
    </span>
  );
}

export function Progress({ value, className = "bg-accent" }: { value: number; className?: string }) {
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-line">
      <span className={`block h-full rounded-full transition-all ${className}`} style={{ width: `${value}%` }} />
    </span>
  );
}