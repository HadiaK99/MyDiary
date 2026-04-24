"use client";

import { useState, useEffect, use } from "react";
import styled from "styled-components";
import { type ActivityCategory } from "@shared/constants/activities";
import { calculateScore, getPerformanceRating, calculateMaxScore, DayData } from "@shared/utils/scoring";
import { useAuth } from "@frontend/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@frontend/components/Navigation/Header";
import { Button } from "@frontend/components/Common/Button";
import {
  Check,
  GlassWater,
  Moon,
  Sparkles,
  Heart
} from "lucide-react";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 24px 100px;
`;

const PlannerSheet = styled.div`
  background: #fffafa; /* Off-white / Cream */
  border: 1px solid #ffe4e6;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  position: relative;
  min-height: 1000px;

  @media (max-width: 600px) {
    padding: 25px 10px;
  }
`;

const PlannerHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  border-bottom: 2px solid #fecaca;
  padding-bottom: 20px;

  h1 {
    font-family: 'Fredoka', cursive;
    font-size: 3.5rem;
    color: #be123c; /* Deep pink-red */
    font-weight: 500;
    margin-bottom: 10px;

    @media (max-width: 600px) {
      font-size: 2.2rem;
    }
  }
`;

const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  letter-spacing: 2px;
  color: #9f1239;
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const QuoteBox = styled.div`
  margin: 30px 0;
  padding: 15px;
  border: 1px solid #fecaca;
  text-align: center;
  font-style: italic;
  color: #9f1239;
  font-weight: 500;
  position: relative;
  border-radius: 8px;
`;

const ChecklistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  align-items: stretch;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ChecklistCol = styled.div``;

const ChecklistCard = styled.div`
  width: 100%;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 24px;
  background: white;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

const CheckTitle = styled.h3`
  font-weight: 800;
  color: #881337;
  margin-bottom: 20px;
  font-size: 1rem;

  @media (max-width: 600px) {
    font-size: 0.85rem;
    margin-bottom: 12px;
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px dashed #fecaca;
  margin-bottom: 8px;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    gap: 8px;
    padding: 6px 0;
  }
`;

const ItemLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #4c0519;
  flex: 1;

  @media (max-width: 600px) {
    font-size: 0.75rem;
  }
`;

const CheckSquare = styled.div`
  width: 18px;
  height: 18px;
  border: 1px solid #9f1239;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #9f1239;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 14px;
    height: 14px;
  }
`;

const VisualTrackers = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  align-items: stretch;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const TrackerCard = styled.div`
  width: 100%;
  background: white;
  border-radius: 10px;
  border: 1px solid #fecaca;
  padding: 24px;

  h3 {
    font-size: 1rem;
    font-weight: 800;
    color: #881337;
    margin-bottom: 15px;
  }

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

const IconRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const IconItem = styled.span<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.2)};
  transition: opacity 0.2s;
`;

const LongSection = styled.div`
  margin-top: 40px;
  border-top: 2px solid #fecaca;
  padding-top: 30px;
  text-align: center;
`;

const MoodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
  flex-wrap: wrap;
`;

const MoodLabel = styled.span`
  font-weight: 800;
  color: #881337;
`;

const MoodBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${({ $active }) => ($active ? '#fff1f2' : 'transparent')};
  color: ${({ $active }) => ($active ? '#be123c' : '#475569')};
  border: none;
  cursor: pointer;
`;

const FinishBtnWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
`;

const SummaryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 241, 242, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SummaryCard = styled.div`
  background: #fffafa;
  border: 1px solid #ffe4e6;
  border-radius: 24px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(190, 18, 60, 0.1);
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const SummaryScore = styled.div`
  font-size: 4rem;
  font-weight: 800;
  color: #be123c;
  margin: 20px 0;
`;

