"use client"
import SpotlightCard from '@/components/SpotlightCard'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useEffect, useRef } from 'react'
import { SpotLight } from 'three'

// Palette and layout knobs kept in one place
// const COLORS = {
//   cyan: 'rgba(34,211,238,1)',
//   cyanSoft: 'rgba(34,211,238,0.35)',
//   pink: 'rgba(236,72,153,1)',
//   pinkSoft: 'rgba(236,72,153,0.35)',
//   textSoft: 'rgba(230,230,233,0.85)'
// }
const COLORS = {
  cyan: 'rgba(0, 18, 117, 1)',
  cyanSoft: 'rgba(34,211,238,0.35)',
  pink: 'rgba(26, 17, 21, 1)',
  pinkSoft: 'rgba(122, 18, 70, 0.35)',
  textSoft: 'rgba(82, 82, 255, 0.85)'
}

const PANEL = {
  maxWidth: 980,
  minHeight: 520,
  borderRadius: 20
}

// Animated backdrop: small, readable canvas-based field
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
      // subtle gradient wash
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

export function BrandBadge() {
  return (
    <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
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

function CTAButton({ children, tone, href }) {
  const styles = tone === 'pink'
    ? { background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.45)', boxShadow: '0 0 24px rgba(236,72,153,0.35) inset, 0 0 24px rgba(236,72,153,0.15)' }
    : { background: 'rgba(34,211,238,0.10)', border: '1px solid rgba(34,211,238,0.45)', boxShadow: '0 0 24px rgba(34,211,238,0.35) inset, 0 0 24px rgba(34,211,238,0.15)' }

  return (
    <Link href={href}>
      <span className="btn fade-up pulse" style={{ ...styles, textDecoration: 'none', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '12px 18px', display: 'inline-block', fontWeight: 600 }}>
      {children}
      </span>
    </Link>

  )
}
 const ContentSection = ({ children, id, className = '' }) => (
  <section id={id} className={`py-12 md:py-16 px-4 md:px-6 ${className}`}
    style={{ maxWidth: 1024, margin: '0 auto', color: 'rgba(230,230,233,0.95)' }}>
    {children}
  </section>
);
const ContentCard = ({ children, className = '', id }) => (
  <div id={id} className={`p-6 md:p-8 rounded-xl ${className}`}
       style={{
         background: 'rgba(255,255,255,0.03)',
         border: '1px solid rgba(255,255,255,0.10)',
         boxShadow: '0 4px 15px rgba(0,0,0,0.4), 0 0 10px rgba(59,130,246,0.02)',
         backdropFilter: 'blur(8px)',
         WebkitBackdropFilter: 'blur(8px)',
         color: 'rgba(230,230,233,0.95)',
         height: '100%',
         transition: 'transform 0.3s, box-shadow 0.3s',
         // Add hover effects for interactivity
       }}>
    {children}
  </div>
);

export default function Home() {
  const placeholders = useMemo(() => {
    const assets = ['/globe.svg', '/vercel.svg', '/next.svg', '/window.svg', '/file.svg']
    const count = 8
    const items = []
    for (let i = 0; i < count; i++) {
      const asset = assets[Math.floor(Math.random() * assets.length)]
      items.push({
        id: `ph-${i}`,
        src: asset,
        top: Math.random() * 80 + 10,
        left: Math.random() * 80 + 10,
        size: Math.random() * 40 + 24,
        rotate: Math.random() * 360,
        opacity: Math.random() * 0.25 + 0.15,
      })
    }
    return items
  }, [])

  return (
    <>
    <main
      style={{
        minHeight: '100svh',
        backgroundColor: ' #0a1128',
        backgroundImage: "linear-gradient(to bottom, #0a1128, #000000)",
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatedBackdrop />
      <div
        className="bg-animated"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(closest-side, rgba(255,255,255,0.06), transparent 60%) 0 0/28px 28px',
          maskImage: 'radial-gradient(1200px 800px at 50% 60%, black, transparent)',
        }}
      />

      <div className='mx-10 my-5'>
        <BrandBadge />
      </div>
      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >

        <div
          style={{
            width: '100%',
            maxWidth: PANEL.maxWidth,
            margin: '0 auto 28px auto',
            minHeight: PANEL.minHeight,
            borderRadius: PANEL.borderRadius,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 80px rgba(59,130,246,0.12), 0 0 110px rgba(0,0,0,0.20)',
            backdropFilter: 'blur(22px) saturate(140%)',
            WebkitBackdropFilter: 'blur(22px) saturate(140%)',
            overflow: 'hidden',
            position: 'relative',
            animation: 'floatGlow 6s ease-in-out infinite'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 16px', opacity: 0.9 }}>
            <div style={{ width: 14, height: 2, background: 'rgba(255,255,255,0.55)', borderRadius: 4 }} />
            <div style={{ width: 14, height: 2, background: 'rgba(255,255,255,0.55)', borderRadius: 4 }} />
            <div style={{ width: 18, height: 2, background: 'rgba(255,255,255,0.55)', borderRadius: 4 }} />
          </div>

          <div style={{ padding: '16px 20px 28px 20px' }}>
            <h1 className="fade-up"
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 800,
            margin: '6px 0 16px 0',
            textShadow:
              '0 0 18px rgba(59,130,246,0.35), 0 0 28px rgba(0,0,0,0.25)',
          }}
        >
              The Future of Decentralized Rewards.
              <br />
              On‑Chain. Seamlessly.
            </h1>

            <p className="fade-up"
          style={{
            maxWidth: 780,
            margin: '0 auto 28px auto',
            color: 'rgba(230,230,233,0.85)',
            fontSize: 'clamp(14px, 2vw, 18px)',
          }}
        >
              Built on BlockDAG for unparalleled transparency and efficiency in predictive markets.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <CTAButton tone="pink" href="/connect">Create Quests</CTAButton>
              <CTAButton tone="cyan" href="#docs">Participate</CTAButton>
            </div>
          </div>

          <div className="panel-stroke" />
          <div className="panel-noise" aria-hidden="true" />
          <div className="panel-sheen" aria-hidden="true" />
          <div className="panel-glow" />
        </div>
      </section>
<ContentSection id="problem-solution" className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
          <SpotlightCard className='lg:col-span-1'>
            <h2 className="text-2xl font-bold mb-4" style={{color: '#3b82f6'}}>Problem Statement</h2>
          <div className="text-lg leading-relaxed opacity-85">
            Traditional prediction platforms are centralized, prone to manipulation, and lack transparency. Users have to trust a middleman, and payouts are often delayed or unfair.
          </div>
          </SpotlightCard>

        
         <SpotlightCard className='lg:col-span-1'>
             <h2 className="text-2xl font-bold mb-4" style={{color: '#ec4899'}}>Our Solution</h2>
          <p className="text-lg leading-relaxed mb-4 opacity-85">
            We’ve built <strong style={{color: '#3b82f6'}}>PredictionVault</strong>, a decentralized application that enables users to:
          </p>
          <ul className="list-none space-y-2 text-left text-base font-medium">
            <li>✓ Create prediction markets.</li>
            <li>✓ Stake on outcomes with full transparency.</li>
            <li>✓ Automatically distribute rewards via smart contracts.</li>
            <li>✓ Eliminate middlemen using the **BlockDAG network**.</li>
          </ul>
          </SpotlightCard>

      </ContentSection>

      <ContentSection id="features">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
          Core <span style={{color: '#3b82f6'}}>Features</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpotlightCard>
             <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl" role="img" aria-label="lightning">⚡</span>
              <h3 className="text-xl font-semibold">Instant Settlement</h3>
            </div>
            <p className="opacity-75">Rewards are distributed <b>automatically on-chain</b> immediately upon resolution, removing slow middleman processing.</p>  
          </SpotlightCard>
          
          <SpotlightCard>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl" role="img" aria-label="lock">🔒</span>
              <h3 className="text-xl font-semibold">Trustless & Transparent</h3>
            </div>
            <p className="opacity-75">Every prediction and stake is recorded on <b>BlockDAG</b>, guaranteeing verifiable proof and non-custodial staking.</p>

          </SpotlightCard>
          
          <SpotlightCard> 
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl" role="img" aria-label="earth">🌍</span>
              <h3 className="text-xl font-semibold">Open Participation</h3>
            </div>
            <p className="opacity-75">The system is <b>permissionless</b>. Anyone can create or join a vault, fostering a truly global market.</p>
          </SpotlightCard>

         <SpotlightCard>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl" role="img" aria-label="chart">📊</span>
              <h3 className="text-xl font-semibold">Diverse Categories</h3>
            </div>
            <p className="opacity-75">We support markets across a wide spectrum: from sports and crypto to weather and global events.</p>
         </SpotlightCard>
        </div>
      </ContentSection>

      <ContentSection id="how-it-works" className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10">
          How It <span style={{color: '#ec4899'}}>Works</span>
        </h2>
        <SpotlightCard className="max-w-3xl mx-auto text-left">
          <ol className="space-y-6 text-lg font-medium">
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: '#3b82f6', color: '#000000'}}>1</div>
              <p><strong>Create a Vault</strong> – Set a question, define outcomes, and establish the resolution source.</p>
            </li>
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: '#ec4899', color: '#000000'}}>2</div>
              <p><strong>Stake Your Prediction</strong> – Choose your side and deposit your funds into the smart contract.</p>
            </li>
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: '#3b82f6', color: '#000000'}}>3</div>
              <p><strong>Wait for Resolution</strong> – Once the pre-determined results are verified (by the specified source), the vault closes.</p>
            </li>
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: '#ec4899', color: '#000000'}}>4</div>
              <p><strong>Claim Rewards</strong> – Winners are paid instantly and automatically via the governing smart contract.</p>
            </li>
          </ol>
        </SpotlightCard>
      </ContentSection>

      <ContentSection id="hackathon-focus">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
          <span style={{color: '#3b82f6'}}>Demo Preview</span> (Hackathon Focus)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <SpotlightCard className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-3">Key Demo Actions</h3>
            <ul className="list-none space-y-3 text-left text-base font-medium">
              <li>• Create your first vault using the intuitive interface.</li>
              <li>• Stake on live categories (Sports, Celebrities, Crypto, Weather, Dollars).</li>
              <li>• Watch payouts happen instantly after results are resolved.</li>
            </ul>
          </SpotlightCard>
          <SpotlightCard className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-3">Why BlockDAG?</h3>
            <ul className="list-none space-y-3 text-left text-base font-medium">
              <li>✅ High throughput & low latency.</li>
              <li>✅ Scalable beyond traditional blockchain limitations.</li>
              <li>✅ Perfect for real-time prediction markets that demand speed.</li>
            </ul>
          </SpotlightCard>
        </div>
      </ContentSection>

      <ContentSection id="faq">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
          Frequently Asked <span style={{color: '#ec4899'}}>Questions</span>
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            { q: "Is this app live on mainnet?", a: "For now, it’s deployed on the BlockDAG testnet as part of the hackathon demo." },
            { q: "Do I need crypto to try it out?", a: "No — you’ll automatically receive free test tokens to interact with the dApp for the demo." },
            { q: "How are winners determined?", a: "Vault creators specify verifiable resolution sources (oracles). Smart contracts handle the payouts automatically and without bias." },
            { q: "Can anyone create a vault?", a: "Yes, the system is fully permissionless and decentralized." },
          ].map((item, index) => (
            <SpotlightCard key={index} className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <p className="font-bold mb-1" style={{ color: '#3b82f6' }}>{item.q}</p>
              <p className="text-sm opacity-80">{item.a}</p>
            </SpotlightCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="cta-final" className="text-center py-20">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-8" style={{ textShadow: '0 0 10px rgba(236,72,153,0.4)' }}>
          “Ready to experience the future of prediction markets?”
        </h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <CTAButton tone="pink" href="/connect">Try the Demo</CTAButton>
          <CTAButton tone="cyan" href="https://github.com/predictionvault">View GitHub</CTAButton>
        </div>
      </ContentSection>


      {/* RESTORED: Decorative Background Images/SVGs */}
      {placeholders.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            top: `${item.top}%`,
            left: `${item.left}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
            filter: 'drop-shadow(0 0 16px rgba(59,130,246,0.35)) drop-shadow(0 0 28px rgba(0,0,0,0.25))',
            opacity: item.opacity,
            pointerEvents: 'none',
          }}
        >
          {/* Using standard HTML <img> tag for asset display */}
          <img src={item.src} alt="decoration" width={item.size} height={item.size} style={{ width: item.size, height: item.size }} />
        </div>
      ))}
    </main>

    {/* Footer Section */}
    <footer className="py-6 px-4 md:px-6 text-center text-sm"
      style={{
        background: 'rgba(0,0,0,0.3)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(230,230,233,0.7)',
        zIndex: 10,
        position: 'relative'
      }}>
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 max-w-4xl mx-auto font-medium">
        {/* Using standard HTML <a> tags for navigation */}
        <a href="#about" className="hover:text-white transition-colors">About</a>
        <a href="#docs" className="hover:text-white transition-colors">Docs</a>
        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        <a href="https://github.com/predictionvault" className="hover:text-white transition-colors">GitHub</a>
        <a href="https://twitter.com/predictionvault" className="hover:text-white transition-colors">X (Twitter)</a>
        <span className="font-bold" style={{ color: '#3b82f6' }}>BlockDAG Hackathon</span>
      </div>
    </footer>


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
        0% { opacity: 0.6; transform: translate3d(0,0,0) scale(1); }
        50% { opacity: 1; transform: translate3d(0,-8px,0) scale(1.02); }
        100% { transform: translate3d(0,0,0) scale(1); }
      }
      .bg-animated {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(1200px 600px at 20% 10%, rgba(59,130,246,0.12), transparent 60%),
          radial-gradient(900px 500px at 80% 30%, rgba(0,0,0,0.18), transparent 60%),
          radial-gradient(1400px 800px at 50% 90%, rgba(29,78,216,0.10), transparent 60%);
        filter: saturate(120%);
        animation: drift 18s ease-in-out infinite;
        pointer-events: none;
      }
      .panel-stroke {
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: ${PANEL.borderRadius}px;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.10), inset 0 0 0 0.5px rgba(255,255,255,0.3);
      }
      .panel-noise {
        position: absolute;
        inset: 0;
        opacity: 0.05;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="140" height="140" filter="url(%23n)" opacity="0.6"/></svg>');
        mix-blend-mode: overlay;
        pointer-events: none;
      }
      .panel-sheen {
        position: absolute;
        inset: 0;
        border-radius: ${PANEL.borderRadius}px;
        background: linear-gradient(120deg, rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.0) 60%);
        mix-blend-mode: overlay;
        transform: translateX(-40%);
        animation: sheen 6s ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes sheen {
        0% { transform: translateX(-40%); opacity: 0.6; }
        50% { transform: translateX(40%); opacity: 1; }
        100% { transform: translateX(-40%); opacity: 0.6; }
      }
      .panel-glow {
        position: absolute;
        inset: -20% -10% auto -10%;
        height: 60%;
        background: radial-gradient(600px 260px at 30% 40%, rgba(59,130,246,0.25), transparent 60%), radial-gradient(520px 240px at 70% 50%, rgba(0,0,0,0.22), transparent 60%);
        filter: blur(40px) saturate(120%);
        animation: floatGlow 6s ease-in-out infinite;
        pointer-events: none;
      }
      .btn { padding: 12px 18px; border-radius: 12px; display: inline-block; font-weight: 600; }
      .fade-up { animation: fadeUp 600ms ease-out both; }
      .pulse { animation: pulseSoft 2.8s ease-in-out infinite; }
      .btn-pink { background: rgba(236,72,153,0.15); border: 1px solid rgba(236,72,153,0.45); box-shadow: 0 0 24px rgba(236,72,153,0.35) inset, 0 0 24px rgba(236,72,153,0.15); backdrop-filter: blur(6px); }
      .btn-cyan { background: rgba(34,211,238,0.10); border: 1px solid rgba(34,211,238,0.45); box-shadow: 0 0 24px rgba(34,211,238,0.35) inset, 0 0 24px rgba(34,211,238,0.15); backdrop-filter: blur(6px); }
      .btn:hover { transform: translateY(-1px); filter: saturate(120%); }
      .btn:active { transform: translateY(0); }
      .btn:focus { outline: none; box-shadow: 0 0 0 3px rgba(255,255,255,0.08); }
      @media (prefers-reduced-motion: reduce) {
        .panel-glow, .bg-animated, .fade-up, .pulse { animation: none; }
      }
    `}</style>
    </>
  );
}


