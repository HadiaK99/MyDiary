"use client";

import { useState, useEffect } from "react";
import { ActivityCategory } from "@shared/constants/activities";
import styles from "../admin.module.css";
import { Plus, Trash2, Save, RotateCcw } from "lucide-react";

export default function AdminTasks() {
  const [categories, setCategories] = useState<ActivityCategory[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/admin/activities");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    };
    fetchActivities();
  }, []);

  const saveTasks = async () => {
    await fetch("/api/admin/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories }),
    });
    alert("Tasks saved successfully! All children will see the updated activities.");
  };

  const resetTasks = async () => {
    if (confirm("Reset to default activities? This will restart the activities from a clean state.")) {
       // We can trigger a re-seed or similar on the backend
       // For now, I'll just alert that this should be done via seeding
       alert("Default activities are managed via the database seeding process.");
    }
  };

  const updateCategoryName = (index: number, name: string) => {
    const updated = [...categories];
    updated[index].name = name;
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
      <div className={styles.tableTitle}>
        <div>
          <h1>Daily Activity Management</h1>
          <p>Define which activities children should track daily.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={styles.actionBtn} onClick={resetTasks}>
            <RotateCcw size={18} /> Reset
          </button>
          <button className={styles.submitBtn} onClick={saveTasks} style={{ width: 'auto', padding: '10px 25px' }}>
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {categories.map((cat, catIndex) => (
          <div key={catIndex} className={styles.tableContainer} style={{ marginTop: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <input 
                value={cat.name} 
                onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                style={{ fontSize: '1.2rem', fontWeight: 800, border: 'none', background: 'transparent', width: '100%' }}
              />
              <span className={styles.badgeChild}>{cat.pointsPerItem} pts/item</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cat.activities.map((act, actIndex) => (
                <div key={actIndex} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    className={styles.actionBtn} 
                    style={{ flexGrow: 1, textAlign: 'left', background: '#f8fafc' }}
                    value={act}
                    onChange={(e) => {
                      const updated = [...categories];
                      updated[catIndex].activities[actIndex] = e.target.value;
                      setCategories(updated);
                    }}
                  />
                  <button className={styles.actionBtn} onClick={() => removeActivity(catIndex, actIndex)}>
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              ))}
              <button 
                className={styles.actionBtn} 
                style={{ borderStyle: 'dashed', marginTop: '10px' }}
                onClick={() => addActivity(catIndex)}
              >
                <Plus size={16} /> Add Activity
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
