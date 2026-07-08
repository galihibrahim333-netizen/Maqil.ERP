import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '◉' },
  { to: '/orders', label: 'Pesanan', icon: '◌' },
  { to: '/products', label: 'Produk', icon: '◍' },
  { to: '/stock', label: 'Stok', icon: '◎' },
  { to: '/marketplace', label: 'Marketplace', icon: '◐' },
  { to: '/reports', label: 'Laporan', icon: '◑' },
  { to: '/settings', label: 'Pengaturan', icon: '◒' },
]

export function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const currentTitle = menuItems.find((item) => location.pathname.startsWith(item.to))?.label ?? 'Dashboard'

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <aside
          className={`flex flex-col border-r border-slate-200 bg-slate-950 text-slate-100 transition-all duration-300 ${
            isCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 font-semibold text-white">
                M
              </div>
              {!isCollapsed ? <div>
                <p className="text-sm font-semibold">maqil.ERP</p>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div> : null}
            </div>
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
            >
              {isCollapsed ? '>' : '<'}
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {!isCollapsed ? <span>{item.label}</span> : null}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-600">ERP Workspace</p>
              <h2 className="text-xl font-semibold text-slate-900">{currentTitle}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                Admin
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-semibold text-white">
                A
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
