import { useState, useEffect, useRef } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { supabase, getCurrentUser, getUserProfile, signOut } from './lib/supabase'
import LoginPage from './pages/LoginPage'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import AdminDashboard from './pages/AdminDashboard'
import MarketingDashboard from './pages/MarketingDashboard'
import CeoDashboard from './pages/CeoDashboard'

function AppInner() {
  const { dark } = useTheme()
  const [loggedIn, setLoggedIn]   = useState(false)
  const [role, setRole]           = useState(null)
  const [activeModule, setModule] = useState('dashboard')
  const [activeView, setActiveView] = useState('overview')
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initAuth = async () => {
      console.log('[Auth] Initializing simple session...');
      
      try {
        const storedUser = localStorage.getItem('bizcore_user')
        if (storedUser) {
          const profile = JSON.parse(storedUser)
          console.log('[Auth] Stored user found:', profile.username)
          
          // Verify with DB that user still exists
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', profile.id)
            .maybeSingle()
          
          if (data) {
            setUser(data)
            setRole(data.role.toLowerCase())
            setLoggedIn(true)
          } else {
            console.warn('[Auth] Stored user no longer exists in DB.')
            localStorage.removeItem('bizcore_user')
          }
        }
      } catch (err) {
        console.error('[Auth] Session recovery error:', err)
      } finally {
        setLoading(false)
      }
    };

    initAuth();
  }, [])

  const handleLogin = (userRole) => {
    setRole(userRole)
    setLoggedIn(true)
  }

  const handleRoleChange = (r) => { 
    setRole(r)
    setModule('dashboard')
    setActiveView('overview')
  }

  const handleModuleChange = (m) => {
    setModule(m)
    // If CEO clicks a module, automatically switch to the correct view
    if (role === 'ceo') {
      const ADMIN_MODS = ['sales', 'inventory', 'payments', 'receivables', 'fabric']
      const MKT_MODS = ['google', 'meta', 'roi']
      
      if (ADMIN_MODS.includes(m)) {
        setActiveView('admin')
      } else if (MKT_MODS.includes(m)) {
        setActiveView('marketing')
      } else {
        setActiveView('overview')
      }
    }
  }

  const handleLogout = async () => { 
    console.log('[Auth] Logging out...');
    localStorage.removeItem('bizcore_user')
    setUser(null)
    setLoggedIn(false)
    setRole(null)
    setModule('dashboard')
    setActiveView('overview')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080e] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!loggedIn) {
    return <LoginPage onLogin={(r) => { setRole(r); setModule('dashboard'); setLoggedIn(true) }} />
  }

  // Define strict rendering logic for the main content area
  const renderDashboard = () => {
    if (role === 'admin') {
      return <AdminDashboard activeModule={activeModule} onRoleChange={handleRoleChange} loggedInRole={role} activeView={activeView} setActiveView={setActiveView} />
    }

    if (role === 'marketing') {
      return <MarketingDashboard activeModule={activeModule} onRoleChange={handleRoleChange} loggedInRole={role} activeView={activeView} setActiveView={setActiveView} />
    }

    if (role === 'ceo') {
      return (
        <div className="space-y-6">
          {/* CEO View Navigation Tabs - Rendered ONLY for CEO */}
          <div className="flex items-center bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-1 w-fit mb-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'admin', label: 'Admin' },
              { id: 'marketing', label: 'Marketing' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id)
                  setModule('dashboard') // Reset to main dashboard view when switching tabs
                }}
                className={`px-6 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeView === tab.id 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Strict Conditional Rendering: ONLY ONE dashboard at a time */}
          {activeView === 'overview' && (
            <CeoDashboard activeModule={activeModule} onRoleChange={handleRoleChange} loggedInRole={role} activeView={activeView} setActiveView={setActiveView} />
          )}
          {activeView === 'admin' && (
            <AdminDashboard activeModule={activeModule} onRoleChange={handleRoleChange} loggedInRole={role} activeView={activeView} setActiveView={setActiveView} />
          )}
          {activeView === 'marketing' && (
            <MarketingDashboard activeModule={activeModule} onRoleChange={handleRoleChange} loggedInRole={role} activeView={activeView} setActiveView={setActiveView} />
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--bg)', transition:'background .3s' }}>
      <Topbar role={role} onLogout={handleLogout} />
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar role={role} setRole={handleRoleChange} activeModule={activeModule} setModule={handleModuleChange} />
        <main style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          {renderDashboard()}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <ThemeProvider><AppInner /></ThemeProvider>
}
