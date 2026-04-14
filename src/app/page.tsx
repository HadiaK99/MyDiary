"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateScore, getPerformanceRating } from "@/utils/scoring";
import Header from "@/components/Navigation/Header";

const DAYS = [
  { short: "Mon", date: 7 },
  { short: "Tue", date: 8 },
  { short: "Wed", date: 9 },
  { short: "Thu", date: 10, active: true },
  { short: "Fri", date: 11 },
  { short: "Sat", date: 12 },
  { short: "Sun", date: 13 },
];

export default function Home() {
  const [todayScore, setTodayScore] = useState(0);
  const [todayRating, setTodayRating] = useState({ rating: "Poor", color: "#ccc" });
  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const saved = localStorage.getItem(`diary-${todayDate}`);
    if (saved) {
      const data = JSON.parse(saved);
      const score = calculateScore(data);
      setTodayScore(score);
      setTodayRating(getPerformanceRating(score));
    }
  }, [todayDate]);

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.greetingHeader}>
        <h1>Hi, <span style={{ color: 'var(--primary)' }}>Jose Maria</span> 👋</h1>
        
        {/* Day Selector */}
        <div className={styles.daySelector}>
          {DAYS.map(day => (
            <div key={day.short} className={`${styles.dayBtn} ${day.active ? styles.dayBtnActive : ''}`}>
              <span>{day.short}</span>
              <span>{day.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hero / Featured Card */}
      <section className={`${styles.featuredCard} animate-fade-in`}>
        <h2>Let's start your day</h2>
        <p>Begin with a mindful morning reflection.</p>
        <div className={styles.sunIllustration}>🌞</div>
        <Link href={`/diary/daily/${todayDate}`} className="pill-btn" style={{ marginTop: '20px' }}>
          Record My Day 📝
        </Link>
      </section>

      {/* Quick Journal Sections */}
      <div className={styles.sectionHeader}>
        <h3>Quick Journal</h3>
        <Link href={`/diary/daily/${todayDate}`} className={styles.seeAll}>See all</Link>
      </div>

      <section className={styles.quickGrid}>
        <div className={`${styles.quickCard} ${styles.pinkCard}`}>
          <h4>Pause & reflect 🌱</h4>
          <p>What are you grateful for today?</p>
          <div className={styles.tagGroup}>
            <span className={styles.miniTag}>Today</span>
            <span className={`${styles.miniTag} ${styles.activeTag}`}>Personal</span>
          </div>
        </div>

        <div className={`${styles.quickCard} ${styles.blueCard}`}>
          <h4>Set Intentions 😊</h4>
          <p>How do you want to feel?</p>
          <div className={styles.tagGroup}>
            <span className={styles.miniTag}>Today</span>
            <span className={styles.miniTag}>Family</span>
          </div>
        </div>

        <div className={`${styles.quickCard} ${styles.greenCard}`}>
          <h4>Emotions Tracker</h4>
          <p>Logged: Happy & Calm</p>
          <div className={styles.tagGroup}>
            <div className="score-badge bg-excellent" style={{ fontSize: '0.6rem' }}>EXCELLENT</div>
          </div>
        </div>
      </section>

      {/* Secondary Actions */}
      <section className={styles.sectionHeader} style={{ marginTop: '20px' }}>
        <h3>Milestones</h3>
      </section>
      
      <div className={styles.quickGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Link href="/monthly/analysis/april" className="journal-card" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '2rem' }}>📊</span>
          <p style={{ fontWeight: 700, marginTop: '10px' }}>Monthly Analysis</p>
        </Link>
        <Link href="/yearly/review" className="journal-card" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '2rem' }}>🏆</span>
          <p style={{ fontWeight: 700, marginTop: '10px' }}>Yearly Review</p>
        </Link>
      </div>
    </div>
  );
}
