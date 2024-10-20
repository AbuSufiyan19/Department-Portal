import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/loginsignup.module.css'; // Adjust path as needed
import config from './config';

const StudentSignupPage = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    nameError: '',
    rollNumberError: '',
    emailError: '',
    groupError: '',
    passwordError: '',
    confirmPasswordError: '',
  });
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    const regex = /^[a-zA-Z\s]+$/;
    setErrors({
      ...errors,
      nameError: !regex.test(value) ? 'Please enter a valid name (letters and spaces only).' : '',
    });
  };

  const handleRollNumberChange = (e) => {
    const value = e.target.value;
    setRollNumber(value);
    const regex = /^\d{2}mx\d{3}$/i;
    setErrors({
      ...errors,
      rollNumberError: !regex.test(value) ? 'Roll number should be in the format: 12mx345' : '',
    });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const regex = /^\d{2}mx\d{3}@psgtech\.ac\.in$/;
    setErrors({
      ...errors,
      emailError: !regex.test(value) ? 'Please enter an official email address.' : '',
    });
  };

  const handleGroupChange = (e) => {
    const value = e.target.value;
    setGroup(value);
    setErrors({
      ...errors,
      groupError: value === '' ? 'Please select a group.' : '',
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setErrors({
      ...errors,
      passwordError: !regex.test(value)
        ? 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
        : '',
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors({
      ...errors,
      confirmPasswordError: value !== password ? 'Passwords do not match.' : '',
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !errors.nameError &&
      !errors.rollNumberError &&
      !errors.emailError &&
      !errors.groupError &&
      !errors.passwordError &&
      !errors.confirmPasswordError
    ) {
      try {
        const response = await fetch(`${config.BASE_API_URL}/api/student/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, rollNumber, email, group, password }),
        });

        if (response.ok) {
          // Redirect to student login page upon successful signup
          alert('Signup Successful.');
          navigate('/login/student');
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
          <h1>Student Signup</h1>
          <a href="/login/student" className={styles.user}>Student Login, Click Here</a>
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
              {errors.nameError && <span className={styles['error-message']}>{errors.nameError}</span>}
            </div>
            <div className={styles['input-group']}>
              <input
                type="text"
                id="rollnumber"
                name="rollnumber"
                placeholder="Roll Number"
                value={rollNumber}
                onChange={handleRollNumberChange}
                required
              />
              {errors.rollNumberError && <span className={styles['error-message']}>{errors.rollNumberError}</span>}
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
              {errors.emailError && <span className={styles['error-message']}>{errors.emailError}</span>}
            </div>
            <div className={styles['input-group']}>
              <select value={group} onChange={handleGroupChange} required>
                <option value="">Select Group</option>
                <option value="G1">G1</option>
                <option value="G2">G2</option>
              </select>
              {errors.groupError && <span className={styles['error-message']}>{errors.groupError}</span>}
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
              {errors.passwordError && <span className={styles['error-message']}>{errors.passwordError}</span>}
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
              {errors.confirmPasswordError && <span className={styles['error-message']}>{errors.confirmPasswordError}</span>}
            </div>
            <button className={styles['loginsignup-button']} type="submit">Signup</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentSignupPage;
