'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import SplitText from '../../lib/gsap/SplitText'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import { TypeAnimation } from 'react-type-animation'
import useDragNavigation from '../../hooks/useDragNavigation'
import HeroCarousel from './HeroCarousel.js'
import HeroPopup from './HeroPopup'
import PassivePopup from './PassivePopup'
import WidgetPopup from './WidgetPopup'
import BarWithTitle from './BarWithTitle'

export default function HeroDetail({ initialId }) {
  const [indexList, setIndexList] = useState([])
  const [index, setIndex] = useState(0)
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const addSkillTitleRef = (el) => {
    if (el && !skillTitleRefs.current.includes(el)) {
      skillTitleRefs.current.push(el)
    }
  }

  const addSkillImageRef = (el) => {
    if (el && !skillImageRefs.current.includes(el)) {
      skillImageRefs.current.push(el)
    }
  }

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
      .catch(() => setIndexList([]))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [initialId])

  const fetchAndSetHero = useCallback((id) => {
    if (!id) return
    setLoading(true)

    fetch(`/api/heroes/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return

        const img = new Image()
        img.src = `/icon/${data.image}`

        img.onload = () => {
          setHero(data)
          skillTitleRefs.current = []
          skillImageRefs.current = []
          setIsReady(false)
          setTimeout(() => setIsReady(true), 50)
        }

        img.onerror = () => {
          setHero(data)
          setIsReady(true)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!indexList.length) return
    fetchAndSetHero(indexList[index].id)
  }, [index, indexList, fetchAndSetHero])

  const handleNext = useCallback(() => {
    if (!indexList.length) return
    setIndex((prev) => (prev + 1) % indexList.length)
  }, [indexList])

  const handlePrev = useCallback(() => {
    if (!indexList.length) return
    setIndex((prev) => (prev - 1 + indexList.length) % indexList.length)
  }, [indexList])

  const isAnyPopupOpen = showSkillDetail || showPassiveDetail || showWidgetDetail
  useDragNavigation(imageRef, handleNext, handlePrev, !isAnyPopupOpen)

  useEffect(() => {
    if (!isReady || !hero) return
    if (!rarityRef.current || !classRef.current || !widgetRef.current || !passiveRef.current) return

    gsap.registerPlugin(SplitText)
    const cleanup = []

    const animateSplit = (ref, delay = 0) => {
      try {
        const split = new SplitText(ref.current, { type: 'chars' })
        gsap.fromTo(split.chars, { opacity: 0, x: -20 }, {
          opacity: 1,
          x: 0,
          stagger: 0.04,
          duration: 0.1,
          delay,
        })
        cleanup.push(() => split.revert())
      } catch {}
    }

    animateSplit(rarityRef, 0.2)
    animateSplit(classRef, 0.3)

    gsap.fromTo(widgetRef.current, { opacity: 0, y: 10 }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
    })

    gsap.fromTo(passiveRef.current, { opacity: 0, y: 10 }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
    })

    return () => cleanup.forEach((fn) => fn())
  }, [isReady, hero])

  const explorationSkills = hero?.skills?.exploration || {}
  const expeditionSkills = explorationSkills.expedition || {}

  return (
    <div className="w-full flex justify-center">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-10 py-6 max-w-[1100px]">

        <button onClick={() => window.history.back()} className="text-green-400 hover:underline mb-6">
          ← BACK TO HOME
        </button>

        {showSkillDetail && <HeroPopup skill={activeSkill} onClose={() => setShowSkillDetail(false)} />}
        {showWidgetDetail && <WidgetPopup widget={activeWidget} onClose={() => setShowWidgetDetail(false)} />}
        {showPassiveDetail && <PassivePopup passive={activePassive} onClose={() => setShowPassiveDetail(false)} />}

        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-10 items-start md:items-center">

          {/* LEFT */}
          <div className="w-full">

            <h2 className="text-sm uppercase tracking-wider text-white mb-2">
              Generation {hero?.generation}
            </h2>

            <h1 className="text-4xl sm:text-5xl font-bold text-green-400">
              <TypeAnimation key={hero?.id} sequence={[hero?.name || '', 1000]} speed={50} wrapper="span" repeat={0} />
            </h1>

            <div className="mt-4 space-y-1 text-base">
              <p>Rarity: <span ref={rarityRef} className="text-white/80">{hero?.rarity}</span></p>
              <p>Class: <span ref={classRef} className="text-white/80">{hero?.class}</span></p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <h3 className="text-md font-semibold mb-2">Stats</h3>
                <BarWithTitle label="Attack" value={hero?.stats?.attack ?? 0} max={15000} />
                <BarWithTitle label="Defense" value={hero?.stats?.defense ?? 0} max={15000} />
                <BarWithTitle label="Health" value={hero?.stats?.health ?? 0} max={180000} />
              </div>

              <div>
                <h3 className="text-md font-semibold mb-2">Expedition</h3>
                <BarWithTitle label="Attack" value={hero?.expedition?.attack ?? 0} max={1500} isPercent />
                <BarWithTitle label="Defense" value={hero?.expedition?.defense ?? 0} max={1500} isPercent />
              </div>

            </div>

            {/* Skills */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Exploration */}
              <div>
                <h3 ref={addSkillTitleRef} className="text-md font-semibold mb-2">Skill Exploration</h3>
                <div className="flex gap-3">
                  {Object.entries(explorationSkills)
                    .filter(([key]) => key !== 'expedition')
                    .map(([_, skill], i) => (
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
                            affectOn: skill.effects?.['affect-on'],
                          })
                          setShowSkillDetail(true)
                        }}
                      >
                        <img
                          src={`/icon/${skill.effects?.icon}`}
                          alt={skill['skill-name'] || 'skill icon'}
                          width={70}
                          height={70}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Expedition */}
              <div>
                <h3 ref={addSkillTitleRef} className="text-md font-semibold mb-2">Skill Expedition</h3>
                <div className="flex gap-3">
                  {Object.entries(expeditionSkills).map(([_, skill], i) => (
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
                        })
                        setShowSkillDetail(true)
                      }}
                    >
                      <img src={`/icon/${skill.effects?.icon}`} alt="" width={70} height={70} />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Widget & Passive */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">

              {/* Widget */}
              <div ref={widgetRef}>
                <h3 className="font-semibold mb-2 text-md">Widget</h3>

                {hero?.widget?.['has-widget'] ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[60px] h-[60px] cursor-pointer"
                      onClick={() => {
                        setActiveWidget({
                          name: hero['widget-name'] || hero.widget?.name,
                          affectOn: hero['widget-affect-on'] || hero.widget?.['affect-on'],
                          level: hero['widget-level'] || hero.widget?.level,
                          stats: hero['widget-stats'] || hero.widget?.['widget-stats'],
                          icon: hero['widget-icon'] || hero.widget?.icon,
                        })
                        setShowWidgetDetail(true)
                      }}
                    >
                      <img
                        src={`/icon/${hero['widget-icon'] || hero.widget?.icon || 'placeholder'}.png`}
                        alt={hero['widget-name'] || hero.widget?.name}
                        width={60}
                        height={60}
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = '/icon/placeholder.png'
                        }}
                      />
                    </div>
                    <span>{hero['widget-name'] || hero.widget?.name}</span>
                  </div>
                ) : (
                  <span className="text-white/50 italic">No Widget</span>
                )}
              </div>

              {/* Passive */}
              <div ref={passiveRef}>
                <h3 className="font-semibold mb-2 text-md">Unique Passive</h3>

                {hero?.uniquePassive?.icon ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={`/icon/${hero.uniquePassive.icon}.png`}
                      alt={hero.uniquePassive.name}
                      width={60}
                      height={60}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/icon/placeholder.png'
                      }}
                    />
                    <span>{hero.uniquePassive.name}</span>
                  </div>
                ) : (
                  <span className="text-white/50 italic">No Passive</span>
                )}
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center w-full" ref={imageRef}>

            <div className="relative w-full max-w-[380px] h-[420px] sm:w-[320px] sm:h-[420px] md:w-[350px] md:h-[450px] overflow-hidden rounded-xl">

              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center text-white/70 text-sm">
                  Loading...
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {hero?.image && (
                  <motion.img
                    key={hero.id}
                    src={`/icon/${hero.image}`}
                    alt={hero.name}
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
                    draggable={false}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>

            </div>

            <div className="flex gap-4 mt-6 items-center">
              <button onClick={handlePrev} className="text-2xl p-2 text-white/60 hover:text-white">
                ❮
              </button>

              <div className="px-2 py-1 rounded-xl">
                <HeroCarousel
                  heroes={indexList}
                  activeIndex={index}
                  onSelect={(i) => setIndex(i)}
                />
              </div>

              <button onClick={handleNext} className="text-2xl p-2 text-white/60 hover:text-white">
                ❯
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
