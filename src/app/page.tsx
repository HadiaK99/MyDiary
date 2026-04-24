"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@frontend/context/AuthContext";
import { getPerformanceRating } from "@shared/utils/scoring";
import Header from "@frontend/components/Navigation/Header";
import { Card } from "@frontend/components/Common/Card";
import { Badge } from "@frontend/components/Common/Badge";
import {
  Sun,
  Smile,
  BarChart3,
  Trophy,
  ArrowRight,
  Target,
  Calendar,
  Heart
} from "lucide-react";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 60px;
`;

const GreetingHeader = styled.section`
  margin: 20px 0 30px;

  h1 {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 20px;
  }
`;

const DaySelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;

  @media (max-width: 600px) {
    gap: 6px;
  }
`;

const DayBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 48px;
  padding: 12px 8px;
  border-radius: 24px;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#facc15' : 'rgba(255,255,255,0.4)')};
  color: ${({ $active }) => ($active ? '#000' : 'inherit')};
  box-shadow: ${({ $active }) => ($active ? '0 4px 15px rgba(250, 204, 21, 0.4)' : 'none')};

  span:first-child {
    font-size: 0.8rem;
    font-weight: 600;
    opacity: ${({ $active }) => ($active ? 0.8 : 0.5)};
  }

  span:last-child {
    font-size: 1.1rem;
    font-weight: 700;
  }

  @media (max-width: 600px) {
    min-width: 44px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
  }
`;

const QuickGrid = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;

  > * {
    flex: 1 1 160px;
  }
`;

