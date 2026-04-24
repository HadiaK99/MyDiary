"use client";

import { useState, useEffect } from "react";
import { User } from "@shared/types";
import { Trophy, Medal, Star } from "lucide-react";
import { DiaryEntry } from "@shared/types";

export default function Rankings() {
  const [leaderboard, setLeaderboard] = useState<{ username: string, totalScore: number }[]>([]);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      // Fetch all children
      const userRes = await fetch("/api/admin/users");
      const userData = await userRes.json();
      const children = userData.users?.filter((u: User) => u.role === "CHILD") || [];

      // Fetch scores for each child
      const rankings = await Promise.all(children.map(async (child: User) => {
        const diaryRes = await fetch(`/api/diary?userId=${child.id}`);
        const diaryData = await diaryRes.json();
        const entries = diaryData.entries as DiaryEntry[] || [];
        const totalScore = entries.reduce((acc: number, curr: DiaryEntry) => acc + curr.score, 0);
        return {
          username: child.username,
          totalScore
        };
      }));

      if (active) {
        setLeaderboard(rankings.sort((a, b) => b.totalScore - a.totalScore));
      }
    };
    fetchData();
    return () => { active = false; };
  }, []);

  return (
    <div>
      <div className="table-title">
        <div>
          <h1>Global Rankings</h1>
          <p style={{ color: '#64748b' }}>See who's making the most progress this month!</p>
        </div>
        <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy size={48} />
        </div>
      </div>

      <div className="table-container">
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', gap: '15px' }}>
          {leaderboard.map((entry, index) => (
            <div key={entry.username} className="stat-card" style={{ background: index < 3 ? 'rgba(245, 158, 11, 0.05)' : 'white' }}>
              <div className="stat-icon" style={{
                background: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : '#f1f5f9',
                color: index < 3 ? 'white' : '#64748b',
                padding: '10px',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {index < 3 ? <Medal size={28} /> : <span style={{ fontWeight: 800 }}>{index + 1}</span>}
              </div>
              <div className="stat-info" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4 style={{ color: '#1e293b', fontSize: '1rem', fontWeight: 700, margin: 0 }}>{entry.username}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0' }}>Moral Hero Level {Math.floor(entry.totalScore / 100) + 1}</p>
                </div>
                <div style={{ textAlign: 'right', marginLeft: 'auto', flexShrink: 0 }}>
                  <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem' }}>{entry.totalScore} pts</p>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '5px', justifyContent: 'flex-end' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= (index < 3 ? 5 : 3) ? '#fbbf24' : 'none'} color="#fbbf24" />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No children registered yet.</p>}
        </div>
      </div>
    </div>
  );
}
