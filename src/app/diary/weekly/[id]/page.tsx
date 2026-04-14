'use client';
import React, { useState, use } from "react";
import styles from "./weekly.module.css";
import { ACTIVITY_CATEGORIES, DAYS } from "@/constants/activities";
import Link from "next/link";

export default function WeeklyDiary({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  // Mock state for the grid: { [activity]: { [day]: boolean } }
  const [data, setData] = useState<Record<string, Record<string, boolean>>>({});

  const toggleActivity = (activity: string, day: string) => {
    setData(prev => ({
      ...prev,
      [activity]: {
        ...prev[activity],
        [day]: !prev[activity]?.[day]
      }
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>⬅️ Dashboard</Link>
        <h1>Week {params.id} Journal</h1>
        <div className={styles.weekDates}>April 13 - April 19, 2026</div>
      </header>

      <div className={`${styles.gridContainer} glass`}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.stickyCol}>Activity</th>
                {DAYS.map(day => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_CATEGORIES.map(category => (
                <React.Fragment key={category.name}>
                  <tr className={styles.categoryRow}>
                    <td colSpan={8}>{category.name}</td>
                  </tr>
                  {category.activities.map(activity => (
                    <tr key={activity}>
                      <td className={styles.stickyCol}>{activity}</td>
                      {DAYS.map(day => (
                        <td key={day} className={styles.cell}>
                          <button
                            className={`${styles.checkBtn} ${data[activity]?.[day] ? styles.checked : ''}`}
                            onClick={() => toggleActivity(activity, day)}
                          >
                            {data[activity]?.[day] ? '✅' : '○'}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className={styles.summarySection}>
        <div className={`${styles.remarksCard} glass`}>
          <h3>Daily Remarks</h3>
          <textarea placeholder="Write down something special about your week..."></textarea>
        </div>

        <div className={`${styles.analysisCard} glass`}>
          <h3>Weekly Analysis</h3>
          <div className={styles.analysisGrid}>
            <div className={styles.analysisItem}>
              <span>Excellent</span>
              <div className={styles.countBox}>0</div>
            </div>
            <div className={styles.analysisItem}>
              <span>Good</span>
              <div className={styles.countBox}>0</div>
            </div>
            <div className={styles.analysisItem}>
              <span>Fair</span>
              <div className={styles.countBox}>0</div>
            </div>
            <div className={styles.analysisItem}>
              <span>Poor</span>
              <div className={styles.countBox}>0</div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <button className="primary-btn">Save Journal Entry</button>
      </footer>
    </div>
  );
}
