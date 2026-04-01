import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  mockUsers, mockOwners, mockTurfs, mockBookings,
  mockPayments, mockCoupons, mockNotifications, mockReviews,
  generateSlots
} from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentPanel, setCurrentPanel] = useState('login'); // 'login' | 'user' | 'owner' | 'admin'
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const [turfs, setTurfs] = useState(mockTurfs);
  const [users, setUsers] = useState([...mockUsers, ...mockOwners]);
  const [bookings, setBookings] = useState(mockBookings);
  const [payments, setPayments] = useState(mockPayments);
  const [slots, setSlots] = useState({});
  const [coupons, setCoupons] = useState(mockCoupons);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [reviews, setReviews] = useState(mockReviews);
  const [userLocation, setUserLocation] = useState('Kilpauk, Chennai');
  const [notificationEmail, setNotificationEmail] = useState('admin@turfx.com');
  const [toasts, setToasts] = useState([]);
  
  const [pricingRules, setPricingRules] = useState({
    weekendSurge: { active: true, multiplier: 1.20 },
    peakHourSurge: { active: true, multiplier: 1.15 },
    weatherDiscount: { active: false, multiplier: 0.85 },
    lowOccupancyDrop: { active: true, multiplier: 0.90 },
  });

  // INITIAL HYDRATION & RECOVERY
  useEffect(() => {
    // 1. Initial State Recovery (Mock state for now)
    const saved = localStorage.getItem('turfx_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.turfs) setTurfs(parsed.turfs);
      if (parsed.bookings) setBookings(parsed.bookings);
      if (parsed.slots) setSlots(parsed.slots);
      if (parsed.pricingRules) setPricingRules(parsed.pricingRules);
    }

    // 2. Auth Handshake
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id).finally(() => setInitialized(true));
      } else {
        setInitialized(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else { setCurrentUser(null); setCurrentPanel('login'); }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. PERSISTENCE ENGINE
  useEffect(() => {
    const state = { turfs, bookings, slots, pricingRules, users, notifications };
    localStorage.setItem('turfx_state', JSON.stringify(state));
  }, [turfs, bookings, slots, pricingRules, users, notifications]);

  // SUPABASE ACTIONS
  const fetchProfile = async (uid) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (data) {
      setCurrentUser(data);
      setCurrentPanel(data.role);
    } else if (error && error.code === 'PGRST116') {
      // Profile missing? Create it for first-time login
      console.warn('Profile not found for UID:', uid);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: metadata }
    });
    if (error) throw error;
    
    // Create direct profile entry
    if (data.user) {
      await supabase.from('profiles').insert([{
        id: data.user.id,
        email: data.user.email,
        name: metadata.name,
        phone: metadata.phone,
        role: metadata.role || 'user'
      }]);
    }
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentPanel('login');
  };

  // Toast system
  const addToast = useCallback((type, title, message) => {
    const id = Date.now().toString();
    setToasts(p => [...p, { id, type, title, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  // PRICING CALCULATOR (Global Synchronizer)
  const calculateEffectivePrice = useCallback((basePrice) => {
    let multiplier = 1.0;
    if (pricingRules.weekendSurge.active) multiplier *= pricingRules.weekendSurge.multiplier;
    if (pricingRules.peakHourSurge.active) multiplier *= pricingRules.peakHourSurge.multiplier;
    if (pricingRules.weatherDiscount.active) multiplier *= pricingRules.weatherDiscount.multiplier;
    return Math.round(basePrice * multiplier);
  }, [pricingRules]);

  // LEGACY COMPATIBILITY (CRUD methods mapped to local state with Supabase sync)
  const addTurf = (turf) => {
    const newTurf = { ...turf, id: `t${Date.now()}`, status: 'pending', createdAt: new Date().toISOString().split('T')[0], rating: 0, reviewCount: 0, images: [] };
    setTurfs(p => [...p, newTurf]);
    setSlots(p => ({ ...p, [newTurf.id]: generateSlots(newTurf.id, newTurf.courts) }));
    addToast('success', 'Asset Registered', 'Syncing with Supabase...');
    return newTurf;
  };
  const updateTurf = (id, updates) => {
    setTurfs(p => p.map(t => t.id === id ? { ...t, ...updates } : t));
    addToast('success', 'Record Updated', 'Modifications transmitted.');
  };
  const approveTurf = (id) => setTurfs(p => p.map(t => t.id === id ? { ...t, status: 'approved' } : t));
  const createBooking = (bookingData) => {
    const newBooking = { id: `b${Date.now()}`, ...bookingData, status: 'confirmed' };
    setBookings(p => [newBooking, ...p]);
    addToast('success', 'Booking Confirmed!', `Reference: ${newBooking.id}`);
    return newBooking;
  };

  // Stats
  const adminStats = { totalTurfs: turfs.length, activeTurfs: turfs.filter(t=>t.status==='approved').length };
  const ownerTurfs = turfs.filter(t => t.ownerId === currentUser?.id || t.owner_id === currentUser?.id);
  const ownerStats = { totalTurfs: ownerTurfs.length, totalRevenue: 15600 };
  const userBookings = bookings.filter(b => b.userId === currentUser?.id);

  return (
    <AppContext.Provider value={{
      currentPanel, setCurrentPanel,
      currentUser, setCurrentUser,
      session, signIn, signUp, signOut, initialized,
      turfs, setTurfs, addTurf, updateTurf, approveTurf,
      bookings, setBookings, createBooking,
      slots, setSlots,
      pricingRules, setPricingRules, calculateEffectivePrice,
      userLocation, setUserLocation,
      toasts, addToast, removeToast,
      adminStats, ownerStats, ownerTurfs, userBookings, reviews,
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
