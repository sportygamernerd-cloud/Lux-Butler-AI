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
    const qr = await QRCode.toDataURL(url, { 
      color: { dark: '#121212', light: '#D4AF37' },
      width: 400
    });
    const win = window.open("");
    win?.document.write(`<div style="text-align:center; font-family: 'Montserrat', sans-serif; padding: 60px; background: #121212; height: 100vh; color: #EAEAEA;">
      <h1 style="color:#D4AF37; margin-bottom:10px; text-transform:uppercase; letter-spacing:4px;">Lux Butler</h1>
      <p style="color:#A0A0A0; margin-bottom:40px; font-weight:300;">COMPLIMENTARY CONCIERGE ACCESS</p>
      <div style="background:#fff; padding:20px; display:inline-block; border-radius:12px;">
         <img src="${qr}" width="300" />
      </div>
      <p style="margin-top:30px; font-size:0.9rem; color:#555;">Scan to connect instantly</p>
    </div>`);
  };

  if (!showDashboard) {
    return (
      <main className="min-h-screen">
        {/* Navigation */}
        <nav className="lux-nav">
          <div className="container flex" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div className="lux-title" style={{fontSize: '1.5rem', fontWeight:'bold'}}>
              LUX<span>BUTLER</span>
            </div>
            <button className="lux-button secondary icon-btn" onClick={() => setShowDashboard(true)}>
              Owner Login
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container" style={{padding: '80px 20px', textAlign:'center'}}>
          <h1 style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '20px', color: '#fff'}}>
            Elegance is in the <br/><span style={{color: 'var(--color-gold)', fontStyle:'italic'}}>Details</span>
          </h1>
          <p style={{fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 50px', lineHeight:'1.8'}}>
            The AI Concierge that transforms your rental into a 5-star experience. Use the power of Artificial Intelligence to serve your guests 24/7.
          </p>
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
            <button className="lux-button" onClick={() => setShowDashboard(true)}>
              Start for Free
            </button>
            <button className="lux-button secondary">
              View Sample
            </button>
          </div>
        </section>

        {/* Feature Grid */}
        <section style={{background: '#1A1A1A', padding: '80px 0', borderTop:'1px solid #333'}}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{borderColor:'#333', background:'#121212'}}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', color:'#fff'}}>24/7 Butler</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Instant, polite responses to every question about WiFi, amenities, and local tips.</p>
            </div>
            <div className="card" style={{borderColor:'#333', background:'#121212'}}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', color:'#fff'}}>Zero App Download</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Guests simply scan a premium QR code placed in your property to chatting instantly.</p>
            </div>
            <div className="card" style={{borderColor:'#333', background:'#121212'}}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '1rem', color:'#fff'}}>Polyglot Service</h3>
              <p style={{color: 'var(--color-text-muted)'}}>Fluent in over 50 languages to welcome guests from all over the world.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Dashboard styles
  return (
    <main className="min-h-screen">
      <nav className="lux-nav">
        <div className="container flex" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="lux-title" style={{fontSize: '1.2rem', fontWeight:'bold'}}>
            LUX<span>BUTLER</span> <span style={{opacity:0.5, fontSize:'0.7em', color:'#fff', marginLeft:'10px'}}>DASHBOARD</span>
          </div>
          <button onClick={() => setShowDashboard(false)} style={{color:'#A0A0A0', background:'transparent', border:'none', cursor:'pointer', fontFamily:'var(--font-heading)', textTransform:'uppercase', fontSize:'0.8rem'}}>Logout</button>
        </div>
      </nav>

      <div className="container" style={{marginTop: '40px', paddingBottom:'40px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '30px'}}>
            {/* Desktop grid tweak */}
            <style jsx>{`
               @media (min-width: 768px) {
                 div[style*="grid"] { grid-template-columns: 1fr 2fr !important; }
               }
            `}</style>
          
          {/* Add Property Form */}
          <div className="card">
            <h2 style={{fontSize: '1.25rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color:'#fff'}}>
              <span style={{color: 'var(--color-gold)'}}>✦</span> New Property
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '8px', color:'var(--color-gold)', letterSpacing:'1px', textTransform:'uppercase'}}>Property Name</label>
                <input className="lux-input" placeholder="e.g. The Golden Villa" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '8px', color:'var(--color-gold)', letterSpacing:'1px', textTransform:'uppercase'}}>WiFi Configuration</label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                  <input className="lux-input" placeholder="SSID" value={formData.wifi_ssid} onChange={e => setFormData({...formData, wifi_ssid: e.target.value})} />
                  <input className="lux-input" placeholder="Password" value={formData.wifi_password} onChange={e => setFormData({...formData, wifi_password: e.target.value})} />
                </div>
              </div>

              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '8px', color:'var(--color-gold)', letterSpacing:'1px', textTransform:'uppercase'}}>Access Details</label>
                <textarea className="lux-textarea" rows={2} placeholder="Keybox code, Gate instructions..." value={formData.instructions_entree} onChange={e => setFormData({...formData, instructions_entree: e.target.value})} />
              </div>

              <div style={{marginBottom: '25px'}}>
                <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '8px', color:'var(--color-gold)', letterSpacing:'1px', textTransform:'uppercase'}}>House Compendium</label>
                <textarea className="lux-textarea" rows={4} placeholder="Pool heating instructions, AC controls, local trash rules..." value={formData.secrets_maison} onChange={e => setFormData({...formData, secrets_maison: e.target.value})} />
              </div>

              <button type="submit" className="lux-button" style={{width: '100%'}}>Create Property</button>
            </form>
          </div>

          {/* Properties List */}
          <div>
            <h2 style={{fontSize: '1.5rem', marginBottom: '25px', color:'#fff'}}>Managed Properties</h2>
            {properties.length === 0 ? (
              <div style={{textAlign: 'center', padding: '60px', color: '#555', border:'1px dashed #333', borderRadius: '12px'}}>
                No properties added yet.
              </div>
            ) : (
              <div style={{display: 'grid', gap: '20px'}}>
                {properties.map(p => (
                  <div key={p.id} className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin:0, padding:'20px 25px'}}>
                    <div>
                      <h3 style={{fontSize: '1.1rem', marginBottom: '5px', color:'#fff'}}>{p.name}</h3>
                      <p style={{color: '#666', fontSize: '0.8rem', margin:0}}>WiFi: <span style={{color:'#888'}}>{p.wifi_ssid || 'Not set'}</span></p>
                    </div>
                    <div>
                       <button 
                        className="lux-button secondary icon-btn" 
                        onClick={() => generateQR(p.id)}
                      >
                        <span style={{fontSize:'1.2em'}}>⚄</span> QR CODE
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
