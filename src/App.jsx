import { useState } from 'react'
import './App.css'


function App() {
  //declare state variables
  const [task, setTask] = useState("");//used for text data,inputs,(initial value=empty string)
  const [tasks, setTasks] = useState([]);//lists of items,todos,users,products(initial value=empty array)
  //array= way to store multiple values in a single variable.

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, {id: Date.now(), text: task, completed: false}]);
      setTask(""); 
    }
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  return (
    <div className="app-container">
      <h1 style={{color: "gold", fontSize: "4rem",}}>
        My Task List</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder='whats need to be done'
      />

      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.text}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      </div>
      );
}

export default App;