import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './store/AppContext';
import { Shield, Building2, User } from 'lucide-react';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Layouts
import UserLayout from './components/UserLayout';
import OwnerLayout from './components/OwnerLayout';
import AdminLayout from './components/AdminLayout';

// User Pages
import HomePage from './pages/user/HomePage';
import TurfListingPage from './pages/user/TurfListingPage';
import TurfDetailPage from './pages/user/TurfDetailPage';
import BookingsPage from './pages/user/BookingsPage';
import ProfilePage from './pages/user/ProfilePage';
import SubscriptionPage from './pages/user/SubscriptionPage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyTurfsPage from './pages/owner/MyTurfsPage';
import SlotManagementPage from './pages/owner/SlotManagementPage';
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage';
import EarningsPage from './pages/owner/EarningsPage';
import OwnerSettings from './pages/owner/OwnerSettings';
import SubscriptionsPage from './pages/owner/SubscriptionsPage';
import ReviewsPage from './pages/owner/ReviewsPage';
import AnalyticsPage from './pages/owner/AnalyticsPage';
import PromotionsPage from './pages/owner/PromotionsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTurfManagement from './pages/admin/AdminTurfManagement';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReports from './pages/admin/AdminReports';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminFraud from './pages/admin/AdminFraud';
import AdminDisputes from './pages/admin/AdminDisputes';
import AdminPricing from './pages/admin/AdminPricing';
import AdminActivityLogs from './pages/admin/AdminActivityLogs';

// Shared
import NotificationsPage from './pages/shared/NotificationsPage';
import ToastContainer from './components/ToastContainer';

