"use client";

import { useState } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import { AuthContainer } from "@frontend/components/Auth/AuthStyles";
import { Button } from "@frontend/components/Common/Button";
import { useRouter } from "next/navigation";
import { Smile, BookOpen } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

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
            <label htmlFor="password">Password</label>
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
