import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { personalInfo, stats } from '../data/portfolio'
import { scrollToId, prefersReducedMotion } from '../lib/scroll'

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState(() => (prefersReducedMotion() ? personalInfo.roles[0] : ''))
  const [typing, setTyping] = useState(true)
  const canvasRef = useRef(null)

  // Particle field. Fixes from the original: the "pause when off-screen" check read a stale value
  // (so nothing was ever drawn), and the loop ran forever. Now it uses IntersectionObserver,
  // pauses when the tab is hidden, honours reduced-motion, and renders crisply on retina screens.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    let particles = []
    let rafId = null
    let visible = true

    const init = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(80, Math.floor(w / 16))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.4 + 0.1,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`
        ctx.fill()
      }
      rafId = requestAnimationFrame(draw)
    }

    const start = () => { if (rafId === null && visible && !document.hidden) rafId = requestAnimationFrame(draw) }
    const stop = () => { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null } }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })
    io.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', init)

    init()
    start()

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', init)
    }
  }, [])

  // Typewriter (static first role when the user prefers reduced motion)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const role = personalInfo.roles[roleIdx]
    let timeout
    if (typing) {
      if (displayed.length < role.length) {
        timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60)
      } else {
        timeout = setTimeout(() => setTyping(false), 1800)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
      } else {
        setRoleIdx((roleIdx + 1) % personalInfo.roles.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, typing, roleIdx])

  const go = (id) => (e) => { e.preventDefault(); scrollToId(id) }

  return (
    <section id="home" data-guide="Welcome! I'm Munch, the tiny tour guide with absolutely no map." className="relative min-h-svh flex items-center justify-center overflow-hidden bg-black">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="orb-a absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.025] blur-3xl" />
        <div className="orb-b absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="orb-c absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-white/[0.015] blur-2xl" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="flex-1 text-left">
          {personalInfo.available && (
            <motion.div
              custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/10 bg-white/5 text-white/80 text-xs font-medium tracking-wide backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
              Available for Internship &amp; Junior Roles
            </motion.div>
          )}

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6"
          >
            <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
              Youssef<br />Samir Refky
            </span>
          </motion.h1>

          {/* Screen readers get the full role list once instead of every typed letter */}
          <p className="sr-only">{personalInfo.roles.join(', ')}</p>
          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            aria-hidden="true"
            className="text-xl sm:text-2xl font-mono text-white/70 mb-5 h-8"
          >
            {displayed}
            <span className="inline-block w-0.5 h-5 bg-white/60 ml-0.5 align-middle animate-pulse" />
          </motion.p>

          <motion.p
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="max-w-xl text-white/60 text-base leading-relaxed mb-10"
          >
            {personalInfo.tagline}
          </motion.p>

          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="flex flex-wrap items-center gap-3 mb-14"
          >
            <motion.a
              href="#projects"
              onClick={go('projects')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-white/90 transition-colors"
            >
              View Projects
            </motion.a>
            <motion.a
              href={personalInfo.cv}
              download={personalInfo.cvFilename}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/15 text-white font-medium rounded-full text-sm hover:bg-white/10 hover:border-white/30 transition-all"
            >
              <DownloadIcon />
              Download CV
            </motion.a>
            <motion.a
              href="#contact"
              onClick={go('contact')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 border border-white/10 text-white/80 font-medium rounded-full text-sm hover:text-white hover:border-white/30 transition-all"
            >
              Get in Touch
            </motion.a>
          </motion.div>

          <motion.ul
            custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className="flex items-center gap-10"
          >
            {stats.map((stat) => (
              <li key={stat.label} className="text-left">
                <AnimatedStat value={stat.value} suffix={stat.suffix} />
                <div className="text-white/55 text-xs font-medium mt-1 tracking-wide">{stat.label}</div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <button
        onClick={() => scrollToId('about')}
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/45 hover:text-white/70 transition-colors group"
      >
        <div className="w-5 h-8 rounded-full border border-current flex items-start justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full bg-current"
          />
        </div>
        <span className="text-xs tracking-widest uppercase">scroll</span>
      </button>
    </section>
  )
}

function AnimatedStat({ value, suffix }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) { setCount(value); return }
    const duration = 1500
    const start = performance.now()
    let rafId
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * value))
      if (progress < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [inView, value])

  return (
    <div ref={ref} className="text-3xl font-black text-white">
      {count}{suffix}
    </div>
  )
}
