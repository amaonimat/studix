"use client";

import {
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
    <section ref={sectionRef} className="scroll-mt-4 rounded-xl border border-green-100 bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-semibold text-green-950">Assignments</h2>
          <span className="text-sm text-green-700">
            {visible.length} of {assignments.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="min-h-11 shrink-0 rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          Add assignment
        </button>
      </div>

      <div className="space-y-3">
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by title or course"
          aria-label="Search assignments"
          className={INPUT_CLASS}
        />

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={statusFilter === filter.id}
              onClick={() => onStatusFilterChange(filter.id)}
              className={`min-h-10 rounded-full border px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
                statusFilter === filter.id
                  ? "border-green-700 bg-green-700 text-white"
                  : "border-green-200 bg-white text-green-800 hover:bg-green-50"
              }`}
            >
              {filter.label} <span className="tabular-nums opacity-80">{counts[filter.id]}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
          <label className="text-sm text-green-800">
            <span className="sr-only">Course</span>
            <select
              value={courseFilter}
              onChange={(event) => {
                const value = event.target.value;
                onCourseFilterChange(value);
              }}
              className={INPUT_CLASS}
            >
              <option value="all">All courses</option>
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-green-800">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "due" || value === "priority") onSortChange(value);
              }}
              className={INPUT_CLASS}
            >
              <option value="due">Sort: due date</option>
              <option value="priority">Sort: priority</option>
            </select>
          </label>
        </div>
      </div>

      {!ready ? (
        <p className="py-8 text-center text-sm text-green-700">Loading assignments…</p>
      ) : visible.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-medium text-green-950">
            {assignments.length === 0 ? "No assignments yet" : "No assignments match these filters"}
          </p>
          <p className="mt-1 text-sm text-green-700">
            {assignments.length === 0 ? "Add one to start tracking your work." : "Try a different status or course."}
          </p>
          {filtersActive && (
            <button type="button" onClick={onResetFilters} className="mt-3 text-sm font-medium text-green-800 underline">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-green-100">
          {visible.map((assignment) => {
            const done = assignment.status !== "pending";
            const overdue = isOverdue(assignment);
            return (
              <li key={assignment.id} className="flex min-w-0 items-start gap-3 py-4 first:pt-1 last:pb-1">
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
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:cursor-not-allowed disabled:opacity-60 ${
                    done ? "border-green-700 bg-green-700 text-white" : "border-green-400 bg-white"
                  }`}
                >
                  {done ? "✓" : ""}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAssignment(assignment.id)}
                  className="flex min-w-0 flex-1 flex-col items-start justify-between gap-2 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 min-[480px]:flex-row min-[480px]:items-center"
                >
                  <div className="min-w-0">
                    <p
                      className={`font-medium ${
                        assignment.status === "submitted" ? "text-green-700 line-through" : "text-green-950"
                      }`}
                    >
                      {assignment.title}
                    </p>
                    <p className={`mt-1 text-sm ${overdue ? "font-medium text-red-700" : "text-green-700"}`}>
                      {assignment.code} · {formatDue(assignment.due)}
                      {overdue ? " · Overdue" : ""}
                    </p>
                  </div>
                  <StatusBadge status={assignment.status} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