// "use client"
// import { useMemo, useEffect, useRef } from 'react'
// // Note: next/image and next/link were intentionally omitted to fix compilation errors, 
// // using standard <img> and <a> tags instead while keeping the original styles and animations.

// // Palette and layout knobs kept in one place
// const COLORS = {
//   cyan: 'rgba(0, 18, 117, 1)',
//   cyanSoft: 'rgba(34,211,238,0.35)',
//   pink: 'rgba(26, 17, 21, 1)',
//   pinkSoft: 'rgba(122, 18, 70, 0.35)',
//   textSoft: 'rgba(82, 82, 255, 0.85)'
// }

// const PANEL = {
//   maxWidth: 980,
//   minHeight: 520,
//   borderRadius: 20
// }

// // Animated backdrop: small, readable canvas-based field
// function AnimatedBackdrop() {
//   const ref = useRef(null)
//   useEffect(() => {
//     const canvas = ref.current
//     if (!canvas) return
//     const ctx = canvas.getContext('2d')
//     let raf = 0
//     let w = 0, h = 0
//     const dpr = Math.min(2, window.devicePixelRatio || 1)
//     let mx = 0.5, my = 0.5

//     const resize = () => {
//       w = canvas.clientWidth
//       h = canvas.clientHeight
//       canvas.width = Math.floor(w * dpr)
//       canvas.height = Math.floor(h * dpr)
//       ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
//     }
//     resize()
//     const onResize = () => { ctx.setTransform(1,0,0,1,0,0); resize() }
//     window.addEventListener('resize', onResize)

