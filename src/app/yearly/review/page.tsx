"use client";

import { useState, useEffect } from "react";
import styles from "./review.module.css";
import Header from "@frontend/components/Navigation/Header";
import { Trophy, Star, MessageSquare, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface YearlyGoal {
  id: number;
  text: string;
  status: string;
}

export default function YearlyReview() {
  const [isEditing, setIsEditing] = useState(false);
  const [goals, setGoals] = useState<YearlyGoal[]>([
    { id: 1, text: "Focus on my daily prayers and connect with Allah.", status: "Almost there! ✨" },
    { id: 2, text: "Read at least one new book every month.", status: "Yes, I did! 🌟" },
    { id: 3, text: "Be more helpful to my siblings and parents.", status: "Working on it! 💪" },
  ]);
  const [achievements, setAchievements] = useState("");
  const [lessons, setLessons] = useState("");

  // Load from planning data if available
  useEffect(() => {
    const savedPlan = localStorage.getItem("yearly_plan_2026");
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      if (plan.goals) {
        setGoals(plan.goals.map((g: any, i: number) => ({ id: i + 1, text: g, status: "Working on it! 💪" })));
      }
    }
    
    const savedReview = localStorage.getItem("yearly_review_2026");
    if (savedReview) {
      const review = JSON.parse(savedReview);
      if (review.goals) setGoals(review.goals);
      if (review.achievements) setAchievements(review.achievements);
      if (review.lessons) setLessons(review.lessons);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("yearly_review_2026", JSON.stringify({ goals, achievements, lessons }));
    setIsEditing(false);
  };

  const updateGoalStatus = (id: number, status: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, status } : g));
  };

  const updateGoalText = (id: number, text: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, text } : g));
  };

  return (
    <div className={styles.container}>
      <Header />

      <section className={`${styles.mainCard} glass animate-fade-in`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h2>Celebrating My Growth! 🎉</h2>
            <p>You've completed an incredible journey this year. Let's look back at your resolutions.</p>
          </div>
          <button 
            className="pill-btn" 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            style={{ background: isEditing ? '#8b5cf6' : 'white', color: isEditing ? 'white' : '#8b5cf6', border: '2px solid #8b5cf6' }}
          >
            {isEditing ? <><Save size={18} /> Save Review</> : "Edit Review"}
          </button>
        </div>

        <div className={styles.focusReview}>
          <h3>My Annual Focuses</h3>
          <div className={styles.focusList}>
            {goals.map(goal => (
              <div key={goal.id} className={styles.focusItem}>
                <div className={styles.focusText}>
                  <strong>Goal #{goal.id}:</strong>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={goal.text} 
                      onChange={(e) => updateGoalText(goal.id, e.target.value)}
                      style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', fontWeight: 600, fontFamily: 'inherit', width: '100%', marginTop: '5px' }}
                    />
                  ) : (
                    <span>{goal.text}</span>
                  )}
                </div>
                <div className={styles.checkArea}>
                  <label>Status:</label>
                  {isEditing ? (
                    <select value={goal.status} onChange={(e) => updateGoalStatus(goal.id, e.target.value)}>
                      <option>Yes, I did! 🌟</option>
                      <option>Almost there! ✨</option>
                      <option>Working on it! 💪</option>
                    </select>
                  ) : (
                    <span style={{ fontWeight: 700, color: '#8b5cf6' }}>{goal.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.reflectionArea}>
          <h3><Trophy size={20} style={{ display: 'inline', marginRight: '8px' }} /> My Big Achievements</h3>
          {isEditing ? (
            <textarea 
              placeholder="Write down the things you are most proud of this year..." 
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
            />
          ) : (
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', minHeight: '80px', marginTop: '10px' }}>
              {achievements || "Share your biggest wins here!"}
            </div>
          )}
          
          <h3 style={{ marginTop: '30px' }}><Star size={20} style={{ display: 'inline', marginRight: '8px' }} /> What I learned</h3>
          {isEditing ? (
            <textarea 
              placeholder="What are the biggest lessons you learned this year?" 
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
            />
          ) : (
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', minHeight: '80px', marginTop: '10px' }}>
              {lessons || "What did this year teach you?"}
            </div>
          )}
        </div>

        {!isEditing && (
          <div style={{ marginTop: '40px', textAlign: 'center', paddingTop: '30px', borderTop: '2px dashed #f1f5f9' }}>
             <button className="pill-btn" onClick={() => window.print()}>Print My Year-End Certificate 📜</button>
          </div>
        )}
      </section>
    </div>
  );
}
