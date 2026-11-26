import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { personalInfo } from '../data/portfolio'
import { scrollToId } from '../lib/scroll'

const links = ['About', 'Projects', 'Skills', 'Education', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active link via IntersectionObserver: no layout reads on every scroll event, and no Array.findLast
  // (which crashes on Safari < 15.4 and older Android browsers).
  useEffect(() => {
    const sections = links.map((l) => document.getElementById(l.toLowerCase())).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    const hero = document.getElementById('home')
    const heroIo = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive('') }, { threshold: 0.5 })
    if (hero) heroIo.observe(hero)
    return () => { io.disconnect(); heroIo.disconnect() }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const goTo = (id) => {
    scrollToId(id.toLowerCase())
    setMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        aria-label="Main"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''}`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => goTo('home')}
            aria-label="Back to top"
            className="font-bold text-lg tracking-widest text-white"
          >
            {personalInfo.initials}
          </button>

          <ul className="hidden md:flex items-center gap-1 relative">
            {links.map((link) => {
              const isActive = active === link.toLowerCase()
              return (
                <li key={link}>
                  <button
                    onClick={() => goTo(link)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white/80'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white/10 rounded-full border border-white/10"
                      />
                    )}
                    <span className="relative z-10">{link}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }} className="block w-6 h-0.5 bg-white origin-center" />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block w-6 h-0.5 bg-white" />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }} className="block w-6 h-0.5 bg-white origin-center" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <ul className="flex flex-col py-4">
              {links.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => goTo(link)}
                    className="w-full text-left px-8 py-3 text-white/85 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
