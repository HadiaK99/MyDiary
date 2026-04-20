"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@frontend/context/AuthContext";
import styles from "./login.module.css";
import Link from "next/link";
import { Smile, BookOpen } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      login(username, password);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.logoArea}>
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'white' }}>
            <BookOpen size={32} />
          </div>
          <h1>My Diary</h1>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Welcome back, Hero!</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={styles.inputField}
              placeholder="Your username"
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
              placeholder="Your secret code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Let's Go! <Smile size={20} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
          </button>
        </form>

        <p className={styles.switchAuth}>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
