"use client";

import { useState } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import { AuthContainer } from "@frontend/components/Auth/AuthStyles";
import { Button } from "@frontend/components/Common/Button";
import { useRouter } from "next/navigation";
import { Smile, BookOpen } from "lucide-react";
import { useEffect } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.refresh();
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      login(username, password);
    }
  };

  return (
    <AuthContainer>
      <div className="auth-card">
        <div className="logo-area">
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'white' }}>
            <BookOpen size={32} />
          </div>
          <h1>My Diary</h1>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Welcome back, Hero!</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password</label>
              <button 
                type="button" 
                onClick={() => router.push("/forgot-password")}
                style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--primary)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Forgot Password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="Your secret code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" fullWidth size="large">
            Let's Go! <Smile size={20} style={{ marginLeft: '10px' }} />
          </Button>

          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            <span style={{ padding: '0 10px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          </div>

          <button 
            type="button" 
            className="google-btn"
            onClick={() => loginWithGoogle()}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#475569',
              transition: 'all 0.2s ease'
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google" />
            Continue with Google
          </button>
        </form>

        <p className="switch-auth">
          Don't have an account? <button 
            type="button" 
            onClick={() => router.push("/signup")}
          >Sign Up</button>
        </p>
      </div>
    </AuthContainer>
  );
}
