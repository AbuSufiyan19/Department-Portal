import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import CircularPosting from './CircularPosting';
import AcademicSchedulePosting from './AcademicSchedulePosting';
import AcademicScheduleView from './AcademicScheduleView';
import AdminDashboard from './AdminDashboard';
import SetReminder from './SetReminder';
import styles from '../css/index.module.css';
import AdminRespondGrievance from './AdminRespondGrievance'
import Repository from './Repository';


const AdminHomePage = () => {
  const [content, setContent] = useState('dashboard'); // Default content
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Sidebar visibility state
  const [loading, setLoading] = useState(true); // Loading state to handle async checks
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const checkSession = () => {
      const userId = localStorage.getItem('userId');
      const userType = localStorage.getItem('userType');

      if (userId && userType === 'admin') {
        // Session is valid
        setLoading(false);
      } else {
        // Session is invalid
        navigate('/login/admin');
      }
    };

    checkSession();
  }, [navigate]);

  const loadContent = (e, page) => {
    e.preventDefault();
    setContent(page);
  };

  const renderContent = () => {
    switch (content) {
      case 'circularposting':
        return <CircularPosting />;
      case 'respondgrievance':
        return <AdminRespondGrievance />;
      case 'schedulepost':
        return <AcademicSchedulePosting />
      case 'scheduleview':
        return <AcademicScheduleView />;
      case 'setreminder':
        return <SetReminder />;
      case 'Repository':
        return <Repository />
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Render loading indicator while session check is in progress
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.main}>
      <AdminTopbar toggleSidebar={toggleSidebar} />
      <div className={styles.container}>
        <AdminSidebar loadContent={loadContent} isSidebarVisible={isSidebarVisible} />
        <div className={`${styles.mainContent} ${!isSidebarVisible ? styles.expandedContent : ''}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
