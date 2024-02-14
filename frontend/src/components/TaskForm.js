// src/components/TaskForm.js
import React, { useState } from "react";

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <div className="container bg-gray-300 py-2 rounded">
      <form onSubmit={handleSubmit} className="d-flex justify-between">
        <input required type="text" placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)} className="m-1 form-control" />
        <input required type="text" placeholder="A description" value={description} onChange={(e) => setDescription(e.target.value)} className="m-1 form-control"/>
        <button type="submit" className="btn btn-outline-success m-1 py-0">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