const SummaryRating = styled.div<{ $color: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: ${({ $color }) => $color};
`;

const SummaryActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export default function DailyDiary({ params: paramsPromise }: { params: Promise<{ date: string }> }) {
  const params = use(paramsPromise);
  const date = params.date;
  const { user } = useAuth();
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [data, setData] = useState<DayData & { water?: number, sleep?: number, mood?: string }>({
    activities: {},
    goodThings: {},
    badThings: {},
    water: 0,
    sleep: 0,
    mood: 'Happy'
  });

  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const maxScore = calculateMaxScore(categories);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/admin/activities");
        const data = await res.json();
        if (data.categories?.length > 0) {
          setCategories(data.categories);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchEntry = async () => {
        const res = await fetch(`/api/diary?date=${date}`);
        const data = await res.json();
        if (data.entry) {
          setData(JSON.parse(data.entry.data));
        }
      };
      fetchEntry();
    }
  }, [date, user]);

  useEffect(() => {
    if (user && categories.length > 0) {
      const newScore = calculateScore(data, categories);
      setScore(newScore);
    }
  }, [data, categories, user]);

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { rating } = getPerformanceRating(score, maxScore);
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          data,
          score,
          rating
        }),
      });

      if (res.ok) {
        setShowSummary(true);
      } else {
        alert("Failed to save entry. Please try again.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const half = Math.ceil(categories.length / 2);
  const leftCats = categories.slice(0, half);
  const rightCats = categories.slice(half);

  const toggleItem = (category: keyof DayData, item: string) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item]
      }
    }));
  };

  const setLevel = (key: 'water' | 'sleep', level: number) => {
    setData(prev => ({ ...prev, [key]: level }));
  };

  const { rating, color, message } = getPerformanceRating(score, maxScore);

  return (
    <Container>
      <Header />

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <Sparkles className="animate-pulse" />
          <p>Preparing your diary...</p>
        </div>
      ) : (
        <PlannerSheet>
          <PlannerHeader>
            <SubHeader>
              <span>{new Date(date).toLocaleDateString()}</span>
            </SubHeader>
            <h1>Self-care Planner</h1>
          </PlannerHeader>

          <QuoteBox>
            "Taking care of yourself is productive." <Heart size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} fill="#be123c" />
          </QuoteBox>

          <ChecklistsGrid>
            <ChecklistCol>
              {leftCats.map((cat, catIndex) => (
                <ChecklistCard key={catIndex}>
                  <CheckTitle>{cat.name}</CheckTitle>
                  {cat.activities.map((act, actIndex) => (
                    <ListItem key={actIndex} onClick={() => toggleItem('activities', act)}>
                      <ItemLabel>{act}</ItemLabel>
                      <CheckSquare>
                        {data.activities[act] && <Check size={14} />}
                      </CheckSquare>
                    </ListItem>
                  ))}
                </ChecklistCard>
              ))}
            </ChecklistCol>

            <ChecklistCol>
              {rightCats.map((cat, catIndex) => (
                <ChecklistCard key={catIndex}>
                  <CheckTitle>{cat.name}</CheckTitle>
                  {cat.activities.map((act, actIndex) => (
                    <ListItem key={actIndex} onClick={() => toggleItem('activities', act)}>
                      <ItemLabel>{act}</ItemLabel>
                      <CheckSquare>
                        {data.activities[act] && <Check size={14} />}
                      </CheckSquare>
                    </ListItem>
                  ))}
                </ChecklistCard>
              ))}
            </ChecklistCol>
          </ChecklistsGrid>

          <VisualTrackers>
            <TrackerCard>
              <h3>Water Intake: (Glass) 💧</h3>
              <IconRow>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <IconItem
                    key={i}
                    $active={(data.water || 0) >= i}
                    onClick={() => setLevel('water', i)}
                  >
                    <GlassWater size={24} />
                  </IconItem>
                ))}
              </IconRow>
            </TrackerCard>

            <TrackerCard>
              <h3>Hours of Sleep: (Hours) 🌙</h3>
              <IconRow>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                  <IconItem
                    key={i}
                    $active={(data.sleep || 0) >= i}
                    onClick={() => setLevel('sleep', i)}
                  >
                    <Moon size={24} fill={(data.sleep || 0) >= i ? "currentColor" : "none"} />
                  </IconItem>
                ))}
              </IconRow>
            </TrackerCard>
          </VisualTrackers>

          <MoodRow>
            <MoodLabel>Mood:</MoodLabel>
            {['Angry', 'Tired', 'Sad', 'Happy', 'Fun'].map(m => (
              <MoodBtn
                key={m}
                $active={data.mood === m}
                onClick={() => setData(prev => ({ ...prev, mood: m }))}
              >
                {m}
              </MoodBtn>
            ))}
          </MoodRow>

          <LongSection>
            <p style={{ fontWeight: 700, opacity: 0.6 }}>My Progress Today: <span style={{ color }}>{rating} ({score} pts)</span></p>
          </LongSection>

          <FinishBtnWrapper>
            <Button
              onClick={handleComplete}
              disabled={saving}
              type="button"
            >
              {saving ? "Saving..." : "Complete Entry"} <Sparkles size={18} style={{ marginLeft: '10px' }} />
            </Button>
          </FinishBtnWrapper>
        </PlannerSheet>
      )}

      {showSummary && (
        <SummaryOverlay>
          <SummaryCard>
            <Sparkles size={48} color="#be123c" style={{ marginBottom: '10px' }} />
            <h2>Daily Summary</h2>
            <p>You've completed your self-care planner!</p>

            <SummaryScore>
              {score} <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>pts</span>
            </SummaryScore>

            <SummaryRating $color={color}>
              {rating}: {message}
            </SummaryRating>

            <SummaryActions>
              <Button
                onClick={() => router.push("/")}
                style={{ background: color, borderColor: color }}
                fullWidth
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => setShowSummary(false)}
                variant="ghost"
                style={{ color: '#be123c', border: '1px solid #be123c' }}
                fullWidth
              >
                Oh, I forgot something!
              </Button>
            </SummaryActions>
          </SummaryCard>
        </SummaryOverlay>
      )}
    </Container>
  );
}
