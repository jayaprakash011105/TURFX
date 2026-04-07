export const SPORTS = [
  { id: 'football', label: 'Football', icon: '⚽', color: '#00e676' },
  { id: 'badminton', label: 'Badminton', icon: '🏸', color: '#8b5cf6' },
  { id: 'cricket', label: 'Cricket', icon: '🏏', color: '#5b8def' },
  { id: 'pickleball', label: 'Pickleball', icon: '🏓', color: '#f97316' },
  { id: 'swimming', label: 'Swimming', icon: '🏊', color: '#0ea5e9' },
  { id: 'squash', label: 'Squash', icon: '🟢', color: '#3b82f6' },
  { id: 'tennis', label: 'Tennis', icon: '🎾', color: '#eab308' },
  { id: 'padel', label: 'Padel', icon: '🎾', color: '#ec4899' },
  { id: 'basketball', label: 'Basketball', icon: '🏀', color: '#f97316' },
  { id: 'table_tennis', label: 'Table Tennis', icon: '🏓', color: '#8b5cf6' },
];

export const AMENITIES_LIST = [
  'Changing Rooms', 'Parking', 'Floodlights', 'Cafeteria', 'First Aid',
  'CCTV', 'Water Dispenser', 'Spectator Seating', 'Coach Available', 'Equipment Rental',
  'Washrooms', 'WiFi', 'Air Cooling', 'Sound System',
];

export const VENUE_RULES_LIST = [
  'No alcohol or drugs on premises',
  'Proper sports shoes mandatory',
  'No food or drinks on the turf',
  'Players must vacate 5 min before slot ends',
  'Abusive language will lead to disqualification',
  'Report any damage to the staff immediately',
  'Pets not allowed inside the premises',
  'Children under 12 must be accompanied by adults',
];

export const mockUsers = [
  { id: 'u1', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 98765 43210', role: 'user', status: 'active', avatar: '👤', joined: '2024-01-15', bookings: 24, subscription: 'premium' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 87654 32109', role: 'user', status: 'active', avatar: '👤', joined: '2024-02-20', bookings: 8, subscription: 'free' },
  { id: 'u3', name: 'Rohan Das', email: 'rohan@example.com', phone: '+91 76543 21098', role: 'user', status: 'suspended', avatar: '👤', joined: '2024-03-10', bookings: 3, subscription: 'free' },
  { id: 'u4', name: 'Sneha Patel', email: 'sneha@example.com', phone: '+91 65432 10987', role: 'user', status: 'active', avatar: '👤', joined: '2024-01-28', bookings: 15, subscription: 'premium' },
  { id: 'u5', name: 'Kiran Kumar', email: 'kiran@example.com', phone: '+91 54321 09876', role: 'user', status: 'active', avatar: '👤', joined: '2024-03-05', bookings: 5, subscription: 'free' },
];

export const mockOwners = [
  { id: 'o1', name: 'Vikram Shetty', email: 'vikram@turfpro.com', phone: '+91 90000 11111', role: 'owner', status: 'active', avatar: '🏢', joined: '2023-11-01', turfs: 2, totalEarnings: 128500, subscription: 'premium-elite' },
  { id: 'o2', name: 'Aditya Nair', email: 'aditya@greens.com', phone: '+91 80000 22222', role: 'owner', status: 'active', avatar: '🏢', joined: '2023-12-15', turfs: 1, totalEarnings: 64200, subscription: 'star-pro' },
  { id: 'o3', name: 'Meera Reddy', email: 'meera@playzone.com', phone: '+91 70000 33333', role: 'owner', status: 'pending', avatar: '🏢', joined: '2024-03-01', turfs: 0, totalEarnings: 0, subscription: 'standard' },
];

