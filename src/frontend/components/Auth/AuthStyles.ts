import styled from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #fdf4ff 0%, #e0f2fe 100%);
  font-family: 'Quicksand', sans-serif;

  .auth-card {
    background: white;
    padding: 40px;
    border-radius: 30px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    width: 100%;
    max-width: 450px;
    text-align: center;
    border: 4px solid #fff;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .logo-area {
    margin-bottom: 30px;

    h1 {
      font-size: 2.5rem;
      color: var(--primary);
      margin-top: 10px;
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input-group {
    text-align: left;

    label {
      display: block;
      font-weight: 700;
      margin-bottom: 8px;
      color: #475569;
    }
  }

  .input-field {
    width: 100%;
    padding: 15px;
    border-radius: 15px;
    border: 2px solid #e2e8f0;
    font-size: 1rem;
    transition: all 0.3s ease;
    outline: none;

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
    }
  }

  .role-select {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }

  .role-btn {
    flex: 1 1 calc(50% - 5px);
    padding: 12px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    background: white;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;

    &.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }
  }

  .switch-auth {
    margin-top: 25px;
    color: #64748b;
    font-size: 0.95rem;

    button {
      color: var(--primary);
      font-weight: 700;
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-size: inherit;
      font-family: inherit;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
