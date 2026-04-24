"use client";

import { useState, useEffect } from "react";
import styles from "./RecordEditor.module.css";
import { type ActivityCategory } from "@shared/constants/activities";
import { calculateScore, getPerformanceRating, calculateMaxScore, DayData } from "@shared/utils/scoring";
import { 
  X, 
  Check, 
  GlassWater, 
  Moon, 
  Sparkles, 
  Calendar,
  Save
} from "lucide-react";

interface RecordEditorProps {
  userId: string;
  username: string;
  entry?: { id: string; date: string; data: string };
  onClose: () => void;
  onSave: () => void;
}

export default function RecordEditor({ userId, username, entry, onClose, onSave }: RecordEditorProps) {
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<DayData & { water?: number, sleep?: number, mood?: string }>({
    activities: {},
    goodThings: {},
    badThings: {},
    water: 0,
    sleep: 0,
    mood: 'Happy'
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/admin/activities");
        const json = await res.json();
        if (json.categories) setCategories(json.categories);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();

    if (entry) {
      setData(JSON.parse(entry.data));
    }
  }, [entry]);

  const score = calculateScore(data, categories);
  const maxScore = calculateMaxScore(categories);
  const { rating } = getPerformanceRating(score, maxScore);

  const toggleItem = (category: keyof DayData, item: string) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item]
      }
    }));
  };

  const setLevel = (key: 'water' | 'sleep', level: number) => {
    setData(prev => ({ ...prev, [key]: level }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const datesToSave = [date];
      
      // If range is specified for new record
      if (!entry && endDate && endDate > date) {
        const current = new Date(date);
        const end = new Date(endDate);
        const limit = 31; // Max 31 days range
        let count = 1;
        
        while (current < end && count < limit) {
          current.setDate(current.getDate() + 1);
          datesToSave.push(current.toISOString().split('T')[0]);
          count++;
        }
      }

      // Save records sequentially
      for (const d of datesToSave) {
        const res = await fetch("/api/diary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            date: d,
            data,
            score,
            rating
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(`Failed to save for ${d}: ${err.error}`);
        }
      }

      onSave();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Something went wrong.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h2>{entry ? "Edit Record" : "Add New Record"}</h2>
            <p>Managing diary for <strong>{username}</strong></p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {!entry && (
            <div className={styles.inputGroup}>
              <label>Select Date or Date Range</label>
              <div className={styles.dateRangeContainer}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Start Date</label>
                  <input 
                    type="date" 
                    className={styles.dateInput}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>End Date (Optional for range)</label>
                  <input 
                    type="date" 
                    className={styles.dateInput}
                    value={endDate}
                    min={date}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {entry && (
            <div className={styles.inputGroup}>
              <label>Record Date</label>
              <input 
                type="date" 
                className={styles.dateInput}
                value={date}
                disabled
              />
            </div>
          )}

          <div className={styles.formGrid}>
            <div>
              <div className={styles.sectionTitle}>
                <Calendar size={18} /> Daily Activities
              </div>
              
              <div className={styles.activityGrid}>
                {categories.map(cat => (
                  cat.activities.map(act => (
                    <div 
                      key={act}
                      className={`${styles.activityItem} ${data.activities[act] ? styles.active : ''}`}
                      onClick={() => toggleItem('activities', act)}
                    >
                      <span>{act}</span>
                      <div className={styles.checkSquare}>
                        {data.activities[act] && <Check size={14} />}
                      </div>
                    </div>
                  ))
                ))}
              </div>
            </div>

            <div>
              <div className={styles.sectionTitle}>
                <Sparkles size={18} /> Trackers & Mood
              </div>

              <div className={styles.trackerCard} style={{ marginBottom: '20px' }}>
                <h4>Water Intake (Glasses)</h4>
                <div className={styles.iconRow}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <span
                      key={i}
                      className={`${styles.iconItem} ${(data.water || 0) >= i ? styles.active : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLevel('water', i);
                      }}
                    >
                      <GlassWater size={22} fill={(data.water || 0) >= i ? "currentColor" : "none"} />
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.trackerCard} style={{ marginBottom: '20px' }}>
                <h4>Hours of Sleep</h4>
                <div className={styles.iconRow}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <span
                      key={i}
                      className={`${styles.iconItem} ${(data.sleep || 0) >= i ? styles.active : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLevel('sleep', i);
                      }}
                    >
                      <Moon size={22} fill={(data.sleep || 0) >= i ? "currentColor" : "none"} />
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.trackerCard}>
                <h4>Mood for the Day</h4>
                <div className={styles.moodGrid}>
                  {['Angry', 'Tired', 'Sad', 'Happy', 'Fun'].map(m => (
                    <button
                      key={m}
                      className={`${styles.moodBtn} ${data.mood === m ? styles.active : ''}`}
                      onClick={() => setData(prev => ({ ...prev, mood: m }))}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.scoreBadge}>
            Calculated Score: {score} pts ({rating})
          </div>
          <div className={styles.actions}>
            <button className={styles.closeBtn} onClick={onClose} style={{ color: '#64748b' }}>
              Cancel
            </button>
            <button 
              className={styles.submitBtn} 
              onClick={handleSave} 
              disabled={saving}
            >
              <Save size={18} /> {saving ? "Saving..." : "Save Record"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
