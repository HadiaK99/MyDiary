"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { X, UserPlus, Shield, User, Users, Save, Check } from "lucide-react";
import { User as UserType } from "@shared/types";
import { Button } from "../Common/Button";

interface UserEditorProps {
  onClose: () => void;
  onSave: () => void;
  initialUser?: UserType & { children?: { id: string, username: string }[] };
}

const EditorOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const EditorContent = styled.div`
  background: white;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .header {
    padding: 24px 30px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8fafc;

    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #1e293b;
      font-weight: 800;
    }

    .close-btn {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 8px;
      border-radius: 10px;
      cursor: pointer;
      color: #94a3b8;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #f1f5f9;
        color: #ef4444;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .body {
    padding: 30px;
    overflow-y: auto;
    flex-grow: 1;
  }

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      font-size: 0.9rem;
      font-weight: 700;
      color: #475569;
      margin-bottom: 8px;
    }

    input, select {
      width: 100%;
      padding: 12px 15px;
      border-radius: 12px;
      border: 1.5px solid #e2e8f0;
      font-family: inherit;
      font-size: 1rem;
      outline: none;
      transition: all 0.2s;
      background: white;

      &:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-glow);
      }
    }
  }

  .role-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .role-option {
    flex: 1 1 calc(33.333% - 7px);
    min-width: 80px;
    padding: 10px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.85rem;
    transition: all 0.2s;
    color: #64748b;
    display: flex;
    flex-direction: column;
    align-items: center;

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    &.active {
      background: var(--primary-glow);
      border-color: var(--primary);
      color: var(--primary);
    }
  }

  .children-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
    margin-top: 10px;
  }

  .child-option {
    padding: 10px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s;

    &:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    &.active {
      background: #dcfce7;
      border-color: #22c55e;
      color: #166534;
    }
  }

  .footer {
    padding: 24px 30px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    gap: 12px;
    background: #f8fafc;
  }

  @media (max-width: 480px) {
    border-radius: 0;
    max-height: 100vh;
    .body { padding: 20px; }
  }
`;

export default function UserEditor({ onClose, onSave, initialUser }: UserEditorProps) {
  const isEdit = !!initialUser;
  const [username, setUsername] = useState(initialUser?.username || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CHILD" | "PARENT" | "ADMIN">(initialUser?.role as any || "CHILD");
  const [selectedChildren, setSelectedChildren] = useState<string[]>(
    initialUser?.children?.map(c => c.id) || []
  );
  const [childUsers, setChildUsers] = useState<UserType[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch child users for parent linking
    const fetchChildren = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          console.error("Failed to fetch users:", await res.text());
          return;
        }
        const data = await res.json();
        if (data.users) {
          setChildUsers(data.users.filter((u: UserType) => u.role === "CHILD"));
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };
    fetchChildren();
  }, []);

  const toggleChild = (id: string) => {
    setSelectedChildren(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || (!isEdit && !password) || !role) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload: any = {
        username,
        role,
        childrenIds: role === "PARENT" ? selectedChildren : [],
      };
      if (password) payload.password = password;
      if (isEdit) payload.id = initialUser.id;

      const res = await fetch("/api/admin/users", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${isEdit ? 'update' : 'create'} user`);

      onSave();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorOverlay onClick={onClose}>
      <EditorContent onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h2>{isEdit ? "Edit User" : "Add New User"}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="body">
            {error && (
              <div style={{ color: "#e11d48", background: "#fff1f2", padding: "10px 15px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.9rem", border: "1px solid #ffe4e6", fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Username</label>
              <input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>{isEdit ? "Change Password (optional)" : "Initial Password"}</label>
              <input
                type="password"
                placeholder={isEdit ? "Leave blank to keep current" : "Set temporary password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isEdit}
              />
            </div>

            <div className="form-group">
              <label>Assign Role</label>
              <div className="role-grid">
                <div 
                  className={`role-option ${role === "CHILD" ? 'active' : ""}`}
                  onClick={() => setRole("CHILD")}
                >
                  <User size={18} style={{ marginBottom: 4 }} />
                  <div>Child</div>
                </div>
                <div 
                  className={`role-option ${role === "PARENT" ? 'active' : ""}`}
                  onClick={() => setRole("PARENT")}
                >
                  <Users size={18} style={{ marginBottom: 4 }} />
                  <div>Parent</div>
                </div>
                <div 
                  className={`role-option ${role === "ADMIN" ? 'active' : ""}`}
                  onClick={() => setRole("ADMIN")}
                >
                  <Shield size={18} style={{ marginBottom: 4 }} />
                  <div>Admin</div>
                </div>
              </div>
            </div>

            {role === "PARENT" && (
              <div className="form-group">
                <label>Link to Children (Multi-select)</label>
                <div className="children-grid">
                  {childUsers.map(child => (
                    <div 
                      key={child.id}
                      className={`child-option ${selectedChildren.includes(child.id) ? 'active' : ''}`}
                      onClick={() => toggleChild(child.id)}
                    >
                      {selectedChildren.includes(child.id) ? <Check size={14} /> : <User size={14} />}
                      {child.username}
                    </div>
                  ))}
                  {childUsers.length === 0 && (
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>No children found.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="footer">
            <Button type="button" variant="secondary" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} fullWidth style={{ flex: 2 }}>
              {isEdit ? <Save size={18} style={{ marginRight: '8px' }} /> : <UserPlus size={18} style={{ marginRight: '8px' }} />}
              {saving ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create User")}
            </Button>
          </div>
        </form>
      </EditorContent>
    </EditorOverlay>
  );
}
