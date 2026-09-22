export const academyImage = "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1800&q=85";
export const trainingImage = "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=900&q=80";
export const kataImage = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80";
export const coachImage = "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=85";

export const trainingPrograms = [
  { name: "Karate", tag: "01 / FOUNDATION", copy: "Build a technical base through stances, strikes, blocks and the discipline that makes them sharp.", icon: "拳" },
  { name: "Kumite", tag: "02 / COMBAT", copy: "Read distance. Control the tempo. Pressure with purpose in coached sparring sessions.", icon: "対" },
  { name: "Kata", tag: "03 / PRECISION", copy: "Turn movement into memory with structured forms built around balance, timing and intent.", icon: "型" },
  { name: "Self Defence", tag: "04 / AWARENESS", copy: "Practical principles for creating space, staying calm and moving with confidence.", icon: "守" },
  { name: "Fitness & Conditioning", tag: "05 / ENGINE", copy: "Strength, speed and stamina sessions that keep your technique ready when it matters.", icon: "力" },
];

export const achievements = [
  { year: "2024", title: "Regional Dojo Showcase", detail: "A disciplined showcase of kata, kumite and the next generation of Cobra athletes." },
  { year: "2023", title: "Competition Season", detail: "Placeholder record — replace with academy tournament wins, certificates and milestones." },
  { year: "2022", title: "Academy Founded", detail: "Placeholder milestone — add the official story and opening date from the admin portal." },
];

export const gallery = [
  { category: "TRAINING", title: "The work is the way", image: trainingImage },
  { category: "COMPETITIONS", title: "Pressure reveals preparation", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80" },
  { category: "EVENTS", title: "Built together", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=80" },
  { category: "TRAINING", title: "Precision in motion", image: kataImage },
];

export const announcements = [
  { date: "22 SEP 2026", title: "New student orientation", copy: "Placeholder announcement. Publish your next academy update from the coach portal." },
  { date: "08 SEP 2026", title: "Autumn training block", copy: "Placeholder announcement. Share schedule changes, events and important dojo notes here." },
];

export const sampleAttendance = {
  student: "SACHIN VISHARAJ",
  id: "COBRA102",
  belt: "Advanced / Black",
  attendance: 86,
  present: 22,
  absent: 3,
  late: 1,
  history: [
    { date: "22 Sep", status: "Present", mark: "✓" },
    { date: "21 Sep", status: "Absent", mark: "×" },
    { date: "20 Sep", status: "Present", mark: "✓" },
    { date: "19 Sep", status: "Late", mark: "~" },
  ],
};
