import { useEffect, useRef, useState } from 'react';
import './App.css';
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import Popup from './components/Popup';
import axios from "axios";
import lottie from "lottie-web";
import addImage from "./images/plus.png"
import caland from "./images/calend.png"
import circleImage from "./images/circle.png"
import filledCircle from "./images/filledCircle.png"
import edit from "./images/edit.png";
import deleteImage from "./images/trash.png";
import saveImage from "./images/check.png"
import cancelImage from "./images/cancel.png"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function App() {
   const [loading, setLoading] = useState(true);
   const [formDisplay, setFormDisplay] = useState(false);
   const [tasks, setTasks] = useState([]);
   const [taskDone, setTaskDone] = useState({}); 
   const [displayDate, setDisplayDate] = useState(new Date());
   const [editingTask, setEditingTask] = useState(null);
   const [editedTaskText, setEditedTaskText] = useState('');
   const dateInputRef = useRef(null);
   
   const container = useRef(null);
   const [startDate, setStartDate] = useState(new Date());
   const [showDatePicker, setShowDatePicker] = useState(false);

   const handleImageClick = () => {
       setShowDatePicker(true);
   };
   const handleRef = (element) => {
    if (element) {
      container.current = element;
      if (tasks.length === 0) {
        const animationInstance = lottie.loadAnimation({
          container: container.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: require('./noList.json'),
        });

        return () => {
          animationInstance.destroy();
        };
      }
    }
  };

   useEffect(() => {
       const fetchTasks = async () => {
           try {
               const response = await axios.get(`https://localhost:8080/tasks/${displayDate.toISOString().split('T')[0]}`);
               setTasks(response.data);
               initializeTaskDoneState(response.data); 
           } catch (error) {
               console.error('Failed to fetch tasks:', error);
           }
       };

       fetchTasks();
   }, [displayDate]);

   useEffect(() => {
       const fetch = () => {
           setTimeout(() => {
               setLoading(false);
           }, 3100);
       };
       fetch();
   }, []);

   const initializeTaskDoneState = (tasks) => {
       const initialTaskDoneState = {};
       tasks.forEach((task) => {
           initialTaskDoneState[task._id] = task.completed; 
       });
       setTaskDone(initialTaskDoneState);
   };

   const toggleTaskDone = async (taskId) => {
       try {
           const response = await axios.put(`https://localhost:8080/task/${taskId}`);
           const updatedTask = response.data;

           setTaskDone({
               ...taskDone,
               [taskId]: updatedTask.completed 
           });

           const updatedTasks = tasks.map(task => task._id === taskId ? updatedTask : task);
           setTasks(updatedTasks);
       } catch (error) {
           console.error('Failed to update task:', error);
       }
   };

   const deleteTask = async (taskId) => {
       try {
           await axios.delete(`https://localhost:8080/task/${taskId}`);
           const updatedTasks = tasks.filter(task => task._id !== taskId);
           setTasks(updatedTasks);
       } catch (error) {
           console.error('Failed to delete task:', error);
       }
   };


   const handleDateChange = (date) => {
    setStartDate(date);
    setDisplayDate(date);
    setShowDatePicker(false);
};

   const handleEditTask = (taskId, taskText) => {
       setEditingTask(taskId);
       setEditedTaskText(taskText);
   };

   const handleSaveTask = async (taskId) => {
       try {
           const response = await axios.put(`https://localhost:8080/edit/${taskId}`, {
               task: editedTaskText
           });
           const updatedTask = response.data;

           const updatedTasks = tasks.map(task => task._id === taskId ? updatedTask : task);
           setTasks(updatedTasks);
           setEditingTask(null);
       } catch (error) {
           console.error('Failed to update task:', error);
       }
   };

   const handleCancelEdit = () => {
       setEditingTask(null);
   };

   return loading ? (
       <div className="loader-container">
           <ClimbingBoxLoader size={30} color={'#ef532f'} loading={loading} />
       </div>
   ) : (
       <div className="App">
           <div className='header'>
               <div className='headerTitle'>List<span>Loom</span></div>
               <div className='headerButton'>
                   <div className='addTask'>
                       <button onClick={() => {setFormDisplay(true)}}><img src={addImage} alt="Add" /></button>
                   </div>
                   <div className='nextDay'>
            <img src={caland} alt="NextDay" onClick={handleImageClick} style={{ cursor: 'pointer' }} />
            {showDatePicker && (
                <div className='datePicker'>
                    <DatePicker
                    value={displayDate.toISOString().split('T')[0]} 
                    selected={startDate}
                    onChange={handleDateChange}
                    inline
                /> 
                </div>
                
            )}
        </div>
               </div>
           </div>
           <div className='taskProgress'>
               <div className='dateInfo'>
                   <p className='todo'>Todo Done</p>
                   <p className='date'>{displayDate.toDateString()}</p>
               </div>
               <div className='taskDone'>{Object.values(taskDone).filter(done => done).length}/{tasks.length}</div>
           </div>
           <div className='taskList' >
            {tasks.length === 0 ?  <div className="noTask">
            <div className="svgWrapper" ref={handleRef}></div>
          </div> : 
               tasks.map((task) => (
                   <div className='taskContainer' key={task._id}>
                       <div className='taskInfo'>
                           <img
                               src={taskDone[task._id] ? filledCircle : circleImage}
                               alt="Circle"
                               onClick={() => toggleTaskDone(task._id)}
                               className={taskDone[task._id] ? 'taskDone' : ''}
                           />
                           {editingTask === task._id ? (
                               <input
                                   type="text"
                                   className='editInput'
                                   value={editedTaskText}
                                   onChange={(e) => setEditedTaskText(e.target.value)}
                               />
                           ) : (
                               <p className={taskDone[task._id] ? 'overLine' : ''}>{task.task}</p>
                           )}
                       </div>
                       <div className='taskEdit'>
                           {editingTask === task._id ? (
                               <>
                                   <img onClick={() => handleSaveTask(task._id)} className='editButton save' src={saveImage} alt="Save"/>
                                   <img  onClick={handleCancelEdit} className='editButton cancel' src={cancelImage} alt="Save"/>
                               </>
                           ) : (
                               <>
                                   <img src={edit} alt="Edit" onClick={() => handleEditTask(task._id, task.task)} />
                                   <img src={deleteImage} alt="Delete" onClick={() => deleteTask(task._id)}/>
                               </>
                           )}
                       </div>
                   </div>
               ))}
           </div>
           <Popup trigger={formDisplay} setTrigger={setFormDisplay} tasks={tasks} setTasks={setTasks} displayDate={displayDate} setDisplayDate={setDisplayDate}/>
       </div>
   );
}

export default App;
