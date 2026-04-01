import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import {
  LayoutDashboard, Building2, Users, Calendar, CreditCard,
  BarChart2, Tag, Bell, Shield, Settings, LogOut,
  ChevronLeft, ChevronRight, Activity, TrendingUp,
  AlertTriangle, FileText, ToggleLeft, Star, MessageSquare
} from 'lucide-react';

const adminNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'turfs', label: 'Turf Management', icon: Building2 },
  { id: 'owners', label: 'Owner Management', icon: Shield },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'bookings', label: 'Booking Control', icon: Calendar },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'pricing', label: 'Dynamic Pricing', icon: TrendingUp },
  { id: 'coupons', label: 'Coupons & Offers', icon: Tag },
  { id: 'subscriptions', label: 'Subscriptions', icon: Star },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
  { id: 'fraud', label: 'Fraud Detection', icon: Shield },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'activity', label: 'Activity Logs', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children, activePage, setActivePage }) {
  const { currentUser, logout, adminStats, notifications } = useApp();
  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Desktop Only */}
        <aside className="hide-mobile" style={{
          width: collapsed ? 72 : 260,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 50, flexShrink: 0,
        }}>
          <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, fontWeight: 900, color: '#fff' }}>T</div>
            {!collapsed && <div><div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 18 }}>TURF<span style={{ color: '#8b5cf6' }}>X</span></div><div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>ADMIN PANEL</div></div>}
          </div>

          <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
            {adminNavItems.filter(i => !['notifications', 'activity'].includes(i.id)).map(item => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button key={item.id} onClick={() => setActivePage(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: collapsed ? '10px' : '10px 14px',
                    borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
                    color: active ? '#8b5cf6' : 'var(--text-secondary)',
                    fontWeight: active ? 700 : 500, fontSize: 13, marginBottom: 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderLeft: active ? '3px solid #8b5cf6' : '3px solid transparent',
                  }}>
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 8px' }}>
             <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 8, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--text-muted)' }}>
                {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span style={{ fontSize: 12 }}>Collapse</span></>}
             </button>
             <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px', color: 'var(--accent-red)', border: 'none', background: 'transparent', fontWeight: 600 }}>
                <LogOut size={18} /> {!collapsed && 'System Exit'}
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header - Responsive */}
          <header style={{ height: 64, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, zIndex: 40, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               {/* Brand on Mobile */}
               <div className="hide-desktop" style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #ef4444)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>T</div>
               <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{adminNavItems.find(i => i.id === activePage)?.label}</div>
                  <div className="hide-mobile" style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Super Administrator</div>
               </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               {adminStats.pendingTurfs > 0 && (
                 <button className="hide-mobile badge badge-orange" onClick={() => setActivePage('turfs')} style={{ fontSize: 9 }}>
                   {adminStats.pendingTurfs} PENDING
                 </button>
               )}
               <button onClick={() => setActivePage('notifications')} style={{ position: 'relative', padding: 8, background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                  <Bell size={20} />
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, background: 'var(--accent-red)', borderRadius: '50%', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>{unreadCount}</span>}
               </button>
               <div onClick={() => setProfileOpen(!profileOpen)} style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 10px rgba(139,92,246,0.3)' }}>
                  A
               </div>

               {profileOpen && (
                 <div className="animate-fade" style={{ position: 'absolute', top: 70, right: 20, width: 220, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '8px', zIndex: 100, boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
                       <div style={{ fontSize: 13, fontWeight: 800 }}>{currentUser?.name}</div>
                       <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{currentUser?.email}</div>
                    </div>
                    <button onClick={() => { setProfileOpen(false); setActivePage('activity'); }} style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                       <Activity size={14} /> System Logs
                    </button>
                    <button onClick={logout} style={{ width: '100%', padding: '10px', background: 'var(--accent-red)10', border: 'none', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--accent-red)', marginTop: 8, borderRadius: 8 }}>
                       Logout Session
                    </button>
                 </div>
               )}
            </div>
          </header>

          <main style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <nav className="hide-desktop" style={{ 
        height: 64, background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', 
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '0 8px', zIndex: 100 
      }}>
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'turfs', label: 'Venues', icon: Building2 },
          { id: 'analytics', label: 'Pulse', icon: BarChart2 },
          { id: 'settings', label: 'Config', icon: Settings },
        ].map(item => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                border: 'none', background: 'transparent',
                color: active ? '#8b5cf6' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{item.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#8b5cf6', marginTop: 1 }}></div>}
            </button>
          );
        })}
      </nav>
    </div>

  );
}
