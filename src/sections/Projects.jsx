import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { projects } from '../data/portfolio'

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.153-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
)

function ProjectLinks({ project }) {
  if (!project.github && !project.live) return null
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors'
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {project.live && (
        <a href={project.live} target="_blank" rel="noopener noreferrer" className={`${base} bg-white text-black hover:bg-white/90`}>
          Live demo
          <span className="sr-only"> of {project.title} (opens in a new tab)</span>
        </a>
      )}
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer" className={`${base} border border-white/15 text-white/85 hover:text-white hover:border-white/30`}>
          <GitHubIcon />
          Source
          <span className="sr-only"> code for {project.title} (opens in a new tab)</span>
        </a>
      )}
    </div>
  )
}

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
})

function FeaturedProject({ project }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <motion.article
      ref={ref}
      variants={fadeUp(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      data-guide={`${project.title}: ${project.description}`}
      className="col-span-full rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/15 transition-colors duration-300 group"
    >
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Info */}
        <div className="p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl" aria-hidden="true">{project.icon}</span>
            {project.badge && (
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs font-medium">
                {project.badge}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
          <p className="text-white/50 text-xs font-mono mb-4">{project.date}</p>
          <p className="text-white/70 text-sm leading-relaxed mb-6">{project.description}</p>
          <ul className="space-y-2 mb-6">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                {h}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 text-white/55 text-xs font-mono">
                {tag}
              </span>
            ))}
          </div>
          <ProjectLinks project={project} />
        </div>

        {/* Code preview */}
        <div className="border-t lg:border-t-0 lg:border-l border-white/5 bg-black/30">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="ml-2 text-xs text-white/45 font-mono">{project.codeFile}</span>
          </div>
          <pre className="p-5 text-xs font-mono leading-relaxed text-white/60 overflow-x-auto h-full">
            <code>{project.code}</code>
          </pre>
        </div>
      </div>
    </motion.article>
  )
}

function ProjectCard({ project, delay }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <motion.article
      ref={ref}
      variants={fadeUp(delay)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      data-guide={`${project.title}: ${project.description}`}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col"
    >
      <div className="mb-6">
        <span className="text-3xl" aria-hidden="true">{project.icon}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
      <p className="text-white/50 text-xs font-mono mb-3">{project.date}</p>
      <p className="text-white/70 text-sm leading-relaxed mb-5 flex-1">{project.description}</p>
      <ul className="space-y-2 mb-6">
        {project.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-white/55">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />
            {h}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs font-mono">
            {tag}
          </span>
        ))}
      </div>
      <ProjectLinks project={project} />
    </motion.article>
  )
}

function PlaceholderCard({ delay }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <motion.article
      ref={ref}
      variants={fadeUp(delay)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className="rounded-2xl border border-dashed border-white/10 p-8 flex flex-col items-center justify-center text-center min-h-64 group hover:border-white/15 transition-colors"
    >
      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/45 text-xl mb-4 group-hover:border-white/20 transition-colors">
        +
      </div>
      <p className="text-white/55 font-medium text-sm mb-1">More coming soon</p>
      <span className="text-white/40 text-xs">Currently building something new</span>
    </motion.article>
  )
}

export default function Projects() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  const featured = projects.filter(p => p.featured)
  const regular = projects.filter(p => !p.featured)

  return (
    <section id="projects" data-guide="The projects live here. I checked: none of them are secretly snack-sized." className="py-32 bg-[#050505]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeUp(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-xs font-mono text-white/55 tracking-[0.3em] uppercase mb-4"
        >
          Projects
        </motion.div>
        <motion.h2
          variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-4xl sm:text-5xl font-black mb-14"
        >
          What I've built
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-5">
          {featured.map(p => <FeaturedProject key={p.id} project={p} />)}
          {regular.map((p, i) => <ProjectCard key={p.id} project={p} delay={i * 0.1} />)}
          <PlaceholderCard delay={regular.length * 0.1} />
        </div>
      </div>
    </section>
  )
}
