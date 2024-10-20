import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/landingpage.module.css'; // Import the CSS file
import config from './config';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      const userId = localStorage.getItem('userId');
      const userType = localStorage.getItem('userType');

      if (userId && userType) {
        try {
          
          if(userType === 'admin'){
            const response = await axios.post(`${config.BASE_API_URL}/api/admin/checksession`, { userId });
            if (response.data.valid) {
              navigate('/admin');
            } else {
              localStorage.clear();
            }
          }
          else{
            const response = await axios.post(`${config.BASE_API_URL}/api/student/checksession`, { userId });
            if (response.data.valid) {
              navigate('/student');
            } else {
              localStorage.clear();
            }
          }
        } catch (error) {
          console.error('Error verifying session:', error);
        }
      }
    };

    checkUserSession();
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles['left-half']}>
        <h1>Master of Computer Applications</h1>
        <h2>Department Portal</h2>
        <br /><br />
        <div className={styles.buttons}>
          <Link to="/login/student">
            <button>Login</button>
          </Link>
          <Link to="/signup/student">
            <button>Signup</button>
          </Link>
        </div>
      </div>
      <div className={styles['right-half']}></div>
    </div>
  );
};

export default LandingPage;
