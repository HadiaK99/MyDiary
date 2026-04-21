"use client";

import { useState, useEffect } from "react";
import styles from "./planning.module.css";
import Header from "@frontend/components/Navigation/Header";
import { Sparkles, Target, Calendar, ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function YearlyPlanning() {
  const [isEditing, setIsEditing] = useState(true);
  const [vision, setVision] = useState("");
  const [goals, setGoals] = useState<string[]>(["", "", ""]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem("yearly_plan_2026");
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      if (plan.vision) setVision(plan.vision);
      if (plan.goals) setGoals(plan.goals);
      setIsEditing(false);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("yearly_plan_2026", JSON.stringify({ vision, goals }));
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateGoal = (idx: number, text: string) => {
    const newGoals = [...goals];
    newGoals[idx] = text;
    setGoals(newGoals);
  };

  const addGoal = () => setGoals([...goals, ""]);
  const removeGoal = (idx: number) => setGoals(goals.filter((_, i) => i !== idx));

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.topActions}>
        <div /> {/* Spacer for flex alignment */}
        <button 
          className="pill-btn" 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          style={{ background: isEditing ? '#8b5cf6' : 'white', color: isEditing ? 'white' : '#8b5cf6', border: '2px solid #8b5cf6' }}
        >
          {isEditing ? <><Save size={18} /> Save My Vision</> : "Edit My Plan"}
        </button>
      </div>

      <section className={`${styles.planningCard} glass animate-fade-in`}>
        <div className={styles.hero}>
          <Sparkles size={48} color="#facc15" />
          <h1>My Vision for 2026</h1>
          <p>What kind of person do you want to become this year? What big dreams do you have?</p>
        </div>

        {saved && (
          <div className={styles.successMsg}>
            ✨ Your annual vision has been safely locked in your diary!
          </div>
        )}

        <div className={styles.visionArea}>
          {isEditing ? (
            <textarea 
              placeholder="In 2026, I want to be more patient, learn how to code, and help my parents every day. I dream of being a person who..."
              value={vision}
              onChange={(e) => setVision(e.target.value)}
            />
          ) : (
            <div className={styles.visionView}>
              {vision || "Click 'Edit My Plan' to write your vision for the year!"}
            </div>
          )}
        </div>

        <div className={styles.goalsSection}>
          <h2><Target size={24} /> My Top Annual Goals</h2>
          <div className={styles.goalList}>
            {goals.map((goal, idx) => (
              <div key={idx} className={styles.goalItem}>
                <span className={styles.goalIndex}>#{idx + 1}</span>
                {isEditing ? (
                  <>
                    <input 
                      type="text" 
                      placeholder="e.g. Master my multiplication tables" 
                      value={goal}
                      onChange={(e) => updateGoal(idx, e.target.value)}
                    />
                    <button onClick={() => removeGoal(idx)} className={styles.removeBtn}>
                      <Trash2 size={18} />
                    </button>
                  </>
                ) : (
                  <span className={styles.goalText}>{goal || "Empty goal"}</span>
                )}
              </div>
            ))}
            {isEditing && (
              <button onClick={addGoal} className={styles.addBtn}>
                <Plus size={18} /> Add Another Goal
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
