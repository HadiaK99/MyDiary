"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import Header from "@frontend/components/Navigation/Header";
import styles from "./goals.module.css";
import { Target, Plus, CheckCircle2, Circle, Trophy } from "lucide-react";

interface Goal {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
}

export default function ChildGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    if (user) {
      const fetchGoals = async () => {
        const res = await fetch("/api/goals");
        const data = await res.json();
        if (data.goals) setGoals(data.goals);
      };
      fetchGoals();
    }
  }, [user]);

  const addGoal = async () => {
    if (!newGoal.trim() || !user) return;
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newGoal }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setGoals([data.goal, ...goals]);
      setNewGoal("");
    }
  };

  const toggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const res = await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !goal.completed }),
    });

    if (res.ok) {
      const data = await res.json();
      setGoals(goals.map(g => g.id === id ? data.goal : g));
    }
  };

  if (!user) return null;

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.goalsCard}>
        <div className={styles.header}>
          <div className={styles.iconBox}><Target size={32} color="white" /></div>
          <div>
            <h1>My Goals</h1>
            <p>What do you want to achieve this week?</p>
          </div>
          <div className={styles.progressCircle}>
            <span>{completedCount}/{goals.length}</span>
          </div>
        </div>

        <div className={styles.addSection}>
          <input 
            type="text" 
            placeholder="Add a new goal..." 
            className={`${styles.addInput} pill-btn`} 
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
          />
          <button className={`${styles.addButton} pill-btn`} onClick={addGoal}><Plus size={20} /></button>
        </div>

        <div className={styles.goalsList}>
          {goals.map(goal => (
            <div key={goal.id} className={`${styles.goalItem} ${goal.completed ? styles.goalDone : ''}`} onClick={() => toggleGoal(goal.id)}>
              {goal.completed ? <CheckCircle2 color="#10b981" /> : <Circle color="#94a3b8" />}
              <span>{goal.text}</span>
            </div>
          ))}
          {goals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <Trophy size={48} style={{ opacity: 0.2, margin: '0 auto 20px' }} />
              <p>No goals set yet. Let's dream big!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
