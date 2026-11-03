"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import AssignmentsSection from "./components/AssignmentsSection";
import DashboardOverview from "./components/DashboardOverview";
import DashboardPanels from "./components/DashboardPanels";
import {
  PRIORITY,
  STORAGE_KEY,
  courses,
  daysFromToday,
  isAssignment,
  isOverdue,
  isPriorityLevel,
  keyFromOffset,
  makeSeed,
  type Assignment,
  type AssignmentSort,
  type AssignmentStatus,
  type CourseSort,
  type PanelState,
  type StatusFilter,
  type ToastState,
} from "./dashboard-data";

export default function Home() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [date, setDate] = useState("");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [ready, setReady] = useState(false);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<AssignmentSort>("due");
  const [courseSort, setCourseSort] = useState<CourseSort>("grade-desc");

  const [panel, setPanel] = useState<PanelState>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [formError, setFormError] = useState("");

  const assignmentsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    // These browser-only values must be initialized after hydration to avoid server/client mismatches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
    setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }));

    let saved: unknown = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      saved = stored ? JSON.parse(stored) : null;
    } catch {
      saved = null;
    }
    setAssignments(Array.isArray(saved) && saved.every(isAssignment) ? saved : makeSeed());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch {}
  }, [assignments, ready]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const courseByCode = useMemo(() => new Map(courses.map((course) => [course.code, course])), []);

  const showToast = (text: string, undo?: () => void) => setToast({ text, undo });

  const patchAssignment = (id: string, changes: Partial<Assignment>) =>
    setAssignments((list) => list.map((assignment) => (assignment.id === id ? { ...assignment, ...changes } : assignment)));

  const setStatus = (id: string, status: AssignmentStatus) => {
    const before = assignments.find((assignment) => assignment.id === id);
    if (!before || before.status === status) return;
    patchAssignment(id, { status });
    showToast(
      status === "submitted" ? `“${before.title}” marked as submitted` : `“${before.title}” moved back to pending`,
      () => patchAssignment(id, { status: before.status })
    );
  };

  const toggleDone = (assignment: Assignment) =>
    setStatus(assignment.id, assignment.status === "pending" ? "submitted" : "pending");

  const toggleStep = (id: string, index: number) => {
    const assignment = assignments.find((item) => item.id === id);
    if (!assignment) return;
    patchAssignment(id, {
      steps: assignment.steps.map((step, stepIndex) =>
        stepIndex === index ? { ...step, done: !step.done } : step
      ),
    });
  };

  const removeAssignment = (id: string) => {
    const index = assignments.findIndex((assignment) => assignment.id === id);
    const removed = assignments[index];
    if (!removed) return;
    setAssignments((list) => list.filter((assignment) => assignment.id !== id));
    setPanel(null);
    showToast(`“${removed.title}” deleted`, () =>
      setAssignments((list) => {
        const copy = [...list];
        copy.splice(index, 0, removed);
        return copy;
      })
    );
  };

  const addAssignment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) {
      setFormError("Give the assignment a title.");
      return;
    }

    const code = String(form.get("code") || "");
    const priority = form.get("priority");
    if (!courses.some((course) => course.code === code) || !isPriorityLevel(priority)) {
      setFormError("Choose a valid course and priority.");
      return;
    }

    const created: Assignment = {
      id: `a${Date.now()}`,
      code,
      title,
      due: String(form.get("due")) || keyFromOffset(1),
      priority,
      status: "pending",
      description: String(form.get("description") || "").trim(),
      steps: [],
      notes: "",
    };
    setAssignments((list) => [...list, created]);
    setFormError("");
    setPanel({ type: "assignment", id: created.id });
    showToast(`“${title}” added`);
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setCourseFilter("all");
    setQuery("");
  };

  const showCourseAssignments = (code: string) => {
    setCourseFilter(code);
    setStatusFilter("all");
    setQuery("");
    setPanel(null);
    assignmentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showDueThisWeek = () => {
    setStatusFilter("pending");
    setCourseFilter("all");
    setQuery("");
    assignmentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const averageGrade = (courses.reduce((sum, course) => sum + course.grade, 0) / courses.length).toFixed(1);
  const dueThisWeek = assignments.filter(
    (assignment) => assignment.status === "pending" && daysFromToday(assignment.due) <= 7
  );
  const highCount = dueThisWeek.filter((assignment) => assignment.priority === "high").length;

  const stats = [
    { label: "Average grade", value: `${averageGrade}%`, note: "+2.1 points this month" },
    { label: "Attendance", value: "92%", note: "On track this term" },
    {
      label: "Due this week",
      value: String(dueThisWeek.length),
      note: highCount ? `${highCount} high priority` : "Nothing urgent",
      action: showDueThisWeek,
    },
  ];

  const baseList = assignments.filter((assignment) => {
    if (courseFilter !== "all" && assignment.code !== courseFilter) return false;
    const search = query.trim().toLowerCase();
    const courseTitle = courseByCode.get(assignment.code)?.title ?? "";
    return !search || `${assignment.title} ${assignment.code} ${courseTitle}`.toLowerCase().includes(search);
  });

  const counts: Record<StatusFilter, number> = {
    all: baseList.length,
    pending: baseList.filter((assignment) => assignment.status === "pending").length,
    review: baseList.filter((assignment) => assignment.status === "review").length,
    submitted: baseList.filter((assignment) => assignment.status === "submitted").length,
    overdue: baseList.filter(isOverdue).length,
  };

  const visible = baseList
    .filter((assignment) =>
      statusFilter === "all"
        ? true
        : statusFilter === "overdue"
          ? isOverdue(assignment)
          : assignment.status === statusFilter
    )
    .sort((a, b) => {
      const doneA = a.status === "submitted" ? 1 : 0;
      const doneB = b.status === "submitted" ? 1 : 0;
      if (doneA !== doneB) return doneA - doneB;
      if (sort === "priority") {
        const difference = PRIORITY[a.priority].rank - PRIORITY[b.priority].rank;
        if (difference) return difference;
      }
      return a.due.localeCompare(b.due);
    });

  const sortedCourses = [...courses].sort((a, b) =>
    courseSort === "grade-desc"
      ? b.grade - a.grade
      : courseSort === "grade-asc"
        ? a.grade - b.grade
        : a.title.localeCompare(b.title)
  );

  const openCount = (code: string) =>
    assignments.filter((assignment) => assignment.code === code && assignment.status === "pending").length;

  const activeAssignment =
    panel?.type === "assignment" ? assignments.find((assignment) => assignment.id === panel.id) ?? null : null;
  const activeCourse = panel?.type === "course" ? courseByCode.get(panel.id) ?? null : null;
  const filtersActive = statusFilter !== "all" || courseFilter !== "all" || query.trim() !== "";

  return (
    <main className="min-h-svh bg-[#f5f7f4] px-4 py-5 text-green-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-7">
        <DashboardOverview
          greeting={greeting}
          date={date}
          stats={stats}
          courseSort={courseSort}
          sortedCourses={sortedCourses}
          openCount={openCount}
          onCourseSortChange={setCourseSort}
          onOpenCourse={(code) => setPanel({ type: "course", id: code })}
        >
          <AssignmentsSection
            assignments={assignments}
            visible={visible}
            counts={counts}
            ready={ready}
            statusFilter={statusFilter}
            courseFilter={courseFilter}
            query={query}
            sort={sort}
            filtersActive={filtersActive}
            onStatusFilterChange={setStatusFilter}
            onCourseFilterChange={setCourseFilter}
            onQueryChange={setQuery}
            onSortChange={setSort}
            onAdd={() => {
              setFormError("");
              setPanel({ type: "new" });
            }}
            onResetFilters={resetFilters}
            onToggleDone={toggleDone}
            onOpenAssignment={(id) => setPanel({ type: "assignment", id })}
            sectionRef={(element) => {
              assignmentsRef.current = element;
            }}
          />
        </DashboardOverview>

        <DashboardPanels
          activeAssignment={activeAssignment}
          activeCourse={activeCourse ?? null}
          assignments={assignments}
          isNewAssignmentOpen={panel?.type === "new"}
          toast={toast}
          formError={formError}
          onClosePanel={() => setPanel(null)}
          onToggleStep={toggleStep}
          onPatchAssignment={patchAssignment}
          onSetStatus={setStatus}
          onShowCourseAssignments={showCourseAssignments}
          onRemoveAssignment={removeAssignment}
          onOpenAssignment={(id) => setPanel({ type: "assignment", id })}
          onAddAssignment={addAssignment}
          onClearFormError={() => setFormError("")}
          onUndoToast={() => {
            toast?.undo?.();
            setToast(null);
          }}
          onDismissToast={() => setToast(null)}
        />
      </div>
    </main>
  );
}