//     const COUNT = 60
//     const SPEED = 0.45
//     const LINK = 120
//     const points = Array.from({ length: COUNT }, () => ({
//       x: Math.random() * w,
//       y: Math.random() * h,
//       vx: (Math.random() - 0.5) * SPEED,
//       vy: (Math.random() - 0.5) * SPEED,
//     }))

//     function lerp(a, b, t) { return a + (b - a) * t }

//     const onMouse = (e) => {
//       const rect = canvas.getBoundingClientRect()
//       mx = (e.clientX - rect.left) / rect.width
//       my = (e.clientY - rect.top) / rect.height
//     }
//     window.addEventListener('pointermove', onMouse)

//     const step = () => {
//       ctx.clearRect(0, 0, w, h)
//       // subtle gradient wash
//       const cx = lerp(w * 0.2, w * 0.8, mx * 0.3)
//       const cy = lerp(h * 0.3, h * 0.7, my * 0.3)
//       const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w,h)*0.9)
//       g.addColorStop(0, 'rgba(59,130,246,0.10)')
//       g.addColorStop(1, 'rgba(0,0,0,0)')
//       ctx.fillStyle = g
//       ctx.fillRect(0,0,w,h)

//       for (const p of points) {
//         p.x += p.vx; p.y += p.vy
//         if (p.x < 0 || p.x > w) p.vx *= -1
//         if (p.y < 0 || p.y > h) p.vy *= -1
//       }

