import styled from "styled-components";

export const ParentContainer = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  background: #fff5f7; /* Keep the pastel pink background */
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
    border-bottom: 1px solid #ffe4e6;
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
    color: #be123c;
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
    border-right: 1px solid #ffe4e6;
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
      box-shadow: 20px 0 50px rgba(190, 18, 60, 0.05);

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
        color: #be123c;
      }
      p {
        margin: 0;
        font-size: 0.85rem;
        color: #9f1239;
        font-weight: 600;
      }
    }

    .parent-avatar {
      width: 50px;
      height: 50px;
      background: #fce7f3;
      border: 2px solid #fbcfe8;
      border-radius: 15px;
      color: #be123c;
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
        color: #9f1239;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.2s;
        border: none;
        background: transparent;
        cursor: pointer;
        width: 100%;
        font-family: inherit;
        font-size: 1rem;

        &:hover {
          background: #fff1f2;
          color: #be123c;
        }

        &.active {
          background: #fff1f2;
          color: #be123c;
          border-left: 4px solid #be123c;
          border-radius: 4px 12px 12px 4px;
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
    background: rgba(159, 18, 57, 0.2);
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
    }

    .welcome-card {
      background: white;
      border-radius: 30px;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 10px 30px rgba(190, 18, 60, 0.03);
      margin-bottom: 40px;

      .welcome-text {
        h1 {
          margin: 0;
          font-size: 2.2rem;
          color: #be123c;
        }
        p {
          margin: 10px 0 0;
          color: #9f1239;
          font-size: 1.1rem;
          font-weight: 600;
        }
      }
    }

    .child-preview {
      background: white;
      border-radius: 25px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(190, 18, 60, 0.05);
      display: flex;
      flex-direction: column;
      gap: 20px;

      .child-header {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .child-avatar {
        width: 70px;
        height: 70px;
        background: #dcfce7;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #166534;
        font-weight: 800;
        font-size: 1.8rem;
      }

      .child-info {
        h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #1e293b;
        }
        p {
          margin: 5px 0 0;
          color: #10b981;
          font-weight: 700;
        }
      }

      .progress-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;

        .progress-stat {
          flex: 1 1 calc(33.333% - 10px);
          min-width: 100px;
          background: #fffafa;
          padding: 15px;
          border-radius: 15px;
          text-align: center;
          border: 1px solid #fff1f2;

          h5 {
            margin: 0;
            color: #9f1239;
            font-size: 0.8rem;
            text-transform: uppercase;
          }
          p {
            margin: 5px 0 0;
            font-weight: 800;
            font-size: 1.2rem;
            color: #be123c;
          }
        }
      }
    }

    .review-section {
      margin-top: 40px;

      .review-card {
        background: white;
        padding: 25px;
        border-radius: 20px;
        border-left: 5px solid #be123c;
        margin-bottom: 15px;
        box-shadow: 0 4px 15px rgba(190, 18, 60, 0.02);

        h4 {
          margin: 0 0 10px;
          display: flex;
          justify-content: space-between;
          color: #be123c;
        }
        p {
          margin: 0;
          font-style: italic;
          color: #4c0519;
        }
      }
    }
  }
`;
