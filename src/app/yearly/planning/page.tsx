"use client";

import { useState, useEffect } from "react";
import Header from "@frontend/components/Navigation/Header";
import { Sparkles, Save, Edit3, Trash2, Plus, Rocket } from "lucide-react";
import { Button } from "@frontend/components/Common/Button";
import { Card } from "@frontend/components/Common/Card";
import { YearlyPlanningContainer } from "./YearlyPlanningStyles";

interface YearlyGoal {
  id: string;
  text: string;
}

const DEFAULT_GOALS: YearlyGoal[] = [
  { id: "1", text: "Learn a new language" },
  { id: "2", text: "Read 12 books" },
  { id: "3", text: "Help more at home" }
];

export default function YearlyPlanning() {
  const [isEditing, setIsEditing] = useState(false);
  const [vision, setVision] = useState("");
  const [goals, setGoals] = useState<YearlyGoal[]>(DEFAULT_GOALS);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("yearly_plan");
    if (saved) {
      const parsed = JSON.parse(saved);
      setVision(parsed.vision || "");
      setGoals(parsed.goals || DEFAULT_GOALS);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("yearly_plan", JSON.stringify({ vision, goals }));
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const updateGoal = (id: string, text: string): void => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, text } : g));
  };

  const addGoal = () => {
    const newId = Date.now().toString();
    setGoals(prev => [...prev, { id: newId, text: "" }]);
  };

  const removeGoal = (id: string): void => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <YearlyPlanningContainer>
      <Header />

      <div className="top-actions">
        <Button 
          variant={isEditing ? "primary" : "secondary"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <><Save size={18} style={{ marginRight: '8px' }} /> Save My Year</>
          ) : (
            <><Edit3 size={18} style={{ marginRight: '8px' }} /> Edit My Plan</>
          )}
        </Button>
      </div>

      <Card variant="default" className="planning-card glass animate-fade-in">
        <div className="hero">
          <Sparkles size={48} color="#8b5cf6" />
          <h1>My Yearly Vision</h1>
          <p>Imagine your best self. What does this year look like for you?</p>
        </div>

        {showSuccess && (
          <div className="success-msg">
            ✨ Your yearly plan has been safely tucked away!
          </div>
        )}

        <div className="vision-area">
          {isEditing ? (
            <textarea 
              placeholder="Write your big dream here..." 
              value={vision}
              onChange={(e) => setVision(e.target.value)}
            />
          ) : (
            <div className="vision-view">
              {vision || "A world of possibilities awaits... Start by editing your vision!"}
            </div>
          )}
        </div>

        <div className="goals-section">
          <h2><Rocket size={24} color="#8b5cf6" /> Top Yearly Goals</h2>
          <div className="goal-list">
            {goals.map((goal, index) => (
              <div key={goal.id} className="goal-item">
                <div className="goal-index">{index + 1}</div>
                {isEditing ? (
                  <>
                    <input 
                      type="text" 
                      value={goal.text}
                      placeholder="Enter a big goal..."
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateGoal(goal.id, e.target.value)}
                    />
                    <button onClick={() => removeGoal(goal.id)} className="remove-btn">
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <span className="goal-text">{goal.text || "Unset goal"}</span>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <Button 
              variant="secondary" 
              className="add-btn" 
              onClick={(e) => {
                e.preventDefault();
                addGoal();
              }}
              style={{ width: '100%', borderStyle: 'dashed' }}
            >
              <Plus size={18} style={{ marginRight: '8px' }} /> Add Another Yearly Goal
            </Button>
          )}
        </div>
      </Card>
    </YearlyPlanningContainer>
  );
}
