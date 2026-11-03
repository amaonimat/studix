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
      <header className="rounded-2xl border border-green-100 bg-white p-5 sm:rounded-3xl sm:p-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-green-700 uppercase sm:text-sm">{date || "Student Portal"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
          {greeting}, Ni&apos;mah
        </h1>
        <p className="mt-1 text-sm text-green-800">Here’s your study overview.</p>
      </header>

      <section className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-3" aria-label="Student summary">
        {stats.map((stat) => {
          const body = (
            <>
              <p className="text-sm text-green-700">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-green-800">{stat.value}</p>
              <p className="mt-1 text-sm text-green-700">{stat.note}</p>
            </>
          );
          return stat.action ? (
            <button
              key={stat.label}
              type="button"
              onClick={stat.action}
              className="min-h-28 rounded-xl border border-green-200 bg-white p-4 text-left transition-colors hover:border-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 min-[420px]:col-span-2 sm:p-5 lg:col-span-1"
            >
              {body}
              <span className="mt-2 inline-block text-sm font-medium text-green-800 underline">Show pending work</span>
            </button>
          ) : (
            <article key={stat.label} className="min-h-28 rounded-xl border border-green-100 bg-white p-4 sm:p-5">
              {body}
            </article>
          );
        })}
      </section>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-6">
        <section className="min-w-0 rounded-xl border border-green-100 bg-white p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg font-semibold text-green-950">My Courses</h2>
              <span className="text-sm text-green-700">{courses.length} courses</span>
            </div>
            <label className="flex min-w-0 items-center gap-2 text-sm text-green-800">
              <span className="shrink-0">Sort by</span>
              <select
                value={courseSort}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "grade-desc" || value === "grade-asc" || value === "name") onCourseSortChange(value);
                }}
                className="min-h-11 max-w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm text-green-950 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
              >
                <option value="grade-desc">Highest grade</option>
                <option value="grade-asc">Lowest grade</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>

          <div className="space-y-3">
            {sortedCourses.map((course) => {
              const open = openCount(course.code);
              return (
                <button
                  key={course.code}
                  type="button"
                  onClick={() => onOpenCourse(course.code)}
                  className="block min-h-11 w-full rounded-lg border border-green-100 bg-[#f8faf8] p-4 text-left transition-colors hover:border-green-400 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-wide text-green-700">{course.code}</p>
                      <h3 className="mt-1 break-words font-semibold text-green-950">{course.title}</h3>
                      <p className="mt-0.5 text-sm text-green-700">{course.teacher}</p>
                      <p className="mt-2 text-xs text-green-700">
                        {open ? `${open} pending assignment${open === 1 ? "" : "s"}` : "All caught up"}
                      </p>
                    </div>
                    <p className="shrink-0 text-lg font-semibold tabular-nums text-green-950">{course.grade}%</p>
                  </div>
                  <div className="mt-3">
                    <Progress value={course.grade} className={course.color} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {children}
      </div>
    </>
  );
}
