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
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '12px',
        textAlign: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        height: '100%'
      }}
      className="quick-action-btn"
    >
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-navy)' }}>{label}</span>
      <span style={{ fontSize: '0.7rem', color: '#888' }}>Tap to ask</span>
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F9FAFB', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <header style={{ 
        background: 'var(--color-white)', 
        padding: '15px 20px', 
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-navy)', fontWeight: 700, letterSpacing: '1px' }}>
            LUX<span style={{color: 'var(--color-gold)'}}>BUTLER</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>Concierge</p>
        </div>
        <div style={{ width: '30px', height: '30px', background: 'var(--color-navy)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{color: 'var(--color-gold)', fontSize: '0.8rem'}}>LB</span>
        </div>
      </header>
      
      {/* Messages Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: 'auto' }}>
            <div style={{ 
              width: '60px', height: '60px', background: 'var(--color-navy)', color: 'var(--color-gold)', 
              borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' 
            }}>✨</div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '5px' }}>Welcome, Guest</h2>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', maxWidth: '80%', margin: '0 auto' }}>
              I am your personal AI butler. How can I assist you with your stay today?
            </p>
          </div>
        )}

        {/* Quick Actions Grid (Only show if no messages or just starting) */}
        {messages.length < 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', margin: '0 auto', maxWidth: '100%', width: '100%' }}>
            <QuickAction label="WiFi Password" query="What is the WiFi password?" />
            <QuickAction label="Check-out" query="What are the check-out instructions?" />
            <QuickAction label="House Rules" query="What are the house rules?" />
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? 'var(--color-navy)' : 'var(--color-white)',
              color: m.role === 'user' ? 'var(--color-white)' : 'var(--color-text-dark)',
              boxShadow: m.role === 'assistant' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              {m.content}
            </div>
            {m.role === 'assistant' && (
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px', marginLeft: '10px' }}>Butler</div>
            )}
          </div>
        ))}
        
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '10px 15px', borderRadius: '18px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ animation: 'bounce 1s infinite', animationDelay: '0s' }}>•</span>
              <span style={{ animation: 'bounce 1s infinite', animationDelay: '0.2s' }}>•</span>
              <span style={{ animation: 'bounce 1s infinite', animationDelay: '0.4s' }}>•</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ 
        background: 'var(--color-white)', 
        padding: '15px', 
        borderTop: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        gap: '10px'
      }}>
        <input 
          style={{ 
            flex: 1, 
            padding: '12px 16px', 
            borderRadius: '24px', 
            border: '1px solid #E5E7EB', 
            fontSize: '1rem',
            outline: 'none',
            fontFamily: 'var(--font-body)'
          }}
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button 
          onClick={() => sendMessage()}
          style={{ 
            width: '45px', 
            height: '45px', 
            borderRadius: '50%', 
            background: 'var(--color-navy)', 
            color: 'var(--color-gold)', 
            border: 'none',
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
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
