// Gautam Kumar Maurya's Portfolio Data Store
// This file serves as the local database. You can edit this directly or use the admin.html panel to generate updates.

window.PORTFOLIO_DATA = {
  blogs: [],
  linkedinPosts: [
    {
      id: "li-1",
      title: "Co-founded PrayagrajRooms to solve student housing issues! 🏠✨",
      text: "Excited to share that I co-founded PrayagrajRooms alongside my friend Praveen! 🚀 Finding rooms and PG options in Prayagraj has been a major pain point for outstation B.Tech students. I am building a scalable, verified platform where students can search, contact owners, and filter listings without brokers. Grateful for the early support! #startup #prayagraj #studenthousing #proptech #founder #webdevelopment",
      date: "June 10, 2026",
      category: "Events",
      image: null,
      link: "https://www.linkedin.com/in/gkm563",
      stats: { likes: 1420, comments: 112 }
    },
    {
      id: "li-2",
      title: "Designed and Deployed the Official BuildX India 2026 Hackathon Website! 💻🌐",
      text: "Thrilled to have worked as the Website Developer and Technical Team Lead for BuildX India 2026! I built a high-performance, responsive registration portal managing hundreds of participants. Managing registration state, event schedules, and user queries in real-time was a massive learning experience in production scaling and UI/UX design. Check it out on my GitHub! #buildx #hackathon #webdev #javascript #leadership",
      date: "June 03, 2026",
      category: "Hackathons",
      image: null,
      link: "https://www.linkedin.com/in/gkm563",
      stats: { likes: 1180, comments: 94 }
    },
    {
      id: "li-3",
      title: "WikiClub UIT contribution sprint: 1st Place Winner! 🏆📖",
      text: "Proud to share that I won 1st Place in the 1-week Open Source Contribution Sprint organized by WikiClub UIT! 🌍 I submitted and merged multiple patches to Wikimedia infrastructure, working with Phabricator and Gerrit review systems. Contributing to global open-source projects has improved my understanding of peer review, code quality, and git collaboration. Thank you to everyone for the guidance! #opensource #wikipedia #wikimedia #git #gerrit #hackathon",
      date: "May 25, 2026",
      category: "Achievements",
      image: null,
      link: "https://www.linkedin.com/in/gkm563",
      stats: { likes: 1560, comments: 135 }
    },
    {
      id: "li-4",
      title: "Completing my 1st Semester with Rank 5 in AKTU University Exams! 🎓⚡",
      text: "Super happy to share that I secured Rank 5 across the entire college in my B.Tech 1st Year examinations at United Institute of Technology, Prayagraj (AKTU)! 📚 Balanced coding, community events, and academic studies. Hard work pays off, and being honored by Dainik Jagran and UP Board Secretary pushes me to maintain the momentum in my Data Science stream. Let's keep building! #academicexcellence #topper #aktu #university #datastructures #BTech",
      date: "May 12, 2026",
      category: "Achievements",
      image: null,
      link: "https://www.linkedin.com/in/gkm563",
      stats: { likes: 1890, comments: 167 }
    },
    {
      id: "li-5",
      title: "Freelance Project Success: Digital Portal for Vindhya Millets! 🌾📊",
      text: "Grateful to collaborate with Vindhya Millets, a local agricultural startup supported by Government of India ecosystem initiatives. I built their digital presence, setting up an optimization and catalog dashboard to improve outreach and catalog downloads. Applying tech to empower local agricultural startups is an incredibly rewarding experience! #freelance #startup #webdev #impactcoding #vindhyamillets",
      date: "April 28, 2026",
      category: "Earnings",
      image: null,
      link: "https://www.linkedin.com/in/gkm563",
      stats: { likes: 980, comments: 54 }
    }
  ],
  githubRepos: [
    {
      name: "CampusClick",
      description: "An interactive campus announcement and event hub built to manage student bulletins and schedules.",
      language: "JavaScript",
      stargazers_count: 3,
      html_url: "https://github.com/gkm563/CampusClick"
    },
    {
      name: "PDFBAZI",
      description: "A local-first browser utility to merge, split, compress, and edit PDF files completely offline for privacy.",
      language: "Python",
      stargazers_count: 5,
      html_url: "https://github.com/gkm563/PDFBAZI"
    },
    {
      name: "TripSync",
      description: "A real-time travel logistics dashboard that synchronizes itineraries, maps, and travel expenses for groups.",
      language: "TypeScript",
      stargazers_count: 4,
      html_url: "https://github.com/gkm563/TripSync"
    },
    {
      name: "uginotes",
      description: "A centralized academic notes repository and syllabus planner built for United Institute of Technology students.",
      language: "TypeScript",
      stargazers_count: 6,
      html_url: "https://github.com/gkm563/uginotes"
    },
    {
      name: "NHAI-offline-biometrics",
      description: "A secure offline biometric authentication helper utility engineered for National Highway Authority operations.",
      language: "TypeScript",
      stargazers_count: 2,
      html_url: "https://github.com/gkm563/NHAI-offline-biometrics"
    },
    {
      name: "buildx-india-website-personal",
      description: "Official registration dashboard and participant tracking platform for BuildX India 2026 Hackathon.",
      language: "TypeScript",
      stargazers_count: 8,
      html_url: "https://github.com/gkm563/buildx-india-website-personal"
    }
  ],
  wikiArticles: [
    { titleHi: "ज्वालामुखी बम", titleEn: "Volcanic bomb", date: "14 Jun", points: 25, category: "science" },
    { titleHi: "मिग्माटाइट", titleEn: "Migmatite", date: "14 Jun", points: 25, category: "science" },
    { titleHi: "कार्बोनेटाइट", titleEn: "Carbonatite", date: "14 Jun", points: 25, category: "science" },
    { titleHi: "डायमटी मृदा", titleEn: "Diatomaceous earth", date: "14 Jun", points: 25, category: "science" },
    { titleHi: "हथौड़ा फेंक", titleEn: "Hammer throw", date: "14 Jun", points: 25, category: "general" },
    { titleHi: "पश्चिमी ईसाई धर्म", titleEn: "Western Christianity", date: "13 Jun", points: 25, category: "general" },
    { titleHi: "रस्साकशी", titleEn: "Tug of war", date: "13 Jun", points: 25, category: "general" },
    { titleHi: "एम16 राइफल", titleEn: "M16 rifle", date: "13 Jun", points: 25, category: "general" },
    { titleHi: "वर्ल्ड ऐट वॉर", titleEn: "World at War", date: "13 Jun", points: 25, category: "general" },
    { titleHi: "माइक्रोसॉफ़्ट एसक्यूएल सर्वर", titleEn: "Microsoft SQL Server", date: "10 Jun", points: 25, category: "tech" },
    { titleHi: "आईबीएम पर्सनल कंप्यूटर", titleEn: "IBM Personal Computer", date: "10 Jun", points: 25, category: "tech" },
    { titleHi: "आईमैक", titleEn: "iMac", date: "10 Jun", points: 25, category: "tech" },
    { titleHi: "आईफ़ोन 6एस", titleEn: "iPhone 6s", date: "10 Jun", points: 25, category: "tech" },
    { titleHi: "आईफ़ोन 3जी", titleEn: "iPhone 3G", date: "10 Jun", points: 25, category: "tech" },
    { titleHi: "आईफ़ोन 3जीएस", titleEn: "iPhone 3GS", date: "8 Jun", points: 25, category: "tech" },
    { titleHi: "मिनीकंप्यूटर", titleEn: "Minicomputer", date: "8 Jun", points: 25, category: "tech" },
    { titleHi: "आईफ़ोन 7", titleEn: "iPhone 7", date: "8 Jun", points: 25, category: "tech" },
    { titleHi: "आईफ़ोन 4एस", titleEn: "iPhone 4s", date: "8 Jun", points: 25, category: "tech" },
    { titleHi: "आईफ़ोन 5", titleEn: "iPhone 5", date: "8 Jun", points: 25, category: "tech" },
    { titleHi: "प्राणियों का इतिहास (अरस्तू)", titleEn: "History of Animals (Aristotle)", date: "8 Jun", points: 25, category: "science" },
    { titleHi: "किता (टोक्यो)", titleEn: "Kita, Tokyo", date: "8 Jun", points: 25, category: "general" },
    { titleHi: "पैरिश", titleEn: "Parish", date: "8 Jun", points: 25, category: "general" },
    { titleHi: "तला हुआ अंडा", titleEn: "Fried egg", date: "8 Jun", points: 25, category: "general" },
    { titleHi: "मैकरोनी", titleEn: "Macaroni", date: "8 Jun", points: 25, category: "general" },
    { titleHi: "रोबोटिक वैक्यूम क्लीनर", titleEn: "Robotic vacuum cleaner", date: "8 Jun", points: 25, category: "tech" },
    { titleHi: "वेब ब्राउज़र", titleEn: "Web browser", date: "5 Jun", points: 25, category: "tech" },
    { titleHi: "कृत्रिम बुद्धिमत्ता", titleEn: "Artificial intelligence", date: "5 Jun", points: 25, category: "tech" },
    { titleHi: "जावास्क्रिप्ट", titleEn: "JavaScript", date: "4 Jun", points: 25, category: "tech" },
    { titleHi: "ज्वालामुखी", titleEn: "Volcano", date: "4 Jun", points: 25, category: "science" },
    { titleHi: "अवसादी शैल", titleEn: "Sedimentary rock", date: "3 Jun", points: 25, category: "science" },
    { titleHi: "भूकंप विज्ञान", titleEn: "Seismology", date: "3 Jun", points: 25, category: "science" }
  ]
};
