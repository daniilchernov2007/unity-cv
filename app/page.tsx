"use client"

import { useState, createContext, useContext, useEffect, useRef, useCallback } from "react"
import { Github, X, Mail, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { FaGooglePlay, FaAppStoreIos, FaSteam, FaXbox, FaPlaystation, FaItchIo, FaTelegramPlane } from "react-icons/fa"
import { SiHuawei } from "react-icons/si"
import { TbBrandRust } from "react-icons/tb"

import translations from "../data/translations.json"
import projectsData from "../data/projects.json"
import experienceData from "../data/experience.json"

type Translation = (typeof translations)["en"]

const LanguageContext = createContext({
  language: "en",
  setLanguage: (lang: string) => {},
})

const BIRTH_DATE = new Date(2001, 6, 9)
const CAREER_START = new Date(2023, 7, 1)
const PHOTO_SRC = "/images/me.jpg"
const TELEGRAM = "https://t.me/potero"
const GITHUB = "https://github.com/smagoll"
const EMAIL = "daniilchernov1994@gmail.com"

const keyStack = ["Unity", "C#", "Zenject", "UniTask", "Addressables", "DOTween", "ECS / FSM / BT", "Photon Fusion", "AppLovin MAX", "Firebase", "CI/CD"]

function getAge() {
  const now = new Date()
  let age = now.getFullYear() - BIRTH_DATE.getFullYear()
  if (
    now.getMonth() < BIRTH_DATE.getMonth() ||
    (now.getMonth() === BIRTH_DATE.getMonth() && now.getDate() < BIRTH_DATE.getDate())
  ) {
    age--
  }
  return age
}

function formatAge(age: number, language: string) {
  if (language !== "ru") return `${age} y.o.`
  const d = age % 10
  const h = age % 100
  const suffix = h >= 11 && h <= 14 ? "лет" : d === 1 ? "год" : d >= 2 && d <= 4 ? "года" : "лет"
  return `${age} ${suffix}`
}

function getCareerYears() {
  const years = (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 3600 * 1000)
  return Math.round(years)
}

type Project = {
  title: string
  role: string
  description: string
  technologies: string[]
  date: string
  team: string
  image: string
  github: string
  platforms?: string
  responsibilities?: string[]
  features?: string[]
  website?: string
  status?: string
  storeLinks?: {
    googlePlay?: string
    appStore?: string
    steam?: string
    xbox?: string
    playstation?: string
    yandexGames?: string
    appGallery?: string
    ruStore?: string
    itchIo?: string
  }
}

type ProjectFilter = "all" | "published" | "development"

function HandArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 90" fill="none" className={className} aria-hidden>
      <path
        d="M22 4c14 6 22 18 12 28-8 8-20 2-14-8 6-9 22-2 24 14 2 14-6 30-14 44"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M22 72l8 14 12-11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HandUnderline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 14" fill="none" preserveAspectRatio="none" className={className} aria-hidden>
      <path d="M2 9c40-6 90-8 196-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext)

  return (
    <div className="flex items-center gap-1.5 text-sm">
      {["en", "ru"].map((lang, i) => (
        <span key={lang} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-muted-foreground/50">/</span>}
          <button
            onClick={() => setLanguage(lang)}
            className={`uppercase transition-colors ${
              language === lang ? "font-bold text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang}
          </button>
        </span>
      ))}
    </div>
  )
}

function StoreLinks({ links, size = "sm" }: { links?: Project["storeLinks"]; size?: "sm" | "md" }) {
  if (!links) return null

  const iconClass = `${size === "sm" ? "w-4 h-4" : "w-5 h-5"} text-muted-foreground hover:text-foreground transition-colors`
  const stop = (e: React.MouseEvent) => e.stopPropagation()
  const items: { href?: string; title: string; icon: React.ReactNode }[] = [
    { href: links.googlePlay, title: "Google Play", icon: <FaGooglePlay className={iconClass} /> },
    { href: links.appStore, title: "App Store", icon: <FaAppStoreIos className={iconClass} /> },
    { href: links.steam, title: "Steam", icon: <FaSteam className={iconClass} /> },
    { href: links.xbox, title: "Xbox", icon: <FaXbox className={iconClass} /> },
    { href: links.playstation, title: "PlayStation", icon: <FaPlaystation className={iconClass} /> },
    {
      href: links.yandexGames,
      title: "Yandex Games",
      icon: (
        <img
          src="https://yastatic.net/s3/doc-binary/src/support/games/en/files/logo-en-short.svg"
          alt="Yandex Games"
          className={`${size === "sm" ? "w-12 h-4" : "w-16 h-5"} grayscale opacity-60 hover:opacity-100 transition-opacity`}
        />
      ),
    },
    { href: links.appGallery, title: "AppGallery", icon: <SiHuawei className={iconClass} /> },
    { href: links.ruStore, title: "RuStore", icon: <TbBrandRust className={iconClass} /> },
    { href: links.itchIo, title: "itch.io", icon: <FaItchIo className={iconClass} /> },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {items
        .filter((item) => item.href)
        .map((item) => (
          <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" title={item.title} onClick={stop}>
            {item.icon}
          </a>
        ))}
    </div>
  )
}

export default function Resume() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [language, setLanguageState] = useState("en")

  const setLanguage = useCallback((lang: string) => {
    localStorage.setItem("preferred-language", lang)
    setLanguageState(lang)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language")
    if (saved === "ru" || saved === "en") {
      setLanguageState(saved)
    } else if (navigator.language.toLowerCase().startsWith("ru")) {
      setLanguageState("ru")
    }
  }, [])

  const t = translations[language as keyof typeof translations]
  const projects = projectsData[language as keyof typeof projectsData]
  const experience = experienceData[language as keyof typeof experienceData]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = language === "ru" ? "Даниил Чернов — Unity-разработчик" : "Daniil Chernov — Unity Developer"
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.about)
  }, [language, t.about])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen overflow-x-hidden">
        <nav className="fixed top-0 inset-x-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
            <a href="#top" className="font-extrabold tracking-tight text-lg">
              {t.name}
            </a>
            <div className="flex items-center gap-5 md:gap-8">
              <a href="#projects" className="hidden sm:block text-sm font-medium hover:link-underline">
                {t.navProjects}
              </a>
              <a href="#experience" className="hidden sm:block text-sm font-medium hover:link-underline">
                {t.navExperience}
              </a>
              <a href="#contacts" className="hidden sm:block text-sm font-medium hover:link-underline">
                {t.contacts}
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </nav>

        <Hero t={t} language={language} gamesCount={projects.published.length} />

        <ProjectsSection projects={projects} t={t} onSelect={setSelectedProject} />

        <ExperienceSection experience={experience} t={t} />

        <ContactsSection t={t} />

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            inDevelopment={projects.inDevelopment.some((p) => p.title === selectedProject.title)}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </LanguageContext.Provider>
  )
}

function Hero({ t, language, gamesCount }: { t: Translation; language: string; gamesCount: number }) {
  return (
    <header id="top" className="relative max-w-7xl mx-auto px-5 md:px-10 pt-16 lg:min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 lg:min-h-[calc(100vh-4rem)]">
        <div className="lg:col-span-7 flex flex-col justify-center py-10 lg:py-12 relative z-10">
          <div className="relative self-start">
            <h1 className="font-black tracking-tighter leading-[0.85] text-[clamp(4.5rem,12vw,10.5rem)]">{t.hello}</h1>
            <p className="text-2xl md:text-3xl font-bold tracking-tight mt-3">{t.iAm}</p>

            <div className="hidden md:flex absolute -right-6 top-[calc(100%-3.25rem)] flex-col items-center -rotate-6 text-foreground/85">
              <span className="font-script text-4xl leading-none whitespace-nowrap">{t.aboutMe}</span>
              <HandArrow className="w-9 h-14 mt-1" />
            </div>
          </div>

          <p className="text-lg md:text-xl font-bold mt-10 md:mt-14">
            {t.title} · {formatAge(getAge(), language)} · {t.location}
          </p>
          <p className="text-[15px] md:text-[17px] leading-[1.75] md:text-justify hyphens-auto mt-3 max-w-[38rem]">{t.about}</p>

          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mt-5 max-w-[38rem] leading-6">
            {keyStack.join("  /  ")}
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 mt-8">
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:bg-foreground/85 transition-colors"
            >
              <FaTelegramPlane className="h-4 w-4" />
              {t.writeTelegram}
            </a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold link-underline hover:opacity-70">
              GitHub
            </a>
            <a href={`mailto:${EMAIL}`} className="text-sm font-semibold link-underline hover:opacity-70">
              Email
            </a>
          </div>

          <div className="grid grid-cols-3 max-w-[38rem] mt-10 border-t border-foreground/20">
            <HeroStat value={String(gamesCount)} label={t.statGames} />
            <HeroStat value={String(getCareerYears())} label={t.statYears} />
            <HeroStat value="Mobile · WebGL · PC" label={t.statPlatforms} small />
          </div>
        </div>

        <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-end">
          <Portrait t={t} />
        </div>
      </div>
    </header>
  )
}

function HeroStat({ value, label, small }: { value: string; label: string; small?: boolean }) {
  return (
    <div className="pt-4 pr-4">
      <p className={`font-extrabold tracking-tight ${small ? "text-sm md:text-base leading-9 md:leading-10" : "text-3xl md:text-4xl"}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

function Portrait({ t }: { t: Translation }) {
  const [hasPhoto, setHasPhoto] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) setHasPhoto(false)
  }, [])

  if (!hasPhoto) {
    return (
      <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] lg:aspect-auto lg:h-[min(86vh,760px)] lg:w-[110%] flex items-center justify-center">
        <div className="absolute inset-0 hatching" />
        <span className="relative font-script text-3xl -rotate-6 bg-background/70 px-3 py-1 rounded">{t.photoSoon}</span>
      </div>
    )
  }

  return (
    <img
      ref={imgRef}
      src={PHOTO_SRC}
      alt={t.name}
      onError={() => setHasPhoto(false)}
      className="pencil w-full max-w-md lg:max-w-none lg:w-[110%] lg:h-[min(90vh,800px)] object-contain object-bottom select-none pointer-events-none"
    />
  )
}

function SectionTitle({ title, note, children }: { title: string; note?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
      <div className="relative">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{title}</h2>
        <HandUnderline className="w-full h-3 mt-1 text-foreground/70" />
        {note && (
          <span className="block mt-2 sm:mt-0 sm:absolute sm:-right-4 sm:translate-x-full sm:-top-2 font-script text-3xl text-foreground/80 -rotate-3 sm:-rotate-6 whitespace-nowrap">
            {note}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function ProjectsSection({
  projects,
  t,
  onSelect,
}: {
  projects: { published: Project[]; inDevelopment: Project[] }
  t: Translation
  onSelect: (p: Project) => void
}) {
  const [filter, setFilter] = useState<ProjectFilter>("all")
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)

  const inDevTitles = new Set(projects.inDevelopment.map((p) => p.title))
  const list =
    filter === "published"
      ? projects.published
      : filter === "development"
        ? projects.inDevelopment
        : [...projects.published, ...projects.inDevelopment]

  const updateArrows = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    sliderRef.current?.scrollTo({ left: 0 })
    updateArrows()
  }, [filter, updateArrows])

  const scrollBy = (dir: number) => {
    const el = sliderRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  const filters: { key: ProjectFilter; label: string }[] = [
    { key: "all", label: t.filterAll },
    { key: "published", label: t.filterPublished },
    { key: "development", label: t.filterInDev },
  ]

  return (
    <section id="projects" className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28">
      <SectionTitle title={t.navProjects} note={`${t.swipe} →`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-sm font-semibold transition-colors ${
                  filter === f.key ? "link-underline" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canLeft}
              aria-label="Previous"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-foreground/80 hover:bg-foreground hover:text-background transition-colors disabled:opacity-25 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canRight}
              aria-label="Next"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-foreground/80 hover:bg-foreground hover:text-background transition-colors disabled:opacity-25 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SectionTitle>

      <div
        ref={sliderRef}
        onScroll={updateArrows}
        className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0 pb-2"
      >
        {list.map((project, i) => (
          <ProjectCard
            key={project.title}
            index={i + 1}
            project={project}
            inDevelopment={inDevTitles.has(project.title)}
            t={t}
            onViewDetails={() => onSelect(project)}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  onViewDetails,
  inDevelopment,
  t,
}: {
  project: Project
  index: number
  onViewDetails: () => void
  inDevelopment?: boolean
  t: Translation
}) {
  return (
    <article
      className="group shrink-0 snap-start w-[78vw] sm:w-[300px] cursor-pointer flex flex-col"
      onClick={onViewDetails}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-foreground/15 bg-muted">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {(inDevelopment || project.status) && (
          <span className="absolute top-3 left-3 bg-background/90 text-foreground text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded">
            {project.status ?? t.inProgress}
          </span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-3 mt-4">
        <h3 className="font-bold text-lg leading-tight truncate group-hover:link-underline">{project.title}</h3>
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">{String(index).padStart(2, "0")}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 truncate">
        {project.role} · {project.date}
      </p>
      <p className="text-sm leading-relaxed mt-2 line-clamp-2 text-foreground/80">{project.description}</p>
      <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-foreground/10">
        <StoreLinks links={project.storeLinks} />
        <span className="text-[11px] text-muted-foreground truncate">{project.platforms}</span>
      </div>
    </article>
  )
}

function ExperienceSection({
  experience,
  t,
}: {
  experience: { company: string; position: string; duration: string; responsibilities: string[] }[]
  t: Translation
}) {
  return (
    <section id="experience" className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28">
      <SectionTitle title={t.experience} note={`${getCareerYears()}+ ${t.statYears}`} />

      <div className="border-t border-foreground/20">
        {experience.map((exp) => (
          <div key={exp.company} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-10 border-b border-foreground/20">
            <div className="md:col-span-4">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">{exp.company}</h3>
              <p className="font-semibold mt-2">{exp.position}</p>
              <p className="font-script text-2xl text-muted-foreground mt-1">{exp.duration}</p>
            </div>
            <ul className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 content-start">
              {exp.responsibilities.map((task) => (
                <li key={task} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="text-muted-foreground">—</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mt-6">{t.eduLine}</p>
    </section>
  )
}

function ContactsSection({ t }: { t: Translation }) {
  const links = [
    { href: TELEGRAM, label: "Telegram", value: "@potero", icon: <FaTelegramPlane className="h-5 w-5" /> },
    { href: `mailto:${EMAIL}`, label: "Email", value: EMAIL, icon: <Mail className="h-5 w-5" /> },
    { href: GITHUB, label: "GitHub", value: "smagoll", icon: <Github className="h-5 w-5" /> },
  ]

  return (
    <section id="contacts" className="max-w-7xl mx-auto px-5 md:px-10 pt-20 md:pt-28 pb-10">
      <div className="relative inline-block">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] max-w-4xl">{t.letsWork}</h2>
        <span className="hidden md:block absolute -bottom-10 right-10 font-script text-4xl -rotate-6 text-foreground/80">
          {t.writeMe} ↓
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-16 border-t border-foreground/20">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 py-6 md:pr-8 border-b md:border-b-0 border-foreground/20"
          >
            <span className="flex items-center gap-3">
              {link.icon}
              <span>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">{link.label}</span>
                <span className="block font-semibold group-hover:link-underline break-all">{link.value}</span>
              </span>
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-16">
        © {new Date().getFullYear()} {t.name}
      </p>
    </section>
  )
}

function ProjectModal({
  project,
  inDevelopment,
  onClose,
}: {
  project: Project
  inDevelopment: boolean
  onClose: () => void
}) {
  const { language } = useContext(LanguageContext)
  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  const details = [
    { label: t.status, value: project.status ?? (inDevelopment ? t.inProgress : t.released) },
    { label: t.timeline, value: project.date },
    { label: t.teamSize, value: project.team },
    { label: t.platforms, value: project.platforms || "—" },
  ]

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-3 md:p-6" onClick={onClose}>
      <div
        className="paper border border-foreground/15 rounded-lg shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 paper flex justify-between items-center px-6 md:px-8 py-4 border-b border-foreground/15">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{project.title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-foreground/80 hover:bg-foreground hover:text-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <div className="md:col-span-2 space-y-8">
            <div className="aspect-video overflow-hidden rounded-md border border-foreground/15 bg-muted">
              <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
            </div>

            <section>
              <h3 className="font-script text-3xl mb-1">{t.overview}</h3>
              <p className="leading-relaxed">{project.description}</p>
            </section>

            <section>
              <h3 className="font-script text-3xl mb-1">{t.myRole}</h3>
              <p className="text-sm font-semibold mb-3">{project.role}</p>
              <ul className="space-y-2">
                {(project.responsibilities || []).map((resp) => (
                  <li key={resp} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="text-muted-foreground">—</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-script text-3xl mb-1">{t.keyFeatures}</h3>
              <ul className="space-y-2">
                {(project.features || []).map((feature) => (
                  <li key={feature} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="text-muted-foreground">—</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.projectDetails}</h3>
              <dl className="border-t border-foreground/15">
                {details.map((d) => (
                  <div key={d.label} className="flex justify-between gap-4 py-2.5 border-b border-foreground/15 text-sm">
                    <dt className="text-muted-foreground">{d.label}</dt>
                    <dd className="font-semibold text-right">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.links}</h3>
              <div className="space-y-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-foreground text-background py-2.5 text-sm font-semibold hover:bg-foreground/85 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    {t.viewOnGitHub}
                  </a>
                )}
                {project.website && (
                  <a href={project.website} target="_blank" rel="noopener noreferrer" className="block text-sm font-semibold link-underline">
                    {t.visitWebsite}
                  </a>
                )}
                <StoreLinks links={project.storeLinks} size="md" />
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.technologies}</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs px-2.5 py-1 rounded-full border border-foreground/25">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
