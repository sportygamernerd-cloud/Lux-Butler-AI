'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function LandingPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    airbnb_link: '',
    wifi_ssid: '',
    wifi_password: '',
    instructions_entree: '',
    secrets_maison: ''
  });

  useEffect(() => {
    fetch('/api/properties').then(res => res.json()).then(setProperties);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const newProp = await res.json();
    setProperties([...properties, newProp]);
    setFormData({ name: '', airbnb_link: '', wifi_ssid: '', wifi_password: '', instructions_entree: '', secrets_maison: '' });
  };

  const generateQR = async (id: string) => {
    const url = `${window.location.origin}/${id}/chat`;
    const qr = await QRCode.toDataURL(url);
    const win = window.open("");
    win?.document.write(`<div style="text-align:center; font-family: sans-serif; padding: 40px;">
      <h1 style="color:#0A192F; margin-bottom:10px;">Deep Butler Access</h1>
      <p style="color:#666; margin-bottom:30px;">Scan to connect with your villa concierge</p>
      <img src="${qr}" width="300" style="border: 1px solid #ddd; padding: 20px; border-radius: 10px;" />
    </div>`);
  };

  if (!showDashboard) {
    return (
      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="container flex items-center justify-between py-6">
          <div className="text-2xl font-bold" style={{color: 'var(--color-navy)', fontFamily: 'var(--font-heading)'}}>
            LUX<span style={{color: 'var(--color-gold)'}}>BUTLER</span>
          </div>
          <button className="lux-button secondary" onClick={() => setShowDashboard(true)}>
            Owner Login
          </button>
        </nav>

        {/* Hero Section */}
        <section className="container py-20 text-center">
          <h1 style={{fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '20px'}}>
            Reduce your messages<br/><span style={{color: 'var(--color-gold)'}}>by 80%</span>
          </h1>
          <p style={{fontSize: '1.25rem', color: '#4B5563', maxWidth: '600px', margin: '0 auto 40px'}}>
            The AI Concierge that handles your guest inquiries 24/7 with the elegance of a 5-star hotel butler.
          </p>
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
            <button className="lux-button lux-button-gold" onClick={() => setShowDashboard(true)}>
              Get Started Free
            </button>
            <button className="lux-button secondary">
              View Demo
            </button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-gray-50 py-20">
          <div className="container grid md:grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>24/7 Availability</h3>
              <p style={{color: '#666'}}>Your guests get instant answers to WiFi, check-out, and appliance questions anytime.</p>
            </div>
            <div className="card">
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Mobile First</h3>
              <p style={{color: '#666'}}>No app to download. Guests simply scan a QR code to start chatting instantly.</p>
            </div>
            <div className="card">
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Multi-Language</h3>
              <p style={{color: '#666'}}>The AI speaks your guest's language fluently, breaking down communication barriers.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Dashboard View for Owners
  return (
    <main className="min-h-screen" style={{background: '#F3F4F6'}}>
      <nav style={{background: 'var(--color-navy)', padding: '1rem 0'}}>
        <div className="container flex justify-between items-center" style={{display: 'flex', justifyContent: 'space-between'}}>
          <div className="text-xl font-bold text-white" style={{color: '#fff', fontFamily: 'var(--font-heading)'}}>
            LUX<span style={{color: 'var(--color-gold)'}}>BUTLER</span> <span style={{opacity:0.5, fontSize:'0.8em'}}>Owner Dashboard</span>
          </div>
          <button onClick={() => setShowDashboard(false)} style={{color:'white', background:'transparent', border:'none', cursor:'pointer'}}>Logout</button>
        </div>
      </nav>

      <div className="container py-10" style={{marginTop: '40px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px'}}>
          
          {/* Add Property Form */}
          <div className="card">
            <h2 style={{fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              <span style={{color: 'var(--color-gold)'}}>+</span> Add New Property
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '5px', fontWeight: 600}}>Property Name</label>
                <input className="lux-input" placeholder="e.g. Villa Serenity" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '5px', fontWeight: 600}}>WiFi Details</label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                  <input className="lux-input" placeholder="Network Name (SSID)" value={formData.wifi_ssid} onChange={e => setFormData({...formData, wifi_ssid: e.target.value})} />
                  <input className="lux-input" placeholder="Password" value={formData.wifi_password} onChange={e => setFormData({...formData, wifi_password: e.target.value})} />
                </div>
              </div>

              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '5px', fontWeight: 600}}>Check-in / Entrance</label>
                <textarea className="lux-textarea" rows={3} placeholder="Keybox code, gate remote location..." value={formData.instructions_entree} onChange={e => setFormData({...formData, instructions_entree: e.target.value})} />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '5px', fontWeight: 600}}>House Secrets & Rules</label>
                <textarea className="lux-textarea" rows={4} placeholder="Pool heating, AC usage, trash day..." value={formData.secrets_maison} onChange={e => setFormData({...formData, secrets_maison: e.target.value})} />
              </div>

              <button type="submit" className="lux-button" style={{width: '100%'}}>Create Property</button>
            </form>
          </div>

          {/* Properties List */}
          <div>
            <h2 style={{fontSize: '1.5rem', marginBottom: '20px'}}>Your Properties</h2>
            {properties.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#888', background: 'white', borderRadius: '12px'}}>
                No properties yet. Add your first villa on the left.
              </div>
            ) : (
              <div style={{display: 'grid', gap: '20px'}}>
                {properties.map(p => (
                  <div key={p.id} className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin:0}}>
                    <div>
                      <h3 style={{fontSize: '1.2rem', marginBottom: '5px'}}>{p.name}</h3>
                      <p style={{color: '#666', fontSize: '0.9rem'}}>WiFi: {p.wifi_ssid || 'N/A'}</p>
                    </div>
                    <div>
                       <button 
                        className="lux-button secondary" 
                        style={{padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'}} 
                        onClick={() => generateQR(p.id)}
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2h2v2H2V2zm0 3h2v1H2V5zm0 3h2v1H2V8zm0 3h2v1H2v-1zM15 2h-2v2h2V2zm0 3h-2v1h2V5zm0 3h-2v1h2V8zm0 3h-2v1h2v-1zM3 3h10v10H3V3z"/></svg>
                        Get QR Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
