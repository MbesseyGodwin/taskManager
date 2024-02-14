import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = ({ tasks, fetchTasks }) => {
  // State variables for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({ id: null, title: '', description: '', status: '' });

  // Function to open the modal and set the edited task data
  const openModal = (task) => {
    console.log("modal is now open");
    setIsModalOpen(true);
    setEditedTask(task);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedTask({ id: null, title: '', description: '', status: '' });
  };

  // Function to handle editing a task
  const handleEditTask = async () => {
    try {
      await axios.put(`http://localhost:5000/tasks/${editedTask.id}`, editedTask);
      closeModal(); // Close the modal after successful update
      fetchTasks(); // Fetch tasks again to update the list
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

// Function to handle input changes in the modal
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setEditedTask({ ...editedTask, [name]: value });
};

// Log the updated state after it has been applied
useEffect(() => {
  console.log(editedTask);
}, [editedTask]);


  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      // After deletion, fetch tasks again to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  function formatDate(dateString) {
    // Create a Date object from the string
    const date = new Date(dateString);
  
    // Options for formatting (customize as needed)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
  
    // Format the date using Intl.DateTimeFormat
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(date);
  
    // Return the formatted date
    return formattedDate;
  }

  return (
    <div className="container bg-gray-300 mt-4 p-4 rounded shadow">
      <h3 className="text-xl font-bold">
        {isModalOpen ? "Editing Task" : "List of Tasks"}
      </h3>

      {!isModalOpen && (<table className="table table-bordered rounded">
        <thead>
          <tr>
            <th className="px-6 py-3">Task ID</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Created At</th>
            <th className="px-6 py-3">Updated At</th>
            <th className="px-6 py-3">Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} className="bg-white">
              <td className="border px-6 py-4">{task.id}</td>
              <td className="border px-6 py-4">{task.title}</td>
              <td className="border px-6 py-4">{task.description}</td>
              <td className="border px-6 py-4">{task.status}</td>
              <td className="border px-6 py-4">{formatDate(task.created_at)}</td>
              <td className="border px-6 py-4">{formatDate(task.updated_at)}</td>
              <td className="border d-flex justify-content-around text-center px-6 py-4">
                <button className="btn btn-outline-primary mr-2" onClick={() => openModal(task)}>Edit</button>
                <button className="btn btn-outline-danger" onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>)}

      {/* Modal for editing task */}
      {isModalOpen && (
        <div className="shadow-2xl">
          <div className="modal-content bg-gray-200 p-3">
            <button className="btn btn-sm btn-outline-danger mb-3" onClick={closeModal}>Cancel Edit</button>
            <form onSubmit={handleEditTask}>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input required type="text" className='form-control border-dark' name="title" value={editedTask.title} onChange={handleInputChange} /></td>
                    <td><input required className='form-control border-dark' name="description" value={editedTask.description} onChange={handleInputChange} /></td>
                    <td>
                      <select className="form-control border-dark" name="status" id="status" value={editedTask.status} onChange={handleInputChange}>
                        <option value="todo">Todo</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button type="submit" className="btn btn-outline-success w-full">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
