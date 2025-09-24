"use client"
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const CARD = { maxWidth: 460, borderRadius: 20 }

// Animated backdrop (same feel as homepage)
function AnimatedBackdrop() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let w = 0, h = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let mx = 0.5, my = 0.5

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const onResize = () => { ctx.setTransform(1,0,0,1,0,0); resize() }
    window.addEventListener('resize', onResize)

    const COUNT = 60
    const SPEED = 0.45
    const LINK = 120
    const points = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
    }))

    function lerp(a, b, t) { return a + (b - a) * t }

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mx = (e.clientX - rect.left) / rect.width
      my = (e.clientY - rect.top) / rect.height
    }
    window.addEventListener('pointermove', onMouse)

    const step = () => {
      ctx.clearRect(0, 0, w, h)
      const cx = lerp(w * 0.2, w * 0.8, mx * 0.3)
      const cy = lerp(h * 0.3, h * 0.7, my * 0.3)
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w,h)*0.9)
      g.addColorStop(0, 'rgba(59,130,246,0.10)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0,0,w,h)

      for (const p of points) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      }

      const max2 = LINK * LINK
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d2 = dx*dx + dy*dy
          if (d2 < max2) {
            const t = 1 - d2 / max2
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
            grad.addColorStop(0, `rgba(59,130,246,${t*0.45})`)
            grad.addColorStop(1, `rgba(0,0,0,${t*0.45})`)
            ctx.strokeStyle = grad
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }

      ctx.fillStyle = 'rgba(59,130,246,0.65)'
      for (const p of points) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2); ctx.fill() }

      raf = requestAnimationFrame(step)
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) step()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onMouse) }
  }, [])
  return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.85 }} />
}

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background:
            'conic-gradient(from 140deg at 50% 50%, #3b82f6, #1e40af, #000000, #3b82f6)',
          boxShadow: '0 0 18px rgba(59,130,246,0.6)'
        }}
      />
      <span style={{ fontWeight: 700, letterSpacing: 0.2, opacity: 0.9 }}>Vault</span>
    </div>
  )
}

export default function AppPage() {
  return (
    <>
    <main
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(1200px 600px at 20% 10%, rgba(59,130,246,0.12), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(0,0,0,0.18), transparent 60%), radial-gradient(1400px 800px at 50% 90%, rgba(29,78,216,0.10), transparent 60%), #000000',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <AnimatedBackdrop />
      <div
        className="bg-animated"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      <div
        className="fade-up card"
        style={{
          width: '100%',
          maxWidth: CARD.maxWidth,
          margin: '0 auto',
          borderRadius: CARD.borderRadius,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 80px rgba(59,130,246,0.12)',
          backdropFilter: 'blur(12px) saturate(140%)',
          WebkitBackdropFilter: 'blur(12px) saturate(140%)',
          padding: 24,
          animation: 'floatGlow 6s ease-in-out infinite'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Logo />
        </div>
        <div className="body" style={{ textAlign: 'center' }}>
          {/* <h2 style={{ fontSize: 22, marginBottom: 12, textShadow: '0 0 18px rgba(59,130,246,0.35), 0 0 28px rgba(0,0,0,0.25)' }}>
            Walletconnect
          </h2> */}
          <p className="fade-up" style={{ opacity: 0.85, marginBottom: 18 }}>
            Connect your wallet to continue.
          </p>
          <a
            href="#connect"
            className="pulse fade-up"
            style={{
              display: 'inline-block',
              padding: '12px 18px',
              borderRadius: 12,
              fontWeight: 600,
              textDecoration: 'none',
              color: 'white',
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.45)',
              boxShadow: '0 0 24px rgba(59,130,246,0.35) inset, 0 0 24px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(6px)'
            }}
          >
            Connect your wallet
          </a>
        </div>
      </div>
    </main>
    <style jsx>{`
      @keyframes drift {
        0% { transform: translate3d(-5%, -2%, 0) scale(1); }
        50% { transform: translate3d(5%, 2%, 0) scale(1.03); }
        100% { transform: translate3d(-5%, -2%, 0) scale(1); }
      }
      @keyframes fadeUp {
        0% { opacity: 0; transform: translate3d(0, 10px, 0); }
        100% { opacity: 1; transform: translate3d(0, 0, 0); }
      }
      @keyframes pulseSoft {
        0%, 100% { box-shadow: 0 0 24px rgba(255,255,255,0.06); }
        50% { box-shadow: 0 0 36px rgba(255,255,255,0.12); }
      }
      @keyframes floatGlow {
        0% { opacity: 0.9; transform: translate3d(0,0,0) scale(1); }
        50% { opacity: 1; transform: translate3d(0,-6px,0) scale(1.01); }
        100% { opacity: 0.9; transform: translate3d(0,0,0) scale(1); }
      }
      .bg-animated {
        background:
          radial-gradient(1200px 600px at 20% 10%, rgba(59,130,246,0.10), transparent 60%),
          radial-gradient(900px 500px at 80% 30%, rgba(0,0,0,0.18), transparent 60%),
          radial-gradient(1400px 800px at 50% 90%, rgba(29,78,216,0.10), transparent 60%);
        filter: saturate(120%);
        animation: drift 18s ease-in-out infinite;
      }
      .fade-up { animation: fadeUp 600ms ease-out both; }
      .pulse { animation: pulseSoft 2.8s ease-in-out infinite; }
      @media (max-width: 640px) {
        .card {
          min-height: 35svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }
        .card .body { text-align: center; }
        .card .body a { margin: 8px auto 0 auto; display: inline-block; }
      }
    `}</style>
    </>
  )
}
