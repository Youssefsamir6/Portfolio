import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion'
import { cvKnowledge, education, personalInfo, projects, skills } from '../data/portfolio'
import { prefersReducedMotion, scrollToId } from '../lib/scroll'

const sectionGreetings = {
  home: "Welcome! I'm Munch, the tiny tour guide with absolutely no map.",
  about: "This is Youssef's origin story. No radioactive spiders, just a lot of code.",
  projects: "The projects live here. I checked: none of them are secretly snack-sized.",
  skills: "A skill list! I tried to learn Python, but it kept hissing at me.",
  education: "The learning zone. Youssef gets the degree; I get to borrow the graduation hat.",
  contact: "Want to reach Youssef? Pick a contact link. I promise not to reply for him.",
}

const prompts = [
  'Hi!',
  'What has Youssef built?',
  'What does he work with?',
  'Summarize his CV',
  'How can I contact him?',
]

/* ------------------------------------------------------------------ */
/* Movement helpers                                                    */
/* ------------------------------------------------------------------ */

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const rand = (min, max) => min + Math.random() * (max - min)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

const SPRING = { type: 'spring', stiffness: 420, damping: 11 }
const SOFT = { type: 'spring', stiffness: 140, damping: 14 }

// Fixed offsets for the little crumbs Munch spits out while chewing.
const CRUMBS = [
  { dx: '-18px', dy: '-14px' },
  { dx: '16px', dy: '-18px' },
  { dx: '-8px', dy: '-24px' },
  { dx: '24px', dy: '-6px' },
  { dx: '-26px', dy: '-4px' },
  { dx: '6px', dy: '-26px' },
]

function getBounds() {
  const width = typeof window === 'undefined' ? 1280 : window.innerWidth
  const height = typeof window === 'undefined' ? 800 : window.innerHeight
  return {
    minX: 16,
    maxX: Math.max(16, width - 80),
    minY: 92,
    maxY: Math.max(92, height - 90),
  }
}

function getRestPosition() {
  const { maxX, maxY } = getBounds()
  return { x: maxX, y: maxY }
}

// Where Munch parks itself while the chat panel is open.
function getDockPosition() {
  const { maxX, minY } = getBounds()
  return { x: maxX, y: Math.max(minY, window.innerHeight - 440) }
}

// A random landing spot a hop-length away that stays on screen.
function randomSpot(from, minDist, maxDist) {
  const b = getBounds()
  for (let i = 0; i < 12; i += 1) {
    const angle = Math.random() * Math.PI * 2
    const dist = rand(minDist, maxDist)
    const tx = from.x + Math.cos(angle) * dist
    const ty = from.y + Math.sin(angle) * dist * 0.7
    if (tx >= b.minX && tx <= b.maxX && ty >= b.minY && ty <= b.maxY) return { x: tx, y: ty }
  }
  return { x: rand(b.minX, b.maxX), y: rand(b.minY, b.maxY) }
}

