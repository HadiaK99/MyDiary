"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@frontend/context/AuthContext";
import { useChild } from "@frontend/context/ChildContext";
import { User, DiaryEntry } from "@shared/types";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Award,
  Clock,
  ChevronRight,
  Send,
  X,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@frontend/components/Common/Button";
import styled from "styled-components";

const ReportContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 25px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #fff1f2;
  
  h5 {
    color: #64748b;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }
  
  .value {
    font-size: 2rem;
    font-weight: 800;
    color: #be123c;
  }
  
  .trend {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    color: #10b981;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    padding: 15px;
    gap: 5px;
    h5 { font-size: 0.7rem; }
    .value { font-size: 1.5rem; }
  }
`;

const EntryCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;

  &:hover {
    transform: translateX(5px);
    border-color: #fce7f3;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .date-box {
    text-align: center;
    min-width: 60px;
    padding: 10px;
    background: #fff1f2;
    border-radius: 15px;
    color: #be123c;
    
    .day { font-size: 1.2rem; font-weight: 800; }
    .month { font-size: 0.7rem; text-transform: uppercase; font-weight: 700; }
  }

  .content {
    flex: 1;
    h4 { margin: 0 0 5px; color: #1e293b; font-size: 1.1rem; }
    p { margin: 0; color: #64748b; font-size: 0.9rem; }
  }

  .score-badge {
    padding: 8px 15px;
    background: #f0f9ff;
    color: #0369a1;
    border-radius: 30px;
    font-weight: 800;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  @media (max-width: 600px) {
    padding: 15px;
    gap: 15px;
    
    .date-box {
      min-width: 50px;
      padding: 8px;
      .day { font-size: 1rem; }
    }

    .content {
      h4 { font-size: 0.95rem; }
      p { font-size: 0.8rem; }
    }

    .score-badge {
      padding: 5px 10px;
      font-size: 0.75rem;
    }
    
    svg { width: 16px; height: 16px; }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 30px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
`;

export default function ChildReport() {
  const { selectedChild } = useChild();
  const router = useRouter();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const fetchEntries = async () => {
    if (selectedChild) {
      setLoading(true);
      try {
        const diaryRes = await fetch(`/api/diary?userId=${selectedChild.id}`);
        const diaryData = await diaryRes.json();
        if (diaryData.entries) {
          const sortedEntries = (diaryData.entries as DiaryEntry[]).sort((a, b) => b.date.localeCompare(a.date));
          setEntries(sortedEntries);
        }
      } catch (error) {
        console.error("Failed to fetch diary entries:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [selectedChild]);

  if (!selectedChild) return (
    <div className="welcome-card">
      <div className="welcome-text">
        <h1>Detailed Reports</h1>
        <p>Please select a child to view their report.</p>
      </div>
    </div>
  );

  const avgScore = entries.length > 0 ? Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length) : 0;
  const totalPoints = entries.reduce((a, b) => a + b.score, 0);

  return (
    <ReportContainer>
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Button
          variant="ghost"
          onClick={() => router.push("/parent")}
          style={{ padding: '10px', background: 'white', borderRadius: '15px', border: '1px solid #fce7f3' }}
        >
          <ArrowLeft size={20} color="#be123c" />
        </Button>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>
            {selectedChild.username}'s <span style={{ color: '#be123c' }}>Report</span>
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>Discover your child's moral growth journey.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard>
          <h5>Avg. Daily Score</h5>
          <div className="value">{avgScore}%</div>
          <div className="trend"><TrendingUp size={14} /> +2% this week</div>
        </StatCard>
        <StatCard>
          <h5>Total Points</h5>
          <div className="value">{totalPoints.toLocaleString()}</div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Overall achievements</p>
        </StatCard>
        <StatCard>
          <h5>Days Logged</h5>
          <div className="value">{entries.length}</div>
          <div className="trend" style={{ color: '#0ea5e9' }}><Award size={14} /> Consistent Hero!</div>
        </StatCard>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="#be123c" /> Recent Activity
          </h3>
          <Button 
            variant="ghost" 
            style={{ color: '#be123c', border: '1px solid #be123c', borderRadius: '20px', padding: '5px 15px' }}
            onClick={() => setShowCalendarModal(true)}
          >
            <CalendarIcon size={16} style={{ marginRight: '5px' }} /> View Calendar
          </Button>
        </div>

        {entries.map(entry => {
          const date = new Date(entry.date);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          
          return (
            <EntryCard key={entry.id} onClick={() => router.push(`/diary/daily/${entry.date}?userId=${selectedChild.id}`)}>
              <div className="date-box">
                <div className="month">{month}</div>
                <div className="day">{day}</div>
              </div>
              <div className="content">
                <h4>{entry.rating} Performance</h4>
                <p>Recorded on {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="score-badge">
                <Star size={16} fill="#0ea5e9" color="#0ea5e9" />
                {entry.score} pts
              </div>
              <ChevronRight size={20} color="#cbd5e1" />
            </EntryCard>
          );
        })}

        {entries.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '30px', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
            <h3>No entries found yet</h3>
            <p>Once {selectedChild.username} completes their first diary entry, it will show up here!</p>
          </div>
        )}
      </section>

      <div style={{ 
        background: 'linear-gradient(135deg, #be123c 0%, #fb7185 100%)', 
        borderRadius: '30px', 
        padding: '35px', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>Moral hero Insight</h2>
          <p style={{ opacity: 0.9, maxWidth: '500px', marginBottom: '20px' }}>
            {selectedChild.username} is showing great consistency in **Prayers**. 
            Try encouraging them more in **Social Manners** this week for a balanced score!
          </p>
          <Button 
            variant="secondary" 
            style={{ background: 'white', color: '#be123c', fontWeight: 800, borderRadius: '20px', padding: '12px 30px' }}
            onClick={() => router.push("/parent/reviews")}
          >
            <Send size={18} style={{ marginRight: '8px' }} /> Send Encouragement Review
          </Button>
        </div>
        <Award size={150} color="white" style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }} />
      </div>


      {/* Calendar Modal Placeholder */}
      {showCalendarModal && (
        <ModalOverlay onClick={() => setShowCalendarModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0, fontWeight: 900, color: '#1e293b' }}>Activity Calendar</h2>
              <X size={24} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setShowCalendarModal(false)} />
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '25px', padding: '30px', textAlign: 'center' }}>
               <CalendarIcon size={64} color="#be123c" style={{ marginBottom: '20px', opacity: 0.5 }} />
               <p style={{ color: '#1e293b', fontWeight: 700, fontSize: '1.1rem' }}>Coming Soon!</p>
               <p style={{ color: '#64748b' }}>We're building a visual heat-map calendar to track {selectedChild.username}'s growth over the entire year.</p>
               <Button onClick={() => setShowCalendarModal(false)} style={{ marginTop: '20px' }}>Got it!</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </ReportContainer>
  );
}
