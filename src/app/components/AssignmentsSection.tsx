"use client";

import {
  BTN_PRIMARY,
  FILTERS,
  INPUT_CLASS,
  courses,
  formatDue,
  isOverdue,
  type Assignment,
  type AssignmentSort,
  type CourseCode,
  type StatusFilter,
} from "../dashboard-data";
import { StatusBadge } from "./DashboardUI";

export default function AssignmentsSection({
  assignments,
  visible,
  counts,
  ready,
  statusFilter,
  courseFilter,
  query,
  sort,
  filtersActive,
  onStatusFilterChange,
  onCourseFilterChange,
  onQueryChange,
  onSortChange,
  onAdd,
  onResetFilters,
  onToggleDone,
  onOpenAssignment,
  sectionRef,
}: {
  assignments: Assignment[];
  visible: Assignment[];
  counts: Record<StatusFilter, number>;
  ready: boolean;
  statusFilter: StatusFilter;
  courseFilter: "all" | CourseCode;
  query: string;
  sort: AssignmentSort;
  filtersActive: boolean;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onCourseFilterChange: (filter: "all" | CourseCode) => void;
  onQueryChange: (query: string) => void;
  onSortChange: (sort: AssignmentSort) => void;
  onAdd: () => void;
  onResetFilters: () => void;
  onToggleDone: (assignment: Assignment) => void;
  onOpenAssignment: (id: string) => void;
  sectionRef: (element: HTMLElement | null) => void;
}) {
  return (
    <section
      ref={sectionRef}
      className="scroll-mt-6 min-w-0 rounded-xl border border-line bg-surface p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-semibold text-ink">Assignments</h2>
          <span className="text-sm tabular-nums text-muted">
            {visible.length} of {assignments.length}
          </span>
        </div>
        <button type="button" onClick={onAdd} className={BTN_PRIMARY}>
          Add assignment
        </button>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by title or course"
          aria-label="Search assignments"
          className={INPUT_CLASS}
        />
        <div className="grid grid-cols-2 gap-2 sm:contents">
          <select
            aria-label="Filter by course"
            value={courseFilter}
            onChange={(event) => onCourseFilterChange(event.target.value)}
            className={`${INPUT_CLASS} sm:w-auto`}
          >
            <option value="all">All courses</option>
            {courses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code}
              </option>
            ))}
          </select>
          <select
            aria-label="Sort assignments"
            value={sort}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "due" || value === "priority") onSortChange(value);
            }}
            className={`${INPUT_CLASS} sm:w-auto`}
          >
            <option value="due">Sort by due date</option>
            <option value="priority">Sort by priority</option>
          </select>
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter by status"
        className="-mx-4 mt-4 flex flex-wrap border-b border-line px-4 sm:-mx-6 sm:px-6"
      >
        {FILTERS.map((filter) => {
          const active = statusFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active}
              onClick={() => onStatusFilterChange(filter.id)}
              className={`-mb-px shrink-0 border-b-2 py-3 pr-5 text-sm whitespace-nowrap transition-colors ${
                active ? "border-accent font-semibold text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {filter.label}
              <span className="ml-1.5 tabular-nums text-muted">{counts[filter.id]}</span>
            </button>
          );
        })}
      </div>

      {!ready ? (
        <p className="py-10 text-center text-sm text-muted">Loading assignments…</p>
      ) : visible.length === 0 ? (
        <div className="py-10 text-center">
          <p className="font-medium text-ink">
            {assignments.length === 0 ? "No assignments yet" : "No assignments match these filters"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {assignments.length === 0 ? "Add one to start tracking your work." : "Try a different status or course."}
          </p>
          {filtersActive && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-3 text-sm font-medium text-accent underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {visible.map((assignment) => {
            const done = assignment.status !== "pending";
            const overdue = isOverdue(assignment);
            return (
              <li key={assignment.id} className="flex min-w-0 items-start gap-3 py-4">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={assignment.status === "submitted"}
                  aria-label={
                    assignment.status === "submitted"
                      ? `Mark ${assignment.title} as pending`
                      : `Mark ${assignment.title} as submitted`
                  }
                  disabled={assignment.status === "review"}
                  onClick={() => onToggleDone(assignment)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    done ? "border-accent bg-accent text-white" : "border-muted bg-surface hover:border-accent"
                  }`}
                >
                  {done && (
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M2.5 6.5l2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAssignment(assignment.id)}
                  className="group grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-x-4 rounded-md text-left"
                >
                  <span className="min-w-0">
                    <span
                      className={`block break-words font-medium underline-offset-2 group-hover:underline ${
                        assignment.status === "submitted" ? "text-muted line-through" : "text-ink"
                      }`}
                    >
                      {assignment.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{assignment.code}</span>
                  </span>
                  <span className="text-right">
                    <span className={`block text-sm font-medium tabular-nums ${overdue ? "text-alert" : "text-ink"}`}>
                      {formatDue(assignment.due)}
                    </span>
                    <span className="mt-0.5 flex justify-end">
                      <StatusBadge status={assignment.status} overdue={overdue} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}