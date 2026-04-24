"use client";

import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Header from "@frontend/components/Navigation/Header";
import { Button } from "@frontend/components/Common/Button";
import { Card } from "@frontend/components/Common/Card";
import { Sparkles, Trophy, Calendar, Check, ArrowRight } from "lucide-react";

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const ProgressHeader = styled.div`
  margin-bottom: 40px;
`;

const StepIndicator = styled.div`
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

const ProgressLine = styled.div`
  height: 8px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, #facc15 100%);
  width: ${({ $progress }) => $progress}%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const StepContent = styled.div`
  h1 {
    font-size: 2.2rem;
    margin-bottom: 10px;
  }
  
  p {
    color: var(--text-muted);
    font-weight: 500;
    margin-bottom: 30px;
  }
`;

const InputGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;

  > * {
    flex: 1 1 calc(50% - 10px);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    > * {
      flex: 1 1 100%;
    }
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 700;
    font-size: 0.9rem;
    color: #475569;
  }

  input, textarea {
    padding: 14px;
    border-radius: var(--radius-sm, 12px);
    border: 2px solid #f1f5f9;
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
`;

const FocusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

const FocusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  span {
    font-family: 'Fredoka', sans-serif;
    font-weight: 700;
    color: var(--primary);
    font-size: 1.2rem;
  }

  input {
    flex: 1;
    padding: 12px;
    border-radius: var(--radius-sm, 12px);
    border: 2px solid #f1f5f9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const finish = () => router.push("/");

  return (
    <Container>
      <Header />
      <Card variant="default" padding="40px" className="glass animate-fade-in" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
        {/* Progress Bar */}
        <ProgressHeader>
          <StepIndicator>Step {step} of 3</StepIndicator>
          <ProgressLine>
            <ProgressFill $progress={(step / 3) * 100} />
          </ProgressLine>
        </ProgressHeader>

        {step === 1 && (
          <StepContent>
            <h1>All About Me! <Sparkles size={32} style={{ color: 'var(--primary)', verticalAlign: 'middle', display: 'inline' }} /></h1>
            <p>Let's personalize your diary. Tell us a bit about yourself.</p>
            
            <InputGrid>
              <InputGroup>
                <label>My Name</label>
                <input type="text" placeholder="Enter your name" />
              </InputGroup>
              <InputGroup>
                <label>School</label>
                <input type="text" placeholder="Your school name" />
              </InputGroup>
              <InputGroup>
                <label>Date of Birth</label>
                <input type="date" />
              </InputGroup>
              <InputGroup>
                <label>Blood Group</label>
                <input type="text" placeholder="e.g. A+" />
              </InputGroup>
            </InputGrid>

            <h3>My Favorites</h3>
            <InputGrid>
              <InputGroup>
                <label>Color</label>
                <input type="text" placeholder="🎨" />
              </InputGroup>
              <InputGroup>
                <label>Food</label>
                <input type="text" placeholder="🍕" />
              </InputGroup>
              <InputGroup>
                <label>Hobbies</label>
                <input type="text" placeholder="⚽" />
              </InputGroup>
              <InputGroup>
                <label>Goals</label>
                <input type="text" placeholder="🚀" />
              </InputGroup>
            </InputGrid>

            <Button fullWidth onClick={nextStep} style={{ marginTop: '20px' }}>
              Next: My Annual Focuses <ArrowRight size={18} />
            </Button>
          </StepContent>
        )}

        {step === 2 && (
          <StepContent>
            <h1>Yearly Focuses <Trophy size={32} style={{ color: '#facc15', verticalAlign: 'middle', display: 'inline' }} /></h1>
            <p>What are your big dreams and goals for this year? (Resolutions)</p>
            
            <FocusList>
              {[1, 2, 3].map(i => (
                <FocusItem key={i}>
                  <span>{i}.</span>
                  <input type="text" placeholder={`Goal #${i}`} />
                </FocusItem>
              ))}
            </FocusList>

            <ButtonGroup>
              <Button variant="ghost" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep}>Next: Month Planning <ArrowRight size={18} /></Button>
            </ButtonGroup>
          </StepContent>
        )}

        {step === 3 && (
          <StepContent>
            <h1>First Month Plan <Calendar size={32} style={{ color: 'var(--primary)', verticalAlign: 'middle', display: 'inline' }} /></h1>
            <p>Let's plan your schedule for the first month.</p>
            
            <InputGroup>
              <label>What's your main focus this month?</label>
              <textarea placeholder="e.g. Learning a new Surah, or helping at home..."></textarea>
            </InputGroup>

            <div style={{ marginTop: '20px' }}>
              <InputGroup>
                <label>Allowed TV/Media programs</label>
                <input type="text" placeholder="List allowed channels..." />
              </InputGroup>
            </div>

            <ButtonGroup>
              <Button variant="ghost" onClick={prevStep}>Back</Button>
              <Button onClick={finish}>Finish & Open My Diary! <Check size={18} /></Button>
            </ButtonGroup>
          </StepContent>
        )}
      </Card>
    </Container>
  );
}
