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
      const data = await res.json();
      setModal({
        open: true,
        title: "Something went wrong",
        message: data.details || "Failed to save activities. Please try again.",
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
  const updateCategoryScoringMode = (index: number, mode: "GROUP" | "INDIVIDUAL") => {
    const updated = [...categories];
    updated[index].scoringMode = mode;
    setCategories(updated);
  };

  const updateActivity = (catIndex: number, actIndex: number, value: string) => {
    const updated = [...categories];
    const act = updated[catIndex].activities[actIndex];
    if (typeof act === "string") {
      updated[catIndex].activities[actIndex] = { name: value };
    } else {
      act.name = value;
    }
    setCategories(updated);
  };

  const updateActivityPoints = (catIndex: number, actIndex: number, points: number | null) => {
    const updated = [...categories];
    const act = updated[catIndex].activities[actIndex];
    if (typeof act === "string") {
      updated[catIndex].activities[actIndex] = { name: act, points };
    } else {
      act.points = points;
    }
    setCategories(updated);
  };

  const addActivity = (catIndex: number) => {
    const updated = [...categories];
    updated[catIndex].activities.push({ name: "New Task", points: null });
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
              <div className="points-badge" style={{ 
                opacity: cat.scoringMode === "GROUP" ? 1 : 0.4,
                filter: cat.scoringMode === "GROUP" ? 'none' : 'grayscale(1)',
                pointerEvents: cat.scoringMode === "GROUP" ? 'auto' : 'none',
                transition: 'all 0.3s'
              }}>
                {isEditing ? (
                  <>
                    <button
                      className="dial-btn"
                      type="button"
                      onClick={() => updateCategoryPoints(catIndex, Math.max(1, cat.pointsPerItem - 1))}
                      aria-label="Decrease points"
                      disabled={cat.scoringMode !== "GROUP"}
                     ><Minus size={14} /></button>
                    <input
                      type="number"
                      value={cat.pointsPerItem}
                      min={1}
                      max={100}
                      onChange={(e) => updateCategoryPoints(catIndex, Number(e.target.value))}
                      className="points-input"
                      disabled={cat.scoringMode !== "GROUP"}
                    />
                    <button
                      className="dial-btn"
                      type="button"
                      onClick={() => updateCategoryPoints(catIndex, Math.min(100, cat.pointsPerItem + 1))}
                      aria-label="Increase points"
                      disabled={cat.scoringMode !== "GROUP"}
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

            {/* Scoring Mode Toggle */}
            <div style={{ marginBottom: '15px', padding: '0 5px' }}>
              <div style={{ 
                display: 'flex', 
                background: '#f1f5f9', 
                borderRadius: '10px', 
                padding: '4px',
                gap: '4px'
              }}>
                <button
                  type="button"
                  onClick={() => isEditing && updateCategoryScoringMode(catIndex, "GROUP")}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: isEditing ? 'pointer' : 'default',
                    background: cat.scoringMode === "GROUP" ? 'white' : 'transparent',
                    color: cat.scoringMode === "GROUP" ? 'var(--primary)' : '#64748b',
                    boxShadow: cat.scoringMode === "GROUP" ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Group Score
                </button>
                <button
                  type="button"
                  onClick={() => isEditing && updateCategoryScoringMode(catIndex, "INDIVIDUAL")}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: isEditing ? 'pointer' : 'default',
                    background: cat.scoringMode === "INDIVIDUAL" ? 'white' : 'transparent',
                    color: cat.scoringMode === "INDIVIDUAL" ? 'var(--primary)' : '#64748b',
                    boxShadow: cat.scoringMode === "INDIVIDUAL" ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Per Item
                </button>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '6px', textAlign: 'center', fontWeight: 500 }}>
                {cat.scoringMode === "GROUP" 
                  ? "Points awarded if ALL items are completed." 
                  : `Each item is worth ${cat.pointsPerItem} points.`}
              </p>
            </div>

            {/* Activity List */}
            <div className="activity-list">
              {cat.activities.map((actObj, actIndex) => {
                const act = typeof actObj === 'string' ? { name: actObj, points: null } : actObj;
                return isEditing ? (
                  <div key={actIndex} className="activity-row" style={{ gap: '10px' }}>
                    <input
                      value={act.name}
                      onChange={(e) => updateActivity(catIndex, actIndex, e.target.value)}
                      style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.9rem', outline: 'none', padding: '6px 0' }}
                    />
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      background: cat.scoringMode === "INDIVIDUAL" ? '#f8fafc' : '#f1f5f9', 
                      padding: '2px 8px', 
                      borderRadius: '8px', 
                      border: '1px solid',
                      borderColor: cat.scoringMode === "INDIVIDUAL" ? '#e2e8f0' : 'transparent',
                      opacity: cat.scoringMode === "INDIVIDUAL" ? 1 : 0.4,
                      pointerEvents: cat.scoringMode === "INDIVIDUAL" ? 'auto' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      <button
                        className="dial-btn-sm"
                        type="button"
                        onClick={() => {
                          const current = act.points ?? cat.pointsPerItem;
                          updateActivityPoints(catIndex, actIndex, Math.max(0, current - 1));
                        }}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                      ><Minus size={12} /></button>
                      
                      <input 
                        type="number"
                        placeholder={String(cat.pointsPerItem)}
                        value={act.points ?? ""}
                        disabled={cat.scoringMode !== "INDIVIDUAL"}
                        onChange={(e) => {
                          const val = e.target.value === "" ? null : parseInt(e.target.value);
                          updateActivityPoints(catIndex, actIndex, val);
                        }}
                        style={{ width: '30px', border: 'none', background: 'transparent', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', outline: 'none' }}
                      />

                      <button
                        className="dial-btn-sm"
                        type="button"
                        onClick={() => {
                          const current = act.points ?? cat.pointsPerItem;
                          updateActivityPoints(catIndex, actIndex, Math.min(100, current + 1));
                        }}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                      ><Plus size={12} /></button>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>pts</span>
                    </div>

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
                    <span style={{ flex: 1 }}>{act.name}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      color: act.points !== null ? '#166534' : '#64748b', 
                      background: act.points !== null ? '#dcfce7' : '#f1f5f9', 
                      padding: '2px 8px', 
                      borderRadius: '6px' 
                    }}>
                      {act.points ?? cat.pointsPerItem} pts
                    </span>
                  </div>
                );
              })}
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
