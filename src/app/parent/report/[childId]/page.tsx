"use client";

import { useState, useEffect, use } from "react";
import { useAuth, User } from "@frontend/context/AuthContext";
import styles from "../../parent.module.css";
import { calculateScore, getPerformanceRating } from "@shared/utils/scoring";
import { ActivityCategory } from "@shared/constants/activities";
import { ArrowLeft, Calendar, MessageSquare, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChildReport({ params: paramsPromise }: { params: Promise<{ childId: string }> }) {
  const params = use(paramsPromise);
  const childId = params.childId;
  const { user } = useAuth();
  const router = useRouter();
  const [child, setChild] = useState<User | null>(null);
  const [entries, setEntries] = useState<{date: string, score: number, rating: string}[]>([]);
  const [categories, setCategories] = useState<ActivityCategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Load child info
      const userRes = await fetch("/api/admin/users");
      const userData = await userRes.json();
      const found = userData.users?.find((u: User) => u.id === childId);
      if (found) setChild(found);

      // Load categories for correct scoring
      const catRes = await fetch("/api/admin/activities");
      const catData = await catRes.json();
      if (catData.categories) setCategories(catData.categories);

      // Fetch entries for this child
      const diaryRes = await fetch(`/api/diary?userId=${childId}`);
      const diaryData = await diaryRes.json();
      if (diaryData.entries) {
        setEntries(diaryData.entries.sort((a: any, b: any) => b.date.localeCompare(a.date)));
      }
    };
    fetchData();
  }, [childId]);

  if (!child) return <div>Child not found</div>;

  return (
    <div>
      <div className={styles.tableTitle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            type="button"
            onClick={() => router.push("/parent")} 
            className={styles.actionBtn}
            style={{ padding: '8px', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1>{child.username}'s Report</h1>
            <p>Detailed breakdown of daily performance.</p>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.tableContainer} style={{ gridColumn: 'span 2' }}>
          <h3>Recent Entries</h3>
          <table className={styles.adminTable} style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Score</th>
                <th>Rating</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.date}>
                  <td style={{ fontWeight: 700 }}><Calendar size={14} inline /> {entry.date}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 800 }}>{entry.score} pts</td>
                  <td>
                    <span className={`${styles.badge} ${
                        entry.rating === 'Excellent' ? styles.badgeChild : 
                        entry.rating === 'Good' ? styles.badgeParent : styles.badgeAdmin
                    }`}>
                        {entry.rating}
                    </span>
                  </td>
                  <td>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', width: '100px' }}>
                        <div style={{ height: '100%', background: 'var(--primary)', borderRadius: '4px', width: `${Math.min(entry.score, 100)}%` }}></div>
                    </div>
                  </td>
                  <td>
                    <button className={styles.actionBtn} type="button"><MessageSquare size={14} /></button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>No entries found for this child yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className={styles.tableContainer}>
          <h3>Summary</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className={styles.progressStat} style={{ textAlign: 'left' }}>
                <h5>Average Performance</h5>
                <p>Great (42 pts)</p>
            </div>
            <div className={styles.progressStat} style={{ textAlign: 'left' }}>
                <h5>Best Activity</h5>
                <p>Spirituality (95%)</p>
            </div>
            <div className={styles.progressStat} style={{ textAlign: 'left' }}>
                <h5>Growth Mindset</h5>
                <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="#fb8500" color="#fb8500" />)}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
