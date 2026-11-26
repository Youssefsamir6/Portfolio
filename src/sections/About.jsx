import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { personalInfo } from '../data/portfolio'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
})

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="about" data-guide="This is Youssef's origin story. No radioactive spiders, just a lot of code." className="py-32 bg-black" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeUp(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-xs font-mono text-white/55 tracking-[0.3em] uppercase mb-4"
        >
          About
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text side */}
          <div>
            <motion.h2
              variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="text-4xl sm:text-5xl font-black leading-tight mb-8"
            >
              Backend-first.<br />
              <span className="text-white/60">Full-stack</span> ready.
            </motion.h2>

            <div className="space-y-5">
              {personalInfo.bio.map((para, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp(0.2 + i * 0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                  className="text-white/70 leading-relaxed text-sm sm:text-base"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            <motion.div
              variants={fadeUp(0.5)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="mt-8 pt-8 border-t border-white/5"
            >
              <div className="text-xs text-white/55 font-mono tracking-widest uppercase mb-3">Currently learning</div>
              <div className="flex flex-wrap gap-2">
                {personalInfo.learning.map(item => (
                  <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium">
                    <span className="w-1 h-1 rounded-full bg-green-400" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Code card */}
          <motion.div
            variants={fadeUp(0.3)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="ml-2 text-xs text-white/45 font-mono">youssef.config.js</span>
              </div>
              {/* Code */}
              <pre className="p-5 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto">
                <code>
                  <span className="text-white/50">{'// Who I am\n'}</span>
                  <span className="text-purple-400">const </span>
                  <span className="text-blue-300">youssef</span>
                  <span className="text-white/80"> {'= {\n'}</span>
                  {Object.entries(personalInfo.config).map(([key, val], i) => (
                    <span key={i}>
                      <span className="text-white/60">{'  '}</span>
                      <span className="text-orange-300">{key}</span>
                      <span className="text-white/60">: </span>
                      {Array.isArray(val)
                        ? <>
                            <span className="text-white/60">{'['}</span>
                            {val.map((v, j) => (
                              <span key={j}>
                                <span className="text-green-300">"{v}"</span>
                                {j < val.length - 1 && <span className="text-white/60">, </span>}
                              </span>
                            ))}
                            <span className="text-white/60">{']'}</span>
                          </>
                        : typeof val === 'boolean'
                          ? <span className="text-purple-400">{String(val)}</span>
                          : <span className="text-green-300">"{val}"</span>
                      }
                      <span className="text-white/60">,{'\n'}</span>
                    </span>
                  ))}
                  <span className="text-white/80">{'};'}</span>
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
