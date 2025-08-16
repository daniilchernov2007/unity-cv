"use client"

import {useState, createContext, useContext, useEffect} from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gamepad2, Github, Globe, Calendar, Users, Code, Cpu, X } from "lucide-react"
import { FaGooglePlay, FaAppStoreIos, FaSteam, FaXbox, FaPlaystation, FaItchIo } from "react-icons/fa"
import { SiHuawei } from "react-icons/si"
import { TbBrandRust } from "react-icons/tb"

import translations from '../data/translations.json';
import projectsData from '../data/projects.json';
import experienceData from '../data/experience.json'

// Custom Yandex Games icon component
const YandexGamesIcon = () => (
    <img
        src="https://yastatic.net/s3/doc-binary/src/support/games/en/files/logo-en-short.svg"
        alt="Yandex Games"
        className="w-20 h-8"
    />
);

// Language context
const LanguageContext = createContext({
  language: "en",
  setLanguage: (lang: string) => {},
})

// Language switcher component
function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext)

  return (
    <div className="flex items-center gap-2">
      <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")}>
        EN
      </Button>
      <Button variant={language === "ru" ? "default" : "outline"} size="sm" onClick={() => setLanguage("ru")}>
        RU
      </Button>
    </div>
  )
}

// Updated Project type
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

// Updated StoreLinks component
function StoreLinks({ links }: { links?: Project["storeLinks"] }) {
  if (!links) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {links.googlePlay && (
        <a href={links.googlePlay} target="_blank" rel="noopener noreferrer" title="Google Play">
          <FaGooglePlay className="w-6 h-6" />
        </a>
      )}
      {links.appStore && (
        <a href={links.appStore} target="_blank" rel="noopener noreferrer" title="App Store">
          <FaAppStoreIos className="w-6 h-6" />
        </a>
      )}
      {links.steam && (
        <a href={links.steam} target="_blank" rel="noopener noreferrer" title="Steam">
          <FaSteam className="w-6 h-6" />
        </a>
      )}
      {links.xbox && (
        <a href={links.xbox} target="_blank" rel="noopener noreferrer" title="Xbox">
          <FaXbox className="w-6 h-6" />
        </a>
      )}
      {links.playstation && (
        <a href={links.playstation} target="_blank" rel="noopener noreferrer" title="PlayStation">
          <FaPlaystation className="w-6 h-6" />
        </a>
      )}
      {links.yandexGames && (
        <a href={links.yandexGames} target="_blank" rel="noopener noreferrer" title="Yandex Games">
          <YandexGamesIcon />
        </a>
      )}
      {links.appGallery && (
        <a href={links.appGallery} target="_blank" rel="noopener noreferrer" title="AppGallery">
          <SiHuawei className="w-6 h-6" />
        </a>
      )}
      {links.ruStore && (
        <a href={links.ruStore} target="_blank" rel="noopener noreferrer" title="RuStore">
          <TbBrandRust className="w-6 h-6" />
        </a>
      )}
      {links.itchIo && (
        <a href={links.itchIo} target="_blank" rel="noopener noreferrer" title="itch.io">
          <FaItchIo className="w-6 h-6" />
        </a>
      )}
    </div>
  )
}

