import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { skills } from '../data/portfolio'

const dotMap = {
  purple: 'bg-purple-400',
  blue: 'bg-blue-400',
  pink: 'bg-pink-400',
  green: 'bg-emerald-400',
}

const coreChip = {
  purple: 'border-purple-400/40 bg-purple-500/10 text-white/90',
  blue: 'border-blue-400/40 bg-blue-500/10 text-white/90',
  pink: 'border-pink-400/40 bg-pink-500/10 text-white/90',
  green: 'border-emerald-400/40 bg-emerald-500/10 text-white/90',
}

const CORE_LEVEL = 80

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
})

function Chip({ item, className }) {
  return (
    <li className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${className}`}>
      <span aria-hidden="true">{item.icon}</span>
      {item.name}
    </li>
  )
}

export default function Skills() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <section id="skills" data-guide="A skill list! I tried to learn Python, but it kept hissing at me." className="py-32 bg-black" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeUp(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-xs font-mono text-white/55 tracking-[0.3em] uppercase mb-4"
        >
          Skills
        </motion.div>
        <motion.h2
          variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-4xl sm:text-5xl font-black mb-4"
        >
          Tools &amp; Technologies
        </motion.h2>
        <motion.p
          variants={fadeUp(0.15)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-white/60 text-sm mb-14 flex flex-wrap items-center gap-x-5 gap-y-1"
        >
          <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full border border-white/50 bg-white/20" aria-hidden="true" />Core — used most</span>
          <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full border border-white/15" aria-hidden="true" />Also use</span>
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-5">
          {skills.map((group, gi) => {
            const core = group.items.filter((i) => i.level >= CORE_LEVEL)
            const rest = group.items.filter((i) => i.level < CORE_LEVEL)
            return (
              <motion.div
                key={group.category}
                variants={fadeUp(gi * 0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                data-guide={`${group.category}: ${group.items.map((item) => item.name).join(', ')}.`}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-2 h-2 rounded-full ${dotMap[group.color]}`} aria-hidden="true" />
                  <h3 className="text-white/80 text-xs font-mono tracking-widest uppercase">{group.category}</h3>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label={`${group.category} skills`}>
                  {core.map((item) => <Chip key={item.name} item={item} className={coreChip[group.color]} />)}
                  {rest.map((item) => <Chip key={item.name} item={item} className="border-white/10 bg-white/[0.02] text-white/70" />)}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
