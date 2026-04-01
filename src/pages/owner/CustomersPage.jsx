import React from 'react';
import { useApp } from '../../store/AppContext';
import { Search, User, Phone, Mail, Calendar, TrendingUp, Download, MoreVertical } from 'lucide-react';

export default function CustomersPage() {
  const { ownerBookings, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Extract unique customers from bookings
  const customers = React.useMemo(() => {
    const customerMap = {};
    
    ownerBookings.forEach(b => {
      // In a real app, b.userId would be an ID, and we'd join with users.
      // Here b.userId is often a name in mockData or an ID.
      const id = b.userId || 'Guest';
      if (!customerMap[id]) {
        customerMap[id] = {
          id,
          name: id === 'u1' ? 'Arjun Mehta' : (id.startsWith('b') ? 'Guest' : id),
          email: id === 'u1' ? 'arjun@example.com' : `${id.toLowerCase()}@example.com`,
          phone: id === 'u1' ? '+91 98765 43210' : '+91 90000 00000',
          totalBookings: 0,
          totalSpent: 0,
          lastBooking: b.date,
          status: 'Active'
        };
      }
      customerMap[id].totalBookings += 1;
      customerMap[id].totalSpent += (b.amount || 0);
      if (new Date(b.date) > new Date(customerMap[id].lastBooking)) {
        customerMap[id].lastBooking = b.date;
      }
    });

    return Object.values(customerMap).filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ownerBookings, searchTerm]);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Customer CRM</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage and analyze your venue's customer base.</p>
        </div>
        <button className="btn btn-secondary btn-sm"><Download size={14} /> Export CSV</button>
      </div>

      {/* CRM Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
         {[
           { label: 'Total Customers', value: customers.length, icon: <User size={20} />, color: '#5b8def' },
           { label: 'Repeat Rate', value: '42%', icon: <TrendingUp size={20} />, color: '#00e676' },
           { label: 'New This Month', value: '12', icon: <Calendar size={20} />, color: '#f97316' },
           { label: 'Avg LTV', value: `₹${Math.round(customers.reduce((s,c)=>s+c.totalSpent, 0) / (customers.length || 1)).toLocaleString()}`, icon: <TrendingUp size={20} />, color: '#8b5cf6' }
         ].map(stat => (
           <div key={stat.label} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ color: stat.color }}>{stat.icon}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{stat.value}</div>
           </div>
         ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16 }}>
           <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by name, email or phone..." 
                style={{ paddingLeft: 40, width: '100%' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="table-wrapper" style={{ border: 'none' }}>
           <table>
             <thead>
               <tr>
                 <th>Customer</th>
                 <th>Contact Info</th>
                 <th>Total Bookings</th>
                 <th>Lifetime Value</th>
                 <th>Last Visit</th>
                 <th>Status</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {customers.map(c => (
                 <tr key={c.id}>
                   <td>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #161b22, #0d1117)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{c.name.charAt(0)}</div>
                        <div>
                           <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                           <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {c.id}</div>
                        </div>
                     </div>
                   </td>
                   <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}><Mail size={12} /> {c.email}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}><Phone size={12} /> {c.phone}</div>
                   </td>
                   <td style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{c.totalBookings}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Bookings</div>
                   </td>
                   <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-green)' }}>₹{c.totalSpent.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Net Profit Share</div>
                   </td>
                   <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.lastBooking}</td>
                   <td><span className="badge badge-green">Loyal</span></td>
                   <td><button className="btn btn-ghost btn-icon"><MoreVertical size={16} /></button></td>
                 </tr>
               ))}
               {customers.length === 0 && (
                 <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No customers found matching your criteria.</td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
