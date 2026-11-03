export type AssignmentStatus = "pending" | "review" | "submitted";
export type PriorityLevel = "high" | "medium" | "low";

export type Course = {
  title: string;
  code: string;
  teacher: string;
  grade: number;
  color: string;
};

export type AssignmentStep = {
  text: string;
  done: boolean;
};

export type Assignment = {
  id: string;
  code: string;
  title: string;
  due: string;
  priority: PriorityLevel;
  status: AssignmentStatus;
  description: string;
  steps: AssignmentStep[];
  notes: string;
};

export type CourseSort = "grade-desc" | "grade-asc" | "name";
export type AssignmentSort = "due" | "priority";
export type PanelState =
  | { type: "assignment"; id: string }
  | { type: "course"; id: string }
  | { type: "new" }
  | null;
export type ToastState = {
  text: string;
  undo?: () => void;
};

export const STORAGE_KEY = "student-portal-assignments-v1";
const DAY = 86400000;

export const courses = [
  { title: "Data Structures", code: "CS 201", teacher: "Prof. James Lee", grade: 91, color: "bg-green-600" },
  { title: "UI/UX Design", code: "DES 210", teacher: "Maya Patel", grade: 87, color: "bg-emerald-500" },
  { title: "Statistics", code: "MTH 140", teacher: "Dr. Olivia West", grade: 82, color: "bg-lime-600" },
  { title: "Research Methods", code: "SOC 205", teacher: "Ali Morgan", grade: 93, color: "bg-teal-500" },
] satisfies readonly Course[];

export type CourseCode = string;

export const STATUS: Record<AssignmentStatus, { label: string; dot: string }> = {
  pending: { label: "Pending", dot: "bg-warn" },
  review: { label: "In review", dot: "border-2 border-accent" },
  submitted: { label: "Submitted", dot: "bg-accent" },
};

export const PRIORITY: Record<PriorityLevel, { label: string; rank: number; text: string }> = {
  high: { label: "High priority", rank: 0, text: "text-alert" },
  medium: { label: "Medium priority", rank: 1, text: "text-warn" },
  low: { label: "Low priority", rank: 2, text: "text-muted" },
};

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "review", label: "In review" },
  { id: "submitted", label: "Submitted" },
  { id: "overdue", label: "Overdue" },
] as const;

export type StatusFilter = (typeof FILTERS)[number]["id"];

export const INPUT_CLASS =
  "w-full min-h-11 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent";

export const BTN_PRIMARY =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-hover";

export const BTN_SECONDARY =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-tint";

export const isAssignmentStatus = (value: unknown): value is AssignmentStatus =>
  value === "pending" || value === "review" || value === "submitted";

export const isPriorityLevel = (value: unknown): value is PriorityLevel =>
  value === "high" || value === "medium" || value === "low";

export const isAssignment = (value: unknown): value is Assignment => {
  if (typeof value !== "object" || value === null) return false;
  const assignment = value as Record<string, unknown>;
  return (
    typeof assignment.id === "string" &&
    typeof assignment.code === "string" &&
    typeof assignment.title === "string" &&
    typeof assignment.due === "string" &&
    isPriorityLevel(assignment.priority) &&
    isAssignmentStatus(assignment.status) &&
    typeof assignment.description === "string" &&
    typeof assignment.notes === "string" &&
    Array.isArray(assignment.steps) &&
    assignment.steps.every(
      (step) =>
        typeof step === "object" &&
        step !== null &&
        typeof step.text === "string" &&
        typeof step.done === "boolean"
    )
  );
};

const toKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const parseKey = (key: string): Date => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const daysFromToday = (key: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseKey(key).getTime() - today.getTime()) / DAY);
};

export const keyFromOffset = (offset: number): string => toKey(new Date(Date.now() + offset * DAY));

export const formatDue = (key: string): string => {
  const days = daysFromToday(key);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  return parseKey(key).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

export const relativeDue = (key: string): string => {
  const days = daysFromToday(key);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days > 1) return `Due in ${days} days`;
  return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
};

export const isOverdue = (assignment: Assignment): boolean =>
  assignment.status === "pending" && daysFromToday(assignment.due) < 0;

export const makeSeed = (): Assignment[] => [
  {
    id: "a1",
    code: "CS 201",
    title: "Binary Tree Lab",
    due: keyFromOffset(0),
    priority: "high",
    status: "pending",
    description: "Implement insert, search and in-order traversal for a binary search tree, then test it on the provided dataset.",
    steps: [
      { text: "Implement insert and search", done: true },
      { text: "Write in-order traversal", done: false },
      { text: "Run the provided tests", done: false },
    ],
    notes: "",
  },
  {
    id: "a2",
    code: "SOC 205",
    title: "Survey Design Draft",
    due: keyFromOffset(1),
    priority: "high",
    status: "pending",
    description: "Draft a 10-question survey on student study habits and explain how you would sample respondents.",
    steps: [
      { text: "Write the research question", done: true },
      { text: "Draft 10 questions", done: false },
      { text: "Describe the sampling plan", done: false },
    ],
    notes: "",
  },
  {
    id: "a3",
    code: "DES 210",
    title: "Moodboard Review",
    due: keyFromOffset(2),
    priority: "medium",
    status: "review",
    description: "Submit your moodboard for peer and teacher review. Feedback arrives within two days.",
    steps: [
      { text: "Collect 12 reference images", done: true },
      { text: "Pick a palette and typefaces", done: true },
      { text: "Upload the board", done: true },
    ],
    notes: "",
  },
  {
    id: "a4",
    code: "MTH 140",
    title: "Probability Quiz 3",
    due: keyFromOffset(4),
    priority: "medium",
    status: "pending",
    description: "Online quiz covering conditional probability and Bayes' theorem. 30 minutes, one attempt.",
    steps: [
      { text: "Review chapter 6 notes", done: false },
      { text: "Do the practice set", done: false },
    ],
    notes: "",
  },
];