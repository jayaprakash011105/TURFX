import React from 'react';
import { useApp } from '../../store/AppContext';
import { Star, MessageCircle, ThumbsUp, Trash2, Filter, MoreVertical, Search, CheckCircle } from 'lucide-react';

export default function ReviewsPage() {
  const { reviews: allReviews, ownerTurfs, updateReview, deleteReview } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState(null);
  const [replyText, setReplyText] = React.useState('');
  const [activeMenu, setActiveMenu] = React.useState(null);

  // Synchronized Review Stream: Filtered for Owner's Venue Portfolio
  const reviews = React.useMemo(() => {
    const ownerTurfIds = ownerTurfs.map(t => t.id);
    
    return allReviews
      .filter(r => ownerTurfIds.includes(r.turfId))
      .map(r => {
        const turf = ownerTurfs.find(t => t.id === r.turfId);
        return {
          ...r,
          turfName: turf?.name || 'Unknown Venue',
          user: r.userName || 'Anonymous Player',
          userAvatar: (r.userName || 'A').charAt(0),
          date: r.createdAt
        };
      })
      .filter(r => 
        r.turfName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allReviews, ownerTurfs, searchTerm]);

  const handleReplySubmit = (id) => {
     if (!replyText.trim()) return;
     updateReview(id, { reply: replyText });
     setReplyingTo(null);
     setReplyText('');
  };

  const avgRating = reviews.length ? (reviews.reduce((s,r) => s+r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="animate-fade" onClick={() => setActiveMenu(null)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Manager Feedback</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Review and reply to customer feedback for all your venues.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-sm"><Filter size={14} /> Filter</button>
        </div>
      </div>

      {/* Review Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: 24, marginBottom: 32 }}>
         <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Global Merit Rating</div>
            <div style={{ fontSize: 56, fontWeight: 900, marginBottom: 4 }}>{avgRating}</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
               {[1,2,3,4,5].map(i => <Star key={i} size={18} fill={i <= Math.round(avgRating) ? 'var(--accent-yellow)' : 'transparent'} color="var(--accent-yellow)" />)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Based on {reviews.length} authentic customer reviews.</div>
         </div>

         <div className="card" style={{ padding: '24px', position: 'relative' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Rating Distribution</h3>
            {[5,4,3,2,1].map(stars => {
              const count = reviews.filter(r => r.rating === stars).length;
              const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                   <div style={{ width: 40, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>{stars} Star</div>
                   <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: stars >= 4 ? 'var(--accent-green)' : stars === 3 ? 'var(--accent-yellow)' : '#ef4444' }}></div>
                   </div>
                   <div style={{ width: 40, fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{pct}%</div>
                </div>
              );
            })}
         </div>
      </div>

      {/* Search & List */}
      <div className="card" style={{ padding: '20px', marginBottom: 24, display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="form-input" placeholder="Search by venue or customer name..." style={{ paddingLeft: 40, width: '100%' }} value={searchTerm} onChange={k => setSearchTerm(k.target.value)} />
          </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
         {reviews.map(r => (
           <div key={r.id} className="card" style={{ padding: '24px', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                 <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #161b22, #0d1117)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>{r.userAvatar}</div>
                    <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontWeight: 800, fontSize: 16 }}>{r.user}</span>
                          <div className="badge badge-green" style={{ fontSize: 10, padding: '2px 8px' }}><CheckCircle size={10} style={{ marginRight: 4 }} /> VERIFIED USER</div>
                       </div>
                       <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Reviewed <strong>{r.turfName}</strong> on {r.date}</div>
                    </div>
                 </div>
                 <div style={{ textAlign: 'right', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 8, justifyContent: 'flex-end' }}>
                       {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= r.rating ? 'var(--accent-yellow)' : 'transparent'} color="var(--accent-yellow)" />)}
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === r.id ? null : r.id); }}><MoreVertical size={16} /></button>
                    
                    {activeMenu === r.id && (
                      <div className="card" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 10, width: 160, padding: 8, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                         <button className="btn btn-ghost btn-sm btn-full" style={{ justifyContent: 'flex-start', color: '#ef4444' }} onClick={() => deleteReview(r.id)}><Trash2 size={14} /> Archive Review</button>
                      </div>
                    )}
                 </div>
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 20, paddingLeft: 64 }}>
                 "{r.comment}"
              </div>

              {r.reply ? (
                <div style={{ marginLeft: 64, padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--accent-blue)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>OFFICIAL RESPONSE</div>
                      <button className="btn btn-ghost btn-xs" style={{ fontSize: 10 }} onClick={() => { setReplyingTo(r.id); setReplyText(r.reply); }}>Edit Reply</button>
                   </div>
                   <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{r.reply}"</div>
                </div>
              ) : replyingTo === r.id ? (
                <div style={{ marginLeft: 64, marginTop: 12 }}>
                   <textarea className="form-input" placeholder="Type your official response..." style={{ width: '100%', minHeight: 80, marginBottom: 12 }} value={replyText} onChange={e => setReplyText(e.target.value)} />
                   <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleReplySubmit(r.id)}>Post Response</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setReplyingTo(null)}>Cancel</button>
                   </div>
                </div>
              ) : (
                <div style={{ marginLeft: 64, display: 'flex', gap: 12 }}>
                   <button className="btn btn-secondary btn-sm" style={{ padding: '8px 16px' }} onClick={() => setReplyingTo(r.id)}><MessageCircle size={14} /> Reply Feedback</button>
                   <button className="btn btn-ghost btn-sm" style={{ padding: '8px 16px' }} onClick={() => updateReview(r.id, { helpful: (r.helpful || 0) + 1 })}><ThumbsUp size={14} /> Helpful ({r.helpful || 0})</button>
                </div>
              )}
           </div>
         ))}
         {reviews.length === 0 && (
           <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No feedback found for your search criteria.</div>
         )}
      </div>
    </div>
  );
}
