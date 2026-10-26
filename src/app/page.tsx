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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#f4f4f5_35%,_#f8fafc_100%)] p-4 text-zinc-900 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-violet-200 bg-white/80 p-5 shadow-[0_18px_40px_rgba(124,58,237,0.08)] backdrop-blur-sm sm:p-6">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] text-violet-600 uppercase">{date || "Student Portal"}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {greeting}, Ni'mah
            </h1>
            <p className="mt-1 text-sm text-zinc-500">Here’s your study overview.</p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Student summary">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-violet-50 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-900">{stat.value}</p>
              <p className="mt-1 text-sm text-zinc-500">{stat.note}</p>
            </article>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">My Courses</h2>
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-sm font-medium text-violet-700">{courses.length} courses</span>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <article key={course.code} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-violet-200 hover:bg-violet-50/70">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-500">
                        <span className={`mr-2 inline-block h-2 w-2 rounded-full ${course.color}`} />
                        {course.code}
                      </p>
                      <h3 className="mt-1 font-semibold text-zinc-900">{course.title}</h3>
                      <p className="mt-0.5 text-sm text-zinc-500">{course.teacher}</p>
                    </div>
                    <p className="shrink-0 rounded-full bg-zinc-900 px-2.5 py-1 text-sm font-semibold tabular-nums text-white">{course.grade}%</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">

            <ul className="divide-y divide-zinc-200">
              {assignments.map((assignment) => (
                <li key={assignment.title} className="flex items-start justify-between gap-3 py-4 first:pt-1 last:pb-1">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900">{assignment.title}</p>
                    <p className="mt-1 text-sm text-zinc-500">{assignment.subject} · {assignment.due}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${assignment.status === "Pending" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
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