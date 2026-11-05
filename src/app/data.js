/**
 * @typedef {"Tech" | "Sports" | "Faith" | "Social"} EventCategory
 * @typedef {{
 *   id: string;
 *   title: string;
 *   category: EventCategory;
 *   date: string;
 *   time: string;
 *   venue: string;
 *   image: string;
 *   description: string;
 * }} CampusEvent
 */

/** @type {CampusEvent[]} */
const events = [
  {
    id: "innovation-night",
    title: "Campus Innovation Night",
    category: "Tech",
    date: "2026-11-12",
    time: "5:30 PM",
    venue: "Engineering Atrium",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    description:
      "Meet student founders, explore new ideas, and see the projects shaping the future of campus. Bring a friend and join the conversation.",
  },
  {
    id: "falcons-vs-hawks",
    title: "Falcons vs. Hawks",
    category: "Sports",
    date: "2026-11-14",
    time: "3:00 PM",
    venue: "North Field",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    description:
      "Cheer on the Falcons in the biggest home match of the season. Student entry is free, and the first 100 fans will receive a team scarf.",
  },
  {
    id: "harvest-table",
    title: "The Harvest Table",
    category: "Social",
    date: "2026-11-18",
    time: "6:00 PM",
    venue: "Student Union Courtyard",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    description:
      "Share a meal, meet people from across campus, and celebrate the season together. A range of vegetarian options will be available.",
  },
  {
    id: "evening-of-reflection",
    title: "An Evening of Reflection",
    category: "Faith",
    date: "2026-11-20",
    time: "7:00 PM",
    venue: "Interfaith Center",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
    description:
      "Take a quiet break from the busy semester with guided reflection, music, and an open, welcoming space for students of every faith and background.",
  },
  {
    id: "build-for-good",
    title: "Build for Good Hackathon",
    category: "Tech",
    date: "2026-11-22",
    time: "9:00 AM",
    venue: "Digital Learning Lab",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    description:
      "Team up for a one-day hackathon focused on practical ideas for the campus community. Beginners are welcome, and mentors will be on hand.",
  },
  {
    id: "open-court",
    title: "Open Court: 3-on-3",
    category: "Sports",
    date: "2026-11-25",
    time: "4:00 PM",
    venue: "Recreation Center",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    description:
      "Bring a team or join one when you arrive for a relaxed afternoon of friendly basketball. All skill levels are welcome.",
  },
  {
    id: "winter-lights",
    title: "Winter Lights Social",
    category: "Social",
    date: "2026-12-02",
    time: "6:30 PM",
    venue: "Founders Hall Lawn",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176",
    description:
      "Celebrate the end of term with music, warm drinks, and a campus lights display. Drop in with friends or come meet someone new.",
  },
  {
    id: "service-and-community",
    title: "Faith & Community Service Day",
    category: "Faith",
    date: "2026-12-05",
    time: "10:00 AM",
    venue: "Campus Chapel, then Community Garden",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18",
    description:
      "Start the morning with a short gathering, then volunteer together at the community garden. No experience is needed; tools and lunch are provided.",
  },
];

export default events;
