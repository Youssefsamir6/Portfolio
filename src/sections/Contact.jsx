import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { personalInfo } from '../data/portfolio'

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 01.99 2.18 2 2 0 012.98 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.153-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

function ContactItem({ icon, label, value, href, copyValue }) {
  const [copied, setCopied] = useState(false)
  const external = href?.startsWith('http')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (e.g. insecure context): the link itself still works.
    }
  }

  // The copy button used to be nested inside the <a>: invalid HTML and confusing for keyboard
  // and screen-reader users. Link and button are now siblings inside one card.
  return (
    <motion.div
      whileHover={{ x: 4 }}
      data-guide={`${label}: ${value}.`}
      className="flex items-center gap-2 pr-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all group"
    >
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="flex flex-1 min-w-0 items-center gap-4 p-5"
      >
        <span className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white/85 transition-colors flex-shrink-0">
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-white/50 text-xs font-mono uppercase tracking-widest mb-0.5">{label}</span>
          <span className="block text-white/80 text-sm group-hover:text-white/80 transition-colors truncate">{value}</span>
        </span>
      </a>
      {copyValue && (
        <button
          onClick={copy}
          className="text-white/45 hover:text-white/80 transition-colors p-2 rounded-md hover:bg-white/5 flex-shrink-0"
          aria-label={copied ? `${label} copied` : `Copy ${label}`}
          title="Copy"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      )}
      <span className="sr-only" role="status">{copied ? `${label} copied to clipboard` : ''}</span>
    </motion.div>
  )
}

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
})

export default function Contact() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="contact" data-guide="Want to reach Youssef? Pick a contact link. I promise not to reply for him." className="py-32 bg-black" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeUp(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-xs font-mono text-white/55 tracking-[0.3em] uppercase mb-4"
        >
          Contact
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text */}
          <div>
            <motion.h2
              variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="text-4xl sm:text-5xl font-black leading-tight mb-6"
            >
              Let's build<br />
              <span className="text-white/60">something</span> great
            </motion.h2>
            <motion.p
              variants={fadeUp(0.2)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="text-white/60 text-sm leading-relaxed mb-8"
            >
              I'm looking for backend or full-stack engineering internship opportunities. Whether you have a role in mind or just want to connect — reach out, I'd love to chat.
            </motion.p>
            <motion.a
              href={personalInfo.cv}
              download={personalInfo.cvFilename}
              variants={fadeUp(0.3)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/15 text-white/85 font-medium rounded-full text-sm hover:bg-white/10 hover:border-white/30 hover:text-white transition-all"
            >
              <DownloadIcon />
              Download CV
            </motion.a>
          </div>

          {/* Links */}
          <motion.div
            variants={fadeUp(0.2)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="space-y-3"
          >
            <ContactItem
              icon={<EmailIcon />}
              label="Email"
              value={personalInfo.email}
              href={`mailto:${personalInfo.email}?subject=${encodeURIComponent('Hello from your portfolio')}`}
              copyValue={personalInfo.email}
            />
            <ContactItem
              icon={<PhoneIcon />}
              label="Phone"
              value={personalInfo.phoneDisplay}
              href={`tel:${personalInfo.phone}`}
              copyValue={personalInfo.phone}
            />
            <ContactItem
              icon={<LinkedInIcon />}
              label="LinkedIn"
              value={personalInfo.linkedin.replace('https://www.', '')}
              href={personalInfo.linkedin}
            />
            <ContactItem
              icon={<GitHubIcon />}
              label="GitHub"
              value="github.com/Youssefsamir6"
              href={personalInfo.github}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