function answerQuestion(question) {
  const text = question.toLowerCase()

  if (/^(hi|hello|hey|hiya|good (morning|afternoon|evening)|sup|greetings)[!. ]*$/.test(text)) {
    return "Hi! I'm Munch, Youssef's portfolio guide. I can tell you about his projects, skills, education, CV, certificates, or how to contact him."
  }
  if (/how are you|how('s| is) it going|what('s| is) up/.test(text)) {
    return "I'm doing great—running on snacks and CSS. What would you like to know about Youssef?"
  }
  if (/what.*(your|u(r)?).*name|who are you|your name/.test(text)) {
    return "I'm Munch, Youssef's pocket-sized portfolio guide."
  }
  if (/thank(s| you)|appreciate/.test(text)) {
    return "You're welcome! Ask me about Youssef's projects, skills, experience, or contact details."
  }
  if (/^(bye|goodbye|see ya|see you|take care)[!. ]*$/.test(text)) {
    return "Goodbye! Thanks for visiting Youssef's portfolio."
  }

  if (/summary|experience|background|cv|résumé|resume|profile/.test(text)) {
    return `${cvKnowledge.summary} His résumé also identifies him as a ${cvKnowledge.roles.join(', ')}. He's seeking ${cvKnowledge.seeking}`
  }
  if (/docker|kubernetes|jenkins|devops|ci.?cd|cloud|deployment|deploy/.test(text)) {
    return `His DevOps and deployment toolkit includes ${cvKnowledge.technicalSkills.filter((item) =>
      /Docker|Kubernetes|Jenkins|Linux|Nginx|CI\/CD|Railway|Render|Vercel/.test(item)
    ).join(', ')}. He is interested in DevOps internships and cloud technologies.`
  }
  if (/cyber|security|siem|threat|incident|owasp|blue team/.test(text)) {
    return `Youssef has security-focused experience in ${cvKnowledge.cybersecurity} He has applied this in the Smart Access & Monitoring graduation project.`
  }
  if (/certificat|training|course/.test(text)) {
    return `His certifications include ${cvKnowledge.certifications.join('; ')}.`
  }
  if (/language|speak|arabic|english/.test(text)) {
    return `Youssef speaks ${cvKnowledge.languages.join(' and ')}.`
  }
  if (/project|built|work|portfolio/.test(text)) {
    const details = cvKnowledge.projectExperience
      .map((project) => `${project.name}: ${project.description}`)
      .join(' ')
    return `${details}`
  }
  if (/skill|tech|language|stack|code/.test(text)) {
    const names = [...new Set(skills.flatMap((group) => group.items.map((item) => item.name)))]
    return `His toolkit includes ${names.join(', ')}. I'm personally strongest in dramatic hovering.`
  }
  if (/contact|email|reach|hire|job|intern|opportunit/.test(text)) {
    return `Youssef is open to internship and junior opportunities. Jump to Contact or email him at ${personalInfo.email}. You can also download his CV from the portfolio.`
  }
  if (/education|school|study|degree|college|university/.test(text)) {
    const currentEducation = education[0]
    return `He's studying ${currentEducation.degree} at ${currentEducation.school} in ${currentEducation.location}, and expects to graduate ${currentEducation.date}.`
  }
  if (/about|youssef|who/.test(text)) {
    return `${personalInfo.name} is a ${personalInfo.title} based in ${personalInfo.location}. ${personalInfo.bio[0]}`
  }
  if (/help|what can you do|where/.test(text)) {
    return 'I can point out the projects, skills, education, and contact info. Ask me about any of them—or hover over a section and I’ll give you the tiny tour.'
  }

  return "I'm a small creature with a very specific job: I know this portfolio, not the whole internet. Try asking about Youssef's projects, skills, education, or contact info."
}

/* ------------------------------------------------------------------ */
/* Mascot art. Moods are driven by a data-mood attribute (see CSS).    */
/* ------------------------------------------------------------------ */

