"use client"

import { useState, createContext, useContext, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, X, Mail, Briefcase, Gamepad2, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react"
import { FaGooglePlay, FaAppStoreIos, FaSteam, FaXbox, FaPlaystation, FaItchIo, FaTelegramPlane } from "react-icons/fa"
import { SiHuawei } from "react-icons/si"
import { TbBrandRust } from "react-icons/tb"

import translations from "../data/translations.json"
import projectsData from "../data/projects.json"
import experienceData from "../data/experience.json"

const YandexGamesIcon = () => (
  <img
    src="https://yastatic.net/s3/doc-binary/src/support/games/en/files/logo-en-short.svg"
    alt="Yandex Games"
    className="w-12 h-4 opacity-70 hover:opacity-100 transition-opacity"
  />
)

const LanguageContext = createContext({
  language: "en",
  setLanguage: (lang: string) => {},
})

const BIRTH_DATE = new Date(2001, 6, 9)
const CAREER_START = new Date(2023, 7, 1)

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

function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext)

  return (
    <div className="flex items-center rounded-full border border-border bg-card p-0.5">
      {["en", "ru"].map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors ${
            language === lang ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
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
  longDescription?: string
  website?: string
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

function StoreLinks({ links }: { links?: Project["storeLinks"] }) {
  if (!links) return null

  const iconClass = "w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.googlePlay && (
        <a href={links.googlePlay} target="_blank" rel="noopener noreferrer" title="Google Play" onClick={stop}>
          <FaGooglePlay className={iconClass} />
        </a>
      )}
      {links.appStore && (
        <a href={links.appStore} target="_blank" rel="noopener noreferrer" title="App Store" onClick={stop}>
          <FaAppStoreIos className={iconClass} />
        </a>
      )}
      {links.steam && (
        <a href={links.steam} target="_blank" rel="noopener noreferrer" title="Steam" onClick={stop}>
          <FaSteam className={iconClass} />
        </a>
      )}
      {links.xbox && (
        <a href={links.xbox} target="_blank" rel="noopener noreferrer" title="Xbox" onClick={stop}>
          <FaXbox className={iconClass} />
        </a>
      )}
      {links.playstation && (
        <a href={links.playstation} target="_blank" rel="noopener noreferrer" title="PlayStation" onClick={stop}>
          <FaPlaystation className={iconClass} />
        </a>
      )}
      {links.yandexGames && (
        <a href={links.yandexGames} target="_blank" rel="noopener noreferrer" title="Yandex Games" onClick={stop}>
          <YandexGamesIcon />
        </a>
      )}
      {links.appGallery && (
        <a href={links.appGallery} target="_blank" rel="noopener noreferrer" title="AppGallery" onClick={stop}>
          <SiHuawei className={iconClass} />
        </a>
      )}
      {links.ruStore && (
        <a href={links.ruStore} target="_blank" rel="noopener noreferrer" title="RuStore" onClick={stop}>
          <TbBrandRust className={iconClass} />
        </a>
      )}
      {links.itchIo && (
        <a href={links.itchIo} target="_blank" rel="noopener noreferrer" title="itch.io" onClick={stop}>
          <FaItchIo className={iconClass} />
        </a>
      )}
    </div>
  )
}

const chipPalette = [
  "bg-indigo-50 text-indigo-700 border-indigo-100",
  "bg-sky-50 text-sky-700 border-sky-100",
  "bg-emerald-50 text-emerald-700 border-emerald-100",
  "bg-amber-50 text-amber-700 border-amber-100",
  "bg-rose-50 text-rose-700 border-rose-100",
  "bg-violet-50 text-violet-700 border-violet-100",
]

const keyStack = [
  "Unity",
  "C#",
  "Zenject",
  "UniTask",
  "Addressables",
  "DOTween",
  "ECS / FSM / BT",
  "Photon Fusion",
  "AppLovin MAX",
  "Firebase",
  "Unity IAP",
  "Git / CI-CD",
]

