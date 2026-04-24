"use client";

import { useState, useEffect } from "react";
import { ActivityCategory } from "@shared/constants/activities";
import Modal from "@frontend/components/Common/Modal";
import { Plus, Trash2, Save, RotateCcw, Pencil, X, Minus } from "lucide-react";
import { Button } from "@frontend/components/Common/Button";

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
      <div className="table-title">
        <div style={{ maxWidth: '100%' }}>
          <h1 style={{ margin: 0, lineHeight: 1.2 }}>Daily Activity Management</h1>
          <p style={{ color: "#64748b", marginTop: 8, fontSize: '0.9rem' }}>Define which activities children should track daily.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={resetTasks} className="hide-text-on-mobile">
                <RotateCcw size={16} style={{ marginRight: '8px' }} /> <span>Reset</span>
              </Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="hide-text-on-mobile">
                <X size={16} style={{ marginRight: '8px' }} /> <span>Cancel</span>
              </Button>
              <Button onClick={saveTasks} disabled={saving} className="hide-text-on-mobile">
                <Save size={16} style={{ marginRight: '8px' }} /> <span>{saving ? "Saving…" : "Save Changes"}</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Pencil size={16} style={{ marginRight: '8px' }} /> <span>Edit Activities</span>
            </Button>
          )}
        </div>
      </div>

      {/* Activity Grid */}
      <div className="dashboard-grid">
        {categories.map((cat, catIndex) => (
          <div key={catIndex} className="category-card">
            {/* Category Header */}
            <div className="category-header">
              {isEditing ? (
                <input
                  value={cat.name}
                  onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                  className="category-name-input"
                />
              ) : (
                <span className="category-name-static" style={{ flex: 1, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', fontFamily: 'Fredoka, sans-serif' }}>{cat.name}</span>
              )}
              <div className="points-badge">
                {isEditing ? (
                  <>
                    <button
                      className="dial-btn"
                      type="button"
                      onClick={() => updateCategoryPoints(catIndex, Math.max(1, cat.pointsPerItem - 1))}
                      aria-label="Decrease points"
                     ><Minus size={14} /></button>
                    <input
                      type="number"
                      value={cat.pointsPerItem}
                      min={1}
                      max={100}
                      onChange={(e) => updateCategoryPoints(catIndex, Number(e.target.value))}
                      className="points-input"
                    />
                    <button
                      className="dial-btn"
                      type="button"
                      onClick={() => updateCategoryPoints(catIndex, Math.min(100, cat.pointsPerItem + 1))}
                      aria-label="Increase points"
                     ><Plus size={14} /></button>
                  </>
                ) : (
                  <span style={{ display: "inline-block", minWidth: 24, textAlign: "center", fontSize: '0.9rem', fontWeight: 800, color: '#166534' }}>
                    {cat.pointsPerItem}
                  </span>
                )}
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534' }}>pts</span>
              </div>
            </div>

            {/* Activity List */}
            <div className="activity-list">
              {cat.activities.map((act, actIndex) => (
                isEditing ? (
                  <div key={actIndex} className="activity-row">
                    <input
                      value={act}
                      onChange={(e) => updateActivity(catIndex, actIndex, e.target.value)}
                      style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.9rem', outline: 'none', padding: '6px 0' }}
                    />
                    <button
                      className="delete-btn"
                      onClick={() => removeActivity(catIndex, actIndex)}
                      type="button"
                      title="Remove activity"
                      style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '5px', borderRadius: '8px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div key={actIndex} className="activity-read-only" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 4px', color: '#334155', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.6 }} />
                    <span>{act}</span>
                  </div>
                )
              ))}
              {isEditing && (
                <button
                  className="add-activity-btn"
                  onClick={() => addActivity(catIndex)}
                  type="button"
                >
                  <Plus size={15} /> <span>Add Activity</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
