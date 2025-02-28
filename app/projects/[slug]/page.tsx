import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Github } from "lucide-react"

export default function ProjectPage({ params }) {
  const { slug } = params

  // Find the project by slug
  const allProjects = [...publishedProjects, ...inDevelopmentProjects]
  const project = allProjects.find((p) => p.title.toLowerCase().replace(/\s+/g, "-") === slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
      <Link href="/" className="inline-block mb-8">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Resume
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
            <img
              src={project.image || "/placeholder.svg?height=400&width=800"}
              alt={project.title}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-muted-foreground">{project.description}</p>
              <p className="text-muted-foreground mt-4">
                {project.longDescription ||
                  "This project showcases advanced game development techniques and innovative gameplay mechanics. The development process involved extensive prototyping, playtesting, and optimization to create an engaging player experience."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">My Role</h2>
              <p className="text-muted-foreground">As the {project.role}, I was responsible for:</p>
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
              <h2 className="text-2xl font-bold mb-3">Key Features</h2>
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
                  <h3 className="font-medium mb-2">Project Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">
                        {project.date.includes("Present") ? "In Development" : "Released"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timeline:</span>
                      <span className="font-medium">{project.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Team Size:</span>
                      <span className="font-medium">{project.team}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="font-medium">{project.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platforms:</span>
                      <span className="font-medium">{project.platforms || "PC, Console, Mobile"}</span>
                    </div>
                  </div>
                </div>

                {project.github && (
                  <div>
                    <h3 className="font-medium mb-2">Links</h3>
                    <div className="space-y-2">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                          <Github className="h-4 w-4" />
                          View on GitHub
                        </Button>
                      </a>
                      {project.website && (
                        <a href={project.website} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="w-full">
                            Visit Website
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2">Technologies</h3>
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
  )
}

// Sample data - same as in page.tsx
const publishedProjects = [
  {
    title: "Cosmic Explorers",
    role: "Lead Gameplay Programmer",
    description: "Open-world space exploration game with procedurally generated planets and dynamic ecosystems.",
    technologies: ["Unity", "C#", "Shader Graph", "HDRP"],
    date: "2022",
    team: "Team of 12",
    image: "/placeholder.svg?height=200&width=400",
    github: "https://github.com/alexjgamedev/cosmic-explorers",
    platforms: "PC, PlayStation 5, Xbox Series X/S",
    responsibilities: [
      "Designed and implemented the procedural planet generation system",
      "Created dynamic ecosystem simulation with flora and fauna interactions",
      "Optimized rendering for console platforms",
      "Implemented spaceship physics and controls",
      "Led a team of 5 gameplay programmers",
    ],
    features: [
      "Seamless planet-to-space transitions with no loading screens",
      "Procedurally generated planets with unique biomes and ecosystems",
      "Dynamic weather and day/night cycle affecting gameplay",
      "Advanced AI for alien creatures with realistic behavior patterns",
      "Multiplayer co-op exploration mode",
    ],
  },
  {
    title: "Shadow Realms",
    role: "Technical Artist & AI Programmer",
    description: "Action RPG featuring dynamic lighting systems and advanced enemy AI behavior trees.",
    technologies: ["Unreal Engine", "C++", "Blueprint", "Behavior Trees"],
    date: "2021",
    team: "Team of 8",
    image: "/placeholder.svg?height=200&width=400",
    github: "https://github.com/alexjgamedev/shadow-realms",
  },
  {
    title: "Pixel Legends",
    role: "Full-stack Developer",
    description: "Cross-platform multiplayer 2D fighting game with rollback netcode and custom matchmaking.",
    technologies: ["Godot", "GDScript", "Node.js", "WebRTC"],
    date: "2020",
    team: "Team of 5",
    image: "/placeholder.svg?height=200&width=400",
    github: "https://github.com/alexjgamedev/pixel-legends",
  },
]

const inDevelopmentProjects = [
  {
    title: "Neon Drift",
    role: "Technical Director",
    description: "Cyberpunk racing game with advanced vehicle physics and dynamic weather system. Currently in beta.",
    technologies: ["Unity", "C#", "DOTS", "Havok Physics"],
    date: "2023-Present",
    team: "Team of 15",
    image: "/placeholder.svg?height=200&width=400",
    github: "https://github.com/alexjgamedev/neon-drift",
  },
  {
    title: "Forgotten Echoes",
    role: "Gameplay & Systems Engineer",
    description: "Narrative-driven horror game with innovative sound propagation and AI sensory systems.",
    technologies: ["Unreal Engine 5", "C++", "Wwise", "Niagara"],
    date: "2023-Present",
    team: "Team of 10",
    image: "/placeholder.svg?height=200&width=400",
    github: "https://github.com/alexjgamedev/forgotten-echoes",
  },
  {
    title: "Tactical Horizons",
    role: "Lead Developer",
    description: "Turn-based strategy game with procedural mission generation and deep customization systems.",
    technologies: ["Custom Engine", "C++", "Vulkan", "ImGui"],
    date: "2022-Present",
    team: "Team of 6",
    image: "/placeholder.svg?height=200&width=400",
    github: "https://github.com/alexjgamedev/tactical-horizons",
  },
]

