"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import { useChild } from "@frontend/context/ChildContext";
import { User, DiaryEntry } from "@shared/types";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@frontend/components/Common/Button";

export default function ParentDashboard() {
  const { user } = useAuth();
  const { selectedChild } = useChild();
  const router = useRouter();
  const [childStats, setChildStats] = useState({
    entries: 0,
    avgScore: 0,
    totalPoints: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChild) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch child diary entries for stats
          const diaryRes = await fetch(`/api/diary?userId=${selectedChild.id}`);
          const diaryData = await diaryRes.json();
          if (diaryData.entries) {
            const entries = diaryData.entries as DiaryEntry[];
            const totalPoints = entries.reduce((acc, curr) => acc + curr.score, 0);
            setChildStats({
              entries: entries.length,
              avgScore: entries.length > 0 ? Math.round(totalPoints / entries.length) : 0,
              totalPoints
            });
          }
        } catch (error) {
          console.error("Failed to fetch child stats:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedChild]);

  if (!selectedChild) return (
    <div className="welcome-card">
      <div className="welcome-text">
        <h1>Welcome, {user?.username}!</h1>
        <p>You haven't linked any child accounts yet. Please contact the administrator.</p>
      </div>
    </div>
  );

  return (
    <div>
      <section className="welcome-card">
        <div className="welcome-text">
          <h1>Welcome, <span style={{ color: 'var(--primary)' }}>{user?.username}</span>!</h1>
          <p>Here's how {selectedChild.username} is doing today.</p>
        </div>
        <Heart size={80} fill="#fce7f3" color="#fce7f3" />
      </section>

      <div className="child-preview">
        <div className="child-header">
          <div className="child-avatar">{selectedChild.username.charAt(0)}</div>
          <div className="child-info">
            <h3>{selectedChild.username}</h3>
            <p><Sparkles size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Level 4 Moral Hero</p>
          </div>
          <Button
            onClick={() => router.push(`/parent/report`)}
            style={{ marginLeft: 'auto' }}
          >
            Full Report <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Button>
        </div>

        <div className="progress-grid">
          <div className="progress-stat">
            <h5>Total Entries</h5>
            <p>{childStats.entries}</p>
          </div>
          <div className="progress-stat">
            <h5>Avg. Score</h5>
            <p>{childStats.avgScore}%</p>
          </div>
          <div className="progress-stat">
            <h5>Total Points</h5>
            <p>{childStats.totalPoints}</p>
          </div>
        </div>

        <div className="review-section">
          <h4 style={{ color: '#64748b', marginBottom: '15px' }}>Recent Review from You</h4>
          <div className="review-card">
            <h4>
              <span>Great job on Fajr!</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Yesterday</span>
            </h4>
            <p>"I'm so proud of how consistent you've been with your morning prayers this week. Keep it up, champ!"</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/parent/reviews")}
            style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            + Add New Review
          </button>
        </div>
      </div>
    </div>
  );
}
