"use client";

import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@frontend/context/AuthContext";
import { LogOut, Star, User, Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;

  .left, .right {
    flex: 1;
  }

  .right {
    display: flex;
    justify-content: flex-end;
    min-width: 120px;
  }

  .user-menu {
    position: relative;
  }

  .username-btn {
    font-size: 0.9rem;
    font-weight: 700;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);

    &:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.05);
      border-color: var(--primary);
    }
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 180px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 1000;
    transform-origin: top right;
    animation: dropdownFade 0.2s ease-out;
  }

  @keyframes dropdownFade {
    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
    text-decoration: none;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      background: #f1f5f9;
      color: var(--primary);
    }
  }

  .dropdown-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 4px 0;
  }

  .logout-btn {
    color: #ef4444;

    &:hover {
      background: #fef2f2;
      color: #dc2626;
    }
  }

  .center {
    flex: 2;
    display: flex;
    justify-content: center;
  }

  .brand {
    font-family: 'Fredoka', sans-serif;
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--primary);
  }

  .settings-btn {
    width: 44px;
    height: 44px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.2s;

    &:hover {
      transform: rotate(30deg);
    }
  }

  @media (max-width: 768px) {
    padding: 15px 0;
    
    .brand {
      font-size: 1rem;
    }
    
    .username-btn span {
      display: none;
    }
    
    .username-btn {
      padding: 8px;
      border-radius: 50%;
    }
    
    .right {
      min-width: 0;
    }
  }

  @media (max-width: 480px) {
    padding: 10px 0;
  }
`;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <StyledHeader className="no-print">
      <div className="left">
        {!isHome && (
          <button 
            onClick={() => router.push("/")} 
            className="back-btn-styled" 
            title="Return to Dashboard"
            type="button"
          >
            <i className="back-arrow"></i>
          </button>
        )}
      </div>

      <div className="center">
        <button 
          onClick={() => router.push("/")}
          className="glass" 
          style={{ 
            padding: '8px 24px', 
            borderRadius: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          type="button"
        >
          <Star size={18} />
          <span className="brand">MyDiary</span>
        </button>
      </div>

      <div className="right">
        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="username-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              type="button"
            >
              <User size={18} />
              <span>{user.username}</span>
              <ChevronDown size={14} style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {showDropdown && (
              <div className="dropdown">
                <button 
                  onClick={() => { router.push("/profile"); setShowDropdown(false); }} 
                  className="dropdown-item"
                >
                  <User size={16} /> View Profile
                </button>
                <button 
                  onClick={() => { router.push("/settings"); setShowDropdown(false); }} 
                  className="dropdown-item"
                >
                  <Settings size={16} /> Settings
                </button>
                <div className="dropdown-divider" />
                <button 
                  onClick={() => { logout(); setShowDropdown(false); }} 
                  className="dropdown-item logout-btn"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => router.push("/login")} 
            className="settings-btn"
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            type="button"
          >
            <User size={20} />
          </button>
        )}
      </div>
    </StyledHeader>
  );
}
