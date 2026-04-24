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
  const [childId, setChildId] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      signup(username, role, password, role === "PARENT" ? childId : undefined);
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
              <label htmlFor="child">Link his/her Child</label>
              <select
                id="child"
                className="input-field"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                required
              >
                <option value="">Select your child</option>
                {availableChildren.map(child => (
                  <option key={child.id} value={child.id}>{child.username}</option>
                ))}
              </select>
              {availableChildren.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '5px' }}>
                  No children accounts found. Create one first!
                </p>
              )}
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
