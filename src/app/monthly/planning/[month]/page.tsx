"use client";

import { use, useState } from "react";
import styles from "./planning.module.css";
import Header from "@frontend/components/Navigation/Header";
import { Edit3, Save, BookOpen, Heart, Clock, Plus, Trash2 } from "lucide-react";

interface ScheduleRow {
  task: string;
  dailyFrom: string;
  dailyTo: string;
}

interface SavedPlan {
  schedule?: ScheduleRow[];
  reading?: string;
  familyTime?: string;
}

const DEFAULT_SCHEDULE: ScheduleRow[] = [
  { task: "Awakening", dailyFrom: "07:00", dailyTo: "07:30" },
  { task: "School / Study", dailyFrom: "08:30", dailyTo: "14:30" },
  { task: "Helping Hands / Chores", dailyFrom: "16:00", dailyTo: "17:00" },
  { task: "Sports / Exercise", dailyFrom: "17:30", dailyTo: "18:30" },
  { task: "Sleeping", dailyFrom: "21:00", dailyTo: "07:00" },
];

export default function MonthlyPlanning({ params: paramsPromise }: { params: Promise<{ month: string }> }) {
  const params = use(paramsPromise);
  const month = params.month.charAt(0).toUpperCase() + params.month.slice(1);
  
  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleRow[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`planning_${params.month}`);
      if (saved) {
        const parsed: SavedPlan = JSON.parse(saved);
        return parsed.schedule || DEFAULT_SCHEDULE;
      }
    }
    return DEFAULT_SCHEDULE;
  });

  const [reading, setReading] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`planning_${params.month}`);
      if (saved) {
        const parsed: SavedPlan = JSON.parse(saved);
        return parsed.reading || "";
      }
    }
    return "";
  });

  const [familyTime, setFamilyTime] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`planning_${params.month}`);
      if (saved) {
        const parsed: SavedPlan = JSON.parse(saved);
        return parsed.familyTime || "";
      }
    }
    return "";
  });

  const handleSave = () => {
    localStorage.setItem(`planning_${params.month}`, JSON.stringify({ schedule, reading, familyTime }));
    setIsEditing(false);
  };

  const updateSchedule = (index: number, field: keyof ScheduleRow, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const addRow = () => {
    setSchedule([...schedule, { task: "", dailyFrom: "12:00", dailyTo: "13:00" }]);
  };

  const removeRow = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.topActions}>
        <div /> {/* Spacer for flex alignment */}
        <button 
          className={`pill-btn ${isEditing ? styles.saveBtn : styles.editBtn}`}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <><Save size={18} /> Save Plan</>
          ) : (
            <><Edit3 size={18} /> Edit Plan</>
          )}
        </button>
      </div>

      <div className={styles.header}>
        <h1>Plan for {month}</h1>
        <p>Set your daily routine and constructive goals for the month.</p>
      </div>

      <div className={styles.grid}>
        {/* Schedule Section */}
        <section className={`${styles.card} glass`}>
          <div className={styles.cardHeader}>
            <h2><Clock size={22} /> My Daily Schedule</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Daily (From - To)</th>
                  {isEditing && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, idx) => (
                  <tr key={idx}>
                    <td className={styles.taskNameCell}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={row.task} 
                          onChange={(e) => updateSchedule(idx, 'task', e.target.value)}
                          className={styles.taskInput}
                        />
                      ) : (
                        <span className={styles.taskLabel}>{row.task}</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.timeRange}>
                        {isEditing ? (
                          <>
                            <input type="time" value={row.dailyFrom} onChange={(e) => updateSchedule(idx, 'dailyFrom', e.target.value)} />
                            <span>-</span>
                            <input type="time" value={row.dailyTo} onChange={(e) => updateSchedule(idx, 'dailyTo', e.target.value)} />
                          </>
                        ) : (
                          <span className={styles.timeVal}>{row.dailyFrom} - {row.dailyTo}</span>
                        )}
                      </div>
                    </td>
                    {isEditing && (
                      <td>
                        <button onClick={() => removeRow(idx)} className={styles.removeBtn}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {isEditing && (
              <button onClick={addRow} className={styles.addBtn}>
                <Plus size={18} /> Add More Slots
              </button>
            )}
          </div>
        </section>

        {/* Goals Section */}
        <section className={`${styles.card} glass`}>
          <div className={styles.goalSection}>
            <h2><BookOpen size={22} /> Constructive Reading</h2>
            <p>What books or stories will you read this month?</p>
            {isEditing ? (
              <textarea 
                placeholder="List your books, titles, and stories..." 
                value={reading}
                onChange={(e) => setReading(e.target.value)}
              />
            ) : (
              <div className={styles.viewBox}>{reading || "No books listed yet."}</div>
            )}
          </div>

          <div className={styles.goalSection} style={{ marginTop: '30px' }}>
            <h2><Heart size={22} /> Family & Helping Hands</h2>
            <p>How will you help around the house and spend time with family?</p>
            {isEditing ? (
              <textarea 
                placeholder="e.g. Setting the table, reading to siblings, weekend walks..." 
                value={familyTime}
                onChange={(e) => setFamilyTime(e.target.value)}
              />
            ) : (
              <div className={styles.viewBox}>{familyTime || "No family goals listed yet."}</div>
            )}
          </div>
        </section>
      </div>

      {!isEditing && (
        <div className={styles.printNote}>
          <p>✨ Tip: You can print your monthly plan to keep it on your desk!</p>
          <button className="pill-btn no-print" onClick={() => window.print()}>Print Daily Plan</button>
        </div>
      )}
    </div>
  );
}
