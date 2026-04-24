import styled from "styled-components";

export const AdminContainer = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Quicksand', sans-serif;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  .mobile-header {
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 100;

    @media (max-width: 768px) {
      display: flex;
    }
  }

  .menu-btn {
    background: transparent;
    border: none;
    color: #1e293b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
  }

  aside {
    width: 280px;
    min-width: 280px;
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    padding: 30px 20px;
    min-height: 100vh;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;

    @media (max-width: 768px) {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      transform: translateX(-100%);
      box-shadow: 20px 0 50px rgba(0, 0, 0, 0.1);

      &.sidebar-open {
        transform: translateX(0);
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 40px;
      padding: 0 10px;

      h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #1e293b;
      }
      p {
        margin: 0;
        font-size: 0.85rem;
        color: #64748b;
      }
    }

    .admin-avatar {
      width: 50px;
      height: 50px;
      background: var(--primary);
      border-radius: 15px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.5rem;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex-grow: 1;

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 15px;
        border-radius: 12px;
        color: #475569;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s;
        border: none;
        background: transparent;
        cursor: pointer;
        width: 100%;
        font-family: inherit;
        font-size: 1rem;

        &:hover {
          background: #f1f5f9;
          color: var(--primary);
        }

        &.active {
          background: var(--primary-glow);
          color: var(--primary);
        }
      }
    }

    .sidebar-footer {
      margin-top: auto;
    }
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(4px);
    z-index: 999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;

    &.overlay-active {
      opacity: 1;
      pointer-events: auto;
    }
  }

  main {
    flex-grow: 1;
    padding: 40px;
    margin: 0;
    width: 100%;
    overflow-x: hidden;

    @media (max-width: 1024px) {
      padding: 30px;
    }
    @media (max-width: 768px) {
      padding: 20px;
      max-width: 100%;
      overflow-x: hidden;
    }
  }

  .dashboard-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    margin-top: 30px;
    & > * { flex: 1 1 280px; }
  }

  .stat-card {
    background: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 20px;

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-info {
      h4 {
        margin: 0;
        color: #64748b;
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p {
        margin: 5px 0 0;
        font-size: 1.8rem;
        font-weight: 800;
        color: #1e293b;
      }
    }
  }

  .table-container {
    background: white;
    border-radius: 20px;
    padding: 30px;
    margin-top: 40px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    @media (max-width: 768px) {
      padding: 15px;
      margin-top: 20px;
      border-radius: 15px;
      overflow-x: auto;
    }

    .table-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
      gap: 20px;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        text-align: center;
        gap: 15px;
        h1 { font-size: 1.5rem; }

        .hide-text-on-mobile span {
          display: none;
        }
        .hide-text-on-mobile svg {
          margin-right: 0 !important;
        }
      }
    }
  }

  .hide-on-mobile {
    @media (max-width: 1100px) {
      display: none !important;
    }
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;

    th {
      text-align: left;
      padding: 15px;
      color: #64748b;
      font-weight: 600;
      border-bottom: 1px solid #f1f5f9;
    }

    td {
      padding: 15px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }

    @media (max-width: 640px) {
      th, td {
        padding: 10px 8px;
        font-size: 0.85rem;
      }
    }
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-top: 10px;
    width: 100%;
    display: block;
  }

  .badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;

    &.badge-child { background: #dcfce7; color: #166534; }
    &.badge-parent { background: #fef9c3; color: #854d0e; }
    &.badge-admin { background: #fee2e2; color: #991b1b; }
  }

  .category-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;

    .category-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 14px;
      border-bottom: 1.5px solid #f1f5f9;
      flex-wrap: wrap;

      @media (max-width: 480px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
    }

    .category-name-input {
      flex: 1;
      font-size: 1.05rem;
      font-weight: 800;
      font-family: inherit;
      color: #1e293b;
      border: none;
      background: transparent;
      outline: none;
      min-width: 0;
      &:focus { color: var(--primary); }
    }

    .points-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #dcfce7;
      border-radius: 10px;
      padding: 5px 10px;
      flex-shrink: 0;

      .dial-btn {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border: 1px solid #bbf7d0;
        border-radius: 6px;
        color: #166534;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
        padding: 0;

        &:hover {
          background: #166534;
          color: white;
          border-color: #166534;
        }
      }

      .points-input {
        width: 32px;
        border: none;
        background: transparent;
        font-size: 0.9rem;
        font-weight: 800;
        color: #166534;
        font-family: inherit;
        text-align: center;
        outline: none;
        &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .activity-row {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 4px 4px 4px 12px;
      transition: border-color 0.2s;
      &:focus-within { border-color: var(--primary); }

      input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 0.9rem;
        font-family: inherit;
        color: #334155;
        outline: none;
        padding: 6px 0;
      }
    }

    .add-activity-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px;
      border-radius: 10px;
      border: 1.5px dashed #cbd5e1;
      background: transparent;
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 4px;

      &:hover {
        border-color: var(--primary);
        color: var(--primary);
        background: var(--primary-glow);
      }
    }
  }

  .records-grid {
    display: flex;
    gap: 30px;
    margin-top: 30px;
    align-items: flex-start;
    width: 100%;

    & > :first-child { 
      flex: 0 0 300px;
      position: sticky;
      top: 20px;
    }
    & > :last-child { flex: 1; min-width: 0; }

    @media (max-width: 1100px) {
      flex-direction: column;
      align-items: stretch;
      gap: 20px;

      & > :first-child { 
        flex: none; 
        width: 100%;
        position: static;
      }
    }
  }

  .user-selector-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: calc(100vh - 300px);
    overflow-y: auto;

    @media (max-width: 1100px) {
      display: none;
    }
  }

  .mobile-user-select {
    display: none;
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    background: #f8fafc;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    outline: none;
    cursor: pointer;
    transition: all 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 18px;

    &:focus {
      border-color: var(--primary);
      background-color: white;
    }

    @media (max-width: 1100px) {
      display: block;
      margin-top: 10px;
    }
  }

  .filter-group {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: 640px) {
      width: 100%;
      gap: 8px;
      justify-content: space-between;
    }
  }
`;
