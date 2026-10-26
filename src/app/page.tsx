"use client";

import { useEffect, useState } from "react";

const stats = [
  { label: "Average grade", value: "88.4%", note: "+2.1 points this month" },
  { label: "Attendance", value: "92%", note: "On track this term" },
  { label: "Due this week", value: "4", note: "2 high priority" },
];

const courses = [
  { title: "Data Structures", code: "CS 201", teacher: "Prof. James Lee", grade: 91, color: "bg-blue-500" },
  { title: "UI/UX Design", code: "DES 210", teacher: "Maya Patel", grade: 87, color: "bg-violet-500" },
  { title: "Statistics", code: "MTH 140", teacher: "Dr. Olivia West", grade: 82, color: "bg-emerald-500" },
  { title: "Research Methods", code: "SOC 205", teacher: "Ali Morgan", grade: 93, color: "bg-amber-500" },
];

const assignments = [
  { subject: "CS 201", title: "Binary Tree Lab", due: "Today, 11:59 PM", status: "Pending" },
  { subject: "SOC 205", title: "Survey Design Draft", due: "Tue, Oct 27", status: "Pending" },
  { subject: "DES 210", title: "Moodboard Review", due: "Wed, Oct 28", status: "In review" },
  { subject: "MTH 140", title: "Probability Quiz 3", due: "Fri, Oct 30", status: "Pending" },
];

export default function Home() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [date, setDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
    setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }));
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#4f46e5_0%,_#0f172a_28%,_#020817_100%)] p-4 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-violet-500/30 bg-slate-950/60 p-5 shadow-[0_20px_50px_rgba(79,70,229,0.24)] backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-[0.2em] text-violet-300 uppercase">{date || "Student Portal"}</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {greeting}, Ni'mah
              </h1>
              <p className="mt-1 text-sm text-slate-300">Here’s your study overview.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              3 goals ahead
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Student summary">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.35)]">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-300">{stat.note}</p>
            </article>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl border border-slate-700/80 bg-slate-900/70 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.35)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">My Courses</h2>
              <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-sm font-medium text-violet-200">{courses.length} courses</span>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <article key={course.code} className="rounded-2xl border border-slate-700/80 bg-slate-950/60 p-4 transition-all duration-200 hover:border-violet-400/40 hover:bg-slate-800/80">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center text-xs font-medium text-slate-400">
                        <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${course.color}`} />
                        {course.code}
                      </p>
                      <h3 className="mt-1 font-semibold text-white">{course.title}</h3>
                      <p className="mt-0.5 text-sm text-slate-400">{course.teacher}</p>
                    </div>
                    <p className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-sm font-semibold tabular-nums text-violet-100 ring-1 ring-inset ring-white/10">{course.grade}%</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-700/80 bg-slate-900/70 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.35)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Upcoming assignments</h2>
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-sm font-medium text-slate-200">{assignments.length} due</span>
            </div>

            <ul className="divide-y divide-slate-700/80">
              {assignments.map((assignment) => (
                <li key={assignment.title} className="flex items-start justify-between gap-3 py-4 first:pt-1 last:pb-1">
                  <div className="min-w-0">
                    <p className="font-medium text-white">{assignment.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{assignment.subject} · {assignment.due}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${assignment.status === "Pending" ? "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-400/30" : "bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-400/30"}`}>
                    {assignment.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}