const ClickableCard = styled.button`
  text-decoration: none;
  border: none;
  text-align: left;
  cursor: pointer;
  background: transparent;
  padding: 0;
  display: flex;
  width: 100%;
`;

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [todayScore, setTodayScore] = useState(0);
  const [todayRating, setTodayRating] = useState({ rating: "None", color: "#ccc" });
  const [reviews, setReviews] = useState<{ id: string, text: string, date: string }[]>([]);

  // Generate last 7 days
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    return {
      short: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      fullDate: dateStr,
      active: dateStr === selectedDate
    };
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "PARENT") {
        router.push("/parent");
      } else if (user.role === "CHILD") {
        const fetchData = async () => {
          const catRes = await fetch("/api/admin/activities");
          const catData = await catRes.json();
          const cats = catData.categories || [];

          let maxSc = 0;
          cats.forEach((cat: { activities: string[], pointsPerItem: number }) => {
            maxSc += (cat.activities.length * cat.pointsPerItem);
          });

          const reviewRes = await fetch("/api/reviews");
          const reviewData = await reviewRes.json();
          if (reviewData.reviews) setReviews(reviewData.reviews);

          const entryRes = await fetch(`/api/diary?date=${selectedDate}`);
          const entryData = await entryRes.json();
          if (entryData.entry) {
            setTodayScore(entryData.entry.score);
            setTodayRating(getPerformanceRating(entryData.entry.score, maxSc));
          } else {
            setTodayScore(0);
            setTodayRating({ rating: "None", color: "#ccc" });
          }
        };
        fetchData();
      }
    }
  }, [user, loading, router, selectedDate]);

  if (loading || !user || user.role !== "CHILD") return null;

  const isToday = selectedDate === todayStr;

  return (
    <Container>
      <Header />

      <GreetingHeader>
        <h1>Hi, <span style={{ color: 'var(--primary)' }}>{user.username}</span> <Smile size={32} style={{ color: 'var(--primary)', verticalAlign: 'middle', display: 'inline' }} /></h1>
        <DaySelector>
          {days.map(day => (
            <DayBtn
              key={day.fullDate}
              onClick={() => setSelectedDate(day.fullDate)}
              $active={day.active}
            >
              <span>{day.short}</span>
              <span>{day.dateNum}</span>
            </DayBtn>
          ))}
        </DaySelector>
      </GreetingHeader>

      <Card variant="featured" className="animate-fade-in">
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{isToday ? "Let's start your day" : `Journal for ${selectedDate}`}</h2>
        <p style={{ fontWeight: 600, opacity: 0.8, maxWidth: '200px' }}>{isToday ? "Begin with a mindful morning reflection." : "Look back and reflect on how you did."}</p>
        <div style={{ fontSize: '5rem', marginTop: '10px' }}>
          {todayScore > 0 ? (
             <div style={{ color: todayRating.color, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800 }}>{todayScore}</span>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>{todayRating.rating}</span>
             </div>
          ) : (
            <Sun size={80} strokeWidth={1.5} />
          )}
        </div>
        <button 
          onClick={() => router.push(`/diary/daily/${selectedDate}`)} 
          className="pill-btn" 
          style={{ marginTop: '20px' }}
        >
          {isToday ? "Record My Day" : "Record Previous Day"} <ArrowRight size={18} />
        </button>
      </Card>

      {reviews.length > 0 && (
        <Card variant="default" className="animate-fade-in" style={{ background: '#fef2f2', border: '2px solid #fecaca', marginTop: '20px', marginBottom: '40px' }}>
          <h4 style={{ color: '#e11d48', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Heart size={18} fill="#e11d48" /> Message from Parents
          </h4>
          <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#475569' }}>"{reviews[reviews.length - 1].text}"</p>
          <p style={{ textAlign: 'right', fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' }}>— {reviews[reviews.length - 1].date}</p>
        </Card>
      )}

      <SectionHeader>
        <h3>Strategic Planning</h3>
      </SectionHeader>

      <QuickGrid>
        <ClickableCard onClick={() => router.push(`/monthly/planning/${new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase()}`)}>
          <Card variant="blue" padding="24px" style={{ width: '100%' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 12px 0' }}>Monthly Plan <Calendar size={16} style={{ display: 'inline' }} /></h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 500, margin: '0 0 auto 0' }}>Set your intentions for the month ahead.</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Badge variant="neutral" size="small">New</Badge>
              <Badge variant="primary" size="small" style={{ background: 'white', color: '#ef4444' }}>Draft</Badge>
            </div>
          </Card>
        </ClickableCard>

        <ClickableCard onClick={() => router.push("/diary/goals")}>
          <Card variant="pink" padding="24px" style={{ width: '100%' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 12px 0' }}>Personal Growth <Target size={16} style={{ display: 'inline' }} /></h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 500, margin: '0 0 auto 0' }}>Track your weekly goals and progress.</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Badge variant="neutral" size="small">Active</Badge>
              <Badge variant="neutral" size="small">Focus</Badge>
            </div>
          </Card>
        </ClickableCard>
      </QuickGrid>

      <SectionHeader style={{ marginTop: '20px' }}>
        <h3>Milestones</h3>
      </SectionHeader>

      <QuickGrid style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <ClickableCard onClick={() => router.push("/yearly/planning")}>
          <Card variant="default" padding="20px" style={{ textAlign: 'center', width: '100%', border: '4px solid #fff' }}>
            <Calendar size={32} style={{ margin: '0 auto', color: '#10b981' }} />
            <p style={{ fontWeight: 700, marginTop: '10px' }}>Yearly Plan</p>
          </Card>
        </ClickableCard>
        
        <ClickableCard onClick={() => router.push("/monthly/analysis/april")}>
          <Card variant="default" padding="20px" style={{ textAlign: 'center', width: '100%', border: '4px solid #fff' }}>
            <BarChart3 size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} />
            <p style={{ fontWeight: 700, marginTop: '10px' }}>Monthly Analysis</p>
          </Card>
        </ClickableCard>

        <ClickableCard onClick={() => router.push("/yearly/review")}>
          <Card variant="default" padding="20px" style={{ textAlign: 'center', width: '100%', border: '4px solid #fff' }}>
            <Trophy size={32} style={{ margin: '0 auto', color: '#facc15' }} />
            <p style={{ fontWeight: 700, marginTop: '10px' }}>Yearly Review</p>
          </Card>
        </ClickableCard>
      </QuickGrid>
    </Container>
  );
}
