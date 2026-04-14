"use client";

import React, { useState, useEffect, use } from "react";
import styles from "./daily.module.css";
import { ACTIVITY_CATEGORIES, GOOD_THINGS, BAD_THINGS } from "@/constants/activities";
import { calculateScore, getPerformanceRating, DayData } from "@/utils/scoring";
import Link from "next/link";
import Header from "@/components/Navigation/Header";

// Split categories into two for the checklist grid
const half = Math.ceil(ACTIVITY_CATEGORIES.length / 2);
const leftCats = ACTIVITY_CATEGORIES.slice(0, half);
const rightCats = ACTIVITY_CATEGORIES.slice(half);

export default function DailyDiary({ params: paramsPromise }: { params: Promise<{ date: string }> }) {
  const params = use(paramsPromise);
  const date = params.date;
  
  const [data, setData] = useState<DayData & { water?: number, sleep?: number, mood?: string }>({
    activities: {},
    goodThings: {},
    badThings: {},
    water: 0,
    sleep: 0,
    mood: 'Happy'
  });

  const [score, setScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`diary-${date}`);
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, [date]);

  useEffect(() => {
    const newScore = calculateScore(data);
    setScore(newScore);
    localStorage.setItem(`diary-${date}`, JSON.stringify(data));
  }, [data, date]);

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

  const { rating, color } = getPerformanceRating(score);

  return (
    <div className={styles.container}>
      <Header />

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
          "Taking care of yourself is productive." 💖
        </div>

        {/* Two Column Checklists */}
        <div className={styles.checklistsGrid}>
          <div className={styles.checklistCol}>
            {leftCats.map(cat => (
              <div key={cat.name} className={styles.checklistCard} style={{ marginBottom: '20px' }}>
                <h3 className={styles.checkTitle}>{cat.name}</h3>
                {cat.activities.map(act => (
                  <div key={act} className={styles.listItem} onClick={() => toggleItem('activities', act)}>
                    <span className={styles.itemLabel}>{act}</span>
                    <div className={styles.checkSquare}>
                      {data.activities[act] && '✓'}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.checklistCol}>
             {rightCats.map(cat => (
              <div key={cat.name} className={styles.checklistCard} style={{ marginBottom: '20px' }}>
                <h3 className={styles.checkTitle}>{cat.name}</h3>
                {cat.activities.map(act => (
                  <div key={act} className={styles.listItem} onClick={() => toggleItem('activities', act)}>
                    <span className={styles.itemLabel}>{act}</span>
                    <div className={styles.checkSquare}>
                      {data.activities[act] && '✓'}
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
              {[1,2,3,4,5,6,7,8].map(i => (
                <span 
                  key={i} 
                  className={`${styles.iconItem} ${(data.water || 0) >= i ? styles.iconActive : ''}`}
                  onClick={() => setLevel('water', i)}
                >
                  🥤
                </span>
              ))}
            </div>
          </div>

          <div className={styles.trackerCard}>
            <h3>Hours of Sleep: (Hours) 🌙</h3>
            <div className={styles.iconRow}>
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <span 
                  key={i} 
                  className={`${styles.iconItem} ${(data.sleep || 0) >= i ? styles.iconActive : ''}`}
                  onClick={() => setLevel('sleep', i)}
                >
                  🌙
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
          <Link href="/" className="pill-btn">
             Complete Entry ✨
          </Link>
        </div>
      </div>
    </div>
  );
}
