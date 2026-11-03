"use client";

import type { ReactNode } from "react";
import { courses, type CourseSort } from "../dashboard-data";
import { Progress } from "./DashboardUI";

type SummaryStat = {
  label: string;
  value: string;
  note: string;
  action?: () => void;
};

export default function DashboardOverview({
  greeting,
  date,
  stats,
  courseSort,
  sortedCourses,
  openCount,
  onCourseSortChange,
  onOpenCourse,
  children,
}: {
  greeting: string;
  date: string;
  stats: SummaryStat[];
  courseSort: CourseSort;
  sortedCourses: typeof courses;
  openCount: (code: (typeof courses)[number]["code"]) => number;
  onCourseSortChange: (sort: CourseSort) => void;
  onOpenCourse: (code: (typeof courses)[number]["code"]) => void;
  children: ReactNode;
}) {
  return (
    <>
      <header className="pt-2 sm:pt-6">
        <h1 className="text-4xl font-medium tracking-[-0.025em] text-ink sm:text-5xl">
          {greeting}, Ni&apos;mah
        </h1>
        <p className="mt-3 text-base text-muted">{date || "Student portal"}</p>
      </header>

      <section
        aria-label="Student summary"
        className="grid divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        {stats.map((stat) => {
          const body = (
            <>
              <span className="block text-sm text-muted">{stat.label}</span>
              <span
                className={`mt-2 block text-4xl font-medium tabular-nums tracking-tight ${
                  stat.action ? "text-accent" : "text-ink"
                }`}
              >
                {stat.value}
              </span>
              <span className="mt-1 block text-sm text-muted">{stat.note}</span>
            </>
          );
          const cell = "block py-5 text-left sm:px-6 sm:first:pl-0 sm:last:pr-0";
          return stat.action ? (
            <button key={stat.label} type="button" onClick={stat.action} className={`group ${cell}`}>
              {body}
              <span className="mt-2 block text-sm font-medium text-accent underline-offset-4 group-hover:underline">
                Show pending work
              </span>
            </button>
          ) : (
            <div key={stat.label} className={cell}>
              {body}
            </div>
          );
        })}
      </section>

      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <div className="min-w-0">{children}</div>

        <section className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg font-semibold text-ink">My courses</h2>
              <span className="text-sm text-muted">{courses.length}</span>
            </div>
            <label className="flex min-w-0 items-center gap-2 text-sm text-muted">
              <span className="shrink-0">Sort by</span>
              <select
                value={courseSort}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "grade-desc" || value === "grade-asc" || value === "name") onCourseSortChange(value);
                }}
                className="min-h-10 max-w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink focus:border-accent"
              >
                <option value="grade-desc">Highest grade</option>
                <option value="grade-asc">Lowest grade</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>

          <ul className="mt-2">
            {sortedCourses.map((course) => {
              const open = openCount(course.code);
              return (
                <li key={course.code}>
                  <button
                    type="button"
                    onClick={() => onOpenCourse(course.code)}
                    className="group -mx-3 block w-[calc(100%+1.5rem)] rounded-lg px-3 py-4 text-left transition-colors hover:bg-tint"
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span className="min-w-0">
                        <span className="block break-words font-medium text-ink underline-offset-2 group-hover:underline">
                          {course.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">{course.teacher}</span>
                      </span>
                      <span className="shrink-0 text-2xl font-medium tabular-nums text-ink">
                        {course.grade}
                        <span className="text-sm text-muted">%</span>
                      </span>
                    </span>
                    <span className="mt-3 flex items-center gap-3">
                      <span className="block flex-1">
                        <Progress value={course.grade} />
                      </span>
                      <span className="shrink-0 text-xs text-muted">
                        {open ? `${open} pending` : "All caught up"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}