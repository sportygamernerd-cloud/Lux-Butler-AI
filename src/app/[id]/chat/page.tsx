'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user' as const, content: input };
    setMessages([...messages, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, propertyId: id })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '600px', margin: '0 auto', borderLeft: '1px solid #333', borderRight: '1px solid #333' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #D4AF37', textAlign: 'center' }}>
        <h1 className="lux-title" style={{ fontSize: '1.5rem', margin: 0 }}>LuxButler</h1>
        <p style={{ color: '#888', fontSize: '0.8rem' }}>Your Personal Palace Concierge</p>
      </div>
      
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 && <p style={{ textAlign: 'center', color: '#555', marginTop: '50px' }}>Welcome. How may I assist you today?</p>}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
            {m.content}
          </div>
        ))}
        {loading && <div className="chat-bubble-ai">Thinking...</div>}
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            className="lux-input" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about WiFi, Pool, AC..."
          />
          <button className="lux-button" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
