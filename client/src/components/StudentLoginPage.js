import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../css/loginsignup.module.css';
import config from './config';

const StudentLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

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

  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailError) {
      try {
        const response = await fetch(`${config.BASE_API_URL}/api/student/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const { user } = data;

          // Store user details and token in localStorage
          localStorage.setItem('userId', user.id);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userType', user.type);
          localStorage.setItem('classgroup',user.studentgroup);
          localStorage.setItem('year',user.year);
          navigate('/student');
        } else {
          alert('Please enter valid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };
  return (
    <div className={styles.outercontainer}>
      <div className={styles.container}>
        <div className={styles['left-section']}>
          <h1>Student Login</h1>
          <Link to="/signup/student" className={styles.user}>Student Signup, Click Here</Link>
          <Link to="/login/admin" className={styles.user}>Admin Login, Click Here</Link>
        </div>
        <div className={styles['right-section']}>
          <form onSubmit={handleLogin}>
            <div className={styles['input-group']}>
              <input 
                type="email" 
                id="email" 
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
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button className={styles['loginsignup-button']} type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
