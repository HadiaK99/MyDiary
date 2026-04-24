import styled from "styled-components";

export const PlanningContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;

  .top-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 30px;
  }

  .header {
    margin-bottom: 40px;
    text-align: center;

    h1 {
      font-size: 2.22rem;
      color: #1e293b;
      margin-bottom: 8px;
    }

    p {
      color: #64748b;
      font-weight: 500;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
    gap: 30px;
    margin-bottom: 60px;
    align-items: flex-start;

    @media (max-width: 1000px) {
      grid-template-columns: 1fr;
    }
  }

  .planning-card {
    padding: 35px;
    display: flex;
    flex-direction: column;

    h2 {
      font-family: 'Fredoka', sans-serif;
      font-size: 1.5rem;
      margin-bottom: 25px;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 10px;

      th {
        padding: 12px;
        text-align: left;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #94a3b8;
        border-bottom: 2px solid #f1f5f9;
      }

      td {
        padding: 15px 8px;
        border-bottom: 1px solid #f1f5f9;
      }
    }

    .task-input {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px 14px;
      border-radius: 12px;
      width: 100%;
      font-weight: 700;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: var(--primary);
      }
    }

    .time-range {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #475569;

      input[type="time"] {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        padding: 6px 10px;
        border-radius: 8px;
        font-family: inherit;
        font-size: 0.9rem;
        color: #1e293b;
      }

      .time-val {
        font-family: 'Quicksand', sans-serif;
        font-weight: 600;
        color: #475569;
      }
    }

    .remove-btn {
      background: #fef2f2;
      color: #ef4444;
      border: none;
      width: 36px;
      height: 36px;
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

    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 15px;
      margin-top: 20px;
      background: #f8fafc;
      border: 2px dashed #e2e8f0;
      border-radius: 12px;
      color: var(--primary);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f1f5f9;
        border-color: var(--primary);
        transform: translateY(-2px);
      }
    }

    textarea {
      width: 100%;
      height: 120px;
      padding: 15px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      font-family: inherit;
      resize: vertical;

      &:focus {
        outline: none;
        border-color: var(--primary);
      }
    }

    .view-box {
      background: #f8fafc;
      padding: 20px;
      border-radius: 16px;
      border: 1px dashed #cbd5e1;
      min-height: 100px;
      color: #475569;
      line-height: 1.6;
    }

    .goal-section {
      p {
        font-size: 0.9rem;
        color: #64748b;
        margin-bottom: 15px;
      }
    }
  }

  .print-note {
    text-align: center;
    padding: 40px;
    border-top: 2px dashed #e2e8f0;

    p {
      color: #64748b;
      margin-bottom: 20px;
    }
  }

  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .planning-card {
      padding: 20px;
      
      table {
        th, td {
          padding: 10px 5px;
          font-size: 0.8rem;
        }
      }

      .time-range {
        gap: 4px;
        input[type="time"] {
          width: 80px;
        }
      }
    }
  }

  @media print {
    .top-actions, .no-print {
      display: none !important;
    }
    padding: 0;
    .planning-card {
      border: 1px solid #eee;
      box-shadow: none;
    }
  }
`;
