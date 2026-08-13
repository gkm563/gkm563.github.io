/**
 * GAUTAM KUMAR MAURYA (gkm563) — MASTER JOURNEY DATASET
 * Focused strictly on active completed and current journey (Pre-College, 1st Year, 2nd Year, 3rd Year).
 */

const JOURNEY_DATA = {
  meta: {
    studentName: "Gautam Kumar Maurya",
    handle: "gkm563",
    degree: "B.Tech in Computer Science & Engineering (Data Science)",
    institution: "United Institute of Technology (UIT Prayagraj)",
    university: "Dr. A.P.J. Abdul Kalam Technical University (AKTU Lucknow)",
    startYear: 2023,
    expectedGraduationYear: 2027,
    currentYear: 3,
    currentSemester: 6,
    currentStatusText: "3rd Year (Semester 6) · Academic Rank 1 Branch Topper · AKTU Rank 5"
  },

  // 1. Primary Phase Cards Selection (Top Control Engine — Active Years Only)
  phases: [
    {
      id: "pre-college",
      title: "Pre-College Foundation",
      shortTitle: "Pre-College",
      subtitle: "School & Board Academic Honors",
      period: "Before 2023",
      icon: "fa-solid fa-graduation-cap",
      accentColor: "from-amber-500 to-orange-500",
      badgeColor: "amber",
      semesters: [
        { id: "pre-college", title: "School & UP Board Achievements", num: "Foundation" }
      ]
    },
    {
      id: "year-1",
      title: "1st Year B.Tech",
      shortTitle: "1st Year",
      subtitle: "Computer Science Foundations & DSA",
      period: "2023 – 2024",
      icon: "fa-solid fa-rocket",
      accentColor: "from-blue-500 to-cyan-500",
      badgeColor: "blue",
      semesters: [
        { id: "sem-1", title: "1st Semester (Semester 1)", num: "Sem 1", desc: "C Programming, Matrix Math, Physics & Lab Foundations" },
        { id: "sem-2", title: "2nd Semester (Semester 2)", num: "Sem 2", desc: "Python Programming, DSA & Web Dev Projects" }
      ]
    },
    {
      id: "year-2",
      title: "2nd Year B.Tech",
      shortTitle: "2nd Year",
      subtitle: "AKTU Rank 5, Cyber Fellowship & Open Source",
      period: "2024 – 2025",
      icon: "fa-solid fa-shield-halved",
      accentColor: "from-indigo-500 to-purple-500",
      badgeColor: "indigo",
      semesters: [
        { id: "sem-3", title: "3rd Semester (Semester 3)", num: "Sem 3", desc: "Branch Rank 1 Topper, AKTU Rank 5, OOP & Operating Systems" },
        { id: "sem-4", title: "4th Semester (Semester 4)", num: "Sem 4", desc: "UP Police APCSIP-2026 Fellowship & MediaWiki Gerrit Patches" }
      ]
    },
    {
      id: "year-3",
      title: "3rd Year B.Tech (CURRENT)",
      shortTitle: "3rd Year (Current)",
      subtitle: "AIT Bangkok Fellowship, GFG VP & Agentic AI",
      period: "2025 – 2026",
      icon: "fa-solid fa-bolt",
      accentColor: "from-emerald-500 to-teal-500",
      badgeColor: "emerald",
      isCurrent: true,
      semesters: [
        { id: "sem-5", title: "5th Semester (Semester 5)", num: "Sem 5", desc: "GFG VP Leadership, GSA 650+ Event, PrayagrajRooms Launch" },
        { id: "sem-6", title: "6th Semester (CURRENT)", num: "Sem 6", desc: "AIT Bangkok GIIP-2026 International Fellowship & BusSetu" }
      ]
    }
  ],

  // 2. Categories definition
  categories: [
    { id: "all", label: "All Categories", icon: "fa-solid fa-layer-group" },
    { id: "Academic", label: "Academic Honors", icon: "fa-solid fa-graduation-cap" },
    { id: "Hackathon", label: "Hackathons & Competitions", icon: "fa-solid fa-laptop-code" },
    { id: "Project", label: "Engineering Projects", icon: "fa-solid fa-code" },
    { id: "Internship", label: "Internships & Fellowships", icon: "fa-solid fa-briefcase" },
    { id: "Open Source", label: "Open Source Contributions", icon: "fa-solid fa-code-merge" },
    { id: "Leadership", label: "Leadership & Community", icon: "fa-solid fa-users" },
    { id: "Award", label: "Awards & Recognition", icon: "fa-solid fa-trophy" },
    { id: "Event", label: "Events & Workshops", icon: "fa-solid fa-calendar-check" },
    { id: "Certification", label: "Certifications", icon: "fa-solid fa-certificate" }
  ],

  // 3. Skill Evolution Progression (Honest non-numeric labels)
  skillEvolution: [
    {
      phaseId: "pre-college",
      phaseTitle: "Pre-College Foundation",
      period: "Before 2023",
      skills: [
        { name: "Mathematics & Physics", level: "Built With" },
        { name: "C Programming", level: "Explored" },
        { name: "Academic Discipline", level: "Used in Production" }
      ]
    },
    {
      phaseId: "year-1",
      phaseTitle: "B.Tech Year 1 (Semesters 1 & 2)",
      period: "2023 – 2024",
      skills: [
        { name: "Python Programming", level: "Built With" },
        { name: "Data Structures & Algorithms", level: "Learning" },
        { name: "HTML / CSS / JavaScript", level: "Built With" },
        { name: "Engineering Physics & Math", level: "Built With" }
      ]
    },
    {
      phaseId: "year-2",
      phaseTitle: "B.Tech Year 2 (Semesters 3 & 4)",
      period: "2024 – 2025",
      skills: [
        { name: "Object-Oriented Programming (Java/Python)", level: "Built With" },
        { name: "Database Management Systems (SQL)", level: "Used in Production" },
        { name: "Cyber Security & Digital Forensics", level: "Used in Production" },
        { name: "MediaWiki / PHP Core Development", level: "Contributed To" },
        { name: "OSINT Reconnaissance", level: "Used in Production" }
      ]
    },
    {
      phaseId: "year-3",
      phaseTitle: "B.Tech Year 3 (Semesters 5 & 6 — CURRENT FOCUS)",
      period: "2025 – 2026",
      skills: [
        { name: "Agentic AI & LLMs", level: "Learning & Built With" },
        { name: "Ubiquitous GIS & QGIS Spatial Analysis", level: "Used in Production" },
        { name: "Drone Telemetry & Sensor Analytics", level: "Explored" },
        { name: "Data Science & Power BI Dashboards", level: "Used in Production" },
        { name: "Full-Stack Web Engineering", level: "Used in Production" }
      ]
    }
  ],

  // 4. Master Milestones List
  milestones: [
    /* ════════════════════════════════════════════════════════════
       PRE-COLLEGE FOUNDATION
       ════════════════════════════════════════════════════════════ */
    {
      id: "pre-college-mnit-award",
      title: "School Academic Topper & 100% Attendance Award by MNIT Professor",
      shortDescription: "Awarded 1st Rank School Academic Topper and 100% Attendance Award presented on stage by an MNIT Professor.",
      fullDescription: "Recognized for outstanding academic diligence, mathematical problem solving, and maintaining a perfect 100% attendance record throughout the academic session. Presented directly by a visiting professor from Malaviya National Institute of Technology (MNIT).",
      startDate: "Pre-College",
      endDate: "2023",
      phaseId: "pre-college",
      semesterId: "pre-college",
      category: "Award",
      status: "completed",
      importance: "major",
      skills: ["Academic Excellence", "Mathematics", "Diligence & Discipline"],
      organization: "MNIT / School Administration",
      role: "School Academic Topper",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Secured 1st Rank across all academic subjects while maintaining an unbroken 100% attendance record.",
      whyItMattered: "Instilled foundational discipline, punctuality, and early confidence in analytical studies.",
      whatILearned: "Time management under academic pressure and commitment to long-term goals.",
      impact: "Laid the mathematical and technical foundation for pursuing Computer Science Engineering.",
      evidence: {
        images: ["assets/images/gallery/gautam-kumar-maurya-iita.jpg"],
        links: [],
        github: null,
        certificate: null,
        linkedin: null
      }
    },
    {
      id: "pre-college-up-board-topper",
      title: "UP Board District Topper Award by Board Directors & Secretary",
      shortDescription: "Honored by UP Board Chairman, Director & Secretary (सचिव - माध्यमिक शिक्षा परिषद्) for district rank academic excellence.",
      fullDescription: "Received prestigious state-level academic recognition as a District Topper in UP Board examinations, presented on stage by the executive leadership of Uttar Pradesh Secondary Education Board.",
      startDate: "Pre-College",
      endDate: "2023",
      phaseId: "pre-college",
      semesterId: "pre-college",
      category: "Award",
      status: "completed",
      importance: "major",
      skills: ["State Academic Honor", "Problem Solving", "Board Rank Excellence"],
      organization: "Board of High School and Intermediate Education UP (UPSMSP)",
      role: "District Topper Scholar",
      location: "Uttar Pradesh, India",
      whatHappened: "Achieved top academic ranking in district board examinations.",
      whyItMattered: "Earned public recognition from state education directors and secretarial authorities.",
      whatILearned: "Structured exam strategy, clear technical exposition, and analytical perseverance.",
      impact: "Earned entrance into United Institute of Technology B.Tech CSE (Data Science) program.",
      evidence: {
        images: ["assets/images/gallery/gautam-kumar-maurya-upsmp.jpg"],
        links: [],
        github: null,
        certificate: null,
        linkedin: null
      }
    },

    /* ════════════════════════════════════════════════════════════
       1ST YEAR B.TECH (SEMESTER 1)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-1-c-programming-mastery",
      title: "C Programming & Algorithmic Problem Solving Mastery",
      shortDescription: "Mastered fundamental algorithmic logic, pointers, memory allocation, and control structures in C.",
      fullDescription: "Immersed in procedural programming, array manipulations, dynamic memory allocation, and pointers under AKTU Lucknow Semester 1 syllabus. Built CLI algorithms and console applications.",
      startDate: "Aug 2023",
      endDate: "Jan 2024",
      phaseId: "year-1",
      semesterId: "sem-1",
      category: "Academic",
      status: "completed",
      importance: "normal",
      skills: ["C Programming", "Algorithms", "Pointers", "Memory Management"],
      organization: "United Institute of Technology (UIT Prayagraj)",
      role: "1st Year Engineering Scholar",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Completed C programming practicals, sorting algorithms, and CLI tools with top lab marks.",
      whyItMattered: "Built understanding of low-level computer system operations and memory management.",
      whatILearned: "Pointer arithmetic, dynamic allocation (malloc/calloc), and algorithmic complexity.",
      impact: "Formed core logic foundation for Data Structures & Algorithms in Semester 2.",
      evidence: { images: [], links: [], github: null, certificate: null, linkedin: null }
    },
    {
      id: "sem-1-math-physics-labs",
      title: "Engineering Physics & Mathematics-I Academic Excellence",
      shortDescription: "Studied matrix calculus, differential equations, laser optics, and quantum physics lab experiments.",
      fullDescription: "Completed Semester 1 engineering mathematics (matrices, calculus, vector calculus) and physics laboratory practicals (interferometry, diffraction, semiconductor optics).",
      startDate: "Aug 2023",
      endDate: "Jan 2024",
      phaseId: "year-1",
      semesterId: "sem-1",
      category: "Academic",
      status: "completed",
      importance: "normal",
      skills: ["Mathematics-I", "Engineering Physics", "Lab Analytics"],
      organization: "UIT Prayagraj / AKTU Lucknow",
      role: "1st Year Engineering Scholar",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Achieved excellent marks in Semester 1 theoretical and practical examinations.",
      whyItMattered: "Provided mathematical tools needed for Data Science and Machine Learning models.",
      whatILearned: "Eigenvalues, differential equations, and physical sensor principles.",
      impact: "Strengthened GPA baseline in 1st year.",
      evidence: { images: [], links: [], github: null, certificate: null, linkedin: null }
    },

    /* ════════════════════════════════════════════════════════════
       1ST YEAR B.TECH (SEMESTER 2)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-2-python-dsa-foundations",
      title: "Python Programming & Data Structures Foundation",
      shortDescription: "Explored Python data structures, recursion, object-oriented concepts, and algorithm analysis.",
      fullDescription: "Shifted into Python programming and Data Structures & Algorithms (arrays, linked lists, stacks, queues, trees). Built algorithmic scripts and explored data manipulation libraries.",
      startDate: "Feb 2024",
      endDate: "Jul 2024",
      phaseId: "year-1",
      semesterId: "sem-2",
      category: "Academic",
      status: "completed",
      importance: "normal",
      skills: ["Python", "Data Structures", "Recursion", "OOP Principles"],
      organization: "United Institute of Technology (UIT Prayagraj)",
      role: "1st Year Engineering Scholar",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Built Python data structures project and analyzed algorithm time complexities (Big-O notation).",
      whyItMattered: "Discovered true passion for Data Science and modern software engineering.",
      whatILearned: "Tree traversals, dictionary hashing, OOP encapsulation, and module architecture.",
      impact: "Set up smooth entry into 2nd year CSE (Data Science) specialized subjects.",
      evidence: { images: [], links: [], github: null, certificate: null, linkedin: null }
    },
    {
      id: "sem-2-web-dev-ideation",
      title: "First Web Development Projects & Responsive UI Design",
      shortDescription: "Designed dynamic responsive web layouts using HTML5, CSS3, JavaScript, and Flexbox.",
      fullDescription: "Began self-directed full-stack web development learning. Created responsive web pages, interactive CSS animations, and JavaScript DOM manipulation scripts.",
      startDate: "Apr 2024",
      endDate: "Jul 2024",
      phaseId: "year-1",
      semesterId: "sem-2",
      category: "Project",
      status: "completed",
      importance: "normal",
      skills: ["HTML5", "CSS3", "JavaScript", "Responsive UI"],
      organization: "Self-Directed Software Project",
      role: "Frontend Developer",
      location: "Prayagraj, India",
      whatHappened: "Deployed initial portfolio websites and project landing pages.",
      whyItMattered: "Unlocked ability to showcase engineering work globally on GitHub Pages.",
      whatILearned: "DOM events, CSS Grid/Flexbox, dynamic rendering, and cross-browser compatibility.",
      impact: "Paved the way for complex full-stack web platforms built in Year 2 and Year 3.",
      evidence: { images: [], links: [], github: "https://github.com/gkm563", certificate: null, linkedin: null }
    },

    /* ════════════════════════════════════════════════════════════
       2ND YEAR B.TECH (SEMESTER 3)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-3-aktu-rank-5-topper",
      title: "CSE (Data Science) Branch Rank 1 Topper & AKTU Rank 5 Excellence Award",
      shortDescription: "Ranked 1st in CSE (Data Science) branch and 5th overall across the college in AKTU semester exams.",
      fullDescription: "Achieved top academic performance across Object-Oriented Programming (Java/Python), Operating Systems, Discrete Mathematics, and Computer Organization. Honored as Branch Rank 1 Topper and College Rank 5 Awardee.",
      startDate: "Aug 2024",
      endDate: "Jan 2025",
      phaseId: "year-2",
      semesterId: "sem-3",
      category: "Academic",
      status: "completed",
      importance: "major",
      skills: ["OOP (Java/Python)", "Operating Systems", "Discrete Math", "Academic Excellence"],
      organization: "United Institute of Technology (UIT Prayagraj) / AKTU Lucknow",
      role: "Branch Rank 1 Scholar",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Secured Rank 1 in CSE (Data Science) branch and Rank 5 college-wide in AKTU exams.",
      whyItMattered: "Validated deep theoretical understanding of core computer science systems.",
      whatILearned: "Process scheduling, memory management, discrete proofs, and OOP design patterns.",
      impact: "Earned academic prestige and student leadership opportunities within the department.",
      evidence: {
        images: ["assets/images/gallery/gautam-kumar-maurya-aktu.jpg", "assets/images/gallery/gautam-kumar-maurya-uit-topper.jpg"],
        links: [],
        github: null,
        certificate: null,
        linkedin: null
      }
    },

    /* ════════════════════════════════════════════════════════════
       2ND YEAR B.TECH (SEMESTER 4)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-4-up-police-fellowship",
      title: "UP Police APCSIP-2026 Cyber Fellowship & Best Content Creator Award",
      shortDescription: "Completed 15-day digital forensic fellowship with Amroha Police; won Best Content Creator Award under DSP Anjali Kataria.",
      fullDescription: "Participated in Amroha Police Cyber Security Internship Program (APCSIP-2026). Applied data science to digital forensics, Call Detail Record (CDR) sorting, OSINT recon, and cyber awareness. Presented Best Content Creator Award by DSP Anjali Kataria.",
      startDate: "Jan 2025",
      endDate: "Feb 2025",
      phaseId: "year-2",
      semesterId: "sem-4",
      category: "Internship",
      status: "completed",
      importance: "major",
      skills: ["Digital Forensics", "OSINT Recon", "CDR Sorting", "Cyber Investigation", "Technical Communication"],
      organization: "Amroha Police Cyber Crime Cell, UP Police",
      role: "Cyber Security Fellow & Lead Awardee",
      location: "Amroha, Uttar Pradesh, India",
      whatHappened: "Executed OSINT mapping, CDR data extraction, and cyber safety campaigns under DSP Anjali Kataria.",
      whyItMattered: "First major government cyber security fellowship applying engineering data science to active law enforcement intelligence.",
      whatILearned: "Call detail record pattern extraction, OSINT intelligence gathering, and digital chain of custody.",
      impact: "Published dedicated APCSIP report and received official commendation.",
      evidence: {
        images: ["assets/images/gallery/gautam-kumar-maurya-up-police.jpg", "assets/images/gallery/gautam-kumar-maurya-best-content-creator-award.jpg"],
        links: ["up-police-internship.html"],
        github: null,
        certificate: "assets/images/gallery/gautam-kumar-maurya-best-content-creator-award.jpg",
        linkedin: "https://www.linkedin.com/in/gkm563/"
      }
    },
    {
      id: "sem-4-mediawiki-gerrit-contributions",
      title: "MediaWiki Core Open Source Contributor (Wikipedia Tech Stack)",
      shortDescription: "Authored and merged production PHP/JS code patches into MediaWiki Core, MinervaNeue, and Pywikibot.",
      fullDescription: "Entered production open-source engineering via Wikimedia Gerrit. Merged patches resolving internationalization metadata, UI rendering, and Pywikibot automation bugs. Recognized in WikiClub Tech India Technical Impact Report at IIIT Hyderabad.",
      startDate: "Jan 2025",
      endDate: "May 2025",
      phaseId: "year-2",
      semesterId: "sem-4",
      category: "Open Source",
      status: "completed",
      importance: "major",
      skills: ["PHP", "MediaWiki Core", "Gerrit Code Review", "Git", "Continuous Integration"],
      organization: "Wikimedia Foundation / WikiClub Tech India (IIIT Hyderabad)",
      role: "MediaWiki Core Contributor",
      location: "Global Open Source Community",
      whatHappened: "Authored 15+ merged production patches across MediaWiki Core and Wikimedia extensions.",
      whyItMattered: "Code used daily by millions of Wikipedia readers globally.",
      whatILearned: "Gerrit patch review workflow, PHP unit testing, Jenkins CI, and open source collaboration.",
      impact: "Established global open-source engineering profile.",
      evidence: {
        images: ["assets/images/gallery/gautam-kumar-maurya-gfg-award.jpg"],
        links: ["open-source-contributions.html"],
        github: "https://github.com/gkm563",
        certificate: "https://upload.wikimedia.org/wikipedia/commons/d/d9/%281%29WikiClubTech_Technical_Impact_Report_Jan_Jun_2026_%281%29.pdf",
        linkedin: "https://www.linkedin.com/in/gkm563/"
      }
    },

    /* ════════════════════════════════════════════════════════════
       3RD YEAR B.TECH (SEMESTER 5)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-5-gfg-vp-and-gsa-mega-event",
      title: "GeeksforGeeks VP Leadership & 650+ Attendee Tech Conference Organizer",
      shortDescription: "Appointed VP of GFG UIT Chapter; co-organized 650+ attendee tech event and awarded on stage by Principal, DSW & HODs.",
      fullDescription: "Led technical student initiatives as Vice President of GeeksforGeeks Student Chapter UIT Prayagraj. Co-organized a massive 650+ attendee tech conference as Google Student Ambassador team member, awarded on stage by Principal Sir, Dean Student Welfare (DSW), and Department HODs. Co-founded PrayagrajRooms portal.",
      startDate: "Aug 2025",
      endDate: "Dec 2025",
      phaseId: "year-3",
      semesterId: "sem-5",
      category: "Leadership",
      status: "completed",
      importance: "major",
      skills: ["Leadership", "Event Management", "Public Speaking", "Community Building", "Web Development"],
      organization: "GeeksforGeeks Student Chapter UIT Prayagraj / GSA Team",
      role: "Vice President & Event Co-Organizer",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Spearheaded student coding initiatives, hosted technical workshops, and co-founded PrayagrajRooms housing platform.",
      whyItMattered: "Demonstrated large-scale leadership and community impact beyond academic rank.",
      whatILearned: "Event logistics, team delegation, institutional sponsorship, and full-stack product launch.",
      impact: "Expanded tech developer ecosystem for 650+ students across the college.",
      evidence: {
        images: ["assets/images/gallery/gautam-kumar-maurya-gsa.jpg", "assets/images/gallery/gautam-kumar-maurya-gfg-award.jpg", "assets/images/gallery/gautam-kumar-maurya-ffdg.jpg"],
        links: ["https://prayagrajrooms.in"],
        github: "https://github.com/gkm563",
        certificate: null,
        linkedin: "https://www.linkedin.com/in/gkm563/"
      }
    },

    /* ════════════════════════════════════════════════════════════
       3RD YEAR B.TECH (SEMESTER 6 — CURRENT FOCUS)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-6-ait-bangkok-fellowship",
      title: "AIT Bangkok GIIP-2026 International Research Fellowship (Thailand)",
      shortDescription: "Participating in 15-day international research fellowship in Thailand; researching Agentic AI, Ubiquitous GIS, and BusSetu capstone.",
      fullDescription: "Selected for Global Innovation Internship Program (GIIP-2026) at Asian Institute of Technology (AIT Bangkok, Thailand). Executed research in Agentic AI, Ubiquitous GIS spatial mapping, UAV drone telemetry, KMITL robotics research, and developed BusSetu transit platform capstone.",
      startDate: "Jan 2026",
      endDate: "Present",
      phaseId: "year-3",
      semesterId: "sem-6",
      category: "Internship",
      status: "current",
      importance: "major",
      skills: ["Agentic AI", "Ubiquitous GIS", "QGIS", "Drone Telemetry", "Robotics", "Power BI", "Data Analytics"],
      organization: "Asian Institute of Technology (AIT), Bangkok, Thailand",
      role: "GIIP International Research Fellow",
      location: "Pathum Thani / Bangkok, Thailand",
      whatHappened: "Executed daily frontier research labs, drone spatial surveys, and built BusSetu public transit navigation capstone.",
      whyItMattered: "First international cross-border research fellowship working directly under international PhDs and professors.",
      whatILearned: "Autonomous AI agent workflows, spatial vector analysis in QGIS, drone sensor payload telemetry, and international academic collaboration.",
      impact: "Published comprehensive GIIP-2026 research portal and daily log repository.",
      evidence: {
        images: [
          "assets/images/ait-bangkok/gautam-kumar-maurya-gkm-ait-bangkok-thailand-internship-1.jpg",
          "assets/images/ait-bangkok/gautam-kumar-maurya-gkm-ait-bangkok-thailand-internship-13.jpg",
          "assets/images/ait-bangkok/gautam-kumar-maurya-gkm-ait-bangkok-thailand-internship-145.jpg"
        ],
        links: ["ait-global-innovation-internship.html"],
        github: "https://github.com/gkm563",
        certificate: null,
        linkedin: "https://www.linkedin.com/in/gkm563/"
      }
    }
  ]
};
