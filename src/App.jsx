import { useEffect } from 'react'
import Lenis from 'lenis'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Education from './sections/Education'
import Contact from './sections/Contact'
import Footer from './components/Footer'
import PortfolioGuide from './components/PortfolioGuide'
import { setLenis, prefersReducedMotion } from './lib/scroll'

function App() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    setLenis(lenis)

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId) // previously leaked a loop on every unmount (StrictMode double-mount)
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  return (
    // reducedMotion="user" makes Framer Motion skip transform animations for users who ask for less motion
    <MotionConfig reducedMotion="user">
      <div className="app">
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Education />
          <Contact />
        </main>
        <Footer />
        <PortfolioGuide />
      </div>
    </MotionConfig>
  )
}

export default App
