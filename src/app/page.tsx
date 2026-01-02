'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
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
  };

  const generateQR = async (id: string) => {
    const url = `${window.location.origin}/${id}/chat`;
    const qr = await QRCode.toDataURL(url);
    const win = window.open("");
    win?.document.write(`<img src="${qr}" /><br> Scan to chat with LuxButler`);
  };

  return (
    <main className="lux-container">
      <h1 className="lux-title" style={{ textAlign: 'center', margin: '40px 0' }}>LuxButler AI</h1>
      
      <div className="lux-card">
        <h2>Add Property</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input className="lux-input" placeholder="Property Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input className="lux-input" placeholder="Airbnb Link" value={formData.airbnb_link} onChange={e => setFormData({...formData, airbnb_link: e.target.value})} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input className="lux-input" placeholder="WiFi SSID" value={formData.wifi_ssid} onChange={e => setFormData({...formData, wifi_ssid: e.target.value})} />
            <input className="lux-input" placeholder="WiFi Password" value={formData.wifi_password} onChange={e => setFormData({...formData, wifi_password: e.target.value})} />
          </div>
          <textarea className="lux-input" placeholder="Entrance Instructions" value={formData.instructions_entree} onChange={e => setFormData({...formData, instructions_entree: e.target.value})} />
          <textarea className="lux-input" placeholder="House Secrets" value={formData.secrets_maison} onChange={e => setFormData({...formData, secrets_maison: e.target.value})} />
          <button type="submit" className="lux-button">Create Property</button>
        </form>
      </div>

      <div className="lux-card">
        <h2>Properties</h2>
        {properties.map(p => (
          <div key={p.id} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{p.name}</span>
            <button className="lux-button" style={{ fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => generateQR(p.id)}>Get QR</button>
          </div>
        ))}
      </div>
    </main>
  );
}
