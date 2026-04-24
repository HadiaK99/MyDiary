import styled from "styled-components";

export const AnalysisContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;

  .analysis-card {
    padding: 40px;
    background: white;

    .hero-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px dashed #f1f5f9;

      .hero-text {
        h1 {
          font-size: 2.2rem;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        p {
          font-size: 1.1rem;
          opacity: 0.6;
        }
      }

      .overall-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        color: white;
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        transform: rotate(5deg);

        .score-num {
          font-size: 1.8rem;
          font-weight: 800;
        }
        .score-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 1px;
        }
      }
    }

    .mark-sheet {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;

      .sheet-header {
        display: flex;
        padding: 0 15px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #94a3b8;
        letter-spacing: 1px;

        & > :nth-child(1) { flex: 2; }
        & > :nth-child(2) { flex: 3; }
        & > :nth-child(3) { flex: 2; text-align: right; }
      }

      .sheet-row {
        display: flex;
        align-items: center;
        padding: 20px;
        background: #f8fafc;
        border-radius: var(--radius-md, 16px);
        transition: transform 0.2s;

        & > :nth-child(1) { flex: 2; }
        & > :nth-child(2) { flex: 3; }
        & > :nth-child(3) { flex: 2; }

        &:hover {
          transform: translateX(5px);
          background: #f1f5f9;
        }

        .cat-name {
          font-size: 1.1rem;
          color: #1e293b;
          font-weight: 600;
        }

        .progress-col {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 0 20px;

          .progress-bar-wrapper {
            flex: 1;
            height: 12px;
            background: #e2e8f0;
            border-radius: 10px;
            overflow: hidden;

            .progress-bar {
              height: 100%;
              border-radius: 10px;
              transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
          }

          .percent-text {
            font-weight: 700;
            font-size: 0.9rem;
            color: #64748b;
            min-width: 40px;
          }
        }

        .rank-col {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;

          .ranking-emoji {
            font-size: 1.5rem;
          }
          .status-text {
            font-weight: 700;
            font-size: 0.9rem;
          }
        }
      }
    }

    .summary-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #f1f5f9;

      .insight-box {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #fff5f5;
        padding: 15px 20px;
        border-radius: 16px;
        color: #ca4d4d;
        font-size: 0.9rem;
        font-weight: 600;
        max-width: 60%;
      }
    }
  }

  .loading-area, .empty-state {
    padding: 60px;
    text-align: center;
    color: #64748b;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .analysis-card {
      padding: 25px 15px;

      .hero-section {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }

      .mark-sheet {
        .sheet-header {
          display: none;
        }
        .sheet-row {
          flex-direction: column;
          align-items: stretch;
          gap: 15px;

          & > * {
            flex: 1 1 auto !important;
          }

          .progress-col {
            padding: 0;
          }

          .rank-col {
            justify-content: flex-start;
          }
        }
      }

      .summary-footer {
        flex-direction: column;
        gap: 20px;

        .insight-box {
          max-width: 100%;
        }
      }
    }
  }

  @media print {
    padding: 0;
    max-width: 100%;
    margin: 0;

    .analysis-card {
      box-shadow: none;
      border: none;
      padding: 0;
      background: transparent;

      .hero-section {
        margin-bottom: 20px;
        padding-bottom: 10px;
      }

      .mark-sheet {
        gap: 10px;
        .sheet-row {
          padding: 10px;
          background: #f8fafc !important;
        }
      }

      .insight-box {
        display: none !important;
      }

      .summary-footer {
        justify-content: center;
      }
    }
  }
`;
