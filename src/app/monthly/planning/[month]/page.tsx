"use client";

import { use, useState } from "react";
import Header from "@frontend/components/Navigation/Header";
import { Edit3, Save, BookOpen, Heart, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@frontend/components/Common/Button";
import { Card } from "@frontend/components/Common/Card";
import { PlanningContainer } from "./PlanningStyles";

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
  const monthName = params.month.charAt(0).toUpperCase() + params.month.slice(1);
  
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
    <PlanningContainer>
      <Header />

      <div className="top-actions">
        <Button 
          variant={isEditing ? "primary" : "secondary"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <><Save size={18} style={{ marginRight: '8px' }} /> Save Plan</>
          ) : (
            <><Edit3 size={18} style={{ marginRight: '8px' }} /> Edit Plan</>
          )}
        </Button>
      </div>

      <div className="header">
        <h1>Plan for {monthName}</h1>
        <p>Set your daily routine and constructive goals for the month.</p>
      </div>

      <div className="grid">
        {/* Schedule Section */}
        <Card variant="default" className="planning-card glass">
          <div className="card-header">
            <h2><Clock size={22} /> My Daily Schedule</h2>
          </div>
          <div className="table-wrapper">
            <table>
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
                    <td style={{ width: '50%' }}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={row.task} 
                          onChange={(e) => updateSchedule(idx, 'task', e.target.value)}
                          className="task-input"
                        />
                      ) : (
                        <span className="task-label">{row.task}</span>
                      )}
                    </td>
                    <td>
                      <div className="time-range">
                        {isEditing ? (
                          <>
                            <input type="time" value={row.dailyFrom} onChange={(e) => updateSchedule(idx, 'dailyFrom', e.target.value)} />
                            <span>-</span>
                            <input type="time" value={row.dailyTo} onChange={(e) => updateSchedule(idx, 'dailyTo', e.target.value)} />
                          </>
                        ) : (
                          <span className="time-val">{row.dailyFrom} - {row.dailyTo}</span>
                        )}
                      </div>
                    </td>
                    {isEditing && (
                      <td>
                        <button onClick={() => removeRow(idx)} className="remove-btn">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {isEditing && (
              <button onClick={addRow} className="add-btn">
                <Plus size={18} /> Add More Slots
              </button>
            )}
          </div>
        </Card>

        {/* Goals Section */}
        <Card variant="default" className="planning-card glass">
          <div className="goal-section">
            <h2><BookOpen size={22} /> Constructive Reading</h2>
            <p>What books or stories will you read this month?</p>
            {isEditing ? (
              <textarea 
                placeholder="List your books, titles, and stories..." 
                value={reading}
                onChange={(e) => setReading(e.target.value)}
              />
            ) : (
              <div className="view-box">{reading || "No books listed yet."}</div>
            )}
          </div>

          <div className="goal-section" style={{ marginTop: '30px' }}>
            <h2><Heart size={22} /> Family & Helping Hands</h2>
            <p>How will you help around the house and spend time with family?</p>
            {isEditing ? (
              <textarea 
                placeholder="e.g. Setting the table, reading to siblings, weekend walks..." 
                value={familyTime}
                onChange={(e) => setFamilyTime(e.target.value)}
              />
            ) : (
              <div className="view-box">{familyTime || "No family goals listed yet."}</div>
            )}
          </div>
        </Card>
      </div>

      {!isEditing && (
        <div className="print-note">
          <p>✨ Tip: You can print your monthly plan to keep it on your desk!</p>
          <Button variant="secondary" className="no-print" onClick={() => window.print()}>Print Daily Plan</Button>
        </div>
      )}
    </PlanningContainer>
  );
}
