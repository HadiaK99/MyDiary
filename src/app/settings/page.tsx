"use client";

import { useState } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import Header from "@frontend/components/Navigation/Header";
import styles from "./settings.module.css";
import { Lock, Trash2, Save, AlertCircle, AlertTriangle } from "lucide-react";
import Modal from "@frontend/components/Common/Modal";

export default function SettingsPage() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
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
        body: JSON.stringify({ 
          username, 
          password: password || undefined 
        }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Account updated successfully!" });
        setPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Update failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile/delete", { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/login";
      } else {
        alert("Failed to delete account");
      }
    } catch {
      alert("Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
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
          <h2><Lock size={22} /> Account Settings</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className={styles.field}>
              <label>Username</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {!showPasswordForm ? (
              <button 
                type="button" 
                className={styles.saveBtn} 
                onClick={() => setShowPasswordForm(true)}
                style={{ marginTop: '20px' }}
              >
                <Lock size={18} /> Change Username and Password
              </button>
            ) : (
              <>
                <div className={styles.field}>
                  <label>New Password (Optional)</label>
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
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" className={styles.saveBtn} disabled={loading}>
                    {loading ? "Updating..." : "Update Password"} <Save size={18} />
                  </button>
                  <button 
                    type="button" 
                    className={styles.cancelBtn} 
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
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

      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalIcon}>
            <AlertTriangle size={48} color="#ef4444" />
          </div>
          <p>Are you sure you want to delete your account? This will <strong>permanently erase</strong> ALL your data, entries, and progress. </p>
          <p className={styles.modalNote}>This action cannot be undone.</p>
          
          <div className={styles.modalActions}>
            <button 
              className={styles.cancelBtn} 
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Cancel, I'll stay
            </button>
            <button 
              className={styles.confirmDeleteBtn} 
              onClick={confirmDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete Everything"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