function Mascot({ svgRef }) {
  return (
    <svg ref={svgRef} className="guide-mascot" viewBox="0 0 64 64" aria-hidden="true">
      <path className="guide-mascot__antenna guide-mascot__antenna--left" d="M17 17C8 12 13 5 20 9" />
      <path className="guide-mascot__antenna guide-mascot__antenna--right" d="M46 16c9-5 5-12-2-8" />
      <path className="guide-mascot__body" d="M11 28C12 15 22 12 32 12s20 4 21 17l3 18c1 7-5 11-12 9l-5-2H25l-5 2c-7 2-13-2-12-9l3-19Z" />
      <g className="guide-mascot__eye-group">
        <ellipse className="guide-mascot__eye" cx="23" cy="31" rx="7" ry="9" transform="rotate(-18 23 31)" />
        <circle className="guide-mascot__pupil" cx="23" cy="32" r="2.1" />
        <circle className="guide-mascot__highlight" cx="21" cy="28" r="1.2" />
      </g>
      <g className="guide-mascot__eye-group guide-mascot__eye-group--right">
        <ellipse className="guide-mascot__eye" cx="41" cy="31" rx="7" ry="9" transform="rotate(18 41 31)" />
        <circle className="guide-mascot__pupil" cx="41" cy="32" r="2.1" />
        <circle className="guide-mascot__highlight" cx="39" cy="28" r="1.2" />
      </g>
      <circle className="guide-mascot__blush" cx="16" cy="40" r="2.8" />
      <circle className="guide-mascot__blush" cx="48" cy="40" r="2.8" />
      <circle className="guide-mascot__spark" cx="15" cy="45" r="2" />
      <path className="guide-mascot__smile" d="M27 43c3 3 7 3 10 0" />
      <path className="guide-mascot__mouth-happy" d="M26 41c1 7 11 7 12 0Z" />
      <ellipse className="guide-mascot__mouth-o" cx="32" cy="44" rx="2.8" ry="3" />
      <path className="guide-mascot__shine" d="M17 22c3-4 7-6 11-7" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Guide                                                               */
/* ------------------------------------------------------------------ */

export default function PortfolioGuide() {
  const [speech, setSpeech] = useState("Psst... I'm Munch. Hover around. I promise not to eat the CSS.")
  const [speechVisible, setSpeechVisible] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hey! I'm Munch, Youssef's pocket-sized portfolio guide. Ask me about his work, skills, or how to get in touch." },
  ])
  const [question, setQuestion] = useState('')
  const [side, setSide] = useState('right')
  const [emote, setEmote] = useState(null)
  const [crumbs, setCrumbs] = useState(0)

  const inputRef = useRef(null)
  const lastGuideTarget = useRef(null)
  const mascotButtonRef = useRef(null)
  const svgRef = useRef(null)

  // Behaviour state lives in refs so the animation loop never triggers re-renders.
  const pointer = useRef(null)
  const lookOverride = useRef({ x: 0, y: 0, until: 0 })
  const hoveredRef = useRef(false)
  const moodRef = useRef('idle')
  const busyRef = useRef(false)
  const cancelWait = useRef(null)
  const emoteTimer = useRef(null)
  const emoteId = useRef(0)
  const dockToken = useRef(0)
  const lastPerk = useRef(0)
  const firstSpeech = useRef(true)

  // Motion values: x/y place Munch on screen, the rest shape the body mid-hop.
  const [start] = useState(getRestPosition)
  const x = useMotionValue(start.x)
  const y = useMotionValue(start.y)
  const hopY = useMotionValue(0)
  const squashX = useMotionValue(1)
  const squashY = useMotionValue(1)
  const tilt = useMotionValue(0)
  const glowScale = useTransform(hopY, [-100, 0, 12], [0.4, 1, 1.08])
  const glowOpacity = useTransform(hopY, [-100, 0], [0.2, 1])

  useMotionValueEvent(x, 'change', (value) => {
    const next = value > window.innerWidth / 2 ? 'right' : 'left'
    setSide((current) => (current === next ? current : next))
  })

  /* ---- tiny helpers ------------------------------------------------ */

  const setMood = (mood) => {
    moodRef.current = mood
    svgRef.current?.setAttribute('data-mood', mood)
  }
  const restMood = () => (hoveredRef.current ? 'happy' : 'idle')
  const setAir = (on) => svgRef.current?.toggleAttribute('data-air', on)
  const flag = (name, ms) => {
    const el = svgRef.current
    if (!el) return
    el.setAttribute(name, '')
    window.setTimeout(() => el.removeAttribute(name), ms)
  }
  const lookAt = (lx, ly, seconds = 1) => {
    lookOverride.current = { x: lx, y: ly, until: performance.now() + seconds * 1000 }
  }
  const lookToward = (dx, dy, seconds = 1) => {
    const mag = Math.hypot(dx, dy) || 1
    lookAt((dx / mag) * 3, (dy / mag) * 2.4, seconds)
  }
  const showEmote = (text, ms = 1300) => {
    window.clearTimeout(emoteTimer.current)
    emoteId.current += 1
    setEmote({ id: emoteId.current, text })
    emoteTimer.current = window.setTimeout(() => setEmote(null), ms)
  }
  const wait = (ms) =>
    new Promise((resolve) => {
      const timer = window.setTimeout(resolve, ms)
      cancelWait.current = () => {
        window.clearTimeout(timer)
        resolve()
      }
    })
  const squash = (sx, sy, duration = 0.1) =>
    Promise.all([
      animate(squashX, sx, { duration, ease: 'easeOut' }),
      animate(squashY, sy, { duration, ease: 'easeOut' }),
    ])
  const settle = () => {
    animate(squashX, 1, SPRING)
    animate(squashY, 1, SPRING)
  }
  const resetPose = () => {
    ;[x, y, hopY, squashX, squashY, tilt].forEach((value) => value.stop())
    hopY.set(0)
    squashX.set(1)
    squashY.set(1)
    tilt.set(0)
    setAir(false)
  }

  // One springy hop: anticipate, launch along an arc, land with a squash.
  const hopTo = async (tx, ty, { height, duration, spin = 0, alive = () => true } = {}) => {
    const dx = tx - x.get()
    const dy = ty - y.get()
    const dist = Math.hypot(dx, dy)
    const dir = dx >= 0 ? 1 : -1
    const d = duration ?? clamp(0.42 + dist / 950, 0.5, 0.95)
    const h = height ?? clamp(26 + dist * 0.12, 30, 80)

    lookToward(dx, dy, d + 0.4)
    await Promise.all([squash(1.2, 0.78, 0.13), animate(hopY, 4, { duration: 0.13 })])
    if (!alive()) return

    setAir(true)
    const ease = [0.4, 0, 0.25, 1]
    await Promise.all([
      animate(x, tx, { duration: d, ease }),
      animate(y, ty, { duration: d, ease }),
      animate(hopY, [4, -h, 0], { duration: d, times: [0, 0.5, 1], ease: ['easeOut', 'easeIn'] }),
      animate(squashY, [0.78, 1.16, 1.02], { duration: d, times: [0, 0.35, 1], ease: 'easeOut' }),
      animate(squashX, [1.2, 0.88, 0.98], { duration: d, times: [0, 0.35, 1], ease: 'easeOut' }),
      spin
        ? animate(tilt, [0, spin], { duration: d, ease: 'easeInOut' })
        : animate(tilt, [0, dir * 10, dir * -4], { duration: d, times: [0, 0.45, 1], ease: 'easeInOut' }),
    ])
    setAir(false)
    if (!alive()) return

    if (spin) tilt.set(0)
    else animate(tilt, 0, SPRING)
    await squash(1.22, 0.76, 0.07)
    settle()
    animate(hopY, [0, -7, 0], { duration: 0.28, ease: 'easeOut' })
  }

  // A quick "oh!" reaction, used when Munch has something new to say.
  const perk = () => {
    showEmote('!', 800)
    lookAt(0, -2.6, 0.8)
    animate(hopY, [0, -18, 0], { duration: 0.4, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] })
    animate(squashY, [1, 1.12, 0.9, 1], { duration: 0.45 })
    animate(squashX, [1, 0.92, 1.1, 1], { duration: 0.45 })
    flag('data-wiggle', 700)
  }

  /* ---- section greetings ------------------------------------------ */

  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting)
        if (!visibleSection || chatOpen) return
        const greeting = visibleSection.target.dataset.guide
          || sectionGreetings[visibleSection.target.id]
        if (greeting) {
          setSpeech(greeting)
          setSpeechVisible(true)
        }
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [chatOpen])

  /* ---- the idle brain: picks a random behaviour every few seconds -- */

  useEffect(() => {
    if (chatOpen || prefersReducedMotion()) return undefined

    const run = { alive: true }
    const alive = () => run.alive
    busyRef.current = false
    let last = null

    const wander = async () => {
      const hops = Math.random() < 0.35 ? Math.floor(rand(2, 4)) : 1
      for (let i = 0; i < hops && alive(); i += 1) {
        const spot = randomSpot({ x: x.get(), y: y.get() }, 110, 380)
        await hopTo(spot.x, spot.y, { alive })
        if (i < hops - 1) await wait(rand(150, 420))
      }
    }

    const dash = async () => {
      const b = getBounds()
      const goRight = x.get() < (b.minX + b.maxX) / 2
      const tx = goRight ? rand(b.maxX * 0.6, b.maxX) : rand(b.minX, b.maxX * 0.4)
      const ty = clamp(y.get() + rand(-120, 120), b.minY, b.maxY)
      const dir = goRight ? 1 : -1
      const d = 0.42
      const ease = [0.7, 0, 0.2, 1]

      showEmote('zoom!', 900)
      lookAt(dir * 3, 0, 0.9)
      await squash(1.3, 0.75, 0.18)
      if (!alive()) return
      setAir(true)
      await Promise.all([
        animate(x, tx, { duration: d, ease }),
        animate(y, ty, { duration: d, ease }),
        animate(hopY, [0, -8, 0], { duration: d }),
        animate(squashX, [1.3, 1.4, 1], { duration: d, times: [0, 0.4, 1] }),
        animate(squashY, [0.75, 0.72, 1.05], { duration: d, times: [0, 0.4, 1] }),
        animate(tilt, [0, dir * 22, dir * -8], { duration: d, times: [0, 0.4, 1] }),
      ])
      setAir(false)
      if (!alive()) return
      animate(tilt, 0, SPRING)
      await squash(1.25, 0.75, 0.08)
      settle()
    }

    const spin = async () => {
      const b = getBounds()
      const dir = Math.random() < 0.5 ? -1 : 1
      setMood('happy')
      showEmote('wheee', 1100)
      await hopTo(clamp(x.get() + rand(-60, 60), b.minX, b.maxX), y.get(), {
        spin: dir * 360,
        height: 70,
        duration: 0.8,
        alive,
      })
    }

    const lookAround = async () => {
      const spots = [[-3, 0], [3, 0], [0, -3], [2.4, 2.2], [-2.4, 2.2]]
      const count = Math.floor(rand(2, 4))
      flag('data-wiggle', 1800)
      for (let i = 0; i < count && alive(); i += 1) {
        const [lx, ly] = pick(spots)
        lookAt(lx, ly, 1)
        animate(tilt, lx * 2.5, SOFT)
        await wait(rand(550, 900))
      }
      animate(tilt, 0, SOFT)
      lookOverride.current.until = 0
    }

    const nom = async () => {
      setMood('nom')
      showEmote('nom nom', 1500)
      setCrumbs((count) => count + 1)
      for (let i = 0; i < 4 && alive(); i += 1) {
        await squash(1.06, 0.92, 0.1)
        await squash(0.98, 1.03, 0.1)
      }
      settle()
    }

    const nap = async () => {
      setMood('sleep')
      await Promise.all([
        animate(squashY, 0.9, { duration: 0.5 }),
        animate(squashX, 1.06, { duration: 0.5 }),
        animate(hopY, 3, { duration: 0.5 }),
        animate(tilt, pick([-7, 7]), { type: 'spring', stiffness: 60, damping: 12 }),
      ])
      const end = performance.now() + rand(4500, 7500)
      const zs = ['z', 'zZ', 'zZz']
      let i = 0
      while (alive() && performance.now() < end && moodRef.current === 'sleep') {
        showEmote(zs[i % zs.length], 1500)
        i += 1
        await wait(1300)
      }
      if (!alive()) return
      setMood('surprised')
      showEmote('!', 900)
      animate(tilt, 0, SPRING)
      animate(squashX, 1, SPRING)
      animate(squashY, 1, SPRING)
      await animate(hopY, [3, -26, 0], { duration: 0.38, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] })
    }

    const peek = async () => {
      const b = getBounds()
      const fromLeft = Math.random() < 0.5
      const tx = fromLeft ? -30 : window.innerWidth - 34
      const ty = rand(b.minY + 20, b.maxY - 20)
      await hopTo(tx, ty, { alive })
      if (!alive()) return
      setMood('happy')
      lookAt(fromLeft ? 3 : -3, 0, 2.6)
      showEmote('?', 1400)
      flag('data-wiggle', 2200)
      await wait(rand(1800, 2800))
      if (!alive()) return
      const spot = randomSpot({ x: fromLeft ? b.minX : b.maxX, y: ty }, 120, 260)
      await hopTo(spot.x, spot.y, { alive })
    }

    const curious = async () => {
      const p = pointer.current
      const here = { x: x.get(), y: y.get() }
      if (!p || Math.hypot(p.x - here.x, p.y - here.y) < 220) return wander()
      const b = getBounds()
      const angle = Math.atan2(here.y - p.y, here.x - p.x) + rand(-0.5, 0.5)
      const dist = rand(120, 170)
      await hopTo(
        clamp(p.x - 32 + Math.cos(angle) * dist, b.minX, b.maxX),
        clamp(p.y - 32 + Math.sin(angle) * dist, b.minY, b.maxY),
        { alive },
      )
      if (!alive()) return
      setMood('happy')
      showEmote('♪', 1300)
      flag('data-wiggle', 1200)
      await wait(rand(900, 1500))
      return undefined
    }

    const actions = { wander, dash, spin, lookAround, nom, nap, peek, curious }
    const weights = [
      ['wander', 32], ['curious', 14], ['lookAround', 16], ['nom', 9],
      ['dash', 9], ['spin', 7], ['peek', 7], ['nap', 6],
    ]
    const choose = () => {
      const pool = weights.filter(([name]) => name !== last)
      const total = pool.reduce((sum, [, weight]) => sum + weight, 0)
      let roll = Math.random() * total
      for (const [name, weight] of pool) {
        roll -= weight
        if (roll <= 0) return name
      }
      return 'wander'
    }

    const loop = async () => {
      await wait(1200)
      while (alive()) {
        if (!document.hidden && !hoveredRef.current) {
          const name = choose()
          last = name
          busyRef.current = true
          await actions[name]()
          if (!alive()) return
          busyRef.current = false
          setMood(restMood())
        }
        await wait(rand(1400, 3400))
      }
    }
    loop()

    return () => {
      run.alive = false
      cancelWait.current?.()
      resetPose()
      busyRef.current = false
    }
  }, [chatOpen])

  /* ---- dock above the chat panel while it is open ------------------ */

  useEffect(() => {
    if (!chatOpen) return undefined
    dockToken.current += 1
    const token = dockToken.current
    const dock = getDockPosition()
    setMood('happy')

    if (prefersReducedMotion()) {
      x.set(dock.x)
      y.set(dock.y)
    } else {
      hopTo(dock.x, dock.y, { alive: () => dockToken.current === token })
    }
    return () => {
      dockToken.current += 1
      setMood(restMood())
    }
  }, [chatOpen])

  useEffect(() => {
    const onResize = () => {
      const b = getBounds()
      if (chatOpen) {
        const dock = getDockPosition()
        x.set(dock.x)
        y.set(dock.y)
      } else {
        x.set(clamp(x.get(), b.minX, b.maxX))
        y.set(clamp(y.get(), b.minY, b.maxY))
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [chatOpen])

  /* ---- eyes: follow the cursor, glance at scrolling ---------------- */

  useEffect(() => {
    let lastScrollY = window.scrollY
    const onMove = (event) => {
      pointer.current = { x: event.clientX, y: event.clientY }
    }
    const onScroll = () => {
      const delta = window.scrollY - lastScrollY
      lastScrollY = window.scrollY
      if (Math.abs(delta) > 4) lookAt(0, delta > 0 ? 2.6 : -2.6, 0.6)
    }
    const tick = () => {
      const svg = svgRef.current
      const button = mascotButtonRef.current
      if (!svg || !button || document.hidden) return
      let lx = 0
      let ly = 0
      const override = lookOverride.current
      if (performance.now() < override.until) {
        lx = override.x
        ly = override.y
      } else if (pointer.current && moodRef.current !== 'sleep') {
        const rect = button.getBoundingClientRect()
        const dx = pointer.current.x - (rect.left + rect.width / 2)
        const dy = pointer.current.y - (rect.top + rect.height * 0.45)
        const dist = Math.hypot(dx, dy) || 1
        const strength = Math.min(1, dist / 220)
        lx = (dx / dist) * 3 * strength
        ly = (dy / dist) * 2.6 * strength
      }
      svg.style.setProperty('--lx', lx.toFixed(2))
      svg.style.setProperty('--ly', ly.toFixed(2))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    const interval = window.setInterval(tick, 90)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.clearInterval(interval)
    }
  }, [])

  /* ---- perk up when there is something new to say ------------------ */

  useEffect(() => {
    if (firstSpeech.current) {
      firstSpeech.current = false
      return
    }
    const now = performance.now()
    if (
      chatOpen
      || busyRef.current
      || hoveredRef.current
      || prefersReducedMotion()
      || moodRef.current === 'sleep'
      || now - lastPerk.current < 2500
    ) return
    lastPerk.current = now
    perk()
  }, [speech])

  useEffect(() => () => window.clearTimeout(emoteTimer.current), [])

  /* ---- hover hints from the page ---------------------------------- */

  useEffect(() => {
    const onPointerOver = (event) => {
      if (!(event.target instanceof Element)) return
      const target = event.target.closest('[data-guide]')
      if (!target || target.closest('[data-portfolio-guide]') || lastGuideTarget.current === target) return
      lastGuideTarget.current = target
      setSpeech(target.dataset.guide)
      setSpeechVisible(true)
    }

    const onPointerOut = (event) => {
      if (!(event.target instanceof Element)) return
      const target = event.target.closest('[data-guide]')
      if (target && !target.contains(event.relatedTarget)) lastGuideTarget.current = null
    }

    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)
    return () => {
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
    }
  }, [])

  useEffect(() => {
    if (!chatOpen) return undefined
    inputRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setChatOpen(false)
        mascotButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [chatOpen])

  const ask = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((current) => [
      ...current,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: answerQuestion(trimmed) },
    ])
    setQuestion('')
  }

  const goToSection = (id) => {
    setChatOpen(false)
    scrollToId(id)
  }

  const onHoverStart = () => {
    hoveredRef.current = true
    setMood(moodRef.current === 'sleep' ? 'surprised' : 'happy')
    cancelWait.current?.()
  }
  const onHoverEnd = () => {
    hoveredRef.current = false
    if (moodRef.current === 'happy') setMood('idle')
  }

  const bubbleOnLeft = side === 'right'

  return (
    <div data-portfolio-guide className="pointer-events-none fixed inset-0 z-[60]">
      <AnimatePresence>
        {chatOpen && (
          <motion.section
            aria-label="Chat with Munch"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="guide-panel pointer-events-auto fixed bottom-5 right-5 z-[62] flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101010]/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="guide-avatar"><Mascot /></span>
                <div>
                  <h2 className="text-sm font-semibold text-white">Munch</h2>
                  <p className="text-[11px] text-white/45">Pocket-sized portfolio guide</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <span aria-hidden="true">×</span>
              </button>
            </header>

            <div className="guide-messages flex max-h-64 min-h-36 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
              {messages.map((message, index) => (
                <p
                  key={`${index}-${message.role}`}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'self-end rounded-br-sm bg-white text-black'
                      : 'self-start rounded-bl-sm bg-white/[0.08] text-white/80'
                  }`}
                >
                  {message.text}
                </p>
              ))}
            </div>

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => ask(prompt)}
                    className="rounded-full border border-white/10 px-2.5 py-1.5 text-left text-[10px] text-white/65 transition-colors hover:border-white/25 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault()
                ask(question)
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <label htmlFor="munch-question" className="sr-only">Ask Munch a question</label>
              <input
                ref={inputRef}
                id="munch-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask me about the portfolio..."
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-white/80"
              >
                Send
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.div style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[61]">
        <AnimatePresence>
          {speechVisible && !chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              role="status"
              aria-live="polite"
              style={{
                position: 'absolute',
                bottom: 4,
                right: bubbleOnLeft ? 'calc(100% + 12px)' : undefined,
                left: bubbleOnLeft ? undefined : 'calc(100% + 12px)',
              }}
              className={`guide-speech relative max-w-56 rounded-2xl border border-white/10 bg-[#141414]/95 px-4 py-3 pr-9 text-xs leading-relaxed text-white/80 shadow-xl shadow-black/30 backdrop-blur-xl ${bubbleOnLeft ? '' : 'guide-speech--right'}`}
            >
              {speech}
              <button
                type="button"
                onClick={() => setSpeechVisible(false)}
                aria-label="Dismiss guide message"
                className="pointer-events-auto absolute right-2 top-2 rounded-full p-1 text-white/40 hover:text-white"
              >
                <span aria-hidden="true">×</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {emote && !chatOpen && (
            <motion.span
              key={emote.id}
              aria-hidden="true"
              initial={{ opacity: 0, y: 6, scale: 0.6 }}
              animate={{ opacity: 1, y: -6, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              style={{ x: '-50%' }}
              className="guide-emote"
            >
              {emote.text}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Ground glow that shrinks while Munch is airborne */}
        <motion.span
          aria-hidden="true"
          style={{ x: '-50%', scale: glowScale, opacity: glowOpacity }}
          className="guide-glow"
        />

        {crumbs > 0 && (
          <span key={crumbs} className="guide-crumbs" aria-hidden="true">
            {CRUMBS.map((crumb) => (
              <i key={crumb.dx + crumb.dy} style={{ '--dx': crumb.dx, '--dy': crumb.dy }} />
            ))}
          </span>
        )}

        <motion.div
          style={{ y: hopY, scaleX: squashX, scaleY: squashY, rotate: tilt, transformOrigin: '50% 100%' }}
        >
          <motion.button
            ref={mascotButtonRef}
            type="button"
            onClick={() => {
              setChatOpen((open) => !open)
              setSpeechVisible(false)
            }}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            aria-label={chatOpen ? 'Close chat with Munch' : 'Talk with Munch'}
            aria-expanded={chatOpen}
            className="guide-toggle pointer-events-auto flex h-16 w-16 items-center justify-center"
          >
            <Mascot svgRef={svgRef} />
          </motion.button>
        </motion.div>
      </motion.div>

      <button
        type="button"
        onClick={() => goToSection('contact')}
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:bottom-5 focus:right-5 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-black"
      >
        Skip guide and go to contact
      </button>
    </div>
  )
}
