"use client";

import type { FormEvent } from "react";
import {
  INPUT_CLASS,
  PRIORITY,
  STATUS,
  courses,
  formatDue,
  isOverdue,
  keyFromOffset,
  relativeDue,
  type Assignment,
  type AssignmentStatus,
  type Course,
  type ToastState,
} from "../dashboard-data";
import { Panel, Progress, StatusBadge } from "./DashboardUI";

export default function DashboardPanels({
  activeAssignment,
  activeCourse,
  assignments,
  isNewAssignmentOpen,
  toast,
  formError,
  onClosePanel,
  onToggleStep,
  onPatchAssignment,
  onSetStatus,
  onShowCourseAssignments,
  onRemoveAssignment,
  onOpenAssignment,
  onAddAssignment,
  onClearFormError,
  onUndoToast,
  onDismissToast,
}: {
  activeAssignment: Assignment | null;
  activeCourse: Course | null;
  assignments: Assignment[];
  isNewAssignmentOpen: boolean;
  toast: ToastState | null;
  formError: string;
  onClosePanel: () => void;
  onToggleStep: (id: string, index: number) => void;
  onPatchAssignment: (id: string, changes: Partial<Assignment>) => void;
  onSetStatus: (id: string, status: AssignmentStatus) => void;
  onShowCourseAssignments: (code: string) => void;
  onRemoveAssignment: (id: string) => void;
  onOpenAssignment: (id: string) => void;
  onAddAssignment: (event: FormEvent<HTMLFormElement>) => void;
  onClearFormError: () => void;
  onUndoToast: () => void;
  onDismissToast: () => void;
}) {
  return (
    <>
      {activeAssignment && (
        <Panel label={`${activeAssignment.title} details`} onClose={onClosePanel}>
          {(() => {
            const course = courses.find((item) => item.code === activeAssignment.code);
            const doneSteps = activeAssignment.steps.filter((step) => step.done).length;
            const progress = activeAssignment.steps.length
              ? Math.round((doneSteps / activeAssignment.steps.length) * 100)
              : 0;
            return (
              <div className="space-y-5 pt-12 sm:pt-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={activeAssignment.status} />
                    <span className={`text-sm font-medium ${PRIORITY[activeAssignment.priority].text}`}>
                      {PRIORITY[activeAssignment.priority].label}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">{activeAssignment.title}</h2>
                  <p className="mt-1 text-sm text-green-700">
                    {course?.title} ({activeAssignment.code}) · {course?.teacher}
                  </p>
                </div>

                <div className="rounded-lg border border-green-100 bg-[#f8faf8] p-4">
                  <p className="text-sm text-green-700">Due</p>
                  <p className="font-semibold">{formatDue(activeAssignment.due)}, 11:59 PM</p>
                  <p
                    className={`mt-0.5 text-sm ${
                      isOverdue(activeAssignment) ? "font-medium text-red-700" : "text-green-700"
                    }`}
                  >
                    {activeAssignment.status === "pending"
                      ? relativeDue(activeAssignment.due)
                      : STATUS[activeAssignment.status].label}
                  </p>
                </div>

                {activeAssignment.description && (
                  <div>
                    <h3 className="text-sm font-semibold">Instructions</h3>
                    <p className="mt-1 text-sm leading-relaxed text-green-900">{activeAssignment.description}</p>
                  </div>
                )}

                {activeAssignment.steps.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Checklist</h3>
                      <span className="text-sm tabular-nums text-green-700">
                        {doneSteps} of {activeAssignment.steps.length} done
                      </span>
                    </div>
                    <Progress value={progress} />
                    <ul className="mt-3 space-y-2">
                      {activeAssignment.steps.map((step, index) => (
                        <li key={index}>
                          <label className="flex cursor-pointer items-start gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={step.done}
                              onChange={() => onToggleStep(activeAssignment.id, index)}
                              className="mt-0.5 h-4 w-4 accent-green-700"
                            />
                            <span className={step.done ? "text-green-700 line-through" : ""}>{step.text}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label htmlFor="notes" className="text-sm font-semibold">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={activeAssignment.notes}
                    onChange={(event) => onPatchAssignment(activeAssignment.id, { notes: event.target.value })}
                    placeholder="Add reminders or questions for your teacher"
                    className={`${INPUT_CLASS} mt-1`}
                  />
                </div>

                <div className="flex flex-wrap gap-2 border-t border-green-100 pt-4">
                  {activeAssignment.status === "pending" ? (
                    <button
                      type="button"
                      onClick={() => onSetStatus(activeAssignment.id, "submitted")}
                      className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                    >
                      Mark as submitted
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSetStatus(activeAssignment.id, "pending")}
                      className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-50"
                    >
                      Move back to pending
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onShowCourseAssignments(activeAssignment.code)}
                    className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-50"
                  >
                    More from {activeAssignment.code}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveAssignment(activeAssignment.id)}
                    className="ml-auto rounded-lg px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })()}
        </Panel>
      )}

      {activeCourse && (
        <Panel label={`${activeCourse.title} details`} onClose={onClosePanel}>
          <div className="space-y-5 pt-12 sm:pt-8">
            <div>
              <p className="text-sm font-medium text-green-700">
                {activeCourse.code}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">{activeCourse.title}</h2>
              <p className="mt-1 text-sm text-green-700">{activeCourse.teacher}</p>
            </div>

            <div className="rounded-lg border border-green-100 bg-[#f8faf8] p-4">
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-sm text-green-700">Current grade</p>
                <p className="text-2xl font-semibold tabular-nums">{activeCourse.grade}%</p>
              </div>
              <Progress value={activeCourse.grade} className={activeCourse.color} />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Assignments</h3>
              {assignments.filter((assignment) => assignment.code === activeCourse.code).length === 0 ? (
                <p className="text-sm text-green-700">No assignments for this course yet.</p>
              ) : (
                <ul className="space-y-2">
                  {assignments
                    .filter((assignment) => assignment.code === activeCourse.code)
                    .map((assignment) => (
                      <li key={assignment.id}>
                        <button
                          type="button"
                          onClick={() => onOpenAssignment(assignment.id)}
                          className="flex w-full items-center justify-between gap-3 rounded-lg border border-green-100 p-3 text-left hover:border-green-400"
                        >
                          <span className="min-w-0">
                            <span className="block font-medium">{assignment.title}</span>
                            <span className="block text-sm text-green-700">{formatDue(assignment.due)}</span>
                          </span>
                          <StatusBadge status={assignment.status} />
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={() => onShowCourseAssignments(activeCourse.code)}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
            >
              Filter assignments by {activeCourse.code}
            </button>
          </div>
        </Panel>
      )}

      {isNewAssignmentOpen && (
        <Panel label="Add assignment" onClose={onClosePanel}>
          <form onSubmit={onAddAssignment} className="space-y-4 pt-12 sm:pt-8" noValidate>
            <h2 className="text-2xl font-semibold tracking-tight">Add assignment</h2>

            <div>
              <label htmlFor="title" className="text-sm font-semibold">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                onChange={onClearFormError}
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "title-error" : undefined}
                placeholder="e.g. Chapter 4 reading response"
                className={`${INPUT_CLASS} mt-1`}
              />
              {formError && (
                <p id="title-error" className="mt-1 text-sm text-red-700">
                  {formError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="code" className="text-sm font-semibold">
                  Course
                </label>
                <select id="code" name="code" defaultValue={courses[0].code} className={`${INPUT_CLASS} mt-1`}>
                  {courses.map((course) => (
                    <option key={course.code} value={course.code}>
                      {course.code} · {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="text-sm font-semibold">
                  Priority
                </label>
                <select id="priority" name="priority" defaultValue="medium" className={`${INPUT_CLASS} mt-1`}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="due" className="text-sm font-semibold">
                Due date
              </label>
              <input id="due" name="due" type="date" defaultValue={keyFromOffset(3)} className={`${INPUT_CLASS} mt-1`} />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-semibold">
                Instructions (optional)
              </label>
              <textarea id="description" name="description" rows={3} className={`${INPUT_CLASS} mt-1`} />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                Add assignment
              </button>
              <button
                type="button"
                onClick={onClosePanel}
                className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </Panel>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] mx-auto flex max-w-md items-center justify-between gap-4 rounded-xl bg-green-950 px-4 py-3 text-sm text-green-50 shadow-xl sm:left-1/2 sm:right-auto sm:w-[calc(100%-2rem)] sm:-translate-x-1/2"
        >
          <span>{toast.text}</span>
          <span className="flex shrink-0 items-center gap-3">
            {toast.undo && (
              <button type="button" onClick={onUndoToast} className="font-medium underline">
                Undo
              </button>
            )}
            <button type="button" onClick={onDismissToast} aria-label="Dismiss" className="text-green-200">
              ✕
            </button>
          </span>
        </div>
      )}
    </>
  );
}
