import { Sun, Moon, Bell, LogOut } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const roleColor = { admin:'#3b82f6', marketing:'#f97316', ceo:'#22c55e' }
const roleLabel = { admin:'Admin', marketing:'Marketing', ceo:'CEO' }

export default function Topbar({ role, onLogout }) {
  const { dark, toggle } = useTheme()
  
  // Normalize role and provide fallbacks
  const normalizedRole = (role || 'admin').toLowerCase() === 'mkt' ? 'marketing' : (role || 'admin').toLowerCase()
  const rc = roleColor[normalizedRole] || roleColor.admin
  const label = roleLabel[normalizedRole] || 'Member'

  return (
    <div className="flex items-center justify-between px-6 h-14 bg-surface border-b border-bdr sticky top-0 z-[100] transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-2.5 font-display font-extrabold text-[17px] tracking-tight text-white">
        <div 
          className="w-7.5 h-7.5 rounded-lg flex items-center justify-center text-sm shadow-lg transition-all duration-300"
          style={{ 
            background: `linear-gradient(135deg, ${rc}, ${rc}99)`,
            boxShadow: `0 0 14px ${rc}55`
          }}
        >
          ✦
        </div>
        Ekanta
      </div>

      <div className="flex items-center gap-2.5">
        {/* Theme toggle */}
        <button 
          onClick={toggle} 
          className="w-[34px] h-[34px] rounded-lg bg-surface2 border border-bdr flex items-center justify-center cursor-pointer text-gray-400 hover:text-white transition-all duration-200"
        >
          {dark ? <Sun size={15}/> : <Moon size={15}/>}
        </button>

        {/* Notif */}
        <div className="relative w-[34px] h-[34px] rounded-lg bg-surface2 border border-bdr flex items-center justify-center cursor-pointer group">
          <Bell size={15} className="text-gray-400 group-hover:text-white transition-colors"/>
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border-1.5 border-surface"/>
        </div>

        {/* Role badge */}
        <div className="text-[12.5px] text-gray-400 px-2.5 py-1 rounded-lg bg-surface2 border border-bdr">
          <span style={{ color: rc }} className="font-semibold mr-1">●</span> {label}
        </div>

        {/* Avatar */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, ${rc}, ${rc}88)` }}
        >
          {label[0]}
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout} 
          className="w-[34px] h-[34px] rounded-lg bg-surface2 border border-bdr flex items-center justify-center cursor-pointer text-gray-400 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={15}/>
        </button>
      </div>
    </div>
  )
}
