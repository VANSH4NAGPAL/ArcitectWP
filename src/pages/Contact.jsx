import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Navigation from '../components/Navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars } from 'react-icons/fa'

function Contact() {
  const formRef = useRef(null)
  const headingRef = useRef(null)
  const inputRefs = useRef([])
  const socialRefs = useRef([])
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [showMobileNav, setShowMobileNav] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { y: -40, opacity: 1 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    gsap.fromTo(
      formRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, delay: 0.3, ease: 'power3.out' }
    )
    gsap.fromTo(
      leftRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' }
    )
    gsap.fromTo(
      rightRef.current,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' }
    )
    gsap.fromTo(
      socialRefs.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, delay: 0.7, ease: 'power3.out' }
    )
  }, [])

  const handleFocus = idx => {
    gsap.to(inputRefs.current[idx], {
      scale: 1.03,
      boxShadow: '0 0 0 2px #fff3',
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  const handleBlur = idx => {
    gsap.to(inputRefs.current[idx], {
      scale: 1,
      boxShadow: '0 0 0 0px #fff0',
      duration: 0.3,
      ease: 'power2.in'
    })
  }

  const socialIcons = [
    {
      href: "#",
      label: "Facebook",
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
      )
    },
    {
      href: "#",
      label: "Twitter",
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.634A9.936 9.936 0 0 0 24 4.557z"/></svg>
      )
    },
    {
      href: "#",
      label: "Instagram",
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.783 2.225 7.149 2.163 8.415 2.105 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.385 3.678 1.366c-.98.98-1.234 2.092-1.293 3.374C2.013 5.668 2 6.077 2 9.333v5.334c0 3.256.013 3.665.072 4.946.059 1.282.313 2.394 1.293 3.374.981.981 2.093 1.234 3.374 1.293 1.281.059 1.69.072 4.946.072s3.665-.013 4.946-.072c1.282-.059 2.394-.313 3.374-1.293.981-.98 1.234-2.092 1.293-3.374.059-1.281.072-1.69.072-4.946V9.333c0-3.256-.013-3.665-.072-4.946-.059-1.282-.313-2.394-1.293-3.374-.98-.981-2.092-1.234-3.374-1.293C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
      )
    }
  ]

  const handleSubmit = e => {
    e.preventDefault()
    setErrorMsg('')
    const [name, email, subject, message] = inputRefs.current.map(ref => ref?.value?.trim())
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!name) return setErrorMsg('Please enter your name.')
    if (!email) return setErrorMsg('Please enter your e-mail.')
    if (!emailValid) return setErrorMsg('Please enter a valid e-mail address.')
    if (!subject) return setErrorMsg('Please enter a subject.')
    if (!message) return setErrorMsg('Please enter your message.')
    gsap.fromTo(
      formRef.current,
      { scale: 1 },
      { scale: 1.04, yoyo: true, repeat: 1, duration: 0.18, ease: 'power1.inOut' }
    )
    setErrorMsg('')
    // Submit logic here
  }

  return (
    <div
      className="min-h-screen flex flex-col !p-0 relative overflow-hidden bg-white"
      style={{
        // White background only
      }}
    >
      {/* --- Foreground content --- */}
      <div className="relative z-10">
        {/* MOBILE NAV BUTTON */}
        <motion.button
          className="fixed top-4 right-4 z-50 lg:hidden w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
          onClick={() => setShowMobileNav(true)}
          aria-label="Open navigation"
          whileHover={{ scale: 1.12, rotate: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
          whileTap={{ scale: 0.95, rotate: -10 }}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: showMobileNav ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <FaBars className="text-2xl text-black" />
          </motion.span>
        </motion.button>
        {/* MOBILE NAV OVERLAY */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              className="fixed inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <motion.button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                onClick={() => setShowMobileNav(false)}
                aria-label="Close navigation"
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.92, rotate: -90 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <span className="text-2xl text-white">&times;</span>
              </motion.button>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Navigation textColor="black" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* LOGO & NAVIGATION - Only on large screens */}
        
      <div className="flex flex-col lg:flex-row justify-center lg:justify-start lg:w-[100%] overflow-y-auto ml-0 mt-0 lg:!ml-5 lg:!mt-5 items-center lg:items-start">
        <div className="!pt-12 lg:!pt-0 h-full px-2 sm:!px-4 lg:!px-8 py-4 sm:!py-6 lg:!py-8 w-[90%] lg:w-[100%] flex flex-col lg:flex-row">
          
          {/* Left Content */}
          <div
            ref={leftRef}
            className="flex-1 flex flex-col items-center md:items-start !p-15 !mt-5 text-2xl tracking-widest font-semibold"
          >
            <div className="text-black !mb-10 !mt-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam excepturi et tenetur distinctio numquam similique delectus facilis recusandae quod possimus, sunt deleniti, eum consequuntur rerum non magnam, sed quia? Repellat.50
            </div>
            <div className="mb-8 !mt-0">
              <div className="uppercase text-black/80 text-xs !mb-1 tracking-widest">address</div>
              <div className="text-lg text-black">123, Main Street, NY 10030</div>
            </div>
            <div className="mb-8 !mt-0">
              <div className="uppercase text-black/80 text-xs !mb-1 tracking-widest">phone</div>
              <div className="text-lg text-black">+1 800 123 4567</div>
            </div>
            <div className="mb-8 !mt-0">
              <div className="uppercase text-black/80 text-xs !mb-1 tracking-widest">e-mail</div>
              <div className="text-lg text-black">tuba@email.com</div>
            </div>
            <div className="flex flex-row gap-4 mt-12 !mb-0">
              {socialIcons.map((icon, idx) => (
                <a
                  key={icon.label}
                  href={icon.href}
                  className="text-black hover:text-black transition text-xl"
                  aria-label={icon.label}
                  ref={el => (socialRefs.current[idx] = el)}
                >
                  {icon.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div ref={rightRef} className="flex-1 flex flex-col items-center justify-center !p-12 !mt-5 lg:!mt-0">
            <form
              ref={formRef}
              className="w-full max-w-3xl bg-white/10 backdrop-blur-[8px] border border-white/20 shadow-2xl !p-14 flex flex-col gap-4"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)',
                border: '1.5px solid rgba(0,0,0,0.08)',
                background: 'rgba(24,25,27,0.07)',
              }}
              onSubmit={handleSubmit}
            >
              <div className="text-black text-3xl font-bold tracking-widest mb-4 !mt-0 text-center">CONTACT FORM</div>
              {errorMsg && (
                <div className="flex justify-center">
                  <div className="bg-[#2c2d31]/80 border border-red-400/40 rounded-lg px-6 py-4 mb-4 shadow-lg flex items-center gap-3 animate-fade-in">
                    <svg className="w-6 h-6 text-red-400 !ml-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                    </svg>
                    <span className="text-red-300 font-semibold !p-4 tracking-wider">{errorMsg}</span>
                  </div>
                </div>
              )}
              {['Your name', 'Your e-mail', 'Your subject'].map((placeholder, idx) => (
                <input
                  key={placeholder}
                  type={placeholder === 'Your e-mail' ? 'email' : 'text'}
                  placeholder={placeholder}
                  className="bg-transparent border-b border-gray-400 focus:border-gray-600 focus:outline-none text-black !py-5 !px-0 placeholder-black/60 text-lg"
                  ref={el => (inputRefs.current[idx] = el)}
                  onFocus={() => handleFocus(idx)}
                  onBlur={() => handleBlur(idx)}
                />
              ))}
              <textarea
                placeholder="Message"
                rows={5}
                className="bg-transparent border-b border-gray-400 focus:border-gray-600 focus:outline-none text-black !py-5 !px-0 placeholder-black/60 resize-none text-lg"
                ref={el => (inputRefs.current[3] = el)}
                onFocus={() => handleFocus(3)}
                onBlur={() => handleBlur(3)}
              />
              <button
                type="submit"
                className="bg-[#232427]/90 text-white font-bold tracking-widest rounded-lg !py-5 !px-0 mt-4 shadow-md hover:bg-[#111] transition text-lg"
                style={{
                  boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.08)'
                }}
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Contact
