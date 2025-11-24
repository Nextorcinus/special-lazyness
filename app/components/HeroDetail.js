'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import SplitText from '../../lib/gsap/SplitText'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import { TypeAnimation } from 'react-type-animation'
import useDragNavigation from '../../hooks/useDragNavigation'
import HeroCarousel from './HeroCarousel.js'
import Particles from './Particles'
import HeroPopup from './HeroPopup'
import PassivePopup from './PassivePopup'
import WidgetPopup from './WidgetPopup'

export default function HeroDetail({ initialId }) {
  const [indexList, setIndexList] = useState([]) // array dari index.json
  const [index, setIndex] = useState(0) // aktif index di indexList
  const [hero, setHero] = useState(null) // hero yang sedang tampil
  const [loading, setLoading] = useState(true) // loading saat fetch data hero baru

  const [activeSkill, setActiveSkill] = useState(null)
  const [showSkillDetail, setShowSkillDetail] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const [showWidgetDetail, setShowWidgetDetail] = useState(false)
  const [activeWidget, setActiveWidget] = useState(null)

  const [showPassiveDetail, setShowPassiveDetail] = useState(false)
  const [activePassive, setActivePassive] = useState(null)

  const imageRef = useRef(null)
  const rarityRef = useRef(null)
  const classRef = useRef(null)
  const widgetRef = useRef(null)
  const passiveRef = useRef(null)
  const skillTitleRefs = useRef([])
  const skillImageRefs = useRef([])

  // helper untuk refs array (reset tiap hero)
  const addSkillTitleRef = (el) => {
    if (!el) return
    if (!skillTitleRefs.current.includes(el)) skillTitleRefs.current.push(el)
  }

  const addSkillImageRef = (el) => {
    if (!el) return
    if (!skillImageRefs.current.includes(el)) skillImageRefs.current.push(el)
  }

  // Load index.json pada mount
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('/api/heroes/index')
      .then((r) => r.json())
      .then((list) => {
        if (!mounted) return
        setIndexList(list || [])
        const found = list?.findIndex((h) => h.id === initialId)
        setIndex(found >= 0 ? found : 0)
      })
      .catch((err) => {
        console.error('Failed to load index.json', err)
        setIndexList([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [initialId])

  // helper untuk preload image dan set hero only after loaded
  const fetchAndSetHero = useCallback((id) => {
    if (!id) return
    setLoading(true)
    fetch(`/api/heroes/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data) => {
        // preload image first
        const img = new Image()
        img.src = `/${data.image}`
        img.onload = () => {
          // set data only after image loaded to avoid blank
          setHero(data)
          // reset animation refs
          skillTitleRefs.current = []
          skillImageRefs.current = []
          setIsReady(false)
          // small timeout to allow DOM paint before GSAP anim
          const t = setTimeout(() => setIsReady(true), 50)
          // clear the timeout on next change
          return () => clearTimeout(t)
        }
        img.onerror = () => {
          // if image fails, still set hero to avoid perpetual loading
          setHero(data)
          setIsReady(true)
        }
      })
      .catch((err) => {
        console.error('Failed to load hero', err)
        // do not null out hero; keep previous displayed hero
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Fetch hero detail saat index berubah
  useEffect(() => {
    if (!indexList || indexList.length === 0) {
      setHero(null)
      return
    }
    const id = indexList[index].id
    fetchAndSetHero(id)
  }, [index, indexList, fetchAndSetHero])

  // navigation handlers - hanya aktif bila indexList ada
  const handleNext = useCallback(() => {
    if (!indexList || indexList.length === 0) return
    setIndex((prev) => (prev + 1) % indexList.length)
  }, [indexList])

  const handlePrev = useCallback(() => {
    if (!indexList || indexList.length === 0) return
    setIndex((prev) => (prev - 1 + indexList.length) % indexList.length)
  }, [indexList])

  const isAnyPopupOpen =
    showSkillDetail || showPassiveDetail || showWidgetDetail
  useDragNavigation(imageRef, handleNext, handlePrev, !isAnyPopupOpen)

  // GSAP animations when hero is ready
  useEffect(() => {
    if (!isReady || !hero) return
    if (
      !rarityRef.current ||
      !classRef.current ||
      !widgetRef.current ||
      !passiveRef.current
    )
      return

    gsap.registerPlugin(SplitText)
    const cleanupFns = []

    const animateSplit = (ref, delay = 0) => {
      try {
        const split = new SplitText(ref.current, { type: 'chars' })
        gsap.fromTo(
          split.chars,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.04,
            duration: 0.1,
            delay,
            ease: 'power2.out',
          }
        )
        cleanupFns.push(() => split.revert())
      } catch (e) {
        // ignore split failures silently
      }
    }

    animateSplit(rarityRef, 0.2)
    animateSplit(classRef, 0.3)

    gsap.fromTo(
      widgetRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' }
    )
    gsap.fromTo(
      passiveRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' }
    )

    gsap.fromTo(
      skillTitleRefs.current.filter(Boolean),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    )

    gsap.fromTo(
      skillImageRefs.current.filter(Boolean),
      { opacity: 0, y: 20, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.4,
        ease: 'back.out(1.7)',
      }
    )

    return () => cleanupFns.forEach((fn) => fn())
  }, [isReady, hero])

  // scroll mouse to change hero - disable on mobile
  useEffect(() => {
    const lenis = new Lenis({ smooth: true, gestureOrientation: 'horizontal' })
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    let wheelTimeout = null
    const handleWheel = (e) => {
      if (isAnyPopupOpen || window.innerWidth < 768) return

      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 10 || wheelTimeout) return

      e.preventDefault()
      delta > 0 ? handleNext() : handlePrev()
      wheelTimeout = setTimeout(() => (wheelTimeout = null), 400)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [handleNext, handlePrev, isAnyPopupOpen])

  // If initial load and no hero yet, show full-screen loader
  if (!hero && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div>Loading hero...</div>
      </div>
    )
  }

  // safety getters for nested structure
  const explorationSkills = hero?.skills?.exploration || {}
  const expeditionSkills = explorationSkills.expedition || {}

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      <Particles
        particleColors={['#ff0000', '#FF6F15']}
        particleCount={150}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={true}
        disableRotation={false}
      />

      <div
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{
          background: `radial-gradient(ellipse 94.14% 94.14% at 64.90% 96.85%, #26223D 0%, #0B0A10 100%)`,
        }}
      />
      <img
        src="/BG.png"
        alt="Background"
        draggable="false"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-3"
      />

      <div className="absolute top-0 left-0 w-full z-30 bg-zinc-900">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <button
            onClick={() => window.history.back()}
            className="text-green-400 hover:underline"
          >
            ← BACK TO HOME
          </button>
        </div>
      </div>

      <div className="relative z-20 w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 py-10">
        {showSkillDetail && activeSkill && (
          <HeroPopup
            skill={activeSkill}
            onClose={() => setShowSkillDetail(false)}
          />
        )}
        {showWidgetDetail && activeWidget && (
          <WidgetPopup
            widget={activeWidget}
            onClose={() => setShowWidgetDetail(false)}
          />
        )}
        {showPassiveDetail && activePassive && (
          <PassivePopup
            passive={activePassive}
            onClose={() => setShowPassiveDetail(false)}
          />
        )}

        <div className="flex flex-col-reverse mt-6 md:mt-0 md:grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <h2 className="text-sm uppercase tracking-wider text-gray-400">
              Generation {hero?.generation}
            </h2>
            <h1 className="text-5xl font-bold text-green-400">
              <TypeAnimation
                key={hero?.id}
                sequence={[hero?.name || '', 1000]}
                speed={50}
                wrapper="span"
                repeat={0}
              />
            </h1>

            <div className="mt-4 space-y-1 text-sm">
              <p>
                Rarity:{' '}
                <span ref={rarityRef} className="text-white/80">
                  {hero?.rarity}
                </span>
              </p>
              <p>
                Class:{' '}
                <span ref={classRef} className="text-white/80">
                  {hero?.class}
                </span>
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8  grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div>
                <h3 className="text-md font-semibold mb-2">Stats</h3>
                <BarWithTitle
                  label="Attack"
                  value={hero?.stats?.attack ?? 0}
                  max={15000}
                />
                <BarWithTitle
                  label="Defense"
                  value={hero?.stats?.defense ?? 0}
                  max={15000}
                />
                <BarWithTitle
                  label="Health"
                  value={hero?.stats?.health ?? 0}
                  max={180000}
                />
              </div>
              <div>
                <h3 className="text-md font-semibold mb-2">Expedition</h3>
                <BarWithTitle
                  label="Attack"
                  value={hero?.expedition?.attack ?? 0}
                  max={1500}
                  isPercent
                />
                <BarWithTitle
                  label="Defense"
                  value={hero?.expedition?.defense ?? 0}
                  max={1500}
                  isPercent
                />
              </div>
            </div>

            {/* Skills */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skill Exploration */}
              <div>
                <h3
                  ref={addSkillTitleRef}
                  className="text-md font-semibold mb-2"
                >
                  Skill Exploration
                </h3>
                <div className="flex gap-3">
                  {Object.entries(explorationSkills)
                    .filter(([key]) => key !== 'expedition')
                    .map(([_, skill], i) => {
                      const icon = skill?.effects?.icon || 'placeholder.png'
                      return (
                        <div
                          key={i}
                          ref={addSkillImageRef}
                          className="skill rounded-lg border border-white/20 cursor-pointer w-[70px] h-[70px] flex items-center justify-center overflow-hidden"
                          onClick={() => {
                            setActiveSkill({
                              name: skill['skill-name'],
                              description: skill.effects?.description,
                              icon: skill.effects?.icon,
                              stats: skill.effects?.stats,
                              effectName: skill.effects?.['effect-name'],
                              affectOn: skill.effects?.['affect-on'],
                              triggerPoint: skill['trigger-point'],
                              triggerTime: skill['trigger-time'],
                              type: 'exploration',
                            })
                            setShowSkillDetail(true)
                          }}
                        >
                          <img
                            src={`/${icon}`}
                            alt={skill['skill-name']}
                            width={70}
                            height={70}
                            draggable={false}
                          />
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* Skill Expedition */}
              <div>
                <h3
                  ref={addSkillTitleRef}
                  className="text-md font-semibold mb-2"
                >
                  Skill Expedition
                </h3>
                <div className="flex gap-3">
                  {Object.entries(expeditionSkills || {}).map(
                    ([_, skill], i) => {
                      const icon = skill?.effects?.icon || 'placeholder.png'
                      return (
                        <div
                          key={i}
                          ref={addSkillImageRef}
                          className="skill rounded-lg border border-white/20 cursor-pointer w-[70px] h-[70px] flex items-center justify-center overflow-hidden"
                          onClick={() => {
                            setActiveSkill({
                              name: skill['skill-name'],
                              description: skill.effects?.description,
                              icon: skill.effects?.icon,
                              stats: skill.effects?.stats,
                              effectName: skill.effects?.['effect-name'],
                              affectOn: skill.effects?.['affect-on'],
                              triggerPoint: skill['trigger-point'],
                              triggerTime: skill['trigger-time'],
                              type: 'Expedition',
                            })
                            setShowSkillDetail(true)
                          }}
                        >
                          <img
                            src={`/${icon}`}
                            alt={skill['skill-name']}
                            width={70}
                            height={70}
                            draggable={false}
                          />
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Widget & Passive */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div ref={widgetRef}>
                <h3 className="font-semibold mb-2 text-md">Widget</h3>
                <div className="flex items-center gap-2">
                  {hero?.widget?.['has-widget'] ? (
                    <>
                      <div
                        className="w-[60px] h-[60px] cursor-pointer"
                        onClick={() => {
                          setActiveWidget({
                            name: hero['widget-name'] || hero.widget?.name,
                            affectOn:
                              hero['widget-affect-on'] ||
                              hero.widget?.['affect-on'],
                            level: hero['widget-level'] || hero.widget?.level,
                            stats:
                              hero['widget-stats'] ||
                              hero.widget?.['widget-stats'],
                            icon: hero['widget-icon'] || hero.widget?.icon,
                          })
                          setShowWidgetDetail(true)
                        }}
                      >
                        <img
                          src={`/${
                            hero['widget-icon'] ||
                            hero.widget?.icon ||
                            'placeholder.png'
                          }.png`}
                          alt="widget"
                          width={60}
                          height={60}
                        />
                      </div>
                      <span>{hero['widget-name'] || hero.widget?.name}</span>
                    </>
                  ) : (
                    <span className="text-white/50 italic">No Widget</span>
                  )}
                </div>
              </div>

              <div ref={passiveRef}>
                <h3 className="font-semibold mb-2 text-md">Unique Passive</h3>
                <div className="flex items-center gap-2">
                  {hero?.uniquePassive?.icon ? (
                    <>
                      <div
                        className="w-[60px] h-[60px] cursor-pointer"
                        onClick={() => {
                          setActivePassive(hero.uniquePassive)
                          setShowPassiveDetail(true)
                        }}
                      >
                        <img
                          src={`/${hero.uniquePassive.icon}.png`}
                          alt="passive"
                          width={60}
                          height={60}
                        />
                      </div>
                      <span>{hero.uniquePassive.name}</span>
                    </>
                  ) : (
                    <span className="text-white/50 italic">No Passive</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center" ref={imageRef}>
            <div className="relative w-[300px] h-[400px]  overflow-hidden rounded-xl">
              {/* small image-level loader overlay when fetching new hero */}
              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center text-white/70 text-sm">
                  Loading...
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {hero?.image && (
                  <motion.img
                    key={hero.id}
                    src={`/${hero.image}`}
                    alt={hero.name}
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-xl cursor-grab active:cursor-grabbing select-none"
                    draggable={false}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-4 mt-6 items-center">
              <button
                onClick={handlePrev}
                className="text-2xl p-2 text-white/60 hover:text-white"
              >
                ❮
              </button>

              <div className=" px-2 py-1 rounded-xl">
                <HeroCarousel
                  heroes={indexList}
                  activeIndex={index}
                  onSelect={(i) => setIndex(i)}
                />
              </div>

              <button
                onClick={handleNext}
                className="text-2xl p-2 text-white/60 hover:text-white"
              >
                ❯
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
