

const ROLE_NAV = {
  admin: [
    { key:'dashboard',   icon:'📊', label:'Dashboard' },
    { key:'sales',       icon:'💼', label:'Sales Entry' },
    { key:'inventory',   icon:'📦', label:'Inventory' },
    { key:'payments',    icon:'💳', label:'Payments' },
    { key:'receivables', icon:'💰', label:'Receivables' },
    { key:'fabric',      icon:'🧵', label:'Fabric Orders' },
  ],
  marketing: [
      { key:'dashboard', icon:'📊', label:'Dashboard' },
      { key:'google',    icon:'🔍', label:'Google Ads' },
      { key:'meta',      icon:'🔵', label:'Meta Ads' },
      { key:'comm',      icon:'📩', label:'Communication Ads' },
    ],
    ceo: [
      { key:'dashboard',   icon:'📊', label:'Dashboard' },
      { key:'sales',       icon:'💼', label:'Sales Entry' },
      { key:'inventory',   icon:'📦', label:'Inventory' },
      { key:'payments',    icon:'💳', label:'Payments' },
      { key:'receivables', icon:'💰', label:'Receivables' },
      { key:'fabric',      icon:'🧵', label:'Fabric Orders' },
      { key:'google',        icon:'🔍', label:'Google Ads' },
      { key:'meta',          icon:'🔵', label:'Meta Ads' },
      { key:'comm',          icon:'📩', label:'Communication Ads' },
      { key:'team',          icon:'👥', label:'Team Members' },
    ],
}

const ROLE_COLOR = { admin:'#3b82f6', marketing:'#f97316', ceo:'#22c55e' }
const ROLE_BADGE = { admin:{ bg:'rgba(59,130,246,.18)', color:'#93c5fd' }, marketing:{ bg:'rgba(249,115,22,.18)', color:'#fdba74' }, ceo:{ bg:'rgba(34,197,94,.18)', color:'#86efac' } }
const ROLES = [
  { key:'admin',     icon:'🛠', label:'Admin' },
  { key:'marketing', icon:'📣', label:'Marketing' },
  { key:'ceo',       icon:'👔', label:'CEO' },
]

export default function Sidebar({ role, setRole, activeModule, setModule }) {
  const normalizedRole = (role || 'admin').toLowerCase() === 'mkt' ? 'marketing' : (role || 'admin').toLowerCase()
  const color = ROLE_COLOR[normalizedRole] || ROLE_COLOR.admin
  const nav   = ROLE_NAV[normalizedRole] || []

  return (
    <div className="w-[220px] bg-surface border-r border-bdr flex flex-col py-3 shrink-0 transition-colors duration-300">
      <SLabel className="mt-3">Modules</SLabel>
      <div className="flex-1 space-y-0.5">
        {nav.map(m => {
          const icon = m.icon
          const active = activeModule === m.key
          return (
            <div 
              key={m.key} 
              onClick={() => setModule(m.key)}
              className={`flex items-center gap-2.5 px-[18px] py-2.5 text-[13px] cursor-pointer transition-all duration-200 border-l-2 ${
                active 
                  ? 'text-white border-l-current bg-white/5' 
                  : 'text-gray-500 border-l-transparent hover:text-gray-300 hover:bg-white/[0.02]'
              }`}
              style={{ 
                borderLeftColor: active ? color : 'transparent',
                backgroundColor: active ? `${color}15` : undefined
              }}
            >
              <span className="text-sm w-3.5 flex items-center justify-center shrink-0">{icon}</span>
              <span className="font-medium">{m.label}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-auto px-[18px] py-3.5">
        <div className="text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">System status</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"/>
          <span className="text-[12px] text-gray-300 font-medium">Live · Real-time</span>
        </div>
      </div>
    </div>
  )
}

function SLabel({ children, className = "" }) {
  return (
    <div className={`text-[10px] font-bold tracking-[0.12em] text-gray-500 px-[18px] py-2 uppercase ${className}`}>
      {children}
    </div>
  )
}
