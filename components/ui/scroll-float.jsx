'use client'

import { useEffect, useRef } from 'react'

export default function ScrollFloat({
  children,
  className = '',
  containerClassName = '',
  as: Tag = 'h2',
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const chars = el.querySelectorAll('.sf-char')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          chars.forEach((char, i) => {
            setTimeout(() => {
              char.style.opacity = '1'
              char.style.transform = 'translateY(0)'
            }, i * 20)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const text = typeof children === 'string' ? children : String(children)
  const words = text.split(' ')
  let charIndex = 0

  return (
    <div ref={containerRef} className="overflow-hidden">
      <Tag className={containerClassName || className}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split('').map((char) => {
              const idx = charIndex++
              return (
                <span
                  key={idx}
                  className="sf-char inline-block will-change-transform"
                  style={{ opacity: 0, transform: 'translateY(60px)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}
                >
                  {char}
                </span>
              )
            })}
            {wi < words.length - 1 && (
              <span
                className="sf-char inline-block will-change-transform"
                style={{ opacity: 0, transform: 'translateY(60px)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}
              >
                &nbsp;
              </span>
            )}
          </span>
        ))}
      </Tag>
    </div>
  )
}
