"use client";

import { useState, useEffect } from "react";
import styles from "./UserEditor.module.css";
import { X, UserPlus, Shield, User, Users } from "lucide-react";
import { User as UserType } from "@frontend/context/AuthContext";

interface UserEditorProps {
  onClose: () => void;
  onSave: () => void;
}

export default function UserEditor({ onClose, onSave }: UserEditorProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CHILD" | "PARENT" | "ADMIN">("CHILD");
  const [childId, setChildId] = useState("");
  const [childUsers, setChildUsers] = useState<UserType[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch child users for parent linking
    const fetchChildren = async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setChildUsers(data.users.filter((u: any) => u.role === "CHILD"));
      }
    };
    fetchChildren();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !role) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          role,
          childId: role === "PARENT" ? childId : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add New User</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className={styles.body}>
            {error && (
              <div style={{ color: "#e11d48", background: "#fff1f2", padding: "10px 15px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.9rem", border: "1px solid #ffe4e6", fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                className={styles.input}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Initial Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Set temporary password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Assign Role</label>
              <div className={styles.roleGrid}>
                <div 
                  className={`${styles.roleOption} ${role === "CHILD" ? styles.roleOptionActive : ""}`}
                  onClick={() => setRole("CHILD")}
                >
                  <User size={18} style={{ marginBottom: 4 }} />
                  <div>Child</div>
                </div>
                <div 
                  className={`${styles.roleOption} ${role === "PARENT" ? styles.roleOptionActive : ""}`}
                  onClick={() => setRole("PARENT")}
                >
                  <Users size={18} style={{ marginBottom: 4 }} />
                  <div>Parent</div>
                </div>
                <div 
                  className={`${styles.roleOption} ${role === "ADMIN" ? styles.roleOptionActive : ""}`}
                  onClick={() => setRole("ADMIN")}
                >
                  <Shield size={18} style={{ marginBottom: 4 }} />
                  <div>Admin</div>
                </div>
              </div>
            </div>

            {role === "PARENT" && (
              <div className={styles.formGroup}>
                <label>Link to Child Account</label>
                <select 
                  className={styles.select}
                  value={childId}
                  onChange={(e) => setChildId(e.target.value)}
                  required
                >
                  <option value="">Select a child...</option>
                  {childUsers.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.username}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              <UserPlus size={18} /> {saving ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
