"use client";

import { use, useEffect, useState } from "react";
import styles from "./analysis.module.css";
import Header from "@frontend/components/Navigation/Header";
import { Sparkles, Calendar, Heart } from "lucide-react";
import { ActivityCategory } from "@shared/constants/activities";

interface CategoryStat {
  name: string;
  percentage: number;
  emoji: string;
  color: string;
  status: string;
}

export default function MonthlyAnalysis({ params: paramsPromise }: { params: Promise<{ month: string }> }) {
  const params = use(paramsPromise);
  const month = params.month.charAt(0).toUpperCase() + params.month.slice(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const getEmoji = (percent: number) => {
    if (percent >= 85) return "🌟";
    if (percent >= 65) return "✨";
    if (percent >= 40) return "💪";
    return "❤️";
  };

  const getColor = (percent: number) => {
    if (percent >= 85) return "#8b5cf6"; // Superstar (Purple)
    if (percent >= 65) return "#10b981"; // Doing Great (Green)
    if (percent >= 40) return "#6366f1"; // Solid Start (Blue)
    return "#f97316"; // Needs Focus (Orange)
  };

  const getStatusText = (percent: number) => {
    if (percent >= 85) return "Superstar!";
    if (percent >= 65) return "Doing Great!";
    if (percent >= 40) return "Solid Progress";
    return "Needs Focus";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories to know what to track
        const catRes = await fetch("/api/admin/activities");
        const catData = await catRes.json();
        const categories: ActivityCategory[] = catData.categories || [];

        // Fetch all entries
        const entriesRes = await fetch("/api/diary");
        const entriesData = await entriesRes.json();
        const entries = (entriesData.entries || []) as { id: string; date: string; data: string }[];

        const monthIndex = new Date(`${month} 1, 2026`).getMonth();
        const filteredEntries = entries.filter((e) => {
          const entryDate = new Date(e.date);
          return entryDate.getMonth() === monthIndex;
        });

        if (filteredEntries.length === 0) {
          setStats([]);
          setLoading(false);
          return;
        }

        // Aggregate data
        const catStats: CategoryStat[] = categories.map(cat => {
          let totalItemsChecked = 0;
          let totalPossibleItems = 0;

          filteredEntries.forEach((entry) => {
            const entryData = JSON.parse(entry.data) as { activities?: Record<string, boolean> };
            const entryActivities = entryData.activities || {};
            
            // Normalize keys to avoid space-related mismatches
            const normalizedActivities: Record<string, boolean> = {};
            Object.keys(entryActivities).forEach(k => {
              normalizedActivities[k.trim()] = entryActivities[k];
            });

            cat.activities.forEach((act) => {
              totalPossibleItems++;
              const actName = (typeof act === 'string' ? act : act.name).trim();
              if (normalizedActivities[actName]) {
                totalItemsChecked++;
              }
            });
          });

          const percentage = totalPossibleItems > 0 ? Math.round((totalItemsChecked / totalPossibleItems) * 100) : 0;
          const finalPercent = (totalItemsChecked === totalPossibleItems && totalPossibleItems > 0) ? 100 : percentage;

          return {
            name: cat.name,
            percentage: finalPercent,
            emoji: getEmoji(finalPercent),
            color: getColor(finalPercent),
            status: getStatusText(finalPercent)
          };
        });

        const totalPercent = catStats.reduce((acc, curr) => acc + curr.percentage, 0) / (catStats.length || 1);
        setOverallScore(Math.round(totalPercent));
        setStats(catStats);
      } catch (err: unknown) {
        console.error("Aggregation error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div className={styles.container}>
      <Header />

      <section className={`${styles.analysisCard} glass animate-fade-in`}>
        <div className={styles.heroSection}>
          <div className={styles.heroText}>
            <h1>How did I do? <Sparkles size={28} style={{ color: '#facc15' }} /></h1>
            <p>Your Monthly Progress Report for <strong>{month}</strong></p>
          </div>
          <div className={styles.overallBadge} style={{ background: getColor(overallScore) }}>
            <span className={styles.scoreNum}>{overallScore}%</span>
            <span className={styles.scoreLabel}>OVERALL</span>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingArea}>
            <div className="animate-pulse">Analyzing your achievements...</div>
          </div>
        ) : stats.length > 0 ? (
          <div className={styles.markSheet}>
            <div className={styles.sheetHeader}>
              <span>Category</span>
              <span style={{ textAlign: 'center' }}>Progress</span>
              <span style={{ textAlign: 'right' }}>Ranking</span>
            </div>

            {stats.map(stat => (
              <div key={stat.name} className={styles.sheetRow}>
                <div className={styles.catName}>
                  <strong>{stat.name}</strong>
                </div>

                <div className={styles.progressCol}>
                  <div className={styles.progressBarWrapper}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${stat.percentage}%`, background: stat.color }}
                    ></div>
                  </div>
                  <span className={styles.percentText}>{stat.percentage}%</span>
                </div>

                <div className={styles.rankCol}>
                  <span className={styles.rankingEmoji}>{stat.emoji}</span>
                  <span className={styles.statusText} style={{ color: stat.color }}>{stat.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Calendar size={48} opacity={0.2} style={{ marginBottom: '15px' }} />
            <p>No entries found for {month}. Keep writing every day to see your report!</p>
          </div>
        )}

        <div className={styles.summaryFooter}>
          <div className={styles.insightBox}>
            <Heart size={20} fill="#ef4444" color="#ef4444" />
            <span>Reflect on your growth. Every small step counts towards a better version of you!</span>
          </div>
          <button className="pill-btn no-print" onClick={() => window.print()}>
            Print My Mark Sheet
          </button>
        </div>
      </section>
    </div>
  );
}
