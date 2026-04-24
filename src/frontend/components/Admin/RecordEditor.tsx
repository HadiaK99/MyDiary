"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
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
import { DiaryEntry } from "@shared/types";
import { Button } from "../Common/Button";

interface RecordEditorProps {
  userId: string;
  username: string;
  entry?: DiaryEntry | null;
  onClose: () => void;
  onSave: () => void;
}

const EditorOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const EditorContent = styled.div`
  background: white;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(20px) scale(0.95); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }

  .header {
    padding: 24px 30px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8fafc;

    .header-title {
      h2 { margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 800; }
      p { margin: 4px 0 0; font-size: 0.9rem; color: #64748b; }
    }

    .close-btn {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 8px;
      border-radius: 10px;
      cursor: pointer;
      color: #94a3b8;
      transition: all 0.2s;
      &:hover { background: #f1f5f9; color: #ef4444; }
    }
  }

  .body {
    padding: 30px;
    overflow-y: auto;
    flex-grow: 1;

    .form-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      & > * { flex: 1 1 calc(50% - 15px); }
    }

    .input-group {
      margin-bottom: 20px;
      label { display: block; font-size: 0.9rem; font-weight: 700; color: #475569; margin-bottom: 8px; }
      .date-input {
        width: 100%;
        padding: 12px 15px;
        border-radius: 12px;
        border: 1.5px solid #e2e8f0;
        font-family: inherit;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s;
        &:focus { border-color: var(--primary); }
      }
    }

    .section-title {
      font-size: 1rem;
      font-weight: 800;
      color: #334155;
      margin: 25px 0 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .activity-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover { border-color: var(--primary-glow); background: white; }
      &.active { border-color: var(--primary); background: var(--primary-glow); }

      .check-square {
        width: 20px;
        height: 20px;
        border: 2px solid #cbd5e1;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        transition: all 0.2s;
      }
      &.active .check-square { background: var(--primary); border-color: var(--primary); color: white; }
    }

    .tracker-card {
      background: #f8fafc;
      padding: 15px;
      border-radius: 18px;
      border: 1px solid #e2e8f0;
      h4 { margin: 0 0 10px; font-size: 0.85rem; color: #64748b; }
    }

    .icon-row {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }

    .icon-item {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      color: #cbd5e1;
      transition: all 0.2s;
      &:hover, &.active { color: var(--primary); background: var(--primary-glow); transform: scale(1.1); }
    }

    .mood-grid {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .mood-btn {
      padding: 8px 15px;
      border-radius: 10px;
      border: 1.5px solid #e2e8f0;
      background: white;
      font-family: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: #64748b;
      &.active { background: var(--primary); border-color: var(--primary); color: white; }
    }
  }

  .footer {
    padding: 24px 30px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8fafc;
    gap: 20px;
  }

  @media (max-width: 768px) {
    .body { padding: 20px 15px; .form-grid { gap: 20px; & > * { flex: 1 1 100%; } } }
    .footer { flex-direction: column; align-items: stretch; }
  }
`;

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
    <EditorOverlay onClick={onClose}>
      <EditorContent onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <div className="header-title">
            <h2>{entry ? "Edit Record" : "Add New Record"}</h2>
            <p>Managing diary for <strong>{username}</strong></p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="body">
          {!entry && (
            <div className="input-group">
              <label>Select Date or Date Range</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: '1 1 calc(50% - 8px)' }}>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Start Date</label>
                  <input 
                    type="date" 
                    className="date-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div style={{ flex: '1 1 calc(50% - 8px)' }}>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>End Date (Optional)</label>
                  <input 
                    type="date" 
                    className="date-input"
                    value={endDate}
                    min={date}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {entry && (
            <div className="input-group">
              <label>Record Date</label>
              <input 
                type="date" 
                className="date-input"
                value={date}
                disabled
              />
            </div>
          )}

          <div className="form-grid">
            <div>
              <div className="section-title">
                <Calendar size={18} /> Daily Activities
              </div>
              
              <div className="activity-grid">
                {categories.map(cat => (
                  cat.activities.map(act => (
                    <div 
                      key={act}
                      className={`activity-item ${data.activities[act] ? 'active' : ''}`}
                      onClick={() => toggleItem('activities', act)}
                    >
                      <span>{act}</span>
                      <div className="check-square">
                        {data.activities[act] && <Check size={14} />}
                      </div>
                    </div>
                  ))
                ))}
              </div>
            </div>

            <div>
              <div className="section-title">
                <Sparkles size={18} /> Trackers & Mood
              </div>

              <div className="tracker-card" style={{ marginBottom: '20px' }}>
                <h4>Water Intake (Glasses)</h4>
                <div className="icon-row">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <span
                      key={i}
                      className={`icon-item ${(data.water || 0) >= i ? 'active' : ''}`}
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

              <div className="tracker-card" style={{ marginBottom: '20px' }}>
                <h4>Hours of Sleep</h4>
                <div className="icon-row">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <span
                      key={i}
                      className={`icon-item ${(data.sleep || 0) >= i ? 'active' : ''}`}
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

              <div className="tracker-card">
                <h4>Mood for the Day</h4>
                <div className="mood-grid">
                  {['Angry', 'Tired', 'Sad', 'Happy', 'Fun'].map(m => (
                    <button
                      key={m}
                      className={`mood-btn ${data.mood === m ? 'active' : ''}`}
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

        <div className="footer">
          <div style={{ background: '#dcfce7', color: '#166534', padding: '8px 15px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem' }}>
            Calculated Score: {score} pts ({rating})
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
            >
              <Save size={18} style={{ marginRight: '8px' }} /> {saving ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </div>
      </EditorContent>
    </EditorOverlay>
  );
}
