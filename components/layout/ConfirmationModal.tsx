import React from "react";
import styles from "./styles/ConfirmationModal.module.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Bestätigen",
  cancelText = "Abbrechen",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.modalButtons}>
          <button onClick={onCancel} className={styles.modalButtonSecondary}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className={styles.modalButtonPrimary}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