//       const max2 = LINK * LINK
//       for (let i = 0; i < points.length; i++) {
//         for (let j = i + 1; j < points.length; j++) {
//           const a = points[i], b = points[j]
//           const dx = a.x - b.x, dy = a.y - b.y
//           const d2 = dx*dx + dy*dy
//           if (d2 < max2) {
//             const t = 1 - d2 / max2
//             const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
//             grad.addColorStop(0, `rgba(59,130,246,${t*0.45})`)
//             grad.addColorStop(1, `rgba(0,0,0,${t*0.45})`)
//             ctx.strokeStyle = grad
//             ctx.lineWidth = 1
//             ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
//           }
//         }
//       }

//       ctx.fillStyle = 'rgba(59,130,246,0.65)'
//       for (const p of points) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2); ctx.fill() }

//       raf = requestAnimationFrame(step)
//     }
//     const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
//     if (!prefersReduced) step()
//     return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onMouse) }
//   }, [])
//   return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.85 }} />
// }

// export function BrandBadge() {
//   return (
//     <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
//       <div
//         style={{
//           width: 28,
//           height: 28,
//           borderRadius: 8,
//           background:
//             'conic-gradient(from 140deg at 50% 50%, #3b82f6, #1e40af, #000000, #3b82f6)',
//           boxShadow: '0 0 18px rgba(59,130,246,0.6)'
//         }}
//       />
//       <span style={{ fontWeight: 700, letterSpacing: 0.2, opacity: 0.9 }}>Vault</span>
//     </div>
//   )
// }

