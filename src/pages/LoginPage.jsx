import { useState, useEffect, useRef } from 'react'
import { signIn, supabase, getUserProfile, signUpTeamMember, isConfigured } from '../lib/supabase'

const ROLES = [
  { key:'admin',     label:'Admin',     icon:'🛠', color:'#4f9cf9', glow:'rgba(79,156,249,0.3)',  soft:'rgba(79,156,249,0.08)',  desc:'Inventory · Sales · Payments · Suppliers' },
  { key:'marketing', label:'Marketing', icon:'📣', color:'#ff8c42', glow:'rgba(255,140,66,0.3)',  soft:'rgba(255,140,66,0.08)',  desc:'Ads · Revenue · Campaigns · ROAS' },
  { key:'ceo',       label:'CEO',       icon:'👔', color:'#2ecf8e', glow:'rgba(46,207,142,0.3)', soft:'rgba(46,207,142,0.08)', desc:'Full access · Investments · Decisions' },
]

export default function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [role, setRole]         = useState('admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [focused, setFocused]   = useState(null)
  const [mounted, setMounted]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [slowConn, setSlowConn] = useState(false)
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  const R = ROLES.find(r => r.key === role)

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t) }, [])

  // particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width  = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight
    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
    window.addEventListener('resize', onResize)
    const pts = Array.from({ length: 24 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.4,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15,
      o: Math.random() * 0.4 + 0.08,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const baseColor = R.color
      pts.forEach(p => {
        p.x = (p.x + p.dx + W) % W
        p.y = (p.y + p.dy + H) % H
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = baseColor + Math.floor(p.o * 255).toString(16).padStart(2,'0')
        ctx.fill()
      })
      
      const maxDistSq = 85 * 85
      for (let i = 0; i < pts.length; i++) {
        const p1 = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j]
          const dx = p1.x - p2.x, dy = p1.y - p2.y
          const dSq = dx * dx + dy * dy
          if (dSq < maxDistSq) {
            const d = Math.sqrt(dSq)
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = baseColor + Math.floor((1 - d / 85) * 18).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize) }
  }, [role])

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSlowConn(false)
    
    if (!isConfigured) {
      return setError('Supabase not configured. Please check your .env file.')
    }

    const cleanUsername = username.trim()
    const cleanName = name.trim()
    const internalEmail = `${cleanUsername}@ekanta.bizcore`
    
    if (!cleanUsername) return setError('Please enter your username.')
    if (!password) return setError('Please enter your password.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (isSignUp && !cleanName) return setError('Please enter your full name.')
    
    setLoading(true)
    let isSuccess = false
    
    // Safety timeouts
    const slowId = setTimeout(() => setSlowConn(true), 8000)
    const abortId = setTimeout(() => {
      if (!success) {
        setLoading(false)
        setError('Connection timed out. Please check your network.')
      }
    }, 45000)

    try {
      console.log('[Auth] Attempting login for:', cleanUsername)
      
      // 1. Check if table 'users' exists and find user by username
      const { data: userProfile, error: dbErr } = await supabase
        .from('users')
        .select('*')
        .eq('username', cleanUsername)
        .maybeSingle()

      if (dbErr) {
        console.error('[Auth] Database error:', dbErr)
        throw new Error(`Database connection failed: ${dbErr.message}`)
      }

      if (!userProfile) {
        console.warn('[Auth] User not found:', cleanUsername)
        throw new Error('Username not found. Please check your spelling or register the account.')
      }

      // 2. Validate password
      if (userProfile.password !== password) {
        console.warn('[Auth] Incorrect password for:', cleanUsername)
        throw new Error('Incorrect password. Please try again.')
      }

      console.log('[Auth] Login successful for:', userProfile.username)
      
      // Save session locally
      localStorage.setItem('bizcore_user', JSON.stringify(userProfile))
      
      clearTimeout(slowId); clearTimeout(abortId)
      isSuccess = true
      setSuccess(true)
      
      // Redirect after a tiny delay for visual feedback
      setTimeout(() => {
        onLogin(userProfile.role.toLowerCase())
      }, 600)

    } catch (err) {
      clearTimeout(slowId); clearTimeout(abortId)
      console.error('[Auth] Error:', err.message)
      setError(err.message || 'Authentication failed.')
    } finally {
      if (!isSuccess) setLoading(false)
    }
  }

  const s = (base, extra={}) => ({
    ...base, transition:'all 0.3s ease', ...extra
  })

  return (
    <div style={{ minHeight:'100vh', background:'#06080e', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', fontFamily:"'Jost',sans-serif" }}>

      {/* canvas */}
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }} />

      {/* orbs */}
      {[
        { w:600, h:600, top:-180, left:-180, delay:'0s' },
        { w:440, h:440, bottom:-120, right:-120, delay:'-5s' },
        { w:320, h:320, bottom:'15%', left:'32%', delay:'-9s' },
      ].map((o, i) => (
        <div key={i} style={{
          position:'fixed', width:o.w, height:o.h, borderRadius:'50%',
          background: `radial-gradient(circle, ${R.glow}, transparent 70%)`,
          top:o.top, left:o.left, bottom:o.bottom, right:o.right,
          filter:'blur(60px)', zIndex:0, pointerEvents:'none',
          animation:`drift${i} ${10+i*2}s ease-in-out infinite alternate`,
          opacity: i===2 ? 0.6 : 1,
          transition:'background 0.5s ease',
        }} />
      ))}

      <style>{`
        @keyframes drift0{0%{transform:translate(0,0)}100%{transform:translate(25px,18px)}}
        @keyframes drift1{0%{transform:translate(0,0)}100%{transform:translate(-20px,25px)}}
        @keyframes drift2{0%{transform:translate(0,0)}100%{transform:translate(15px,-15px)}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
        @keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ekanta-input:focus{outline:none}
      `}</style>

      {/* CARD */}
      <div style={{
        position:'relative', zIndex:10, width:'100%', maxWidth:1080,
        display:'flex', borderRadius:24, overflow:'hidden',
        border:'1px solid rgba(255,255,255,0.07)',
        background:'rgba(7,9,16,0.78)', backdropFilter:'blur(20px)',
        boxShadow:'0 48px 140px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'none' : 'translateY(20px)',
        transition:'opacity 0.5s ease, transform 0.5s ease',
        minHeight: 620,
      }}>

        {/* ── LEFT ── */}
        <div style={{ flex:1, padding:'52px 48px', display:'flex', flexDirection:'column', borderRight:'1px solid rgba(255,255,255,0.06)', position:'relative', overflow:'hidden' }}>

          {/* decorative rings */}
          {[[500,500,-210,-210],[300,300,null,-70,null,-80]].map(([w,h,t,l,b,r],i) => (
            <div key={i} style={{ position:'absolute', width:w, height:h, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.035)', pointerEvents:'none', top:t, left:l, bottom:b, right:r }} />
          ))}

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:52 }}>
            <div style={{
              width:44, height:44, borderRadius:13,
              background:`linear-gradient(135deg, ${R.color}, #2ecf8e)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:20, boxShadow:`0 0 32px ${R.glow}`,
              transition:'box-shadow 0.4s, background 0.4s',
            }}>✦</div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, letterSpacing:'.04em', color:'#f0f2fa' }}>Ekanta</div>
              <div style={{ fontSize:10.5, color:'#3a4058', letterSpacing:'.12em', textTransform:'uppercase' }}>Business Intelligence</div>
            </div>
          </div>

          {/* Hero */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:24, height:1, background:R.color, transition:'background 0.3s' }} />
            <span style={{ fontSize:11, fontWeight:500, letterSpacing:'.18em', textTransform:'uppercase', color:R.color, transition:'color 0.3s' }}>Unified Command Center</span>
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:48, fontWeight:700, lineHeight:1.07, letterSpacing:'-.5px', marginBottom:18, color:'#f0f2fa' }}>
            One platform.<br />
            <em style={{ fontStyle:'italic', background:`linear-gradient(120deg, ${R.color}, #2ecf8e)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', transition:'all 0.4s' }}>
              Every insight.
            </em>
          </h1>
          <p style={{ fontSize:14, color:'#4a5168', lineHeight:1.8, maxWidth:340, marginBottom:44 }}>
            Ekanta brings your Admin operations, Marketing performance, and CEO-level intelligence into a single, beautifully designed workspace.
          </p>

          {/* ROLE CARDS */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {ROLES.map((r, i) => {
              const active = r.key === role
              return (
                <div key={r.key} onClick={() => setRole(r.key)}
                  style={{
                    display:'flex', alignItems:'center', gap:12,
                    padding:'11px 14px', borderRadius:12, cursor:'pointer',
                    border:`1px solid ${active ? r.color+'55' : 'rgba(255,255,255,0.05)'}`,
                    background: active ? r.soft : 'rgba(255,255,255,0.015)',
                    transition:'all 0.22s ease',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'none' : 'translateY(10px)',
                    transitionDelay:`${0.4 + i*0.08}s`,
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor='rgba(255,255,255,0.1)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor='rgba(255,255,255,0.05)' }}
                >
                  <div style={{
                    width:36, height:36, borderRadius:9, fontSize:16, flexShrink:0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background: active ? r.soft : 'rgba(255,255,255,0.04)',
                    border:`1px solid ${active ? r.color+'44' : 'rgba(255,255,255,0.06)'}`,
                    transition:'all 0.22s',
                  }}>{r.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500, color: active ? r.color : '#dde3f0', transition:'color 0.2s' }}>{r.label}</div>
                    <div style={{ fontSize:11.5, color:'#3a4058' }}>{r.desc}</div>
                  </div>
                  <div style={{
                    width:6, height:6, borderRadius:'50%', flexShrink:0,
                    background:r.color, boxShadow:`0 0 8px ${r.color}`,
                    opacity: active ? 1 : 0, transition:'opacity 0.2s',
                  }} />
                </div>
              )
            })}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={{ width:430, flexShrink:0, padding:'52px 44px', display:'flex', flexDirection:'column', justifyContent:'center' }}>

          {success ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:16, animation:'fadeSlideUp 0.4s ease' }}>
              <div style={{
                width:76, height:76, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:30, background:`radial-gradient(circle, ${R.glow}, ${R.color}22)`,
                border:`1px solid ${R.color}55`, color:R.color,
                animation:'popIn 0.45s cubic-bezier(.34,1.56,.64,1) both',
              }}>✓</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:700, color:'#f0f2fa' }}>Welcome, {R.label}</div>
              <div style={{ fontSize:14, color:'#4a5168' }}>Loading your {R.label} dashboard…</div>
            </div>
          ) : (
            <>
              {/* Badge */}
              <div style={{
                display:'inline-flex', alignItems:'center', gap:6,
                padding:'4px 12px', borderRadius:999, marginBottom:18,
                fontSize:11.5, fontWeight:500,
                background:R.soft, border:`1px solid ${R.color}33`, color:R.color,
                transition:'all 0.3s',
              }}>{R.icon} Signing in as {R.label}</div>

              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:700, letterSpacing:'-.3px', color:'#f0f2fa', marginBottom:6 }}>{isSignUp ? 'Create account' : 'Welcome back'}</div>
              <div style={{ fontSize:13.5, color:'#4a5168', marginBottom:28 }}>{isSignUp ? 'Join the Ekanta workspace' : 'Access your Ekanta dashboard'}</div>

              <form onSubmit={handleSubmit}>
                {/* Full Name (Sign Up only) */}
                {isSignUp && (
                  <Field label="Full Name">
                    <InputWrap icon="👤">
                      <input className="ekanta-input" type="text" placeholder="John Doe"
                        value={name} onChange={e => setName(e.target.value)}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                        style={inputStyle(focused==='name', R.color, R.glow)} />
                    </InputWrap>
                  </Field>
                )}

                {/* Username */}
                <Field label="Username">
                  <InputWrap icon="@">
                    <input className="ekanta-input" type="text" placeholder="Enter username"
                      autoCapitalize="none" autoComplete="username"
                      value={username} onChange={e => setUsername(e.target.value)}
                      onFocus={() => setFocused('username')} onBlur={() => setFocused(null)}
                      style={inputStyle(focused==='username', R.color, R.glow)} />
                  </InputWrap>
                </Field>

                {/* Password */}
                <Field label="Password" right={!isSignUp && <span style={{ fontSize:12, color:R.color, cursor:'pointer' }}>Forgot password?</span>}>
                  <InputWrap icon="🔒">
                    <input className="ekanta-input" type={showPass ? 'text' : 'password'} placeholder={isSignUp ? "Min 6 characters" : "Enter your password"}
                      value={password} onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)}
                      style={{ ...inputStyle(focused==='pass', R.color, R.glow), paddingRight:44 }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:14, opacity:.35, padding:4 }}>
                      {showPass ? '🙈' : '👁'}
                    </button>
                  </InputWrap>
                </Field>

                {/* Error */}
                {error && (
                  <div style={{ background:'rgba(239,68,68,.07)', border:'1px solid rgba(239,68,68,.2)', borderRadius:9, padding:'10px 14px', fontSize:13, color:'#fca5a5', display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
                    ⚠ {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading}
                  style={{
                    width:'100%', padding:14, borderRadius:11, border:'none',
                    fontSize:15, fontWeight:600, fontFamily:"'Jost',sans-serif",
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color:'#fff', letterSpacing:'.02em', marginTop:8,
                    display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                    background:`linear-gradient(135deg, ${R.color}, ${R.color}bb)`,
                    boxShadow: loading ? 'none' : `0 4px 28px ${R.glow}`,
                    opacity: loading ? .65 : 1,
                    transition:'all 0.25s ease',
                  }}
                  onMouseEnter={e => { if(!loading) e.currentTarget.style.transform='translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none' }}
                >
                  {loading ? <><Spinner />{slowConn ? 'Slow connection…' : 'Please wait…'}</> : <>{'Sign in to Ekanta →'}</>}
                </button>
              </form>

              {/* Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:12, margin:'22px 0' }}>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.18)' }}>or continue with</span>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
              </div>

              {/* SSO */}
              <div style={{ display:'flex', gap:8 }}>
                {['🔵 Google SSO','⬛ Microsoft'].map(label => (
                  <button key={label} type="button"
                    style={{ flex:1, padding:'10px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.35)', fontSize:12.5, fontFamily:"'Jost',sans-serif", cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, transition:'all 0.18s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.7)' }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.color='rgba(255,255,255,0.35)' }}
                  >{label}</button>
                ))}
              </div>

              <p style={{ fontSize:12, color:'#3a4058', textAlign:'center', marginTop:24, lineHeight:1.7 }}>
                Secured by enterprise-grade encryption.<br />
                <span style={{ color:R.color, cursor:'pointer' }}>Contact your administrator</span> for access issues.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, right, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <label style={{ fontSize:11, fontWeight:500, letterSpacing:'.12em', textTransform:'uppercase', color:'#3a4058' }}>{label}</label>
        {right}
      </div>
      {children}
    </div>
  )
}

function InputWrap({ icon, children }) {
  return (
    <div style={{ position:'relative' }}>
      <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:14, opacity:.35, pointerEvents:'none' }}>{icon}</span>
      {children}
    </div>
  )
}

function inputStyle(focused, color, glow) {
  return {
    width:'100%', padding:'13px 14px 13px 40px',
    background:'#070910',
    border:`1px solid ${focused ? color+'80' : 'rgba(255,255,255,0.07)'}`,
    borderRadius:11, fontSize:14, color:'#e8eaf2',
    fontFamily:"'Jost',sans-serif",
    boxShadow: focused ? `0 0 0 3px ${glow}` : 'none',
    transition:'all 0.2s ease',
  }
}

function Spinner() {
  return (
    <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite' }} />
  )
}
