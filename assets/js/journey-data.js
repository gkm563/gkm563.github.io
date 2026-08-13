/**
 * GAUTAM KUMAR MAURYA (gkm563) — MASTER JOURNEY DATASET
 * Decoupled data module powering btech-journey.html
 * 
 * Allows updating data over time without changing UI/HTML structure.
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

  // Skill Evolution Progression (Honest non-numeric labels)
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
    },
    {
      phaseId: "year-4",
      phaseTitle: "B.Tech Year 4 (Semesters 7 & 8 — ROADMAP)",
      period: "2026 – 2027",
      skills: [
        { name: "Advanced Deep Learning & AI Research", level: "Planned" },
        { name: "Production Enterprise Architecture", level: "Planned" },
        { name: "Open Source Leadership", level: "Planned" }
      ]
    }
  ],

  // Master Journey Items List
  milestones: [
    /* ════════════════════════════════════════════════════════════
       PHASE 0: PRE-COLLEGE & SCHOOL FOUNDATION
       ════════════════════════════════════════════════════════════ */
    {
      id: "pre-college-mnit-award",
      title: "MNIT Professor Academic Topper & 100% Attendance Award",
      shortDescription: "Awarded by an MNIT Professor for securing 1st Rank School Academic Topper and maintaining a perfect 100% Attendance record.",
      fullDescription: "Recognized for outstanding academic excellence and an unbroken 100% attendance record throughout school education. The honor was presented directly by a professor from MNIT (Malaviya National Institute of Technology).",
      startDate: "Pre-College",
      endDate: "2023",
      phase: "pre-college",
      semester: null,
      category: "Award",
      status: "completed",
      importance: "major",
      skills: ["Academic Excellence", "Mathematics", "Diligence & Discipline"],
      organization: "MNIT / School Administration",
      role: "School Academic Topper",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Secured 1st Rank across all academic subjects while maintaining a 100% attendance record throughout the academic session.",
      whyItMattered: "Instilled core discipline, time management, and a strong analytical mindset before starting B.Tech.",
      whatILearned: "Punctuality, focus under academic pressure, and dedication to long-term goals.",
      impact: "Laid a solid mathematical and technical foundation for pursuing Computer Science Engineering.",
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
      title: "UP Board District Topper Award",
      shortDescription: "Honored by the Chairman, Director & Secretary (सचिव - माध्यमिक शिक्षा परिषद्) of UP Board for academic rank excellence.",
      fullDescription: "Received prestigious state recognition as a District Topper in board examinations, presented on stage by the senior leadership of Uttar Pradesh Secondary Education Board (माध्यमिक शिक्षा परिषद्).",
      startDate: "Pre-College",
      endDate: "2023",
      phase: "pre-college",
      semester: null,
      category: "Award",
      status: "completed",
      importance: "major",
      skills: ["State Academic Honor", "Problem Solving", "Competitive Performance"],
      organization: "Board of High School and Intermediate Education UP (UPSMSP)",
      role: "District Topper Scholar",
      location: "Uttar Pradesh, India",
      whatHappened: "Achieved top academic ranking in district board examinations.",
      whyItMattered: "Earned public recognition from state education directors and secretarial authorities.",
      whatILearned: "Structured exam strategy, clear technical exposition, and perseverance.",
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
       PHASE 1: B.TECH YEAR 1 (SEMESTERS 1 & 2)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-1-foundations",
      title: "B.Tech Semester 1: Computer Science & Science Foundations",
      shortDescription: "Immersed in core engineering principles, C programming, physics lab experiments, and university mathematics.",
      fullDescription: "Started B.Tech CSE (Data Science) at United Institute of Technology, Prayagraj under AKTU Lucknow syllabus. Focused on C programming algorithms, matrix algebra, differential calculus, and engineering physics.",
      startDate: "Aug 2023",
      endDate: "Jan 2024",
      phase: "year-1",
      semester: 1,
      category: "Academic",
      status: "completed",
      importance: "normal",
      skills: ["C Programming", "Engineering Physics", "Mathematics-I", "Problem Solving"],
      organization: "United Institute of Technology (UIT Prayagraj) / AKTU",
      role: "1st Year Engineering Scholar",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Completed Semester 1 theory courses and laboratory practicals in C algorithms and physics.",
      whyItMattered: "Transitioned from high school mathematics into structured algorithmic thinking and computer systems.",
      whatILearned: "Memory allocation in C, control flow optimization, and rigorous mathematical logic.",
      impact: "Established a strong GPA foundation for the 1st academic year.",
      evidence: {
        images: [],
        links: [],
        github: null,
        certificate: null,
        linkedin: null
      }
    },
    {
      id: "sem-2-python-dsa-intro",
      title: "B.Tech Semester 2: Python, DSA & Web Ideation",
      shortDescription: "Explored Data Structures & Algorithms, Object-Oriented concepts in Python, and fundamental web development.",
      fullDescription: "Deepened computer science fundamentals through Python data structures (arrays, linked lists, stacks, queues), Mathematics-II, and initial web development technologies.",
      startDate: "Feb 2024",
      endDate: "Jul 2024",
      phase: "year-1",
      semester: 2,
      category: "Academic",
      status: "completed",
      importance: "normal",
      skills: ["Python", "Data Structures", "HTML5/CSS3", "Mathematics-II"],
      organization: "United Institute of Technology (UIT Prayagraj) / AKTU",
      role: "1st Year Engineering Scholar",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Built first algorithmic scripts in Python and designed static web layouts.",
      whyItMattered: "Discovered passion for Data Science and modern software development.",
      whatILearned: "Time complexity analysis (Big-O), recursion, and DOM layout mechanics.",
      impact: "Prepared for advanced 2nd year core computer science subjects.",
      evidence: {
        images: [],
        links: [],
        github: null,
        certificate: null,
        linkedin: null
      }
    },

    /* ════════════════════════════════════════════════════════════
       PHASE 2: B.TECH YEAR 2 (SEMESTERS 3 & 4)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-3-aktu-rank-5-topper",
      title: "B.Tech Semester 3: CSE (DS) Branch Rank 1 Topper & AKTU Rank 5",
      shortDescription: "Secured 1st Rank in CSE (Data Science) and Rank 5 College-wide in AKTU examinations.",
      fullDescription: "Achieved top academic performance in Semester 3 core subjects including Object-Oriented Programming, Operating Systems, Discrete Mathematics, and Computer Organization. Awarded Branch Topper 1st Rank and College Academic Excellence Rank 5.",
      startDate: "Aug 2024",
      endDate: "Jan 2025",
      phase: "year-2",
      semester: 3,
      category: "Academic",
      status: "completed",
      importance: "major",
      skills: ["OOP (Java/Python)", "Operating Systems", "Discrete Math", "Academic Leadership"],
      organization: "United Institute of Technology (UIT Prayagraj) / AKTU",
      role: "Branch Rank 1 Scholar",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Ranked 1st in Computer Science & Engineering (Data Science) branch and 5th overall across the college in AKTU semester exams.",
      whyItMattered: "Validated technical mastery in core computer science theory and practical implementation.",
      whatILearned: "Process synchronization, memory paging, OOP design patterns, and relational logic.",
      impact: "Built academic prestige and leadership credibility within the institute.",
      evidence: {
        images: ["assets/images/gallery/gautam-kumar-maurya-aktu.jpg", "assets/images/gallery/gautam-kumar-maurya-uit-topper.jpg"],
        links: [],
        github: null,
        certificate: null,
        linkedin: null
      }
    },
    {
      id: "sem-4-up-police-fellowship",
      title: "B.Tech Semester 4: UP Police APCSIP-2026 Cyber Fellowship & Best Content Creator Award",
      shortDescription: "Completed a 15-day government digital investigation fellowship with Amroha Police Cyber Crime Cell; won Best Content Creator Award under DSP Anjali Kataria.",
      fullDescription: "Participated in the Amroha Police Cyber Security Internship Program (APCSIP-2026), bridging engineering data science with state-level cyber forensics, CDR sorting, OSINT recon, and malware telemetry. Awarded Best Content Creator for technical cyber security investigation workflows.",
      startDate: "Jan 2025",
      endDate: "Feb 2025",
      phase: "year-2",
      semester: 4,
      category: "Internship",
      status: "completed",
      importance: "major",
      skills: ["Digital Forensics", "OSINT Reconnaissance", "CDR Analysis", "Cyber Crime Investigation", "Technical Communication"],
      organization: "Amroha Police Cyber Crime Cell, Uttar Pradesh Police",
      role: "Cyber Security Fellow & Lead Awardee",
      location: "Amroha, Uttar Pradesh, India",
      whatHappened: "Executed digital forensic sorting, OSINT mapping, and cyber security awareness campaigns under DSP Anjali Kataria.",
      whyItMattered: "First major government cyber security fellowship applying data science to active law enforcement intelligence.",
      whatILearned: "Call Detail Record (CDR) pattern extraction, open-source intelligence gathering, and evidentiary digital chain of custody.",
      impact: "Earned public recognition from UP Police leadership and launched dedicated APCSIP report.",
      evidence: {
        images: ["assets/images/gallery/gautam-kumar-maurya-up-police.jpg", "assets/images/gallery/gautam-kumar-maurya-best-content-creator-award.jpg"],
        links: ["up-police-internship.html"],
        github: null,
        certificate: "assets/images/gallery/gautam-kumar-maurya-best-content-creator-award.jpg",
        linkedin: "https://www.linkedin.com/in/gkm563/"
      }
    },
    {
      id: "sem-4-mediawiki-open-source-start",
      title: "Open Source Milestone: MediaWiki Core Gerrit Patches",
      shortDescription: "Began contributing production PHP and JavaScript code to MediaWiki Core (the software powering Wikipedia).",
      fullDescription: "Entered international open-source development by submitting Gerrit code reviews for MediaWiki Core, UploadWizard extension, MinervaNeue mobile skin, and Pywikibot. Merged production patches resolving internationalization and UI bugs.",
      startDate: "Jan 2025",
      endDate: "May 2025",
      phase: "year-2",
      semester: 4,
      category: "Open Source",
      status: "completed",
      importance: "major",
      skills: ["PHP", "MediaWiki Core", "Gerrit Code Review", "Git", "Open Source Software"],
      organization: "Wikimedia Foundation / WikiClub Tech India (IIIT Hyderabad)",
      role: "MediaWiki Core Contributor",
      location: "Global Open Source Community",
      whatHappened: "Authored and merged 15+ production patches across MediaWiki Core, Pywikibot, and language metadata repositories.",
      whyItMattered: "Code used daily by millions of global Wikipedia users; featured in WikiClub Tech India Technical Impact Report at IIIT Hyderabad.",
      whatILearned: "Rigorous unit testing, continuous integration (Jenkins), code review etiquette, and large-scale PHP architecture.",
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
       PHASE 3: B.TECH YEAR 3 — CURRENT (SEMESTERS 5 & 6)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-5-gfg-vp-and-gsa-event",
      title: "B.Tech Semester 5: GeeksforGeeks VP Leadership & 650+ Attendee Mega Event",
      shortDescription: "Appointed Vice President of GeeksforGeeks UIT Chapter; co-organized 650+ attendee tech conference and awarded on stage by Principal, DSW & HODs.",
      fullDescription: "Led technical student initiatives as Vice President of GeeksforGeeks Student Chapter UIT Prayagraj. Co-organized a massive 650+ attendee tech conference as Google Student Ambassador team member, recognized on stage by Principal Sir, Dean Student Welfare (DSW), and all Department HODs. Also co-founded PrayagrajRooms platform.",
      startDate: "Aug 2025",
      endDate: "Dec 2025",
      phase: "year-3",
      semester: 5,
      category: "Leadership",
      status: "completed",
      importance: "major",
      skills: ["Leadership", "Event Management", "Public Speaking", "Community Building", "Full-Stack Development"],
      organization: "GeeksforGeeks Student Chapter UIT Prayagraj / GSA Team",
      role: "Vice President & Event Co-Organizer",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Spearheaded student coding initiatives, hosted technical workshops, and co-founded PrayagrajRooms student housing portal.",
      whyItMattered: "Demonstrated large-scale leadership and community impact beyond academic achievements.",
      whatILearned: "Event logistics, team delegation, institutional sponsorship, and user-centric web platform launch.",
      impact: "Expanded developer culture across the institute for over 650+ students.",
      evidence: {
        images: ["assets/images/gallery/gautam-kumar-maurya-gsa.jpg", "assets/images/gallery/gautam-kumar-maurya-gfg-award.jpg", "assets/images/gallery/gautam-kumar-maurya-ffdg.jpg"],
        links: ["https://prayagrajrooms.in"],
        github: "https://github.com/gkm563",
        certificate: null,
        linkedin: "https://www.linkedin.com/in/gkm563/"
      }
    },
    {
      id: "sem-6-ait-bangkok-fellowship",
      title: "B.Tech Semester 6 (CURRENT): AIT Bangkok GIIP-2026 International Research Fellowship",
      shortDescription: "Participating in a 15-day international research fellowship in Pathum Thani, Thailand; researching Agentic AI, Ubiquitous GIS, Drone Telemetry, and building BusSetu.",
      fullDescription: "Selected for the Global Innovation Internship Program (GIIP-2026) at Asian Institute of Technology (AIT Bangkok, Thailand). Executed research in Agentic AI workflows, Ubiquitous GIS, QGIS spatial mapping, UAV flight telemetry, KMITL robotics research, and developed the BusSetu AI transit platform capstone.",
      startDate: "Jan 2026",
      endDate: "Present",
      phase: "year-3",
      semester: 6,
      category: "Internship",
      status: "current",
      importance: "major",
      skills: ["Agentic AI", "Ubiquitous GIS", "QGIS", "Drone Telemetry", "Robotics", "Power BI", "Data Analytics"],
      organization: "Asian Institute of Technology (AIT), Bangkok, Thailand",
      role: "GIIP International Research Fellow",
      location: "Pathum Thani / Bangkok, Thailand",
      whatHappened: "Executed daily frontier research labs, drone spatial surveys, and built the BusSetu public transit navigation capstone.",
      whyItMattered: "First international cross-border research fellowship, working directly under international PhDs and professors.",
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
    },

    /* ════════════════════════════════════════════════════════════
       PHASE 4: B.TECH YEAR 4 & BEYOND (SEMESTERS 7 & 8 — ROADMAP)
       ════════════════════════════════════════════════════════════ */
    {
      id: "sem-7-advanced-ai-research",
      title: "B.Tech Semester 7: Advanced Deep Learning & Capstone Architecture",
      shortDescription: "Planned focus on advanced neural network architectures, AI research publication, and major capstone engineering.",
      fullDescription: "Upcoming roadmap milestone for 4th year Semester 7: Deep learning models, multi-agent AI systems, research paper submission, and enterprise production architecture.",
      startDate: "Aug 2026",
      endDate: "Dec 2026",
      phase: "year-4",
      semester: 7,
      category: "Learning",
      status: "planned",
      importance: "major",
      skills: ["Deep Learning", "Multi-Agent Systems", "Research Writing", "System Architecture"],
      organization: "United Institute of Technology (UIT Prayagraj)",
      role: "4th Year Senior Scholar",
      location: "Prayagraj, Uttar Pradesh, India",
      whatHappened: "Roadmap goal: Publish peer-reviewed AI research paper and lead final year capstone engineering project.",
      whyItMattered: "Bridges undergraduate engineering with high-impact industry or graduate research.",
      whatILearned: "Planned: Deep learning model deployment, distributed inference, and paper peer review.",
      impact: "Upcoming milestone towards B.Tech completion.",
      evidence: {
        images: [],
        links: [],
        github: null,
        certificate: null,
        linkedin: null
      }
    },
    {
      id: "sem-8-graduation-and-industry",
      title: "B.Tech Semester 8 & Graduation: Degree Completion & Industry Launch",
      shortDescription: "Completion of 4-Year B.Tech CSE (Data Science) degree, major project defense, and full-time engineering deployment.",
      fullDescription: "Upcoming final milestone: Successful defense of B.Tech thesis/capstone project, completion of all 8 semesters under AKTU Lucknow, and launch into full-time AI Engineering / Data Science role.",
      startDate: "Jan 2027",
      endDate: "Jun 2027",
      phase: "year-4",
      semester: 8,
      category: "Academic",
      status: "planned",
      importance: "major",
      skills: ["B.Tech Graduate", "Full-Stack AI Engineering", "Enterprise Systems", "Open Source Leadership"],
      organization: "United Institute of Technology (UIT Prayagraj) / AKTU Lucknow",
      role: "B.Tech Engineering Graduate",
      location: "Prayagraj / Global",
      whatHappened: "Roadmap goal: Graduation with 4-Year B.Tech CSE (Data Science) degree.",
      whyItMattered: "Fulfillment of 4-year academic journey from school topper to international AI fellow and engineer.",
      whatILearned: "Planned: Complete engineering lifecycle execution.",
      impact: "Launch into professional AI engineering, research, and open source leadership.",
      evidence: {
        images: [],
        links: [],
        github: null,
        certificate: null,
        linkedin: null
      }
    }
  ]
};