// function CTAButton({ children, tone, href }) {
//   const styles = tone === 'pink'
//     ? { background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.45)', boxShadow: '0 0 24px rgba(236,72,153,0.35) inset, 0 0 24px rgba(236,72,153,0.15)' }
//     : { background: 'rgba(34,211,238,0.10)', border: '1px solid rgba(34,211,238,0.45)', boxShadow: '0 0 24px rgba(34,211,238,0.35) inset, 0 0 24px rgba(34,211,238,0.15)' }

//   return (
//     // Standard HTML <a> tag
//     <a href={href} style={{ textDecoration: 'none' }}>
//       <span className="btn fade-up pulse" style={{ ...styles, backdropFilter: 'blur(6px)', borderRadius: 12, padding: '12px 18px', display: 'inline-block', fontWeight: 600 }}>
//       {children}
//       </span>
//     </a>

//   )
// }

// // Helper component for content cards
// const ContentCard = ({ children, className = '', id }) => (
//   <div id={id} className={`p-6 md:p-8 rounded-xl ${className}`}
//        style={{
//          background: 'rgba(255,255,255,0.03)',
//          border: '1px solid rgba(255,255,255,0.10)',
//          boxShadow: '0 4px 15px rgba(0,0,0,0.4), 0 0 10px rgba(59,130,246,0.02)',
//          backdropFilter: 'blur(8px)',
//          WebkitBackdropFilter: 'blur(8px)',
//          color: 'rgba(230,230,233,0.95)',
//          height: '100%',
//          transition: 'transform 0.3s, box-shadow 0.3s',
//          // Add hover effects for interactivity
//        }}>
//     {children}
//   </div>
// );

