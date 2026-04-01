import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  mockUsers, mockOwners, mockTurfs, mockBookings,
  mockPayments, mockCoupons, mockNotifications, mockReviews,
  generateSlots
} from '../data/mockData';

const AppContext = createContext(null);

const LOGGED_IN_USER = { id: 'u1', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 98765 43210', role: 'user', subscription: 'premium', avatar: '👤' };
const LOGGED_IN_OWNER = { id: 'o1', name: 'Vikram Shetty', email: 'vikram@turfpro.com', phone: '+91 90000 11111', role: 'owner', avatar: '🏢' };
const LOGGED_IN_ADMIN = { id: 'admin1', name: 'Super Admin', email: 'admin@turfx.com', phone: '+91 00000 00000', role: 'admin', avatar: '👑' };

const allSlots = {};
mockTurfs.forEach(t => {
  allSlots[t.id] = generateSlots(t.id, t.courts);
});

export const AppProvider = ({ children }) => {
  const [currentPanel, setCurrentPanel] = useState('login'); // 'login' | 'user' | 'owner' | 'admin'
  const [currentUser, setCurrentUser] = useState(null);

  const [turfs, setTurfs] = useState(mockTurfs);
  const [users, setUsers] = useState([...mockUsers, ...mockOwners]);
  const [bookings, setBookings] = useState(mockBookings);
  const [payments, setPayments] = useState(mockPayments);
  const [slots, setSlots] = useState(allSlots);
  const [coupons, setCoupons] = useState(mockCoupons);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [reviews, setReviews] = useState(mockReviews);
  const [userLocation, setUserLocation] = useState('Kilpauk, Chennai');
  const [notificationEmail, setNotificationEmail] = useState('admin@turfx.com');
  const [toasts, setToasts] = useState([]);
  const [activityLogs, setActivityLogs] = useState([
    { id: 'LOG-8821', user: 'Admin (Rohan)', action: 'System Credentials Updated', category: 'security', time: '2 mins ago', status: 'success', details: 'Changed primary admin password and updated 2-step verification hash.' },
    { id: 'LOG-8819', user: 'Platform Engine', action: 'Fraud Alert Triggered', category: 'security', time: '12 mins ago', status: 'warning', details: 'User ID 9928 flagged for massive cancellation rate (>85%).' },
    { id: 'LOG-8815', user: 'Admin (Rohan)', action: 'Approved Turf: "Sky Arena"', category: 'management', time: '45 mins ago', status: 'success', details: 'Manually verified documents and activated venue listing.' },
    { id: 'LOG-8802', user: 'Automated Bot', action: 'Premium Subscription Renewal', category: 'financial', time: '1 hour ago', status: 'success', details: 'Successfully processed 12 recurring payments for Tier 1 users.' },
    { id: 'LOG-8798', user: 'Admin (Rohan)', action: 'User Banned: Sneha P.', category: 'user', time: '3 hours ago', status: 'danger', details: 'Indefinite suspension issued due to repeated payment disputes.' },
  ]);

  const [pricingRules, setPricingRules] = useState({
    weekendSurge: { active: true, multiplier: 1.20 },
    peakHourSurge: { active: true, multiplier: 1.15 },
    weatherDiscount: { active: false, multiplier: 0.85 },
    lowOccupancyDrop: { active: true, multiplier: 0.90 },
  });

  // Persist State to LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('turfx_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.turfs) setTurfs(parsed.turfs);
      if (parsed.bookings) setBookings(parsed.bookings);
      if (parsed.slots) setSlots(parsed.slots);
      if (parsed.pricingRules) setPricingRules(parsed.pricingRules);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.notifications) setNotifications(parsed.notifications);
    }
  }, []);

  useEffect(() => {
    const state = { turfs, bookings, slots, pricingRules, users, notifications };
    localStorage.setItem('turfx_state', JSON.stringify(state));
  }, [turfs, bookings, slots, pricingRules, users, notifications]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'turfx_state' && e.newValue) {
        const parsed = JSON.parse(e.newValue);
        setTurfs(parsed.turfs);
        setBookings(parsed.bookings);
        setSlots(parsed.slots);
        setPricingRules(parsed.pricingRules);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // PRICING CALCULATOR
  const calculateEffectivePrice = useCallback((basePrice) => {
    let multiplier = 1.0;
    if (pricingRules.weekendSurge.active) multiplier *= pricingRules.weekendSurge.multiplier;
    if (pricingRules.peakHourSurge.active) multiplier *= pricingRules.peakHourSurge.multiplier;
    if (pricingRules.weatherDiscount.active) multiplier *= pricingRules.weatherDiscount.multiplier;
    return Math.round(basePrice * multiplier);
  }, [pricingRules]);

  // Toast system
  const addToast = useCallback((type, title, message) => {
    const id = Date.now().toString();
    setToasts(p => [...p, { id, type, title, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  const addActivity = useCallback((action, category, details, user = 'System', status = 'success') => {
    const newLog = {
      id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
      user,
      action,
      category,
      details,
      status,
      time: 'Just now'
    };
    setActivityLogs(p => [newLog, ...p].slice(0, 50)); // Keep last 50
  }, []);

  const addNotification = useCallback((type, title, message, sub = '') => {
    const newNotif = {
      id: `n${Date.now()}`,
      type,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(p => [newNotif, ...p]);
    
    // Simulate Email Dispatch for Important Alerts
    if (['booking', 'payment', 'security', 'alert'].includes(type) || true) {
      console.log(`[SIMULATED EMAIL DISPATCH] To: ${notificationEmail} | Subject: ${title} | Body: ${message}`);
    }
  }, [notificationEmail, addToast]);

  // Auth
  const login = (role) => {
    if (role === 'user') { setCurrentUser(LOGGED_IN_USER); setCurrentPanel('user'); }
    else if (role === 'owner') { setCurrentUser(LOGGED_IN_OWNER); setCurrentPanel('owner'); }
    else if (role === 'admin') { setCurrentUser(LOGGED_IN_ADMIN); setCurrentPanel('admin'); }
    addToast('success', 'Welcome Back!', `Logged in as ${role}`);
  };
  const logout = () => {
    setCurrentUser(null);
    setCurrentPanel('login');
    addToast('info', 'Logged Out', 'See you next time!');
  };

  // TURF CRUD
  const addTurf = (turf) => {
    const newTurf = { ...turf, id: `t${Date.now()}`, status: 'pending', createdAt: new Date().toISOString().split('T')[0], rating: 0, reviewCount: 0, images: [] };
    setTurfs(p => [...p, newTurf]);
    setSlots(p => ({ ...p, [newTurf.id]: generateSlots(newTurf.id, newTurf.courts) }));
    addActivity(`New Turf Applied: "${newTurf.name}"`, 'management', `Venue located in ${newTurf.location} is awaiting admin approval.`, currentUser?.name || 'Owner', 'warning');
    addNotification('alert', 'New Turf Listing', `Venue "${newTurf.name}" has been submitted for approval by ${currentUser?.name || 'Owner'}.`);
    addToast('success', 'Turf Added', 'Your turf has been submitted for approval');
    return newTurf;
  };
  const updateTurf = (id, updates) => {
    setTurfs(p => p.map(t => t.id === id ? { ...t, ...updates } : t));
    addToast('success', 'Turf Updated', 'Changes saved successfully');
  };
  const deleteTurf = (id) => {
    setTurfs(p => p.filter(t => t.id !== id));
    setSlots(p => { const n = { ...p }; delete n[id]; return n; });
    addToast('success', 'Turf Deleted', 'The turf listing has been removed');
  };
  const approveTurf = (id) => {
    const turf = turfs.find(t => t.id === id);
    setTurfs(p => p.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    addActivity(`Turf Approved: "${turf?.name}"`, 'management', `Admin ${currentUser?.name} has activated the venue.`, currentUser?.name, 'success');
    addToast('success', 'Turf Approved', 'The turf is now live on the platform');
  };
  const rejectTurf = (id) => {
    const turf = turfs.find(t => t.id === id);
    setTurfs(p => p.map(t => t.id === id ? { ...t, status: 'rejected' } : t));
    addActivity(`Turf Rejected: "${turf?.name}"`, 'management', `Admin ${currentUser?.name} has rejected the listing.`, currentUser?.name, 'danger');
    addNotification('alert', 'Turf Rejected', `Listing for "${turf?.name}" has been rejected and the owner notified.`);
    addToast('warning', 'Turf Rejected', 'The turf listing has been rejected');
  };

  // SLOT MANAGEMENT
  const updateSlot = (turfId, slotId, updates) => {
    setSlots(p => ({
      ...p,
      [turfId]: (p[turfId] || []).map(s => s.id === slotId ? { ...s, ...updates } : s)
    }));
  };
  const blockSlot = (turfId, slotId) => {
    updateSlot(turfId, slotId, { status: 'blocked' });
    addToast('warning', 'Slot Blocked', 'The slot has been marked as unavailable');
  };
  const unblockSlot = (turfId, slotId) => {
    updateSlot(turfId, slotId, { status: 'available' });
    addToast('success', 'Slot Available', 'The slot is now open for booking');
  };

  // BOOKING
  const createBooking = (bookingData) => {
    const newBooking = {
      id: `b${Date.now()}`,
      userId: currentUser?.id,
      ...bookingData,
      status: 'confirmed',
      paymentStatus: 'paid',
      transactionId: `TXN${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: null,
    };
    setBookings(p => [newBooking, ...p]);
    const turf = turfs.find(t => t.id === bookingData.turfId);
    // Mark slot as booked
    updateSlot(bookingData.turfId, bookingData.slotId, { status: 'booked', bookedBy: currentUser?.id });
    // Add payment
    setPayments(p => [...p, { id: `p${Date.now()}`, bookingId: newBooking.id, userId: currentUser?.id, turfId: bookingData.turfId, amount: bookingData.amount, status: 'success', method: bookingData.paymentMethod || 'GPay', transactionId: newBooking.transactionId, createdAt: newBooking.createdAt }]);
    addActivity(`New Booking: "${turf?.name}"`, 'financial', `User ${currentUser?.name || bookingData.userId} booked a slot for ₹${bookingData.amount}.`, currentUser?.name || 'User', 'success');
    addNotification('booking', 'Confirmed Booking', `A new booking has been confirmed for ${turf?.name} at ₹${bookingData.amount}.`);
    addToast('success', 'Booking Confirmed!', `Your slot is booked. Transaction ID: ${newBooking.transactionId}`);
    return newBooking;
  };
  const cancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setBookings(p => p.map(b => b.id === bookingId ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b));
    addActivity(`Booking Cancelled: ${bookingId}`, 'financial', `Booking for ${booking?.turfName || 'Turf'} was cancelled. Refund initialized.`, currentUser?.name || 'Platform', 'warning');
    addNotification('alert', 'Booking Cancelled', `Booking #${bookingId} has been cancelled. Refund process started.`);
    addToast('info', 'Booking Cancelled', 'Your refund will be processed in 3-5 business days');
  };

  // USER MANAGEMENT
  const updateUserStatus = (userId, status) => {
    const user = users.find(u => u.id === userId);
    setUsers(p => p.map(u => u.id === userId ? { ...u, status } : u));
    addActivity(`${status === 'banned' ? 'User Banned' : 'User Updated'}: ${user?.name}`, 'user', `Admin managed account status to: ${status}`, currentUser?.name, status === 'banned' ? 'danger' : 'success');
    addNotification('security', 'User Status Updated', `Account "${user?.name}" status set to ${status}.`);
    addToast('success', 'User Updated', `User status changed to ${status}`);
  };
  const deleteUser = (userId) => {
    setUsers(p => p.filter(u => u.id !== userId));
    addToast('success', 'User Deleted', 'User account has been removed');
  };

  // COUPON CRUD
  const addCoupon = (coupon) => {
    setCoupons(p => [...p, { ...coupon, id: `c${Date.now()}`, used: 0 }]);
    addToast('success', 'Coupon Created', `Code: ${coupon.code}`);
  };
  const updateCoupon = (id, updates) => {
    setCoupons(p => p.map(c => c.id === id ? { ...c, ...updates } : c));
    addToast('success', 'Coupon Updated', 'Changes saved');
  };
  const deleteCoupon = (id) => {
    setCoupons(p => p.filter(c => c.id !== id));
    addToast('success', 'Coupon Deleted', 'Coupon removed from platform');
  };

  // Real-time Platform Simulation Engine
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance of a mock event occurring every minute
      if (Math.random() > 0.7) {
        const randomTurf = turfs[Math.floor(Math.random() * turfs.length)];
        const mockAmount = 800 + Math.floor(Math.random() * 1200);
        const txnId = `TXN-SIM-${Math.floor(Math.random() * 90000) + 10000}`;
        
        // Simulating a live booking from an external user
        setBookings(prev => [{
          id: `b-sim-${Date.now()}`,
          userId: 'u-remote',
          turfId: randomTurf.id,
          turfName: randomTurf.name,
          date: new Date().toISOString().split('T')[0],
          startTime: '18:00',
          endTime: '19:00',
          amount: mockAmount,
          status: 'confirmed',
          paymentStatus: 'paid',
          transactionId: txnId,
          createdAt: new Date().toISOString()
        }, ...prev]);

        setPayments(prev => [{
          id: `p-sim-${Date.now()}`,
          bookingId: `b-sim-${Date.now()}`,
          userId: 'u-remote',
          turfId: randomTurf.id,
          amount: mockAmount,
          status: 'success',
          method: 'GPay',
          transactionId: txnId,
          createdAt: new Date().toISOString()
        }, ...prev]);

        addActivity(
          `Live Booking: ${randomTurf.name}`,
          'financial',
          `External user processed a payment of ₹${mockAmount.toLocaleString()} via UPI.`,
          'Platform Engine',
          'success'
        );
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [turfs, addActivity]);

  // Notifications
  const markNotifRead = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));

  // Stats
  const adminStats = {
    totalUsers: users.filter(u => u.role === 'user').length,
    totalOwners: users.filter(u => u.role === 'owner').length,
    totalTurfs: turfs.length,
    activeTurfs: turfs.filter(t => t.status === 'approved').length,
    pendingTurfs: turfs.filter(t => t.status === 'pending').length,
    totalBookings: bookings.length,
    todayBookings: bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length,
    totalRevenue: payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0),
    monthRevenue: 110000,
    commission: Math.round(payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0) * 0.10),
  };

  const ownerTurfs = turfs.filter(t => t.ownerId === currentUser?.id);
  const ownerBookings = bookings.filter(b => ownerTurfs.some(t => t.id === b.turfId));
  const ownerStats = {
    totalTurfs: ownerTurfs.length,
    totalBookings: ownerBookings.length,
    todayBookings: ownerBookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length,
    totalRevenue: ownerBookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0),
    monthRevenue: ownerBookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0),
  };

  const userBookings = bookings.filter(b => b.userId === currentUser?.id);

  const addReview = (review) => {
    const newReview = { ...review, id: `r${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], helpful: 0 };
    setReviews(p => [newReview, ...p]);
    addToast('success', 'Feedback Submitted!', 'Thank you for your valuable response.');
    return newReview;
  };

  const updateReview = (id, updates) => {
    setReviews(p => p.map(r => r.id === id ? { ...r, ...updates } : r));
    addToast('success', 'Feedback Updated', 'Your changes have been synced.');
  };

  const deleteReview = (id) => {
    setReviews(p => p.filter(r => r.id !== id));
    addToast('info', 'Review Archived', 'The feedback has been removed from your venue profile.');
  };

  return (
    <AppContext.Provider value={{
      currentPanel, setCurrentPanel,
      currentUser, setCurrentUser,
      login, logout,
      turfs, setTurfs, addTurf, updateTurf, deleteTurf, approveTurf, rejectTurf,
      users, setUsers, updateUserStatus, deleteUser,
      reviews, setReviews, addReview, updateReview, deleteReview,
      bookings, setBookings, createBooking, cancelBooking,
      payments, setPayments,
      slots, setSlots, updateSlot, blockSlot, unblockSlot,
      coupons, addCoupon, updateCoupon, deleteCoupon,
      notifications, markNotifRead, markAllRead, addNotification,
      notificationEmail, setNotificationEmail,
      userLocation, setUserLocation,
      toasts, addToast, removeToast,
      activityLogs, setActivityLogs, addActivity,
      adminStats, ownerStats, ownerTurfs, ownerBookings, userBookings,
      pricingRules, setPricingRules, calculateEffectivePrice,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
