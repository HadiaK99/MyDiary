"use client";

import { useState } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@frontend/components/Navigation/Header";
import styles from "../login/login.module.css";
import { User, Lock, CheckCircle, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { user, login } = useAuth(); // We'll use a hack to refresh session or just redirect
  const router = useRouter();
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: password || undefined }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully! Pleaser relogin to see changes." });
        setTimeout(() => {
          window.location.reload(); // Refresh the whole state
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Update failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.authCard} style={{ marginTop: '40px' }}>
        <button 
          onClick={() => router.push("/")} 
          style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
        >
          <ArrowLeft size={24} />
        </button>

        <div className={styles.logoArea}>
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'white' }}>
            <User size={32} />
          </div>
          <h1>My Profile</h1>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Update your account details</p>
        </div>

        <form className={styles.form} onSubmit={handleUpdate}>
          {message.text && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '12px', 
              marginBottom: '20px', 
              fontSize: '0.9rem',
              background: message.type === 'success' ? '#dcfce7' : '#fef2f2',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              textAlign: 'center'
            }}>
              {message.text}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                id="username"
                type="text"
                className={styles.inputField}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">New Password (leave blank to keep current)</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                className={styles.inputField}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
            </div>
          </div>

          {password && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type="password"
                  className={styles.inputField}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <CheckCircle size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