// Admin Bookings / Payments placeholder
const AdminBookings = () => {
  const { bookings, cancelBooking } = useApp();
  const sorted = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Booking Control Center</h1>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>ID</th><th>Turf</th><th>User</th><th>Date</th><th>Time</th><th>Amount</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {sorted.map(b => (
              <tr key={b.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>#{b.id}</td>
                <td style={{ fontSize: 13, fontWeight: 500 }}>{b.turfName}</td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.userId}</td>
                <td style={{ fontSize: 12 }}>{b.date}</td>
                <td style={{ fontSize: 12 }}>{b.startTime}–{b.endTime}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-green)' }}>₹{b.amount}</td>
                <td><span className={`badge badge-${b.paymentStatus === 'paid' ? 'green' : b.paymentStatus === 'refunded' ? 'blue' : 'yellow'}`}>{b.paymentStatus}</span></td>
                <td><span className={`badge badge-${b.status === 'confirmed' ? 'green' : b.status === 'completed' ? 'blue' : 'red'}`}>{b.status}</span></td>
                <td>{b.status === 'confirmed' && <button className="btn btn-danger btn-sm" onClick={() => cancelBooking(b.id)}>Cancel</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const Placeholder = ({ title, icon }) => (
  <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
    <div style={{ fontSize: 56, marginBottom: 16 }}>{icon}</div>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>{title}</h2>
    <p style={{ fontSize: 14 }}>This section is ready for further development</p>
  </div>
);


// Gateway Component for "SuperSystem" Hub
function Gateway() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg, var(--accent-green), #00a854)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#000', boxShadow: '0 0 40px rgba(0,230,118,0.4)' }}>T</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 36, letterSpacing: -1, lineHeight: 1 }}>TURF<span style={{ color: 'var(--accent-green)' }}>X</span></div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 2 }}>SUPERSYSTEM LOCALHOST</div>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500 }}>Select a subsystem below. Each operates on a dedicated sub-link while sharing the unified platform backend.</p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/app" style={{ textDecoration: 'none' }}>
          <div style={{ width: 260, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s', cursor: 'pointer' }} className="hover-lift">
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: 'var(--accent-green)' }}>
              <User size={32} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Player App</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>localhost:5173/app</p>
          </div>
        </Link>
        <Link to="/owner" style={{ textDecoration: 'none' }}>
          <div style={{ width: 260, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s', cursor: 'pointer' }} className="hover-lift">
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(91,141,239,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#5b8def' }}>
              <Building2 size={32} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Owner Portal</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>localhost:5173/owner</p>
          </div>
        </Link>
        <Link to="/admin" style={{ textDecoration: 'none' }}>
          <div style={{ width: 260, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s', cursor: 'pointer' }} className="hover-lift">
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#8b5cf6' }}>
              <Shield size={32} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Admin System</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>localhost:5173/admin</p>
          </div>
        </Link>
      </div>
    </div>
  );
}


function DeploymentPort() {
  const { initialized } = useApp();
  const deployTarget = (import.meta.env.VITE_DEPLOY_TARGET || '').toLowerCase(); // 'user' | 'owner' | 'admin' | ''

  if (!initialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
         <div className="status-dot online" style={{ width: 12, height: 12, boxShadow: '0 0 20px var(--accent-green)' }} />
         <div style={{ marginLeft: 12, fontSize: 13, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 1 }}>INITIATING_TURFX_PROTOCOLS...</div>
      </div>
    );
  }

  // PORTAL SELECTION BASED ON DEPLOY TARGET
  switch (deployTarget) {
    case 'user': return <SubSystemAuth role="user"><UserApp /></SubSystemAuth>;
    case 'owner': return <SubSystemAuth role="owner"><OwnerApp /></SubSystemAuth>;
    case 'admin': return <SubSystemAuth role="admin"><AdminApp /></SubSystemAuth>;
    default: return <Gateway />;
  }
}

function SubSystemAuth({ role, children }) {
  const { currentUser, session, signOut } = useApp();
  
  // 1. Not Authenticated: Force Login for specific role
  if (!session || !currentUser) {
    return <LoginPage overrideRole={role} />;
  }

  // 2. Authenticated but WRONG ROLE: Access Denied
  if (currentUser.role !== role) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20 }}>
        <div className="card animate-fade" style={{ maxWidth: 400, textAlign: 'center', padding: 40, border: '1px solid var(--accent-red)' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Shield size={40} strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>Your operative profile (<b>{currentUser.role.toUpperCase()}</b>) is not authorized to access the <b>{role.toUpperCase()}</b> deployment center.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
             <button className="btn btn-primary" style={{ height: 50, fontWeight: 800 }} onClick={() => window.location.href = '/'}>RETURN_TO_BASE</button>
             <button className="btn btn-ghost" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-red)' }} onClick={signOut}>TERMINATE_SESSION</button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

// User Panel
function UserApp() {
  const [page, setPage] = useState('home');
  const [selectedTurf, setSelectedTurf] = useState(null);

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage setActivePage={setPage} setSelectedTurf={setSelectedTurf} />;
      case 'turfs': return <TurfListingPage setActivePage={setPage} setSelectedTurf={setSelectedTurf} />;
      case 'turfdetail': return <TurfDetailPage turf={selectedTurf} setActivePage={setPage} />;
      case 'bookings': return <BookingsPage setActivePage={setPage} setSelectedTurf={setSelectedTurf} />;
      case 'subscription': return <SubscriptionPage />;
      case 'profile': return <ProfilePage />;
      case 'notifications': return <NotificationsPage />;
      default: return <HomePage setActivePage={setPage} setSelectedTurf={setSelectedTurf} />;
    }
  };

  return (
    <UserLayout activePage={page} setActivePage={setPage}>
      <div className="animate-fade">{renderPage()}</div>
    </UserLayout>
  );
}

// Owner Panel
function OwnerApp() {
  const [page, setPage] = useState('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <OwnerDashboard setActivePage={setPage} />;
      case 'myturfs': return <MyTurfsPage setActivePage={setPage} />;
      case 'slots': return <SlotManagementPage />;
      case 'bookings': return <OwnerBookingsPage />;
      case 'earnings': return <EarningsPage />;
      case 'customers': return <SubscriptionsPage />;
      case 'reviews': return <ReviewsPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'promotions': return <PromotionsPage />;
      case 'notifications': return <NotificationsPage />;
      case 'settings': return <OwnerSettings />;
      default: return <OwnerDashboard setActivePage={setPage} />;
    }
  };

  return (
    <OwnerLayout activePage={page} setActivePage={setPage}>
      <div className="animate-fade">{renderPage()}</div>
    </OwnerLayout>
  );
}

// Admin Panel
function AdminApp() {
  const [page, setPage] = useState('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <AdminDashboard setActivePage={setPage} />;
      case 'turfs': return <AdminTurfManagement setActivePage={setPage} />;
      case 'owners': return <AdminUserManagement roleType="owner" />;
      case 'users': return <AdminUserManagement roleType="user" />;
      case 'bookings': return <AdminBookings />;
      case 'payments': return <AdminPayments />;
      case 'analytics': return <AdminAnalytics />;
      case 'coupons': return <AdminCoupons />;
      case 'notifications': return <NotificationsPage />;
      case 'pricing': return <AdminPricing />;
      case 'subscriptions': return <AdminSubscriptions />;
      case 'disputes': return <AdminDisputes />;
      case 'fraud': return <AdminFraud />;
      case 'reports': return <AdminReports />;
      case 'activity': return <AdminActivityLogs />;
      case 'settings': return <AdminSettings />;
      default: return <AdminDashboard setActivePage={setPage} />;
    }
  };

  return (
    <AdminLayout activePage={page} setActivePage={setPage}>
      <div className="animate-fade">{renderPage()}</div>
    </AdminLayout>
  );
}

// Root
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DeploymentPort />} />
        
        {/* Shared Subsystem Routes (Local Gateway & Deep Links) */}
        <Route path="/app/*" element={
          <SubSystemAuth role="user">
            <UserApp />
          </SubSystemAuth>
        } />
        
        {/* Owner Portal Subsystem */}
        <Route path="/owner/*" element={
          <SubSystemAuth role="owner">
            <OwnerApp />
          </SubSystemAuth>
        } />
        
        {/* Admin Portal Subsystem */}
        <Route path="/admin/*" element={
          <SubSystemAuth role="admin">
            <AdminApp />
          </SubSystemAuth>
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
