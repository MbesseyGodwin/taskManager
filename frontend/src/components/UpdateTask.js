import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateTask = ({ taskId }) => {
  const [task, setTask] = useState({});
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasks/${taskId}`);
        setTask(response.data);
        setNewTitle(response.data.title);
        setNewDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdateTask = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${taskId}`, {
        title: newTitle,
        description: newDescription,
      });
      console.log('Task updated successfully:', response.data);
      // You can perform additional actions after updating the task, such as refreshing the task list
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div>
      <h2>Update Task</h2>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Enter new title"
      />
      <textarea
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        placeholder="Enter new description"
      />
      <button onClick={handleUpdateTask}>Update Task</button>
    </div>
  );
};

export default UpdateTask;
