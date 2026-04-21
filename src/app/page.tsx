"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@frontend/context/AuthContext";
import { calculateScore, getPerformanceRating } from "@shared/utils/scoring";
import Header from "@frontend/components/Navigation/Header";
import { 
  Sun, 
  Sparkles, 
  Leaf, 
  Smile, 
  BarChart3, 
  Trophy, 
  ArrowRight,
  Target
} from "lucide-react";

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
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [todayScore, setTodayScore] = useState(0);
  const [todayRating, setTodayRating] = useState({ rating: "Poor", color: "#ccc" });
  const [reviews, setReviews] = useState<{id: string, text: string, date: string}[]>([]);

  // Generate last 7 days
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    return {
      short: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      fullDate: dateStr,
      active: dateStr === selectedDate
    };
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "PARENT") {
        router.push("/parent");
      } else if (user.role === "CHILD") {
        const fetchData = async () => {
          // Fetch reviews
          const reviewRes = await fetch("/api/reviews");
          const reviewData = await reviewRes.json();
          if (reviewData.reviews) setReviews(reviewData.reviews);

          // Fetch entry for selected date
          const entryRes = await fetch(`/api/diary?date=${selectedDate}`);
          const entryData = await entryRes.json();
          if (entryData.entry) {
            setTodayScore(entryData.entry.score);
            setTodayRating(getPerformanceRating(entryData.entry.score));
          } else {
            setTodayScore(0);
            setTodayRating({ rating: "None", color: "#ccc" });
          }
        };
        fetchData();
      }
    }
  }, [user, loading, router, selectedDate]);

  if (loading || !user || user.role !== "CHILD") return null;

  const isToday = selectedDate === todayStr;

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.greetingHeader}>
        <h1>Hi, <span style={{ color: 'var(--primary)' }}>{user.username}</span> <Smile size={32} style={{ color: 'var(--primary)', verticalAlign: 'middle', display: 'inline' }} /></h1>
        
        {/* Day Selector */}
        <div className={styles.daySelector}>
          {days.map(day => (
            <button 
              key={day.fullDate} 
              onClick={() => setSelectedDate(day.fullDate)}
              className={`${styles.dayBtn} ${day.active ? styles.dayBtnActive : ''}`}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              <span>{day.short}</span>
              <span>{day.dateNum}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero / Featured Card */}
      <section className={`${styles.featuredCard} animate-fade-in`}>
        <h2>{isToday ? "Let's start your day" : `Journal for ${selectedDate}`}</h2>
        <p>{isToday ? "Begin with a mindful morning reflection." : "Look back and reflect on how you did."}</p>
        <div className={styles.sunIllustration}>
          {todayScore > 0 ? (
             <div style={{ color: todayRating.color, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800 }}>{todayScore}</span>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>{todayRating.rating}</span>
             </div>
          ) : (
            <Sun size={80} strokeWidth={1.5} />
          )}
        </div>
        <button 
          onClick={() => router.push(`/diary/daily/${selectedDate}`)} 
          className="pill-btn" 
          style={{ marginTop: '20px' }}
        >
          {isToday ? "Record My Day" : "Record Previous Day"} <ArrowRight size={18} />
        </button>
      </section>

      {/* Parent Reviews Section */}
      {reviews.length > 0 && (
        <section className={`${styles.featuredCard} animate-fade-in`} style={{ background: '#fef2f2', border: '2px solid #fecaca', marginTop: '20px' }}>
          <h4 style={{ color: '#e11d48', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Heart size={18} fill="#e11d48" /> Message from Parents
          </h4>
          <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#475569' }}>"{reviews[reviews.length - 1].text}"</p>
          <p style={{ textAlign: 'right', fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' }}>— {reviews[reviews.length - 1].date}</p>
        </section>
      )}

      {/* Quick Journal Sections */}
      <div className={styles.sectionHeader}>
        <h3>Quick Journal</h3>
      </div>

      <section className={styles.quickGrid}>
        <button 
          onClick={() => router.push("/diary/goals")} 
          className={`${styles.quickCard} ${styles.pinkCard}`} 
          style={{ textDecoration: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          <h4>My Goals <Target size={16} style={{ display: 'inline' }} /></h4>
          <p>Check your weekly targets.</p>
          <div className={styles.tagGroup}>
            <span className={styles.miniTag}>Active</span>
            <span className={`${styles.miniTag} ${styles.activeTag}`}>Track</span>
          </div>
        </button>

        <div className={`${styles.quickCard} ${styles.blueCard}`}>
          <h4>Set Intentions <Sparkles size={16} style={{ display: 'inline' }} /></h4>
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
        <button 
          onClick={() => router.push("/monthly/analysis/april")} 
          className="journal-card" 
          style={{ padding: '20px', textAlign: 'center', width: '100%', border: '4px solid #fff' }}
        >
          <BarChart3 size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} />
          <p style={{ fontWeight: 700, marginTop: '10px' }}>Monthly Analysis</p>
        </button>
        <button 
          onClick={() => router.push("/yearly/review")} 
          className="journal-card" 
          style={{ padding: '20px', textAlign: 'center', width: '100%', border: '4px solid #fff' }}
        >
          <Trophy size={32} style={{ margin: '0 auto', color: '#facc15' }} />
          <p style={{ fontWeight: 700, marginTop: '10px' }}>Yearly Review</p>
        </button>
      </div>
    </div>
  );
}
