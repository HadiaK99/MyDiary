import styled from "styled-components";

export const YearlyPlanningContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;

  .top-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 30px;
  }

  .planning-card {
    padding: 50px;
    text-align: center;

    .hero {
      margin-bottom: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;

      h1 {
        font-family: 'Fredoka', sans-serif;
        font-size: 2.5rem;
        color: #1e293b;
      }

      p {
        color: #64748b;
        font-weight: 500;
        max-width: 500px;
      }
    }

    .success-msg {
      background: #f0fdf4;
      color: #166534;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      font-weight: 600;
      font-size: 0.9rem;
      border: 1px solid #bbf7d0;
      animation: fadeIn 0.3s ease-out;
    }

    .vision-area {
      margin-bottom: 50px;

      textarea {
        width: 100%;
        height: 180px;
        padding: 24px;
        border-radius: 20px;
        border: 2px solid #e2e8f0;
        background: #f8fafc;
        font-family: inherit;
        font-size: 1.1rem;
        line-height: 1.6;
        resize: vertical;
        transition: all 0.2s;

        &:focus {
          outline: none;
          border-color: #8b5cf6;
          background: white;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }
      }

      .vision-view {
        background: #f8fafc;
        padding: 30px;
        border-radius: 24px;
        border: 2px dashed #cbd5e1;
        min-height: 150px;
        color: #1e293b;
        font-size: 1.2rem;
        line-height: 1.6;
        font-style: italic;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .goals-section {
      text-align: left;

      h2 {
        font-family: 'Fredoka', sans-serif;
        font-size: 1.5rem;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 25px;
      }

      .goal-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .goal-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        width: 100%;
        overflow: hidden;

        .goal-index {
          background: #8b5cf6;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        input {
          flex: 1;
          border: none;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          padding: 5px;
          min-width: 0;
          &:focus {
            outline: none;
          }
        }

        .goal-text {
          flex: 1;
          font-weight: 600;
          color: #475569;
        }

        .remove-btn {
          background: #fef2f2;
          color: #ef4444;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: #ef4444;
            color: white;
          }
        }
      }

      .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 15px;
        background: #f8fafc;
        border: 2px dashed #e2e8f0;
        border-radius: 16px;
        color: #8b5cf6;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 10px;

        &:hover {
          background: white;
          border-color: #8b5cf6;
          transform: translateY(-2px);
        }
      }
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .top-actions {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }

    .planning-card {
      padding: 30px 15px;

      .hero {
        h1 { font-size: 1.8rem; }
        p { font-size: 0.9rem; }
      }

      .goal-item {
        padding: 10px;
        gap: 8px;

        .goal-text {
          font-size: 0.9rem;
          overflow-wrap: break-word;
        }

        .remove-btn {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .goal-index {
          width: 28px;
          height: 28px;
          font-size: 0.75rem;
        }
      }
    }
  }
`;
