// Prefix for files in /public so paths work under the GitHub Pages base ('/Portfolio/') and in dev.
const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export const personalInfo = {
  name: "Youssef Samir Refky",
  initials: "YSR",
  title: "Full-Stack Engineer",
  roles: ["Full-Stack Engineer", "Backend Developer", "API Architect", "CS Student"],
  tagline: "I engineer production-ready systems — AI-driven security backends, scalable REST APIs, and the clean UIs that bring them to life.",
  bio: [
    "I'm a Computer Science student at CHI, graduating in 2026. I specialise in backend-heavy full-stack development — building scalable systems that are as solid under the hood as they are polished on the surface.",
    "My recent work spans AI-based security platforms with real-time monitoring, full-stack inventory systems with automated invoicing, and RESTful API architectures designed for modularity and growth.",
    "I'm actively looking for a backend or full-stack engineering internship where I can contribute, learn from experienced teams, and grow fast.",
  ],
  location: "Cairo, Egypt",
  available: true,
  seeking: "Internship / Junior Role",
  email: "youssefrefky66@gmail.com",
  phone: "+201095262732",
  phoneDisplay: "+20 109 526 2732",
  linkedin: "https://www.linkedin.com/in/youssef-samir-6b12b132a",
  github: "https://github.com/Youssefsamir6",
  cv: asset("Youssef_Samir_Refky_CV.pdf"),
  cvFilename: "Youssef_Samir_Refky_CV.pdf",
  learning: ["TypeScript", "Docker", "System Design"],
  config: {
    role: "Full-Stack Engineer",
    focus: "Backend Systems",
    location: "Cairo, Egypt",
    backend: ["Django", "Node.js", "Express"],
    frontend: ["React", "HTML", "CSS"],
    db: ["PostgreSQL", "MongoDB"],
    languages: ["Python", "JavaScript"],
    available: true,
    seeking: "Internship / Junior Role",
  },
}

export const cvKnowledge = {
  summary:
    "Youssef is a backend-focused Computer Science student with hands-on experience building secure web applications, REST APIs, automation systems, and AI-powered monitoring platforms.",
  roles: ["Backend Engineer", "Full-Stack Developer", "Security-Focused Developer"],
  education: {
    degree: "Bachelor of Science in Computer Science",
    school: "CHI for Engineering, Computer Science and Management",
    graduation: "2026",
  },
  technicalSkills: [
    "Python", "JavaScript", "SQL", "Java", "C", "C++",
    "Django", "Node.js", "Express.js", "REST APIs", "JWT Authentication",
    "React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS",
    "PostgreSQL", "MongoDB", "SQLite",
    "Docker", "Kubernetes", "Jenkins", "Linux", "Nginx", "CI/CD",
    "Git", "GitHub", "Postman", "WebSockets", "Celery",
  ],
  cybersecurity:
    "Blue Team operations, SIEM fundamentals, threat detection, security monitoring, incident response, log analysis, and OWASP Top 10.",
  certifications: [
    "Cisco JavaScript Essentials 1",
    "Cisco Cybersecurity Defense Analyst Career Path",
    "Creative and Innovative Thinking Skills in the Age of Artificial Intelligence",
  ],
  languages: ["Arabic (Native)", "English (Fluent)"],
  projectExperience: [
    {
      name: "Smart Access & Monitoring System",
      period: "2025–Present",
      description:
        "AI-powered campus security platform for face recognition, access control, attendance tracking, and real-time monitoring.",
      details:
        "Secure REST APIs with JWT authentication and authorization, WebSocket notifications, event logging, blacklist detection, and modular backend services.",
    },
    {
      name: "Inventory & Invoicing Management System",
      description:
        "Full-stack inventory platform for inventory control, invoicing, customer management, PDF invoices, dynamic pricing, and QR-code product linking.",
      details:
        "Built secure authentication and role-based access control with Django and PostgreSQL.",
    },
  ],
  seeking:
    "Backend, Full-Stack, DevOps, or Security Engineering internship opportunities.",
}

