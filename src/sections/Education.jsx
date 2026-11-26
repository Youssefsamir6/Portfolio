import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { education, certificates } from '../data/portfolio'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
})

export default function Education() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="education" data-guide="The learning zone. Youssef gets the degree; I get to borrow the graduation hat." className="py-32 bg-[#050505]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeUp(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-xs font-mono text-white/55 tracking-[0.3em] uppercase mb-4"
        >
          Education
        </motion.div>
        <motion.h2
          variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-4xl sm:text-5xl font-black mb-14"
        >
          Academic Background
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 ml-5" />

          <div className="space-y-10">
            {education.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp(0.2 + i * 0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                data-guide={`${item.degree} at ${item.school}, ${item.location}. Expected ${item.date}.`}
                className="relative pl-16"
              >
                {/* Dot */}
                <div className="absolute left-3.5 top-1.5 w-3 h-3 rounded-full border-2 border-white/40 bg-black" />

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 hover:border-white/15 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.degree}</h3>
                      <p className="text-white/70 text-sm">{item.school}</p>
                      <p className="text-white/50 text-xs font-mono mt-1">{item.location}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-mono flex-shrink-0">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.courses.map(course => (
                      <span key={course} className="px-2.5 py-1 rounded-full bg-white/5 text-white/55 text-xs">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <motion.h2
          variants={fadeUp(0.5)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-3xl sm:text-4xl font-black mt-24 mb-14"
        >
          Certifications
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, i) => (
            <motion.a
              key={i}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp(0.6 + i * 0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              data-guide={`${cert.name}, issued by ${cert.issuer}.`}
              className="group block rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 hover:bg-white/[0.04] transition-all"
            >
              {cert.image ? (
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-white/10 bg-white/5">
                  <img src={cert.image} alt={`${cert.name} certificate`} loading="lazy" decoding="async" width="800" height="600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-white/10 bg-white/5 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white/90 transition-colors">{cert.name}</h3>
                <p className="text-white/70 text-sm mb-4">{cert.issuer}</p>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-white/60 group-hover:text-white/85 transition-colors">
                  View Certificate
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
