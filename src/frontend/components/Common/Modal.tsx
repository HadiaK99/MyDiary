import React from "react";
import styled from "styled-components";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** If provided, renders a confirm + cancel button row */
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" renders the confirm button in red */
  variant?: "primary" | "danger";
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  width: 90%;
  max-width: 450px;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(20px) scale(0.95); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }

  .header {
    padding: 24px;
    padding-bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-family: 'Fredoka', sans-serif;
      font-size: 1.4rem;
      color: #1e293b;
      margin: 0;
    }

    .close-btn {
      background: #f1f5f9;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #e2e8f0;
        color: #1e293b;
      }
    }
  }

  .body {
    padding: 24px;
  }

  .footer {
    padding: 16px 24px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
`;

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>
        <div className="body">
          {children}
        </div>
        {onConfirm && (
          <div className="footer">
            <Button variant="secondary" onClick={onClose} type="button">
              {cancelLabel}
            </Button>
            <Button
              variant={variant === "danger" ? "danger" : "primary"}
              onClick={() => { onConfirm(); onClose(); }}
              type="button"
            >
              {confirmLabel}
            </Button>
          </div>
        )}
        {!onConfirm && (
          <div className="footer">
            <Button variant="primary" onClick={onClose} type="button">
              OK
            </Button>
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
