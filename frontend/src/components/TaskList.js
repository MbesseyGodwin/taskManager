import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DateFormatter from './DateFormatter';

const TaskList = ({ tasks, fetchTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({ id: null, title: '', description: '', status: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState('');

  const openModal = (task) => {
    setIsModalOpen(true);
    setEditedTask(task);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditedTask({ id: null, title: '', description: '', status: '' });
  };

  const handleEditTask = async () => {
    try {
      setLoading("editing task");
      await axios.put(`http://localhost:5000/tasks/${editedTask.id}`, editedTask);
      closeModal();
      setLoading(`Task with ID ${editedTask.id} has been edited`);
      setTimeout(() => {
        setLoading("");
      }, 3000); // Set timeout for 3 seconds
      fetchTasks();
    } catch (error) {
      setLoading("Error updating task");
      console.error('Error updating task:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setLoading("deleting task");
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setLoading(`task with id: ${taskId} was deleted`);
      setTimeout(() => {
        setLoading("");
      }, 3000); // Set timeout for 3 seconds
      fetchTasks(); // Fetch tasks again to update the list
    } catch (error) {
      setLoading("Error deleting task");
      console.error('Error deleting task:', error);
    }
  };
  


  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container bg-gray-300 mt-4 p-4 rounded shadow">
      <h3 className="text-xl font-bold">
        {isModalOpen ? "Editing Task" : "List of Tasks"}
      </h3>

      {loading && <p className='alert alert-success'>{loading}</p>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search tasks by title or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!isModalOpen && (
        <table className="table table-bordered rounded">
          <thead>
            <tr>
              <th className="px-6 py-3">Task ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Updated At</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id} className="bg-white">
                <td className="border px-6 py-4">{task.id}</td>
                <td className="border px-6 py-4">{task.title}</td>
                <td className="border px-6 py-4">{task.description}</td>
                <td className="border px-6 py-4">{task.status}</td>
                <td className="border px-6 py-4"><DateFormatter dateString={task.created_at} /></td>
                <td className="border px-6 py-4"><DateFormatter dateString={task.updated_at} /></td>
                <td className="border d-flex justify-content-around text-center px-6 py-4">
                  <button className="btn btn-outline-primary uppercase" onClick={() => openModal(task)}>Edit</button>
                  <button className="btn btn-outline-danger uppercase" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="shadow-2xl">
          <div className="modal-content bg-gray-200 p-3">
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
              <div className='d-flex justify-between'>
                <button className="btn btn-danger text-uppercase" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-success text-uppercase">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