// // Helper component for standard full-width content sections
// const ContentSection = ({ children, id, className = '' }) => (
//   <section id={id} className={`py-12 md:py-16 px-4 md:px-6 ${className}`}
//     style={{ maxWidth: 1024, margin: '0 auto', color: 'rgba(230,230,233,0.95)' }}>
//     {children}
//   </section>
// );


// export default function Home() {
//   const placeholders = useMemo(() => {
//     // These paths assume the assets are in the public directory of the project
//     // Note: These need to be actual files in the public directory to load!
//     const assets = ['https://placehold.co/40x40/3b82f6/white?text=A', 'https://placehold.co/40x40/ec4899/white?text=B', 'https://placehold.co/40x40/0f172a/white?text=C', 'https://placehold.co/40x40/3b82f6/white?text=D', 'https://placehold.co/40x40/ec4899/white?text=E']
//     const count = 8
//     const items = []
//     for (let i = 0; i < count; i++) {
//       const asset = assets[Math.floor(Math.random() * assets.length)]
//       items.push({
//         id: `ph-${i}`,
//         src: asset,
//         top: Math.random() * 80 + 10,
//         left: Math.random() * 80 + 10,
//         size: Math.random() * 40 + 24,
//         rotate: Math.random() * 360,
//         opacity: Math.random() * 0.25 + 0.15,
//       })
//     }
//     return items
//   }, [])

