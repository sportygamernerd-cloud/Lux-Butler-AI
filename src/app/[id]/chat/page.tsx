'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    
    // Optimistic Update
    const newMsg = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, propertyId: id })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch(e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I am having trouble connecting to the concierge service right now." }]);
    }
    setLoading(false);
  };

  const QuickAction = ({ label, query }: { label: string, query: string }) => (
    <button 
      onClick={() => sendMessage(query)}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '15px 10px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        height: '100%'
      }}
      className="quick-action-btn"
    >
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{label}</span>
      <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontStyle:'italic' }}>Tap to ask</span>
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <header style={{ 
        background: 'rgba(30, 30, 30, 0.95)', 
        padding: '15px 20px', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, letterSpacing: '2px', color: '#fff' }}>
            LUX<span style={{color: 'var(--color-gold)'}}>BUTLER</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: '#666', margin: 0, textTransform:'uppercase', letterSpacing:'1px' }}>Private Concierge</p>
        </div>
        <div style={{ width: '35px', height: '35px', border: '1px solid var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{color: 'var(--color-gold)', fontSize: '0.8rem', fontFamily:'var(--font-heading)'}}>LB</span>
        </div>
      </header>
      
      {/* Messages Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: 'auto' }}>
            <div style={{ 
              width: '70px', height: '70px', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', 
              borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' 
            }}>✦</div>
            <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '10px' }}>Welcome</h2>
            <p style={{ fontSize: '1rem', color: '#888', maxWidth: '85%', margin: '0 auto', lineHeight:'1.6' }}>
              I am your dedicated digital butler. <br/>How may I be of service to you today?
            </p>
          </div>
        )}

        {/* Quick Actions Grid */}
        {messages.length < 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', margin: '0 auto', width: '100%' }}>
            <QuickAction label="WiFi Access" query="What is the WiFi password?" />
            <QuickAction label="Check-out" query="What are the check-out instructions?" />
            <QuickAction label="House Rules" query="What are the house rules?" />
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            animation: 'fadeIn 0.4s ease'
          }}>
            <div style={{ 
              padding: '14px 18px', 
              borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              background: m.role === 'user' ? 'linear-gradient(135deg, var(--color-gold), #B59020)' : 'var(--color-bg-card)',
              color: m.role === 'user' ? '#121212' : 'var(--color-text-main)',
              border: m.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              fontWeight: m.role === 'user' ? 600 : 400
            }}>
              {m.content}
            </div>
            {m.role === 'assistant' && (
              <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '6px', marginLeft: '5px', textTransform:'uppercase', letterSpacing:'1px' }}>Butler</div>
            )}
          </div>
        ))}
        
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: 'transpatent', padding: '10px 0' }}>
            <div style={{ display: 'flex', gap: '4px', marginLeft:'10px' }}>
              <span style={{ color:'var(--color-gold)', animation: 'bounce 1s infinite', animationDelay: '0s' }}>•</span>
              <span style={{ color:'var(--color-gold)', animation: 'bounce 1s infinite', animationDelay: '0.2s' }}>•</span>
              <span style={{ color:'var(--color-gold)', animation: 'bounce 1s infinite', animationDelay: '0.4s' }}>•</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ 
        background: 'var(--color-bg-card)', 
        padding: '15px', 
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '12px',
        alignItems:'center'
      }}>
        <input 
          style={{ 
            flex: 1, 
            padding: '14px 20px', 
            borderRadius: '30px', 
            border: '1px solid #333', 
            background: '#121212',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            fontFamily: 'var(--font-body)'
          }}
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your request..."
        />
        <button 
          onClick={() => sendMessage()}
          style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            background: 'var(--color-gold)', 
            color: '#121212', 
            border: 'none',
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.2rem'
          }}
        >
          ➤
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      `}</style>
    </div>
  );
}
