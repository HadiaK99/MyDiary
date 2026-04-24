"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import { UserRole, User } from "@shared/types";
import styles from "./login.module.css";
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
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.logoArea}>
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'white' }}>
            <Star size={32} />
          </div>
          <h1>Join the Club</h1>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Start your moral journey today!</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>I am a...</label>
            <div className={styles.roleSelect}>
              {(["CHILD", "PARENT", "ADMIN"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`${styles.roleBtn} ${role === r ? styles.roleBtnActive : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={styles.inputField}
              placeholder="Pick a cool name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.inputField}
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {role === "PARENT" && (
            <div className={styles.inputGroup}>
              <label htmlFor="child">Link his/her Child</label>
              <select
                id="child"
                className={styles.inputField}
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

          <button type="submit" className={styles.submitBtn}>
            Create My Account <Sparkles size={20} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
          </button>
        </form>

        <p className={styles.switchAuth}>
          Already have an account? <button
            type="button"
            onClick={() => router.push("/login")}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 'inherit', fontFamily: 'inherit' }}
          >Log In</button>
        </p>
      </div>
    </div>
  );
}
