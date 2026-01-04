'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-scroll logic could go here

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    
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
      setMessages(prev => [...prev, { role: 'assistant', content: "I am having trouble connecting. Please try again in a moment." }]);
    }
    setLoading(false);
  };

  const QuickAction = ({ label, query }: { label: string, query: string }) => (
    <button 
      onClick={() => sendMessage(query)}
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        height: '100%',
        color: 'var(--color-text-main)'
      }}
      className="quick-action-btn"
    >
      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', opacity: 0.8 }}>Tap to ask</span>
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-main)' }}>
      {/* Header */}
      <header style={{ 
        background: 'rgba(10, 10, 10, 0.8)', 
        padding: '16px 24px', 
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(20px)',
        position: 'absolute',
        width: '100%',
        top: 0,
        boxSizing: 'border-box',
        zIndex: 10
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{ width: '32px', height: '32px', background: 'var(--color-gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <span style={{color: '#0A0A0A', fontSize: '0.9rem', fontWeight: 'bold'}}>LB</span>
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', margin: 0, fontWeight: 700, letterSpacing: '-0.01em', color: '#fff' }}>
              Lux Butler
            </h1>
            <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
               <span style={{width:'6px', height:'6px', background:'#10B981', borderRadius:'50%'}}></span>
               <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0 }}>Online</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Messages Area */}
      <div style={{ flex: 1, padding: '90px 20px 20px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
            <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '12px', letterSpacing: '-0.02em' }}>Welcome</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', maxWidth: '300px', margin: '0 auto', lineHeight:'1.5' }}>
              I am your AI concierge. How can I assist you with your stay?
            </p>
          </div>
        )}

        {/* Quick Actions Grid */}
        {messages.length < 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '0 auto', width: '100%', maxWidth: '600px' }}>
            <QuickAction label="WiFi Access" query="What is the WiFi password?" />
            <QuickAction label="Check-out Info" query="What are the check-out instructions?" />
            <QuickAction label="House Guide" query="What are the house rules?" />
            <QuickAction label="Local Tips" query="What are good restaurants nearby?" />
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <div style={{ 
              padding: '16px 20px', 
              borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              background: m.role === 'user' ? 'var(--color-gold)' : 'var(--color-bg-surface)',
              color: m.role === 'user' ? '#0A0A0A' : 'var(--color-text-main)',
              border: m.role === 'assistant' ? '1px solid var(--color-border)' : 'none',
              fontSize: '1rem',
              lineHeight: '1.6',
              fontWeight: m.role === 'user' ? 500 : 400,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: 'transparent', padding: '0' }}>
            <div style={{ display: 'flex', gap: '4px', marginLeft:'12px', opacity: 0.6 }}>
              <span style={{ width:'6px', height:'6px', background:'var(--color-gold)', borderRadius:'50%', animation: 'bounce 1s infinite', animationDelay: '0s' }}></span>
              <span style={{ width:'6px', height:'6px', background:'var(--color-gold)', borderRadius:'50%', animation: 'bounce 1s infinite', animationDelay: '0.2s' }}></span>
              <span style={{ width:'6px', height:'6px', background:'var(--color-gold)', borderRadius:'50%', animation: 'bounce 1s infinite', animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ 
        background: 'var(--color-bg)', 
        padding: '16px 20px', 
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: '12px',
        alignItems:'center'
      }}>
        <input 
          style={{ 
            flex: 1, 
            padding: '16px 24px', 
            borderRadius: '100px', 
            border: '1px solid var(--color-border)', 
            background: 'var(--color-bg-surface)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            fontFamily: 'var(--font-main)',
            transition: 'border-color 0.3s'
          }}
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything..."
          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
        <button 
          onClick={() => sendMessage()}
          style={{ 
            width: '54px', 
            height: '54px', 
            borderRadius: '50%', 
            background: 'var(--color-gold)', 
            color: '#0A0A0A', 
            border: 'none',
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ➤
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
    </div>
  );
}
