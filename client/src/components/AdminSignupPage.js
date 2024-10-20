import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/loginsignup.module.css'; // Adjust path as needed
import config from './config';

const AdminSignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(value)) {
      setNameError('Please enter a valid name (letters and spaces only).');
    } else {
      setNameError('');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const regex = /^[\w.-]+@psgtech\.ac\.in$/i;
    if (!regex.test(value)) {
      setEmailError('Please enter official email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(value)) {
      setPasswordError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!nameError && !emailError && !passwordError && !confirmPasswordError) {
      try {
        const response = await fetch(`${config.BASE_API_URL}/api/admin/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
          // Redirect to admin login page upon successful signup
          alert('Signup Successful');
          navigate('/login/admin');
        } else {
          alert('Signup failed. Please try again.');
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className={styles.outercontainer}>
    <div className={styles.container}>
      <div className={styles['left-section']}>
        <h1>Admin Signup</h1>
        <a href="/login/admin" className={styles.user}>Admin Login, Click Here</a>
      </div>
      <div className={styles['right-section']}>
        <form onSubmit={handleSignup}>
          <div className={styles['input-group']}>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
              required
            />
            {nameError && <span className={styles['error-message']}>{nameError}</span>}
          </div>
          <div className={styles['input-group']}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <span className={styles['error-message']}>{emailError}</span>}
          </div>
          <div className={styles['input-group']}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && <span className={styles['error-message']}>{passwordError}</span>}
          </div>
          <div className={styles['input-group']}>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {confirmPasswordError && <span className={styles['error-message']}>{confirmPasswordError}</span>}
          </div>
          <button className={styles['loginsignup-button']} type="submit">Signup</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AdminSignupPage;
