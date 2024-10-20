import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css'; 
import config from './config';


const AdminDashboard = () => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        axios.get(`${config.BASE_API_URL}/api/admin/circulars`)
            .then(response => {
                setCards(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the circulars!', error);
            });
    }, []);

    const openImageInNewTab = (imageUrl) => {
        window.open(imageUrl, '_blank').focus();
    };

    const handleDelete = (cardId) => {
        if (window.confirm('Are you sure you want to delete this circular?')) {
            axios.delete(`${config.BASE_API_URL}/api/admin/circularsdelete/${cardId}`)
                .then(() => {
                    // Remove the deleted card from the state
                    setCards(cards.filter(card => card._id !== cardId));
                    alert('Circular deleted successfully!');
                })
                .catch(error => {
                    console.error('There was an error deleting the circular!', error);
                    alert('There was an error deleting the circular!');
                });
        }
    };

    return (
        <div className={styles.content}>
            <h1 style={{ paddingLeft: 20 }}>Admin Dashboard</h1>
            <br />
            <div className={styles.cardcontainer}>
                {cards.length > 0 ? (
                    cards.map(card => (
                        <div className={styles.card} key={card._id}>
                            <img 
                                src={`${config.BASE_API_URL}/${card.image}`} 
                                alt={card.title} 
                                className={styles.cardImage} 
                                onClick={() => openImageInNewTab(`${config.BASE_API_URL}/${card.image}`)} 
                                style={{ cursor: 'pointer' }} 
                            />
                            <h2>{card.title}</h2>
                            <button 
                                onClick={() => handleDelete(card._id)} 
                                style={{ backgroundColor: 'white', color: 'red', cursor: 'pointer', padding: '5px', border: '3px solid red', borderRadius: '50px', width:'90px', fontWeight:'bold' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p className={styles.empty}>No circulars available.</p>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
