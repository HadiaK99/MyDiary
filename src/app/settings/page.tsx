"use client";

import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "@frontend/context/AuthContext";
import Header from "@frontend/components/Navigation/Header";
import { Button } from "@frontend/components/Common/Button";
import { Card } from "@frontend/components/Common/Card";
import Modal from "@frontend/components/Common/Modal";
import { Lock, Trash2, Save, AlertCircle, AlertTriangle, X } from "lucide-react";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeaderSection = styled.div`
  margin-bottom: 40px;
  text-align: center;

  h1 {
    font-size: 2.2rem;
    color: var(--text-main);
    margin-bottom: 8px;
  }

  p {
    color: #64748b;
    font-weight: 500;
  }
`;

const Section = styled.section`
  background: #f8fafc;
  padding: 30px;
  border-radius: var(--radius-md, 16px);
  margin-bottom: 30px;

  h2 {
    font-family: 'Fredoka', sans-serif;
    font-size: 1.4rem;
    color: #1e293b;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    font-size: 1rem;
    font-family: 'Quicksand', sans-serif;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px var(--primary-glow, rgba(236,72,153,0.1));
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 25px;

  @media (max-width: 600px) {
    flex-direction: column;
    & > * { width: 100%; }
  }
`;

const DeleteZone = styled.div`
  margin-top: 50px;
  padding-top: 40px;
  border-top: 2px dashed #f1f5f9;
`;

const Message = styled.div<{ $type?: string }>`
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 0.95rem;

  ${({ $type }) => $type === 'success' ? `
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  ` : `
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}
`;

const ModalContent = styled.div`
  text-align: center;

  .icon {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }

  p {
    color: #1e293b;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .note {
    font-weight: 700;
    color: #ef4444 !important;
    font-size: 0.9rem;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 30px;
  }
`;


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
        setShowPasswordForm(false);
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
    <Container>
      <Header />
      
      <Card variant="default" padding="40px" className="animate-fade-in">
        <HeaderSection>
          <h1>Settings</h1>
          <p>Managed your account and security</p>
        </HeaderSection>

        {message.text && (
          <Message $type={message.type}>
            {message.text}
          </Message>
        )}

        <Section>
          <h2><Lock size={22} /> Account Settings</h2>
          
          {!showPasswordForm ? (
            <Button 
              type="button" 
              onClick={() => setShowPasswordForm(true)}
              fullWidth
            >
              <Lock size={18} style={{ marginRight: '8px' }} /> Change Username and Password
            </Button>
          ) : (
            <form onSubmit={handleUpdatePassword}>
              <Field>
                <label>New Username</label>
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <label>New Password (Optional)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Field>
              <ButtonGroup>
                <Button type="submit" disabled={loading} style={{ flex: 1 }}>
                  {loading ? "Updating..." : "Update Account"} <Save size={18} style={{ marginLeft: '8px' }} />
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPassword("");
                    setConfirmPassword("");
                    setUsername(user.username);
                  }}
                  style={{ flex: 1 }}
                >
                  <X size={18} style={{ marginRight: '8px' }} /> Cancel
                </Button>
              </ButtonGroup>
            </form>
          )}
        </Section>

        <DeleteZone>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '15px' }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Danger Zone</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="danger" fullWidth onClick={handleDeleteAccount}>
            Delete My Account <Trash2 size={18} style={{ marginLeft: '8px' }} />
          </Button>
        </DeleteZone>
      </Card>

      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <ModalContent>
          <div className="icon">
            <AlertTriangle size={48} color="#ef4444" />
          </div>
          <p>Are you sure you want to delete your account? This will <strong>permanently erase</strong> ALL your data, entries, and progress. </p>
          <p className="note">This action cannot be undone.</p>
          
          <div className="actions">
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
              fullWidth
            >
              Cancel, I'll stay
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete}
              disabled={loading}
              fullWidth
            >
              {loading ? "Deleting..." : "Yes, Delete Everything"}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </Container>
  );
}