//   return (
//     <>
//     <main
//       style={{
//         minHeight: '100svh',
//         background:
//           'radial-gradient(1200px 600px at 20% 10%, rgba(59,130,246,0.12), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(0,0,0,0.18), transparent 60%), radial-gradient(1400px 800px at 50% 90%, rgba(29,78,216,0.10), transparent 60%), #000000',
//         color: 'white',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* RESTORED: Animated Canvas Backdrop */}
//       <AnimatedBackdrop />
//       <div
//         className="bg-animated"
//         aria-hidden="true"
//         style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
//       />
//       <div
//         style={{
//           position: 'absolute',
//           inset: 0,
//           pointerEvents: 'none',
//           background:
//             'radial-gradient(closest-side, rgba(255,255,255,0.06), transparent 60%) 0 0/28px 28px',
//           maskImage: 'radial-gradient(1200px 800px at 50% 60%, black, transparent)',
//         }}
//       />

//       <div className='mx-10 my-5'>
//         <BrandBadge />
//       </div>

//       {/* Main Hero Card Section (EXISTING) */}
//       <section
//         style={{
//           maxWidth: 1120,
//           margin: '0 auto',
//           padding: '20px 24px',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           textAlign: 'center',
//           zIndex: 10, // Ensure hero is above background
//           position: 'relative'
//         }}
//       >
//         {/* The main card */}
//         <div
//           style={{
//             width: '100%',
//             maxWidth: PANEL.maxWidth,
//             margin: '0 auto 28px auto',
//             minHeight: PANEL.minHeight,
//             borderRadius: PANEL.borderRadius,
//             background: 'rgba(255,255,255,0.025)',
//             border: '1px solid rgba(255,255,255,0.10)',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 80px rgba(59,130,246,0.12), 0 0 110px rgba(0,0,0,0.20)',
//             backdropFilter: 'blur(22px) saturate(140%)',
//             WebkitBackdropFilter: 'blur(22px) saturate(140%)',
//             overflow: 'hidden',
//             position: 'relative',
//             animation: 'floatGlow 6s ease-in-out infinite'
//           }}
//         >
//           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 16px', opacity: 0.9 }}>
//             <div style={{ width: 14, height: 2, background: 'rgba(255,255,255,0.55)', borderRadius: 4 }} />
//             <div style={{ width: 14, height: 2, background: 'rgba(255,255,255,0.55)', borderRadius: 4 }} />
//             <div style={{ width: 18, height: 2, background: 'rgba(255,255,255,0.55)', borderRadius: 4 }} />
//           </div>

//           <div style={{ padding: '16px 20px 28px 20px' }}>
//             <h1 className="fade-up"
//           style={{
//             fontSize: 'clamp(32px, 5vw, 56px)',
//             lineHeight: 1.05,
//             fontWeight: 800,
//             margin: '6px 0 16px 0',
//             textShadow:
//               '0 0 18px rgba(59,130,246,0.35), 0 0 28px rgba(0,0,0,0.25)',
//           }}
//         >
//               The Future of Decentralized Rewards.
//               <br />
//               On‑Chain. Seamlessly.
//             </h1>

//             <p className="fade-up"
//           style={{
//             maxWidth: 780,
//             margin: '0 auto 28px auto',
//             color: 'rgba(230,230,233,0.85)',
//             fontSize: 'clamp(14px, 2vw, 18px)',
//           }}
//         >
//               Built on BlockDAG for unparalleled transparency and efficiency in predictive markets.
//             </p>

//             <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
//               <CTAButton tone="pink" href="/connect">Launch App</CTAButton>
//               <CTAButton tone="cyan" href="#docs">Explore Docs</CTAButton>
//             </div>
//           </div>

//           <div className="panel-stroke" />
//           <div className="panel-noise" aria-hidden="true" />
//           <div className="panel-sheen" aria-hidden="true" />
//           <div className="panel-glow" />
//         </div>
//       </section>
//       {/* END Main Hero Card Section */}

//       {/* NEW CONTENT SECTIONS ADDED BELOW THE MAIN CARD */}

//     </main>
//     </>
//   );
// }
