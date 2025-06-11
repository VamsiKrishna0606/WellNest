// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [habits, setHabits] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [newHabit, setNewHabit] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const habitRes = await axios.get('/api/habits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHabits(habitRes.data);

      const foodRes = await axios.get('/api/food', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoodLogs(foodRes.data);

      const analysis = habitRes.data.map(h => ({
        name: h.name,
        percent: h.checked ? 100 : 0
      }));
      setAnalytics(analysis);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const totalCalories = foodLogs.reduce((sum, food) => sum + food.calories, 0);

  const handleAddHabit = async () => {
  console.log("Submitting habit:", newHabit); // 🔍 log input
  try {
    const res = await axios.post('/api/habits', { name: newHabit }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Added habit:", res.data); // ✅ log response
    setNewHabit('');
    setShowHabitForm(false);
    fetchData();
  } catch (err) {
    console.error('❌ Error adding habit:', err.response?.data || err.message);
  }
};


  return (
    <div className="home-container">
      <nav className="navbar">
        <h2>🌱 WellNest</h2>
        <div className="nav-tabs">
          <span className="active">Habit</span>
          <span>Food</span>
          <span>Analytics</span>
        </div>
        <button className="logout" onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}>Log Out</button>
      </nav>

      <div className="dashboard">
        <div className="habit-card card">
          <h3>Habit Tracker</h3>
          {habits.map((habit, i) => (
            <div key={i}>
              <input type="checkbox" checked={habit.checked} readOnly /> {habit.name}
            </div>
          ))}
          {!showHabitForm ? (
            <a href="#" className="add-link" onClick={() => setShowHabitForm(true)}>+ Add Habit</a>
          ) : (
            <div className="habit-form">
              <input
                type="text"
                placeholder="Enter habit"
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
              />
              <button onClick={handleAddHabit}>Add</button>
              <button onClick={() => setShowHabitForm(false)}>Cancel</button>
            </div>
          )}
        </div>

        <div className="food-card card">
          <h3>Food Logger</h3>
          {foodLogs.map((item, i) => (
            <div key={i} className="food-row">
              <span>{item.name}</span>
              <span>{item.calories} g</span>
            </div>
          ))}
          <div className="food-footer">
            <a href="#" className="add-link">Add Food</a>
            <span>Total <b>{totalCalories}</b> Cal</span>
          </div>
        </div>
      </div>

      <div className="analytics-card card">
        <h3>Goal Analytics</h3>
        {analytics.map((item, i) => (
          <div key={i}>
            <span>{item.name}</span>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${item.percent}%` }}></div>
            </div>
          </div>
        ))}
        <div className="bar-labels">
          <span>0%</span><span>20%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