type ProjectFilter = "all" | "published" | "development"

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
    document.title = language === "ru" ? "Даниил Чернов — Unity-разработчик" : "Daniil Chernov — Unity Developer"
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.about)
  }, [language, t.about])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col">
        {/* Top strip */}
        <header className="shrink-0 px-4 lg:px-5 h-12 flex items-center justify-between border-b border-border bg-card/70">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="font-bold tracking-tight whitespace-nowrap">{t.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {t.title} · {formatAge(getAge(), language)} · {t.location}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/smagoll"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://t.me/potero"
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaTelegramPlane className="h-4 w-4" />
            </a>
            <a
              href="mailto:daniilchernov1994@gmail.com"
              title="Email"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
            <LanguageSwitcher />
          </div>
        </header>

        {/* Bento grid */}
        <main className="flex-1 min-h-0 p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[11fr_7fr] gap-3 lg:gap-4">
          {/* Profile */}
          <Card className="lg:col-span-4 rounded-2xl p-5 flex flex-col min-h-0 overflow-hidden border-black/5 bg-gradient-to-br from-white via-white to-indigo-50/70">
            <h1 className="text-2xl xl:text-3xl font-bold tracking-tight">{t.name}</h1>
            <p className="text-sm font-medium text-indigo-600 mt-1">{t.title}</p>
            <p className="text-[13px] text-muted-foreground mt-3 leading-relaxed">{t.about}</p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {keyStack.map((skill, i) => (
                <span
                  key={skill}
                  className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${chipPalette[i % chipPalette.length]}`}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              <span>{t.eduLine}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              <a href="https://t.me/potero" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-1.5 rounded-full px-4 h-8 text-xs">
                  <FaTelegramPlane className="h-3.5 w-3.5" />
                  {t.getInTouch}
                </Button>
              </a>
              <a href="https://github.com/smagoll" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5 rounded-full px-4 h-8 text-xs bg-white/70">
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </Button>
              </a>
              <a href="mailto:daniilchernov1994@gmail.com">
                <Button size="sm" variant="outline" className="gap-1.5 rounded-full px-4 h-8 text-xs bg-white/70">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </Button>
              </a>
            </div>

            <div className="flex items-stretch gap-5 mt-4 pt-4 border-t border-black/5">
              <Stat value={String(projects.published.length)} label={t.statGames} color="text-indigo-600" />
              <div className="w-px bg-black/5" />
              <Stat value={String(getCareerYears())} label={t.statYears} color="text-emerald-600" />
              <div className="w-px bg-black/5" />
              <Stat value="Mobile · WebGL · PC" label={t.statPlatforms} color="text-amber-600" small />
            </div>
          </Card>

          {/* Projects */}
          <ProjectsTile projects={projects} t={t} onSelect={(p) => setSelectedProject(p)} />

          {/* Experience */}
          <Card className="lg:col-span-12 rounded-2xl p-5 min-h-0 flex flex-col overflow-hidden border-black/5 bg-gradient-to-br from-white via-white to-amber-50/60">
            <TileHeader
              icon={<Briefcase className="h-3.5 w-3.5" />}
              color="bg-amber-100/80 text-amber-700"
              label={t.experience}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 overflow-y-auto pr-1 flex-1 min-h-0">
              {experience.map((exp, index) => (
                <div key={index} className={index === 0 ? "md:border-r md:border-black/5 md:pr-10" : ""}>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="font-bold text-sm">{exp.company}</h3>
                    <span className="text-xs text-muted-foreground">{exp.position}</span>
                    <span
                      className={`text-[11px] ml-auto px-2 py-0.5 rounded-full ${
                        index === 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {exp.duration}
                    </span>
                  </div>
                  <ul className="mt-2.5 grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-1.5">
                    {exp.responsibilities.map((task, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-1.5 leading-snug">
                        <span className="text-amber-500 mt-px">▪</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </main>

        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </div>
    </LanguageContext.Provider>
  )
}

function Stat({ value, label, color, small }: { value: string; label: string; color: string; small?: boolean }) {
  return (
    <div className="flex flex-col justify-center min-w-0">
      <p className={`font-bold tracking-tight ${color} ${small ? "text-xs leading-6" : "text-xl"}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

function TileHeader({
  icon,
  color,
  label,
  right,
}: {
  icon: React.ReactNode
  color: string
  label: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 mb-3 shrink-0">
      <span className={`flex items-center justify-center w-6 h-6 rounded-md ${color}`}>{icon}</span>
      <h2 className="text-sm font-bold tracking-tight">{label}</h2>
      {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
    </div>
  )
}

function ProjectsTile({
  projects,
  t,
  onSelect,
}: {
  projects: { published: Project[]; inDevelopment: Project[] }
  t: Record<string, string>
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
    const el = sliderRef.current
    if (el) el.scrollTo({ left: 0 })
    updateArrows()
  }, [filter, updateArrows])

  const scrollBy = (dir: number) => {
    const el = sliderRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" })
  }

  const filters: { key: ProjectFilter; label: string }[] = [
    { key: "all", label: t.filterAll },
    { key: "published", label: t.filterPublished },
    { key: "development", label: t.filterInDev },
  ]

  return (
    <Card className="lg:col-span-8 rounded-2xl p-5 min-h-0 flex flex-col overflow-hidden border-black/5 bg-gradient-to-br from-white via-white to-violet-50/60">
      <TileHeader
        icon={<Gamepad2 className="h-3.5 w-3.5" />}
        color="bg-indigo-100/80 text-indigo-700"
        label={t.navProjects}
        right={
          <>
            <div className="flex items-center gap-1 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors ${
                    filter === f.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white/70 text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scrollBy(-1)}
                disabled={!canLeft}
                aria-label="Previous"
                className="flex items-center justify-center w-7 h-7 rounded-full border border-border bg-white/70 hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => scrollBy(1)}
                disabled={!canRight}
                aria-label="Next"
                className="flex items-center justify-center w-7 h-7 rounded-full border border-border bg-white/70 hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        }
      />

      <div
        ref={sliderRef}
        onScroll={updateArrows}
        className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory flex-1 min-h-0 items-stretch"
      >
        {list.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            inDevelopment={inDevTitles.has(project.title)}
            t={t}
            onViewDetails={() => onSelect(project)}
          />
        ))}
      </div>
    </Card>
  )
}

function ProjectCard({
  project,
  onViewDetails,
  inDevelopment,
  t,
}: {
  project: Project
  onViewDetails: () => void
  inDevelopment?: boolean
  t: Record<string, string>
}) {
  return (
    <div
      className="cursor-pointer group flex flex-col shrink-0 snap-start w-[215px] rounded-xl border border-black/5 bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      onClick={onViewDetails}
    >
      <div className="relative h-[45%] min-h-[100px] w-full overflow-hidden bg-muted shrink-0">
        <img
          src={project.image}
          alt={project.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <Badge
          className={`absolute top-2 right-2 text-[10px] px-1.5 py-0 shadow-sm ${
            inDevelopment
              ? "bg-violet-100 text-violet-700 border border-violet-200"
              : "bg-white/90 text-foreground backdrop-blur-sm border border-black/5"
          }`}
        >
          {inDevelopment ? t.inProgress : project.date}
        </Badge>
      </div>
      <div className="p-3 flex flex-col flex-1 min-h-0">
        <h3 className="font-semibold text-[13px] leading-tight truncate">{project.title}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{project.role}</p>
        <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-3 leading-snug">{project.description}</p>
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <StoreLinks links={project.storeLinks} />
          <span className="text-[10px] text-muted-foreground truncate shrink-0 max-w-[80px]">{project.platforms}</span>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
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

  return (
    <div
      className="fixed inset-0 bg-foreground/25 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card/95 backdrop-blur z-10 flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl md:text-2xl font-bold">{project.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="aspect-video w-full overflow-hidden rounded-xl mb-6 border border-border">
                <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-bold mb-2">{t.overview}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                </section>

                <section>
                  <h3 className="text-lg font-bold mb-2">{t.myRole}</h3>
                  <p className="text-sm font-medium mb-2">{project.role}</p>
                  <ul className="space-y-1.5">
                    {(project.responsibilities || []).map((resp, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-indigo-400 mt-0.5">▪</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold mb-2">{t.keyFeatures}</h3>
                  <ul className="space-y-1.5">
                    {(project.features || []).map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-indigo-400 mt-0.5">▪</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            <div className="md:col-span-1 space-y-5">
              <div>
                <h3 className="font-semibold mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                  {t.projectDetails}
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{t.status}:</span>
                    <span className="font-medium text-right">
                      {project.date.includes("Present") ? t.inProgress : t.released}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{t.timeline}:</span>
                    <span className="font-medium text-right">{project.date}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{t.teamSize}:</span>
                    <span className="font-medium text-right">{project.team}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{t.platforms}:</span>
                    <span className="font-medium text-right">{project.platforms || "—"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-xs uppercase tracking-wide text-muted-foreground">{t.links}</h3>
                <div className="space-y-2">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Github className="h-4 w-4" />
                        {t.viewOnGitHub}
                      </Button>
                    </a>
                  )}
                  {project.website && (
                    <a href={project.website} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        {t.visitWebsite}
                      </Button>
                    </a>
                  )}
                  <StoreLinks links={project.storeLinks} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                  {t.technologies}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={tech}
                      className={`text-xs px-2 py-0.5 rounded-full border ${chipPalette[i % chipPalette.length]}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