export const mockTurfs = [
  {
    id: 't1',
    ownerId: 'o1',
    ownerName: 'Vikram Shetty',
    name: 'Champions Arena',
    tagline: 'Play Like a Champion',
    location: 'HSR Layout, Bangalore',
    address: '42nd Cross, HSR Layout, Sector 7, Bangalore - 560102',
    phone: '+91 90000 11111',
    email: 'info@championsarena.com',
    sportTypes: ['football', 'cricket'],
    amenities: ['Changing Rooms', 'Parking', 'Floodlights', 'Cafeteria', 'CCTV', 'Water Dispenser'],
    venueRules: ['No alcohol or drugs on premises', 'Proper sports shoes mandatory', 'No food or drinks on the turf'],
    pricePerHour: 800,
    weekendPrice: 1000,
    courts: 3,
    rating: 4.7,
    reviewCount: 128,
    status: 'approved',
    images: ['https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=800&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=800&q=80',
    description: 'Premium turf facility with international-grade synthetic grass, floodlights for night games, and fully equipped changing rooms. Perfect for corporate matches and weekend tournaments.',
    openTime: '06:00',
    closeTime: '23:00',
    mapLink: 'https://maps.google.com',
    createdAt: '2023-11-15',
  },
  {
    id: 't2',
    ownerId: 'o1',
    ownerName: 'Vikram Shetty',
    name: 'Green Field Sports Hub',
    tagline: 'Where Passion Meets Performance',
    location: 'Koramangala, Bangalore',
    address: '5th Block, Koramangala, Bangalore - 560034',
    phone: '+91 90000 11112',
    email: 'info@greenfield.com',
    sportTypes: ['football', 'basketball', 'badminton'],
    amenities: ['Parking', 'Floodlights', 'First Aid', 'CCTV', 'Washrooms', 'Equipment Rental'],
    venueRules: ['Proper sports shoes mandatory', 'Players must vacate 5 min before slot ends'],
    pricePerHour: 600,
    weekendPrice: 750,
    courts: 2,
    rating: 4.4,
    reviewCount: 89,
    status: 'approved',
    images: ['https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
    description: 'Multi-sport facility featuring state-of-the-art courts for football, basketball, and badminton.',
    openTime: '05:30',
    closeTime: '22:00',
    mapLink: 'https://maps.google.com',
    createdAt: '2023-12-01',
  },
  {
    id: 't3',
    ownerId: 'o2',
    ownerName: 'Aditya Nair',
    name: 'The Greens Turf Club',
    tagline: 'Natural Feel, Premium Play',
    location: 'Indiranagar, Bangalore',
    address: '100 Feet Road, Indiranagar, Bangalore - 560038',
    phone: '+91 80000 22222',
    email: 'info@greensturf.com',
    sportTypes: ['cricket', 'tennis'],
    amenities: ['Changing Rooms', 'Parking', 'Cafeteria', 'Spectator Seating', 'Coach Available', 'WiFi'],
    venueRules: ['No alcohol or drugs on premises', 'Pets not allowed inside the premises'],
    pricePerHour: 1200,
    weekendPrice: 1500,
    courts: 4,
    rating: 4.9,
    reviewCount: 215,
    status: 'approved',
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    description: 'An iconic sports club in the heart of Indiranagar. Featuring premium cricket pitches and clay tennis courts with professional coaching facilities.',
    openTime: '06:00',
    closeTime: '22:00',
    mapLink: 'https://maps.google.com',
    createdAt: '2024-01-10',
  },
  {
    id: 't4',
    ownerId: 'o3',
    ownerName: 'Meera Reddy',
    name: 'PlayZone Sports Complex',
    tagline: 'Fun For Everyone',
    location: 'JP Nagar, Bangalore',
    address: '7th Phase, JP Nagar, Bangalore - 560078',
    phone: '+91 70000 33333',
    email: 'info@playzone.com',
    sportTypes: ['volleyball', 'badminton', 'basketball'],
    amenities: ['Parking', 'Washrooms', 'Water Dispenser'],
    venueRules: ['Proper sports shoes mandatory'],
    pricePerHour: 400,
    weekendPrice: 500,
    courts: 2,
    rating: 3.8,
    reviewCount: 34,
    status: 'pending',
    images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    description: 'Affordable multi-sport complex for recreational players.',
    openTime: '07:00',
    closeTime: '21:00',
    mapLink: 'https://maps.google.com',
    createdAt: '2024-03-01',
  },
  {
    id: 't5',
    ownerId: 'o1',
    ownerName: 'Vikram Shetty',
    name: 'Skyline Rooftop Futsal',
    tagline: 'Play Under the Stars',
    location: 'Whitefield, Bangalore',
    address: 'Level 8, Nexus Mall, Whitefield, Bangalore - 560066',
    phone: '+91 90000 11115',
    email: 'hello@skylineturf.com',
    sportTypes: ['football'],
    amenities: ['Rooftop View', 'Cafeteria', 'Floodlights', 'Premium Grass', 'Waiting Lounge'],
    venueRules: ['Proper football studs mandatory', 'No outside food'],
    pricePerHour: 1500,
    weekendPrice: 1800,
    courts: 2,
    rating: 4.8,
    reviewCount: 420,
    status: 'approved',
    images: ['https://images.unsplash.com/photo-1518605368461-1e1e38ce81ba?w=800&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce81ba?w=800&q=80',
    description: 'Experience Bangalore\'s finest rooftop futsal pitch. Elite FIFA-certified turf with spectacular panoramic city views and professional-grade LED floodlighting.',
    openTime: '16:00',
    closeTime: '02:00',
    mapLink: 'https://maps.google.com',
    createdAt: '2024-03-10',
  },
  {
    id: 't6',
    ownerId: 'o2',
    ownerName: 'Aditya Nair',
    name: 'Oasis Padél & Tennis',
    tagline: 'The Ultimate Racquet Club',
    location: 'Yelahanka, Bangalore',
    address: 'Airport Road Hub, Yelahanka, Bangalore - 560064',
    phone: '+91 80000 22223',
    email: 'courts@oasishub.com',
    sportTypes: ['tennis', 'badminton'],
    amenities: ['Locker Rooms', 'Pro Shop', 'Cafe', 'AC Badminton Courts', 'Shower Facilities'],
    venueRules: ['Non-marking shoes only for badminton', 'Manners on the court'],
    pricePerHour: 900,
    weekendPrice: 1100,
    courts: 5,
    rating: 4.6,
    reviewCount: 88,
    status: 'approved',
    images: ['https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&q=80',
    description: 'A dedicated sanctuary for racquet sports enthusiasts. Featuring climate-controlled indoor badminton courts and stunning outdoor blue hard-courts for tennis.',
    openTime: '05:00',
    closeTime: '23:00',
    mapLink: 'https://maps.google.com',
    createdAt: '2024-04-02',
  },
];

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];

export const generateSlots = (turfId, courtCount = 2) => {
  const slots = [];
  const statuses = ['available', 'available', 'available', 'booked', 'locked'];
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = fmt(date);
    for (let c = 1; c <= courtCount; c++) {
      for (let h = 6; h < 23; h++) {
        const start = `${String(h).padStart(2, '0')}:00`;
        const end = `${String(h + 1).padStart(2, '0')}:00`;
        const statusIdx = Math.floor(Math.random() * statuses.length);
        slots.push({
          id: `${turfId}-c${c}-${dateStr}-${h}`,
          turfId,
          court: c,
          date: dateStr,
          startTime: start,
          endTime: end,
          status: d === 0 && h < new Date().getHours() ? 'past' : statuses[statusIdx],
          bookedBy: statuses[statusIdx] === 'booked' ? 'u1' : null,
        });
      }
    }
  }
  return slots;
};

export const mockBookings = [
  { id: 'b1', userId: 'u1', turfId: 't1', turfName: 'Champions Arena', slotId: 't1-c1-2024-01-15-18', court: 1, date: '2024-01-15', startTime: '18:00', endTime: '19:00', sport: 'football', status: 'completed', paymentStatus: 'paid', amount: 800, transactionId: 'TXN001', createdAt: '2024-01-14', rating: 5 },
  { id: 'b2', userId: 'u1', turfId: 't3', turfName: 'The Greens Turf Club', slotId: 't3-c2-2024-02-10-10', court: 2, date: '2024-02-10', startTime: '10:00', endTime: '11:00', sport: 'cricket', status: 'completed', paymentStatus: 'paid', amount: 1200, transactionId: 'TXN002', createdAt: '2024-02-09', rating: 4 },
  { id: 'b3', userId: 'u1', turfId: 't1', turfName: 'Champions Arena', slotId: 't1-c1-today-20', court: 1, date: fmt(today), startTime: '20:00', endTime: '21:00', sport: 'football', status: 'confirmed', paymentStatus: 'paid', amount: 800, transactionId: 'TXN003', createdAt: fmt(today), rating: null },
  { id: 'b4', userId: 'u2', turfId: 't2', turfName: 'Green Field Sports Hub', slotId: 't2-c1-2024-03-01-09', court: 1, date: '2024-03-01', startTime: '09:00', endTime: '10:00', sport: 'basketball', status: 'cancelled', paymentStatus: 'refunded', amount: 600, transactionId: 'TXN004', createdAt: '2024-02-28', rating: null },
  { id: 'b5', userId: 'u3', turfId: 't1', turfName: 'Champions Arena', slotId: 't1-c2-today-15', court: 2, date: fmt(today), startTime: '15:00', endTime: '16:00', sport: 'cricket', status: 'confirmed', paymentStatus: 'paid', amount: 800, transactionId: 'TXN005', createdAt: fmt(today), rating: null },
];

export const mockReviews = [
  { id: 'r1', userId: 'u1', userName: 'Arjun Mehta', turfId: 't1', rating: 5, comment: 'Excellent facility! The turf quality is top-notch and the staff is very helpful.', createdAt: '2024-01-16' },
  { id: 'r2', userId: 'u2', userName: 'Priya Sharma', turfId: 't1', rating: 4, comment: 'Good experience overall. Loved the floodlights for the evening game.', createdAt: '2024-02-15' },
  { id: 'r3', userId: 'u1', userName: 'Arjun Mehta', turfId: 't3', rating: 4, comment: 'Premium experience, worth the price.', createdAt: '2024-02-11' },
  { id: 'r4', userId: 'u4', userName: 'Sneha Patel', turfId: 't2', rating: 4, comment: 'Great multi-sport facility. The courts are well maintained.', createdAt: '2024-03-05' },
];

export const mockPayments = [
  { id: 'p1', bookingId: 'b1', userId: 'u1', turfId: 't1', amount: 800, status: 'success', method: 'UPI', transactionId: 'TXN001', createdAt: '2024-01-14' },
  { id: 'p2', bookingId: 'b2', userId: 'u1', turfId: 't3', amount: 1200, status: 'success', method: 'Card', transactionId: 'TXN002', createdAt: '2024-02-09' },
  { id: 'p3', bookingId: 'b3', userId: 'u1', turfId: 't1', amount: 800, status: 'success', method: 'GPay', transactionId: 'TXN003', createdAt: fmt(today) },
  { id: 'p4', bookingId: 'b4', userId: 'u2', turfId: 't2', amount: 600, status: 'refunded', method: 'UPI', transactionId: 'TXN004', createdAt: '2024-02-28' },
  { id: 'p5', bookingId: 'b5', userId: 'u3', turfId: 't1', amount: 800, status: 'success', method: 'Wallet', transactionId: 'TXN005', createdAt: fmt(today) },
];

export const mockCoupons = [
  { id: 'c1', code: 'WELCOME20', discount: 20, type: 'percent', maxDiscount: 200, usageLimit: 100, used: 43, status: 'active', expiry: '2024-12-31' },
  { id: 'c2', code: 'FLAT100', discount: 100, type: 'flat', maxDiscount: 100, usageLimit: 50, used: 12, status: 'active', expiry: '2024-06-30' },
  { id: 'c3', code: 'WEEKEND15', discount: 15, type: 'percent', maxDiscount: 150, usageLimit: 200, used: 89, status: 'expired', expiry: '2024-02-28' },
];

export const mockNotifications = [
  { id: 'n1', type: 'booking', title: 'Booking Confirmed', message: 'Your slot at Champions Arena is confirmed for today at 8:00 PM', time: '2 min ago', read: false },
  { id: 'n2', type: 'payment', title: 'Payment Successful', message: '₹800 paid successfully via GPay', time: '5 min ago', read: false },
  { id: 'n3', type: 'offer', title: 'Weekend Offer!', message: 'Get 15% off on all weekend bookings with code WEEKEND15', time: '2 hours ago', read: true },
  { id: 'n4', type: 'reminder', title: 'Upcoming Match', message: 'You have a football match at Green Field Sports Hub tomorrow at 7 AM', time: '1 day ago', read: true },
];

export const analyticsData = {
  revenue: [
    { month: 'Oct', amount: 48000 },
    { month: 'Nov', amount: 63000 },
    { month: 'Dec', amount: 78000 },
    { month: 'Jan', amount: 92000 },
    { month: 'Feb', amount: 85000 },
    { month: 'Mar', amount: 110000 },
  ],
  bookingsByDay: [
    { day: 'Mon', bookings: 24 },
    { day: 'Tue', bookings: 18 },
    { day: 'Wed', bookings: 22 },
    { day: 'Thu', bookings: 19 },
    { day: 'Fri', bookings: 35 },
    { day: 'Sat', bookings: 58 },
    { day: 'Sun', bookings: 52 },
  ],
  sportDistribution: [
    { sport: 'Football', value: 42 },
    { sport: 'Cricket', value: 28 },
    { sport: 'Basketball', value: 15 },
    { sport: 'Tennis', value: 8 },
    { sport: 'Badminton', value: 5 },
    { sport: 'Volleyball', value: 2 },
  ],
  peakHours: [
    { hour: '6AM', bookings: 8 },
    { hour: '7AM', bookings: 22 },
    { hour: '8AM', bookings: 35 },
    { hour: '9AM', bookings: 28 },
    { hour: '10AM', bookings: 18 },
    { hour: '11AM', bookings: 12 },
    { hour: '12PM', bookings: 10 },
    { hour: '1PM', bookings: 8 },
    { hour: '2PM', bookings: 6 },
    { hour: '3PM', bookings: 14 },
    { hour: '4PM', bookings: 30 },
    { hour: '5PM', bookings: 48 },
    { hour: '6PM', bookings: 62 },
    { hour: '7PM', bookings: 58 },
    { hour: '8PM', bookings: 45 },
    { hour: '9PM', bookings: 32 },
    { hour: '10PM', bookings: 15 },
  ],
};

export const subscriptionPlans = [
  { id: 'free', name: 'Free', price: 0, features: ['3 bookings/month', 'Basic support', 'Standard slots only'], color: '#8b8fa8' },
  { id: 'premium', name: 'Premium', price: 299, features: ['Unlimited bookings', 'Priority support', 'Early slot access', '10% discount on all bookings', 'Match creation'], color: '#00e676' },
  { id: 'pro', name: 'Pro', price: 599, features: ['Everything in Premium', '20% discount on all bookings', 'Dedicated account manager', 'Guest passes (2/month)', 'AI turf recommendations'], color: '#5b8def' },
];
