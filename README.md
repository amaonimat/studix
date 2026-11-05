# Studix — Student Dashboard

Studix is a student dashboard for keeping track of courses and assignments. It is a frontend project built with Next.js, React, TypeScript, and Tailwind CSS.

## What the dashboard does

- Shows an overview with a greeting, current date, average course grade, attendance, and assignments due soon.
- Displays courses with their teachers, grades, and progress indicators.
- Lists assignments with their course, due date, priority, and status.
- Lets students search assignments and filter them by course or status.
- Sorts assignments by due date or priority, and courses by grade or name.
- Opens detail panels for a course or assignment.
- Lets students add assignments, mark work as submitted, keep notes, and check off assignment steps.
- Shows a confirmation message after changes and offers Undo for certain actions.
- Saves assignment changes in the browser so they remain after a refresh.

This version uses sample course and assignment data. It does not have a server, database, sign-in, or cross-device syncing. Saved changes live in the current browser's local storage.

## How the project is organized

```text
src/app/
  components/
    AssignmentsSection.tsx   Assignment search, filters, sorting, and list
    DashboardOverview.tsx    Greeting, stats, and course overview
    DashboardPanels.tsx      Course and assignment details, add form, and messages
    DashboardUI.tsx          Shared panel, status badge, and progress bar
  dashboard-data.ts          Types, sample data, labels, and date helpers
  globals.css                Shared colors, fonts, and accessibility styles
  layout.tsx                 Shared HTML layout, fonts, and page metadata
  page.tsx                   Dashboard state, calculations, and interactions
```

## How the dashboard works

1. **The layout starts the app.** `layout.tsx` loads the shared stylesheet and fonts, sets the browser tab title and description, and wraps the page.
2. **The data file defines the content.** `dashboard-data.ts` describes the shape of courses and assignments, provides the sample data, and contains helpers for dates, status, and priority.
3. **The page manages the state.** `page.tsx` keeps track of assignments, filters, search text, sorting, open panels, and confirmation messages.
4. **Components display each part.** The page passes data and event handlers into smaller components for the course overview, assignment list, and detail panels.
5. **React updates the screen after an action.** For example, adding or submitting an assignment changes the page state, and React redraws the affected information.
6. **The browser stores assignment changes.** The dashboard loads saved assignments from local storage when it opens and updates that saved copy when assignments change.

## Technology

- **Next.js App Router** provides the application structure and page.
- **React** builds reusable components and manages interactive state.
- **TypeScript** describes the data and component types.
- **Tailwind CSS** provides the responsive layout and visual styling.
- **Browser local storage** keeps assignment changes on the same device and browser.

## Run it locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Check the code with ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Design notes

The interface uses a light, muted color palette with green accents. Shared colors and global behavior are defined in `globals.css`; Tailwind utility classes are used in the React components for spacing, layout, and individual visual details. The layout adapts to smaller screens, and focus styles help keyboard users see which control is selected.
