"use client";

import { useState, useEffect } from "react";
import { ActivityCategory } from "@shared/constants/activities";
import styles from "../admin.module.css";
import Modal from "@frontend/components/Common/Modal";
import { Plus, Trash2, Save, RotateCcw, Pencil, X } from "lucide-react";

type ModalState = {
  open: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  variant?: "primary" | "danger";
};

const CLOSED_MODAL: ModalState = { open: false, title: "", message: "" };

export default function AdminTasks() {
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/admin/activities");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    };
    fetchActivities();
  }, []);

  const saveTasks = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories }),
    });
    setSaving(false);
    if (res.ok) {
      setIsEditing(false);
      setModal({
        open: true,
        title: "Changes Saved! 🎉",
        message: "All children will see the updated daily activities.",
      });
    } else {
      setModal({
        open: true,
        title: "Something went wrong",
        message: "Failed to save activities. Please try again.",
        variant: "danger",
      });
    }
  };

  const resetTasks = () => {
    setModal({
      open: true,
      title: "Reset Activities?",
      message: "This will restart the activities from a clean slate. Default activities are managed via the database seeding process.",
      confirmLabel: "Reset",
      variant: "danger",
      onConfirm: () => {
        // Trigger re-seed on backend if needed
      },
    });
  };

  const updateCategoryName = (index: number, name: string) => {
    const updated = [...categories];
    updated[index].name = name;
    setCategories(updated);
  };

  const updateCategoryPoints = (index: number, points: number) => {
    const updated = [...categories];
    updated[index].pointsPerItem = points;
    setCategories(updated);
  };

  const updateActivity = (catIndex: number, actIndex: number, value: string) => {
    const updated = [...categories];
    updated[catIndex].activities[actIndex] = value;
    setCategories(updated);
  };

  const addActivity = (catIndex: number) => {
    const updated = [...categories];
    updated[catIndex].activities.push("New Task");
    setCategories(updated);
  };

  const removeActivity = (catIndex: number, actIndex: number) => {
    const updated = [...categories];
    updated[catIndex].activities.splice(actIndex, 1);
    setCategories(updated);
  };

  return (
    <div>
      {/* Custom Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal(CLOSED_MODAL)}
        title={modal.title}
        onConfirm={modal.onConfirm}
        confirmLabel={modal.confirmLabel}
        variant={modal.variant}
      >
        <p style={{ color: "#475569", lineHeight: 1.6 }}>{modal.message}</p>
      </Modal>

      {/* Page Header */}
      <div className={styles.tableTitle}>
        <div>
          <h1>Daily Activity Management</h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>Define which activities children should track daily.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {isEditing ? (
            <>
              <button className={styles.resetBtn} onClick={resetTasks} type="button">
                <RotateCcw size={16} /> Reset
              </button>
              <button className={styles.resetBtn} onClick={() => setIsEditing(false)} type="button">
                <X size={16} /> Cancel
              </button>
              <button className={styles.submitBtn} onClick={saveTasks} type="button" disabled={saving}>
                <Save size={16} /> {saving ? "Saving…" : "Save Changes"}
              </button>
            </>
          ) : (
            <button className={styles.editBtn} onClick={() => setIsEditing(true)} type="button">
              <Pencil size={16} /> Edit Activities
            </button>
          )}
        </div>
      </div>

      {/* Activity Grid */}
      <div className={styles.dashboardGrid}>
        {categories.map((cat, catIndex) => (
          <div key={catIndex} className={styles.categoryCard}>
            {/* Category Header */}
            <div className={styles.categoryHeader}>
              {isEditing ? (
                <input
                  value={cat.name}
                  onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                  className={styles.categoryNameInput}
                />
              ) : (
                <span className={styles.categoryNameStatic}>{cat.name}</span>
              )}
              <div className={styles.pointsBadge}>
                {isEditing ? (
                  <>
                    <button
                      className={styles.dialBtn}
                      type="button"
                      onClick={() => updateCategoryPoints(catIndex, Math.max(1, cat.pointsPerItem - 1))}
                      aria-label="Decrease points"
                    >−</button>
                    <input
                      type="number"
                      value={cat.pointsPerItem}
                      min={1}
                      max={100}
                      onChange={(e) => updateCategoryPoints(catIndex, Number(e.target.value))}
                      className={styles.pointsInput}
                    />
                    <button
                      className={styles.dialBtn}
                      type="button"
                      onClick={() => updateCategoryPoints(catIndex, Math.min(100, cat.pointsPerItem + 1))}
                      aria-label="Increase points"
                    >+</button>
                  </>
                ) : (
                  <span className={styles.pointsInput} style={{ display: "inline-block", minWidth: 24, textAlign: "center" }}>
                    {cat.pointsPerItem}
                  </span>
                )}
                <span className={styles.pointsLabel}>pts</span>
              </div>
            </div>

            {/* Activity List */}
            <div className={styles.activityList}>
              {cat.activities.map((act, actIndex) => (
                isEditing ? (
                  <div key={actIndex} className={styles.activityRow}>
                    <input
                      className={styles.activityInput}
                      value={act}
                      onChange={(e) => updateActivity(catIndex, actIndex, e.target.value)}
                    />
                    <button
                      className={styles.deleteBtn}
                      onClick={() => removeActivity(catIndex, actIndex)}
                      type="button"
                      title="Remove activity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div key={actIndex} className={styles.activityReadOnly}>
                    <span className={styles.activityDot} />
                    <span>{act}</span>
                  </div>
                )
              ))}
              {isEditing && (
                <button
                  className={styles.addActivityBtn}
                  onClick={() => addActivity(catIndex)}
                  type="button"
                >
                  <Plus size={15} /> Add Activity
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

