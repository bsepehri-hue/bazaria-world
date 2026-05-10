"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { 
  Users, TrendingUp, ShieldCheck, Search, 
  Award, Settings, UserCircle, ChevronRight, Activity
} from "lucide-react";

export default function LicenseHolderHub() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchTerritoryData() {
      try {
        const q = query(collection(db, "users"), where("role", "==", "user"));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(docs);
      } catch (err) { console.error("Registry Sync Fail:", err); }
      setLoading(false);
    }
    fetchTerritoryData();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', fontFamily: 'sans-serif', color: '#000', overflow: 'hidden' }}>
      
      {/* 🧭 THE COMMAND COLUMN (Sidebar) */}
      <aside style={{ width: '280px', backgroundColor: '#0f172a', height: '100vh', position: 'sticky', top: 0, padding: '32px', color: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '10px 0 40px rgba(0,0,0,0.1)', flexShrink: 0 }}>
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <ShieldCheck size={26} style={{ color: '#14b8a6' }} strokeWidth={2.5} />
            <span style={{ fontWeight: 1000, fontSize: '20px', textTransform: 'uppercase', letterSpacing: '-0.04em' }}>BAZARIA</span>
          </div>
          <p style={{ fontSize: '8px', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4em' }}>PROTOCOL: COMMAND</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Customer Registry', icon: <Users size={16} />, active: true },
            { label: 'Market Pulse', icon: <Activity size={16} /> },
            { label: 'Reward Vaults', icon: <Award size={16} /> },
            { label: 'License Settings', icon: <Settings size={16} /> },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', borderRadius: '16px', backgroundColor: item.active ? '#fff' : 'transparent', color: item.active ? '#000' : '#475569', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}>
              {item.icon} {item.label}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '8px', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '10px' }}>System Health</p>
          <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '98%', backgroundColor: '#14b8a6' }}></div>
          </div>
        </div>
      </aside>

      {/* 🖥️ THE REGISTRY MAINBOARD */}
      <main style={{ flex: 1, padding: '4vw', maxWidth: 'calc(100vw - 280px)', overflowY: 'auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ textAlign: 'left', flex: '1 1 300px' }}>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 1000, textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '0.9', margin: 0 }}>Customer<br/>Portfolio</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
               <div style={{ height: '2px', width: '24px', backgroundColor: '#14b8a6' }}></div>
               <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5em', margin: 0 }}>Registry Management</p>
            </div>
          </div>
          
          <div style={{ position: 'relative', flex: '0 1 340px' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={16} />
            <input 
              placeholder="SEARCH PROTOCOL..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ height: '56px', width: '100%', backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '18px', paddingLeft: '52px', paddingRight: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', outline: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.03)' }}
            />
          </div>
        </header>

        {/* 📊 THE DATA LEDGER */}
        <div style={{ backgroundColor: '#fff', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fcfdfe', borderBottom: '1px solid #f1f5f9' }}>
                  {['Sovereign Identity', 'Status', 'Pulse Points', 'Operations'].map((h, i) => (
                    <th key={i} style={{ padding: '20px 32px', textAlign: 'left', fontSize: '9px', fontWeight: 1000, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', fontSize: '10px', fontWeight: 900, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.4em' }}>Syncing...</td></tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', fontSize: '10px', fontWeight: 900, color: '#cbd5e1', textTransform: 'uppercase' }}>No Registry Entries Identified</td></tr>
                ) : filteredCustomers.map((user, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                           <UserCircle size={24} style={{ color: '#94a3b8' }} strokeWidth={1.5} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 1000, color: '#000' }}>{user.displayName || 'ANONYMOUS ASSET'}</div>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', backgroundColor: '#f0fdfa', color: '#14b8a6', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#14b8a6' }} /> Active
                      </div>
                    </td>
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 1000 }}>
                         <Award size={16} style={{ color: '#14b8a6' }} /> {user.pulsePoints || 0}
                      </div>
                    </td>
                    <td style={{ padding: '20px 32px' }}>
                      <button style={{ height: '42px', padding: '0 20px', backgroundColor: '#000', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Portfolio <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
