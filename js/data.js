export const profile = {
  name: "Omran Kaadan",
  age: 22,
  role: "Software Engineer",
  location: "Dibbiyeh, Lebanon",
  phone: "81717230",
  phoneIntl: "+96181717230",
  email: "omrankaadan4@gmail.com",
  linkedin: "https://www.linkedin.com/in/omran-kaadan-2724b8419",
  github: "https://github.com/omrankaadan",
  cv: "./assets/cv.pdf",
  summary:
    "CCE graduate (2025) from Lebanese International University, currently pursuing a Master's degree, with experience developing and integrating software projects.",
};

export const education = [
  {
    degree: "Master of Science in Computer & Communication Engineering",
    school: "Lebanese International University (LIU)",
    when: "In progress",
    note: "",
  },
  {
    degree: "Bachelor in Computer & Communication Engineering",
    school: "Lebanese International University (LIU)",
    when: "2021 — 2025",
    note: "Focused on software development, computer systems, networking, embedded systems and communication technologies, with hands-on academic and practical projects.",
  },
  {
    degree: "Certifications",
    school: "Udemy — Data Science, Machine Learning, NLP & Neural Networks · Full Stack Web Development",
    when: "Certified",
    note: "",
  },
];

export const skills = [
  "Python", "PostgreSQL", "JavaScript", "React JS", "Node JS",
  "Express JS", "Frontend", "Backend", "Debugging", "Web Development",
  "PHP", "APIs", "AI Agents", "Mobile Applications",
];

export const projects = [
  {
    title: "Garage Platform",
    year: "",
    url: "http://65.21.59.78/",
    tags: ["React", "Express", "PostgreSQL", "JWT", "REST API"],
    description:
      "Full-stack garage management platform: car & parts catalog, inventory, advanced search, Excel import, appointments, audit logs and an admin panel with image uploads. Vite/React client, Express + PostgreSQL server, JWT auth with role-based authorization, Zod validation, security hardening, Swagger docs — deployed to production.",
  },
  {
    title: "AI PDF Analyzer",
    year: "2026",
    url: null,
    tags: ["OpenAI API", "Python", "PostgreSQL", "Node.js"],
    description:
      "AI-powered PDF analysis platform that summarizes documents of any size, extracts key insights and formulas using OpenAI — with chunking, Google auth, subscriptions, a responsive UI for researchers and students, and an admin dashboard for analytics.",
  },
  {
    title: "Social Services Platform",
    year: "2025",
    url: null,
    tags: ["React", "Node", "SQL", "Chat", "Video"],
    description:
      "Senior project connecting users with social service providers through video-based guidance and direct messaging, featuring a video rating system that promotes highly rated content — plus an admin panel for content and user management.",
  },
];
