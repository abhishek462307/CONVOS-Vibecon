'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

function formatNumber(n, separator, decimals) {
  const fixed = n.toFixed(decimals)
  if (!separator) return fixed
  const [int, dec] = fixed.split('.')
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return dec !== undefined ? `${formatted}.${dec}` : formatted
}

export default function CountUp({
  from = 0,
  to,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  separator = ',',
  decimals = 0,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const motionValue = useMotionValue(from)
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 })
  const [display, setDisplay] = useState(`${prefix}${formatNumber(from, separator, decimals)}${suffix}`)

  useEffect(() => {
    if (inView) motionValue.set(to)
  }, [inView, motionValue, to])

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      setDisplay(`${prefix}${formatNumber(v, separator, decimals)}${suffix}`)
    })
    return unsub
  }, [spring, prefix, suffix, separator, decimals])

  return <motion.span ref={ref} className={className}>{display}</motion.span>
}
