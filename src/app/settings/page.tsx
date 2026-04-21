"use client";

import { useState } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import Header from "@frontend/components/Navigation/Header";
import styles from "./settings.module.css";
import { Lock, Trash2, ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (!user) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: "Update failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This will permanently erase ALL your data, entries, and progress. This action cannot be undone.")) {
      try {
        const res = await fetch("/api/auth/profile/delete", { method: "DELETE" });
        if (res.ok) {
          alert("Your account has been deleted.");
          window.location.href = "/login";
        }
      } catch {
        alert("Failed to delete account");
      }
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={`${styles.card} animate-fade-in`}>
        <div className={styles.header}>
          <h1>Settings</h1>
          <p>Managed your account and security</p>
        </div>

        {message.text && (
          <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
            {message.text}
          </div>
        )}

        <section className={styles.section}>
          <h2><Lock size={22} /> Change Password</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className={styles.field}>
              <label>New Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Confirm New Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Updating..." : "Update Password"} <Save size={18} />
            </button>
          </form>
        </section>

        <div className={styles.deleteZone}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '15px' }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Danger Zone</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button onClick={handleDeleteAccount} className={styles.deleteBtn}>
            Delete My Account <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
