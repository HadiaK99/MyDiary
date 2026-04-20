"use client";

import { useState, useEffect, use } from "react";
import styles from "./daily.module.css";
import { type ActivityCategory } from "@shared/constants/activities";
import { calculateScore, getPerformanceRating, calculateMaxScore, DayData } from "@shared/utils/scoring";
import { useAuth } from "@frontend/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@frontend/components/Navigation/Header";
import {
  Check,
  GlassWater,
  Moon,
  Sparkles,
  Heart
} from "lucide-react";

// Split categories helper - we'll do this inside component or keep it reactive
export default function DailyDiary({ params: paramsPromise }: { params: Promise<{ date: string }> }) {
  const params = use(paramsPromise);
  const date = params.date;
  const { user } = useAuth();
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [data, setData] = useState<DayData & { water?: number, sleep?: number, mood?: string }>({
    activities: {},
    goodThings: {},
    badThings: {},
    water: 0,
    sleep: 0,
    mood: 'Happy'
  });

  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const maxScore = calculateMaxScore(categories);

  useEffect(() => {
    // Load custom categories from admin settings
      const fetchCats = async () => {
        try {
          const res = await fetch("/api/admin/activities");
          const data = await res.json();
          if (data.categories?.length > 0) {
            setCategories(data.categories);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchCats();
    }, []);

  useEffect(() => {
    if (user) {
      const fetchEntry = async () => {
        const res = await fetch(`/api/diary?date=${date}`);
        const data = await res.json();
        if (data.entry) {
          setData(JSON.parse(data.entry.data));
        }
      };
      fetchEntry();
    }
  }, [date, user]);

  useEffect(() => {
    if (user && categories.length > 0) {
      const newScore = calculateScore(data, categories);
      setScore(newScore);
    }
  }, [data, categories, user]);

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { rating } = getPerformanceRating(score, maxScore);
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          date, 
          data, 
          score, 
          rating 
        }),
      });
      
      if (res.ok) {
        setShowSummary(true);
      } else {
        alert("Failed to save entry. Please try again.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const half = Math.ceil(categories.length / 2);
  const leftCats = categories.slice(0, half);
  const rightCats = categories.slice(half);

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

  const { rating, color, message } = getPerformanceRating(score, maxScore);

  return (
    <div className={styles.container}>
      <Header />

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <Sparkles className="animate-pulse" />
          <p>Preparing your diary...</p>
        </div>
      ) : (
        <div className={styles.plannerSheet}>
        <div className={styles.plannerHeader}>
          <div className={styles.subHeader}>
            <span>Daily</span>
            <span>Works</span>
            <span>Today Is</span>
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          <h1>Self-care Planner</h1>
        </div>

        <div className={styles.quoteBox}>
          "Taking care of yourself is productive." <Heart size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} fill="#be123c" />
        </div>

        {/* Two Column Checklists */}
        <div className={styles.checklistsGrid}>
          <div className={styles.checklistCol}>
            {leftCats.map(cat => (
              <div key={cat.id} className={styles.checklistCard} style={{ marginBottom: '20px' }}>
                <h3 className={styles.checkTitle}>{cat.name}</h3>
                {cat.activities.map(act => (
                  <div key={act.id} className={styles.listItem} onClick={() => toggleItem('activities', act.name)}>
                    <span className={styles.itemLabel}>{act.name}</span>
                    <div className={styles.checkSquare}>
                      {data.activities[act.name] && <Check size={14} />}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.checklistCol}>
            {rightCats.map(cat => (
              <div key={cat.id} className={styles.checklistCard} style={{ marginBottom: '20px' }}>
                <h3 className={styles.checkTitle}>{cat.name}</h3>
                {cat.activities.map(act => (
                  <div key={act.id} className={styles.listItem} onClick={() => toggleItem('activities', act.name)}>
                    <span className={styles.itemLabel}>{act.name}</span>
                    <div className={styles.checkSquare}>
                      {data.activities[act.name] && <Check size={14} />}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Trackers */}
        <div className={styles.visualTrackers}>
          <div className={styles.trackerCard}>
            <h3>Water Intake: (Glass) 💧</h3>
            <div className={styles.iconRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <span
                  key={i}
                  className={`${styles.iconItem} ${(data.water || 0) >= i ? styles.iconActive : ''}`}
                  onClick={() => setLevel('water', i)}
                >
                  <GlassWater size={24} />
                </span>
              ))}
            </div>
          </div>

          <div className={styles.trackerCard}>
            <h3>Hours of Sleep: (Hours) 🌙</h3>
            <div className={styles.iconRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <span
                  key={i}
                  className={`${styles.iconItem} ${(data.sleep || 0) >= i ? styles.iconActive : ''}`}
                  onClick={() => setLevel('sleep', i)}
                >
                  <Moon size={24} fill={(data.sleep || 0) >= i ? "currentColor" : "none"} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mood Section */}
        <div className={styles.moodRow}>
          <span className={styles.moodLabel}>Mood:</span>
          {['Angry', 'Tired', 'Sad', 'Happy', 'Fun'].map(m => (
            <button
              key={m}
              className={`${styles.moodBtn} ${data.mood === m ? styles.activeMood : ''}`}
              onClick={() => setData(prev => ({ ...prev, mood: m }))}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Score Reflection (Subtle) */}
        <div className={styles.longSection} style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 700, opacity: 0.6 }}>My Progress Today: <span style={{ color }}>{rating} ({score} pts)</span></p>
        </div>

        <div className={styles.finishBtn}>
          <button 
            onClick={handleComplete} 
            className="pill-btn" 
            disabled={saving}
          >
            {saving ? "Saving..." : "Complete Entry"} <Sparkles size={18} />
          </button>
        </div>
        </div>
      )}

      {showSummary && (
        <div className={styles.summaryOverlay}>
          <div className={styles.summaryCard}>
            <Sparkles size={48} color="#be123c" style={{ marginBottom: '10px' }} />
            <h2>Daily Summary</h2>
            <p>You've completed your self-care planner!</p>
            
            <div className={styles.summaryScore}>
              {score} <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>pts</span>
            </div>
            
            <div className={styles.summaryRating} style={{ color }}>
              {rating}: {message}
            </div>

            <div className={styles.summaryActions}>
              <Link href="/" className="pill-btn" style={{ background: color }}>
                Back to Dashboard
              </Link>
              <button 
                onClick={() => setShowSummary(false)} 
                className="pill-btn" 
                style={{ background: 'transparent', color: '#be123c', border: '1px solid #be123c' }}
              >
                Oh, I forgot something!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
