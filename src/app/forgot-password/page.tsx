"use client";

import { useState } from "react";
import { AuthContainer } from "@frontend/components/Auth/AuthStyles";
import { Button } from "@frontend/components/Common/Button";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Logic for sending reset link would go here
      setSent(true);
    }
  };

  return (
    <AuthContainer>
      <div className="auth-card">
        <div className="logo-area">
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'white' }}>
            <Mail size={32} />
          </div>
          <h1>Reset Password</h1>
          <p style={{ color: '#64748b', fontWeight: 500 }}>
            {sent ? "Check your email for the link!" : "We'll send you a recovery link."}
          </p>
        </div>

        {!sent ? (
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" fullWidth size="large">
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#475569', marginBottom: '20px' }}>
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Button onClick={() => router.push("/login")} fullWidth size="large">
              Back to Login
            </Button>
          </div>
        )}

        {!sent && (
          <p className="switch-auth">
            <button 
              type="button" 
              onClick={() => router.push("/login")}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto' }}
            >
              <ArrowLeft size={16} /> Back to Log In
            </button>
          </p>
        )}
      </div>
    </AuthContainer>
  );
}
