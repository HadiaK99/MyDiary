"use client";

import { useState, useEffect } from "react";
import Header from "@frontend/components/Navigation/Header";
import { Sparkles, Trophy, Star, ChevronLeft, Edit3, Save } from "lucide-react";
import { Button } from "@frontend/components/Common/Button";
import { Card } from "@frontend/components/Common/Card";
import { YearlyReviewContainer } from "./YearlyReviewStyles";
import { useRouter } from "next/navigation";

export default function YearlyReview() {
  const router = useRouter();
  const [reflection, setReflection] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [focusAreas, setFocusAreas] = useState([
    { id: 1, title: "Studies & Learning", score: "Excellent" },
    { id: 2, title: "Helping at Home", score: "Good" },
    { id: 3, title: "Personal Growth", score: "Improving" },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("yearly_review");
    if (saved) {
      const parsed = JSON.parse(saved);
      setReflection(parsed.reflection || "");
      setFocusAreas(parsed.focusAreas || focusAreas);
    }
  }, []);

  const handleSave = (): void => {
    setIsSaving(true);
    localStorage.setItem("yearly_review", JSON.stringify({ reflection, focusAreas }));
    
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  };

  return (
    <YearlyReviewContainer>
      <Header />

      <div className="top-actions">
        <Button variant="ghost" className="back-btn" onClick={() => router.back()}>
          <ChevronLeft size={18} style={{ marginRight: '8px' }} /> Back
        </Button>

        <Button 
          variant={isEditing ? "primary" : "secondary"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
        >
          {isEditing ? (
            <><Save size={18} style={{ marginRight: '8px' }} /> Save My Review</>
          ) : (
            <><Edit3 size={18} style={{ marginRight: '8px' }} /> Edit My Review</>
          )}
        </Button>
      </div>

      <Card variant="default" className="main-card glass animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2>Annual Achievement Review</h2>
            <p>Let's look back at everything you've accomplished this year!</p>
          </div>
          <Trophy size={60} color="#facc15" />
        </div>

        {showSuccess && (
          <div className="success-msg" style={{ 
            background: '#f0fdf4', 
            color: '#166534', 
            padding: '12px 20px', 
            borderRadius: '12px', 
            marginBottom: '30px', 
            fontWeight: 600, 
            fontSize: '0.9rem', 
            border: '1px solid #bbf7d0',
            textAlign: 'center'
          }}>
            ✨ Your yearly review has been safely tucked away!
          </div>
        )}

        <div className="focus-review">
          <h3><Star size={20} fill="#8b5cf6" style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Performance Summary</h3>
          <div className="focus-list">
            {focusAreas.map(area => (
              <div key={area.id} className="focus-item">
                <div className="focus-text">
                  <strong>{area.title}</strong>
                </div>
                <div className="check-area">
                  {isEditing ? (
                    <select 
                      value={area.score} 
                      onChange={(e) => setFocusAreas(focusAreas.map(a => a.id === area.id ? { ...a, score: e.target.value } : a))}
                      style={{ padding: '8px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontFamily: 'inherit', fontWeight: 600 }}
                    >
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Improving</option>
                      <option>Needs Effort</option>
                    </select>
                  ) : (
                    <span style={{ fontWeight: 700, color: '#8b5cf6' }}>{area.score}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reflection-area">
          <h3>Reflection & Future Goals</h3>
          <p>What was your favorite moment of the year? What do you want to do better next year?</p>
          {isEditing ? (
            <textarea 
              placeholder="I am proud of... Next year I want to..." 
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          ) : (
            <div style={{ 
              background: '#f8fafc', 
              padding: '20px', 
              borderRadius: '16px', 
              border: '1.5px dashed #cbd5e1',
              minHeight: '100px',
              color: '#1e293b',
              lineHeight: 1.6,
              fontStyle: 'italic'
            }}>
              {reflection || "A world of possibilities awaits... Start by editing your reflection!"}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="footer" style={{ marginTop: '30px' }}>
            <Button 
              variant="primary" 
              size="large"
              disabled={isSaving}
              onClick={handleSave}
              fullWidth
            >
              {isSaving ? "Saving..." : "Complete Yearly Review"} <Sparkles size={18} style={{ marginLeft: '8px' }} />
            </Button>
          </div>
        )}
      </Card>
    </YearlyReviewContainer>
  );
}
