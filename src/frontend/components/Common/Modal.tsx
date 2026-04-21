import React from "react";
import styles from "./Modal.module.css";
import { X } from "lucide-react";

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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
        {onConfirm && (
          <div className={styles.footer}>
            <button className={styles.cancelBtn} onClick={onClose} type="button">
              {cancelLabel}
            </button>
            <button
              className={`${styles.confirmBtn} ${variant === "danger" ? styles.confirmDanger : styles.confirmPrimary}`}
              onClick={() => { onConfirm(); onClose(); }}
              type="button"
            >
              {confirmLabel}
            </button>
          </div>
        )}
        {!onConfirm && (
          <div className={styles.footer}>
            <button className={styles.confirmBtn + " " + styles.confirmPrimary} onClick={onClose} type="button">
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
