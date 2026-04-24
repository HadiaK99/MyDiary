"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "@frontend/context/AuthContext";
import Header from "@frontend/components/Navigation/Header";
import { Target, Plus, CheckCircle2, Circle, Trophy } from "lucide-react";
import { Card } from "@frontend/components/Common/Card";

interface Goal {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
}

const Container = styled.div`
  min-height: 100vh;
  background: var(--bg-soft);
  padding: 20px;
  font-family: 'Quicksand', sans-serif;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const GoalsCard = styled(Card)`
  max-width: 600px;
  margin: 40px auto;
  padding: 40px;

  @media (max-width: 600px) {
    padding: 25px 15px;
    margin: 20px auto;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const IconBox = styled.div`
  background: var(--primary);
  padding: 15px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2);
`;

const TitleArea = styled.div`
  h1 {
    margin: 0;
    font-size: 2rem;
    color: #1e293b;
  }
  p {
    margin: 5px 0 0;
    color: #64748b;
  }
`;

const ProgressCircle = styled.div`
  margin-left: auto;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: var(--primary);

  @media (max-width: 600px) {
    margin: 10px auto;
  }
`;

const AddSection = styled.div`
  display: flex;
  margin-bottom: 30px;

  @media (max-width: 600px) {
    justify-content: space-between;
    gap: 8px;
  }
`;

const AddInput = styled.input<{ $hasError?: boolean }>`
  text-align: left;
  background: white !important;
  color: #1e293b !important;
  border: 2px solid ${({ $hasError }) => ($hasError ? '#ef4444' : '#e2e8f0')} !important;
  flex: 1;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.2s;
  animation: ${({ $hasError }) => ($hasError ? 'shake 0.3s ease-in-out' : 'none')};

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#ef4444' : 'var(--primary)')} !important;
    box-shadow: 0 0 0 4px ${({ $hasError }) => ($hasError ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary-glow, rgba(236,72,153,0.1))')};
  }

  @media (max-width: 600px) {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
`;

const ErrorMsg = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid #fee2e2;
  text-align: center;
  animation: fadeIn 0.3s ease-out;
`;

const AddButton = styled.button`
  margin-left: 10px;
  flex-shrink: 0;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }

  @media (max-width: 600px) {
    margin-left: 0;
    padding: 10px 15px;
    min-width: 50px;
  }
`;

const GoalsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GoalItem = styled.div<{ $completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: ${({ $completed }) => ($completed ? '#f0fdf4' : '#f8fafc')};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  opacity: ${({ $completed }) => ($completed ? 0.7 : 1)};

  &:hover {
    border-color: var(--primary);
    transform: translateX(5px);
  }

  span {
    text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
    color: ${({ $completed }) => ($completed ? '#64748b' : 'inherit')};
    
    @media (max-width: 600px) {
      font-size: 0.95rem;
      overflow-wrap: break-word;
      word-break: break-word;
    }
  }

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

export default function ChildGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchGoals = async () => {
        const res = await fetch("/api/goals");
        const data = await res.json();
        if (data.goals) setGoals(data.goals);
      };
      fetchGoals();
    }
  }, [user]);

  const triggerError = (msg: string) => {
    setError(msg);
    setHasError(true);
    setTimeout(() => setHasError(false), 500);
    setTimeout(() => setError(null), 4000);
  };

  const addGoal = async () => {
    if (!newGoal.trim()) {
      triggerError("Please enter a goal first!");
      return;
    }
    if (!user) {
      triggerError("You must be logged in to add goals.");
      return;
    }

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newGoal.trim() }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setGoals(prev => [data.goal, ...prev]);
        setNewGoal("");
        setError(null);
      } else {
        const errData = await res.json();
        triggerError(errData.error || "Failed to add goal");
      }
    } catch {
      triggerError("Something went wrong. Please check your connection.");
    }
  };

  const toggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const res = await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !goal.completed }),
    });

    if (res.ok) {
      const data = await res.json();
      setGoals(goals.map(g => g.id === id ? data.goal : g));
    }
  };

  if (!user) return null;

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <Container>
      <Header />
      
      <GoalsCard variant="default">
        <HeaderSection>
          <IconBox><Target size={32} color="white" /></IconBox>
          <TitleArea>
            <h1>My Goals</h1>
            <p>What do you want to achieve this week?</p>
          </TitleArea>
          <ProgressCircle>
            <span>{completedCount}/{goals.length}</span>
          </ProgressCircle>
        </HeaderSection>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <AddSection>
          <AddInput 
            $hasError={hasError}
            type="text" 
            placeholder="Add a new goal..." 
            value={newGoal}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addGoal()}
          />
          <AddButton type="button" onClick={addGoal}><Plus size={20} /></AddButton>
        </AddSection>

        <GoalsList>
          {goals.map(goal => (
            <GoalItem 
              key={goal.id} 
              $completed={goal.completed} 
              onClick={() => toggleGoal(goal.id)}
            >
              {goal.completed ? <CheckCircle2 color="#10b981" /> : <Circle color="#94a3b8" />}
              <span>{goal.text}</span>
            </GoalItem>
          ))}
          {goals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <Trophy size={48} style={{ opacity: 0.2, margin: '0 auto 20px' }} />
              <p>No goals set yet. Let's dream big!</p>
            </div>
          )}
        </GoalsList>
      </GoalsCard>
    </Container>
  );
}