export default function Resume() {
  const getInitialLanguage = () => {
    // Определяем по браузеру
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('ru')) return 'ru'
    return 'en'
  }
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [language, setLanguage] = useState(getInitialLanguage)

  const t = translations[language as keyof typeof translations]
  const projects = projectsData[language as keyof typeof projectsData]

  useEffect(() => {
    localStorage.setItem('preferred-language', language)
  }, [language])

  useEffect(() => {
    const title = language === 'ru' ? 'Данил Чернов - Unity Разработчик' : 'Daniil Chernov - Unity Developer'
    document.title = title

    const description = t.about
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [language, t.about])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="container mx-auto py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.name}</h1>
              <p className="text-xl text-muted-foreground mt-1">{t.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{t.years}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>{t.location}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  <a
                    href="https://github.com/smagoll"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    github.com/smagoll
                  </a>
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="mailto:daniilchernov1994@gmail.com" className="text-sm text-muted-foreground hover:text-primary">
                daniilchernov1994@gmail.com
              </a>
              <LanguageSwitcher />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-muted-foreground max-w-3xl">{t.about}</p>
          </div>
        </header>

        {/* Featured Project Section */}
        <section className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2">
            🌟 {t.featuredProject || "Избранный проект"}
          </h2>

          {projects.inDevelopment.length > 0 && (
              <Card
                  className="overflow-hidden relative border-2 border-yellow-400/40 shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => setSelectedProject(projects.inDevelopment[0])}
              >
                {/* Бейдж "Code Sample / In Development" */}
                <Badge className="absolute top-3 left-3 bg-yellow-500 text-white z-10 shadow-md">
                  {t.codeSample || "Пример кода / В разработке"}
                </Badge>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Картинка */}
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                        src={projects.inDevelopment[0].image}
                        alt={projects.inDevelopment[0].title}
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                  </div>

                  {/* Описание + код */}
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-xl font-bold">{projects.inDevelopment[0].title}</h3>
                      <p className="text-yellow-700 mt-2 font-semibold">
                        {t.inDevelopment || "В разработке — смотрите как пример кода"}
                      </p>
                      <p className="text-muted-foreground mt-2">{projects.inDevelopment[0].description}</p>

                      {/* Технологии */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {projects.inDevelopment[0].technologies.map((tech) => (
                            <Badge key={tech} variant="outline">
                              {tech}
                            </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Кнопки */}
                    <div className="flex gap-3 mt-6">
                      {projects.inDevelopment[0].github && (
                          <a href={projects.inDevelopment[0].github} target="_blank" rel="noopener noreferrer">
                            <Button className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700">
                              <Github className="h-4 w-4" />
                              {t.viewOnGitHub || "Посмотреть код"}
                            </Button>
                          </a>
                      )}
                      <Button variant="outline">
                        {t.viewDetails || "Подробнее"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
          )}
        </section>


        {/* Main Content */}
        <main className="container mx-auto py-6">
          <Tabs defaultValue="published" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="published" className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                {t.publishedProjects}
              </TabsTrigger>
              <TabsTrigger value="development" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                {t.inDevelopment}
              </TabsTrigger>
            </TabsList>

            {/* Published Projects */}
            <TabsContent value="published" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.published.map((project) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    onViewDetails={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* In Development Projects */}
            <TabsContent value="development" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.inDevelopment.map((project) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    onViewDetails={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Experience Section */}
        <section className="container mx-auto py-12 border-t">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t.experience || "Experience"}
          </h2>

          <div className="space-y-6">
            {experienceData[language as keyof typeof experienceData].map((exp, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{exp.company}</CardTitle>
                    <CardDescription className="flex justify-between text-sm text-muted-foreground">
                      <span>{exp.position}</span>
                      <span>{exp.duration}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {exp.responsibilities.map((task, i) => (
                          <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
            ))}
          </div>
        </section>


        {/* Skills Section */}
        <section className="container mx-auto py-12 border-t">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            {t.skills}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-4">
              <h3 className="font-medium mb-4">{t.gameDev}</h3>
              {gameDevSkills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium mb-4">{t.programmingTools}</h3>
              {programmingSkills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="justify-center py-2">
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        {/* Project Details Modal */}
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </div>
    </LanguageContext.Provider>
  )
}

// Updated ProjectCard component
function ProjectCard({ project, onViewDetails }: { project: Project; onViewDetails: () => void }) {
  const { language } = useContext(LanguageContext)
  const t = translations[language as keyof typeof translations]

  return (
    <Card className="overflow-hidden cursor-pointer" onClick={onViewDetails}>
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={project.image}
          alt={project.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
        <StoreLinks links={project.storeLinks} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{project.date}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>{project.team}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

// Updated ProjectModal component
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { language } = useContext(LanguageContext)
  const t = translations[language as keyof typeof translations]

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background z-10 flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-bold mb-3">{t.overview}</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-3">{t.myRole}</h3>
                  <p className="text-muted-foreground">
                    {t.role}: {project.role}
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    {project.responsibilities ? (
                      project.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)
                    ) : (
                      <>
                        <li>Designing and implementing core gameplay systems</li>
                        <li>Optimizing performance across target platforms</li>
                        <li>Collaborating with artists to implement visual effects</li>
                        <li>Debugging and fixing critical issues</li>
                        <li>Contributing to technical documentation</li>
                      </>
                    )}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-3">{t.keyFeatures}</h3>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    {project.features ? (
                      project.features.map((feature, i) => <li key={i}>{feature}</li>)
                    ) : (
                      <>
                        <li>Immersive gameplay experience with innovative mechanics</li>
                        <li>High-performance rendering and optimization</li>
                        <li>Intuitive user interface and controls</li>
                        <li>Dynamic content generation systems</li>
                        <li>Cross-platform compatibility</li>
                      </>
                    )}
                  </ul>
                </section>
              </div>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{t.projectDetails}</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t.status}:</span>
                          <span className="font-medium">
                            {project.date.includes("Present") ? t.inProgress : t.released}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t.timeline}:</span>
                          <span className="font-medium">{project.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t.teamSize}:</span>
                          <span className="font-medium">{project.team}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t.role}:</span>
                          <span className="font-medium">{project.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t.platforms}:</span>
                          <span className="font-medium">{project.platforms || "PC, Console, Mobile"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">{t.links}</h3>
                      <div className="space-y-2">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                              <Github className="h-4 w-4" />
                              {t.viewOnGitHub}
                            </Button>
                          </a>
                        )}
                        {project.website && (
                          <a href={project.website} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full">
                              {t.visitWebsite}
                            </Button>
                          </a>
                        )}
                        <StoreLinks links={project.storeLinks} />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">{t.technologies}</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkillBar({ skill }: { skill: { name: string; level: number } }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}/10</span>
      </div>
      <Progress value={skill.level * 10} className="h-2" />
    </div>
  )
}

const gameDevSkills = [
  { name: "Unity Engine", level: 9 },
  { name: "Game Design", level: 8 },
  { name: "3D Modeling", level: 4 },
  { name: "Animation", level: 7 },
  { name: "Shaders/Particles", level: 7 },
]

const programmingSkills = [
  { name: "C#", level: 9 },
  { name: "Shader Programming", level: 5 },
  { name: "Addressables", level: 8 },
  { name: "Zenject", level: 6 },
  { name: "Photon", level: 6 },
]

const otherSkills = [
  "Version Control (Git)",
  "Agile/Scrum",
  "Performance Optimization",
  "Cross-platform Development",
  "Multiplayer Networking",
  "PC/Mobile/WebGL Development",
  "Technical Documentation",
]

