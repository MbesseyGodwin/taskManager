import React, { useState } from "react";

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsAddingTask(true); // Set state to indicate that task is being added
    try {
      // Perform the task submission
      await onSubmit({ title, description });
      // Clear the form inputs
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsAddingTask(false); // Reset state after task submission is complete
    }
  };

  return (
    <div className="container bg-gray-300 py-2 rounded">
      <form onSubmit={handleSubmit} className="d-flex justify-between">
        <input required type="text" placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)} className={isAddingTask ? "d-none" : "m-1 form-control"} />
        <input required type="text" placeholder="A description" value={description} onChange={(e) => setDescription(e.target.value)} className={isAddingTask ? "d-none" : "m-1 form-control"}/>
        <button type="submit" className={isAddingTask ? "w-full alert alert-success m-1 text-uppercase" : "btn btn-outline-success m-1 text-uppercase"} disabled={isAddingTask}>
          {isAddingTask ? "Please wait, Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