// Project fields: github / live are optional. Add them and the card shows the buttons automatically.
export const projects = [
  {
    id: 1,
    featured: true,
    icon: "🔐",
    badge: "Graduation Project",
    title: "Smart Access & Monitoring System",
    date: "2025 – Present",
    description: "AI-based campus security system for face recognition, access control, and attendance tracking — built with a modular architecture designed to scale.",
    highlights: [
      "AI-powered face recognition & access control",
      "Real-time logs, alerts & blacklist detection",
      "Backend services for access decisions & monitoring",
      "Modular architecture — CV pipeline & admin dashboard ready",
    ],
    tags: ["Node.js", "Express", "REST APIs", "MongoDB", "System Design"],
    github: null,
    live: null,
    codeFile: "access.controller.js (simplified)",
    code: `// Real-time access decision
async function checkAccess(faceData) {
  const match = await
    faceRecognition.identify(faceData);

  if (blacklist.has(match.id)) {
    alerts.trigger("BLACKLIST_HIT", match);
    return { granted: false };
  }

  logs.record({ id: match.id,
    time: Date.now(), granted: true });

  return { granted: true, user: match };
}`,
  },
  {
    id: 2,
    featured: false,
    icon: "📦",
    title: "Inventory & Invoicing System",
    date: "March 2025 – June 2025",
    description: "Full-stack inventory management with automated PDF invoicing, QR code product linking, real-time pricing logic, and a responsive UI.",
    highlights: [
      "Automated PDF invoice generation",
      "QR code product linking",
      "Real-time stock tracking & pricing",
      "AJAX-powered search with Select2",
    ],
    tags: ["Django", "Python", "PostgreSQL", "JavaScript", "Tailwind CSS"],
    github: "https://github.com/Youssefsamir6",
    live: null,
  },
]

// `level` is kept for reference, but the UI now groups skills into "Core" (80+) and "Also use"
// instead of showing fake-precise percentages.
export const skills = [
  {
    category: "Languages",
    color: "purple",
    items: [
      { name: "Python", icon: "🐍", level: 90 },
      { name: "JavaScript", icon: "🟨", level: 85 },
      { name: "SQL", icon: "🗄️", level: 80 },
      { name: "Java", icon: "☕", level: 65 },
      { name: "C++", icon: "⚙️", level: 60 },
    ],
  },
  {
    category: "Backend",
    color: "blue",
    items: [
      { name: "Django", icon: "🦄", level: 88 },
      { name: "Node.js", icon: "🟢", level: 82 },
      { name: "Express", icon: "🚂", level: 80 },
      { name: "REST APIs", icon: "🔗", level: 85 },
    ],
  },
  {
    category: "Frontend",
    color: "pink",
    items: [
      { name: "React.js", icon: "⚛️", level: 72 },
      { name: "Tailwind CSS", icon: "💨", level: 78 },
      { name: "HTML & CSS", icon: "🌐", level: 85 },
      { name: "AJAX", icon: "⚡", level: 75 },
    ],
  },
  {
    category: "Databases & Tools",
    color: "green",
    items: [
      { name: "PostgreSQL", icon: "🐘", level: 82 },
      { name: "MongoDB", icon: "🍃", level: 75 },
      { name: "Git & GitHub", icon: "🐙", level: 85 },
      { name: "Postman", icon: "📮", level: 80 },
      { name: "Docker", icon: "🐳", level: 62 },
      { name: "Linux / Bash", icon: "🐧", level: 75 },
    ],
  },
]

export const education = [
  {
    degree: "B.Sc. in Computer Science",
    school: "CHI for Engineering, Computer Science and Management",
    location: "Cairo, Egypt",
    date: "2026",
    courses: [
      "Data Structures & Algorithms",
      "Database Systems",
      "Software Engineering",
      "Web Development",
      "Operating Systems",
    ],
  },
]

export const certificates = [
  {
    name: "Creative and Innovative Thinking Skills in the Age of AI",
    issuer: "NEOMI",
    link: asset("certs/neomi-full.webp"),
    image: asset("certs/neomi-thumb.webp"),
  },
  {
    name: "Cybersecurity Defense Analyst Career Path",
    issuer: "Cisco",
    link: asset("cybersecurity_cert.pdf"),
    image: asset("certs/cybersecurity-thumb.webp"),
  },
  {
    name: "JavaScript Essentials 1",
    issuer: "Cisco",
    link: asset("javascript_cert.pdf"),
    image: asset("certs/javascript-thumb.webp"),
  },
]

// Derived from the data above so the numbers can never drift out of sync with what's on the page
// (the old hard-coded "5+ projects" and "12+ technologies" didn't match).
export const stats = [
  { value: projects.length, suffix: "", label: "Projects Built" },
  { value: new Set(skills.flatMap((g) => g.items.map((i) => i.name))).size, suffix: "", label: "Technologies" },
  { value: certificates.length, suffix: "", label: "Certifications" },
]
