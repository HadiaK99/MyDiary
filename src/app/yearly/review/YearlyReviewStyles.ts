import styled from "styled-components";

export const YearlyReviewContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;

  .top-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    gap: 20px;

    .back-btn {
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 600;
    }
  }

  .main-card {
    padding: 40px;
    
    h2 {
      margin-bottom: 10px;
    }

    p {
      opacity: 0.7;
      margin-bottom: 40px;
    }

    .focus-review {
      margin-bottom: 40px;
      
      h3 {
        margin-bottom: 20px;
        color: var(--primary);
      }

      .focus-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .focus-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.03);
        border-radius: var(--radius-md, 16px);
        gap: 20px;

        .focus-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .check-area {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
          min-width: 150px;

          select {
            padding: 8px;
            border-radius: var(--radius-sm, 8px);
            border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
            font-family: inherit;
            font-weight: 600;
          }
        }
      }
    }

    .reflection-area {
      textarea {
        width: 100%;
        height: 120px;
        padding: 15px;
        border-radius: var(--radius-md, 16px);
        border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
        font-family: inherit;
        margin-top: 10px;
      }
    }
  }

  .footer {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 600px) {
    .main-card {
      padding: 30px 15px;
      
      p {
        margin-bottom: 25px;
      }

      .focus-item {
        flex-direction: column;
        align-items: stretch;
        padding: 15px;
      }
    }

    .footer {
      margin-top: 30px;
      button {
        width: 80%;
        max-width: 300px;
      }
    }
  }
`;
