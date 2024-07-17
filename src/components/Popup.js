import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Popup.css';
import arrow from "../images/arrow.png"
import dateSelection from "../images/calendar2.png"
import closePopup from "../images/close.png"

function Popup(props) {
  const [task, setTask] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [error, setError] = useState('');

  

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/search', {
        task,
        taskDate,
        displayDate: props.displayDate
      });

      if (response.data) {
        props.setTasks(response.data.tasks); 
        setError('');
        setTask('');
        setTaskDate('');
        props.setTrigger(false);
      }
    } catch (error) {
      setError('Failed to fetch data. Please try again.');
    }
  };

  return props.trigger ? (
    <div className="popup">
      <div className="popupInner">
        <div className="innerTitle">
          Every task brings you closer to your goals!
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="input1">Enter your task</label>
              <br />
              <input
                type="text"
                placeholder="Enter your task"
                id="input1"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
              />
            </div>
            {/* <div className="date-picker-container">
              <label htmlFor="input2">Enter task date</label>
              <br />
              <input
                className="dateInput"
                type="date"
                id="input2"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                required
              /> */}
              {/* <img src={dateSelection} alt="" className="date-picker-icon" /> */}
            {/* </div> */}
            <div>
              <label htmlFor="input1">Enter your task</label>
              <br />
              <input
                type="date"
                placeholder="Enter your task"
                id="input1"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
              />
            </div>
            <div className="formButton">
              <button type="submit">
                Add{' '}
                <span>
                  <img src={arrow} alt="Arrow" />
                </span>
              </button>
            </div>
          </form>
        </div>
        {error && <div className="error">{error}</div>}
        <button
          className="closeForm"
          onClick={() => props.setTrigger(false)}>
          <img src={closePopup} alt="Exit" />
        </button>
      </div>
    </div>
  ) : null;
}

export default Popup;
