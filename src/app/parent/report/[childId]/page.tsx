"use client";

import { useState, useEffect, use } from "react";
import { User } from "@shared/types";
import { ArrowLeft, Calendar, MessageSquare, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@frontend/components/Common/Button";

export default function ChildReport({ params: paramsPromise }: { params: Promise<{ childId: string }> }) {
  const params = use(paramsPromise);
  const childId = params.childId;
  const router = useRouter();
  const [child, setChild] = useState<User | null>(null);
  const [entries, setEntries] = useState<{ date: string, score: number, rating: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await fetch("/api/admin/users");
      const userData = await userRes.json();
      const found = userData.users?.find((u: User) => u.id === childId);
      if (found) setChild(found);

      const diaryRes = await fetch(`/api/diary?userId=${childId}`);
      const diaryData = await diaryRes.json();
      if (diaryData.entries) {
        const sortedEntries = (diaryData.entries as { date: string, score: number, rating: string }[]).sort((a, b) => b.date.localeCompare(a.date));
        setEntries(sortedEntries);
      }
    };
    fetchData();
  }, [childId]);

  if (!child) return <div>Child not found</div>;

  return (
    <div>
      <div className="table-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Button
            variant="ghost"
            onClick={() => router.push("/parent")}
            style={{ padding: '8px' }}
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1>{child.username}'s Report</h1>
            <p style={{ color: '#64748b' }}>Detailed breakdown of daily performance.</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="table-container" style={{ gridColumn: 'span 2' }}>
          <h3>Recent Entries</h3>
          <table className="admin-table" style={{ marginTop: '20px' }}>
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
                  <td style={{ fontWeight: 700 }}>
                    <Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} /> 
                    {entry.date}
                  </td>
                  <td style={{ color: 'var(--primary)', fontWeight: 800 }}>{entry.score} pts</td>
                  <td>
                    <span className={`badge ${entry.rating === 'Excellent' ? 'badge-child' :
                        entry.rating === 'Good' ? 'badge-parent' : 'badge-admin'
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
                    <Button variant="ghost" style={{ padding: '8px' }}>
                      <MessageSquare size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No entries found for this child yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h3>Summary</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="progress-stat" style={{ textAlign: 'left' }}>
              <h5>Average Performance</h5>
              <p>Great (42 pts)</p>
            </div>
            <div className="progress-stat" style={{ textAlign: 'left' }}>
              <h5>Best Activity</h5>
              <p>Spirituality (95%)</p>
            </div>
            <div className="progress-stat" style={{ textAlign: 'left' }}>
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
