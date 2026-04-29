"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import { UserRole, User } from "@shared/types";
import { AuthContainer } from "@frontend/components/Auth/AuthStyles";
import { Button } from "@frontend/components/Common/Button";
import { useRouter } from "next/navigation";
import { Sparkles, Star } from "lucide-react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CHILD");
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [availableChildren, setAvailableChildren] = useState<User[]>([]);
  const { signup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchChildren = async () => {
      const res = await fetch("/api/children");
      const data = await res.json();
      if (data.users) {
        setAvailableChildren(data.users);
      }
    };
    fetchChildren();
  }, []);

  const toggleChild = (id: string) => {
    setSelectedChildIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      signup(username, role, password, role === "PARENT" ? selectedChildIds : undefined);
    }
  };

  return (
    <AuthContainer>
      <div className="auth-card">
        <div className="logo-area">
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'white' }}>
            <Star size={32} />
          </div>
          <h1>Join the Club</h1>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Start your moral journey today!</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>I am a...</label>
            <div className="role-select">
              {(["CHILD", "PARENT", "ADMIN"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`role-btn ${role === r ? 'active' : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="Pick a cool name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {role === "PARENT" && (
            <div className="input-group">
              <label>Select your children</label>
              <div style={{ 
                maxHeight: '160px', 
                overflowY: 'auto', 
                border: '1.5px solid #e2e8f0', 
                borderRadius: '12px',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '8px'
              }}>
                {availableChildren.length > 0 ? (
                  availableChildren.map(child => (
                    <div 
                      key={child.id} 
                      onClick={() => toggleChild(child.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        background: selectedChildIds.includes(child.id) ? '#f5f3ff' : '#f8fafc',
                        border: '1px solid',
                        borderColor: selectedChildIds.includes(child.id) ? '#ddd6fe' : '#f1f5f9',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid',
                        borderColor: selectedChildIds.includes(child.id) ? 'var(--primary)' : '#cbd5e1',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: selectedChildIds.includes(child.id) ? 'var(--primary)' : 'white',
                        color: 'white'
                      }}>
                        {selectedChildIds.includes(child.id) && <Star size={12} fill="white" />}
                      </div>
                      <span style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 600,
                        color: selectedChildIds.includes(child.id) ? 'var(--primary)' : '#475569'
                      }}>{child.username}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ 
                    fontSize: '0.8rem', 
                    color: '#ef4444', 
                    textAlign: 'center', 
                    padding: '10px',
                    gridColumn: '1 / -1'
                  }}>
                    No children accounts found. Create one first!
                  </p>
                )}
              </div>
            </div>
          )}

          <Button type="submit" fullWidth size="large">
            Create My Account <Sparkles size={20} style={{ marginLeft: '10px' }} />
          </Button>
        </form>

        <p className="switch-auth">
          Already have an account? <button
            type="button"
            onClick={() => router.push("/login")}
          >Log In</button>
        </p>
      </div>
    </AuthContainer>
  );
}
