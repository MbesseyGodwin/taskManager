import React, { useState } from "react";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = "mbesseygodwin@gmail.com";
    const subject = "Feedback";
    const body = `Feedback: ${feedback}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className={`${showForm ? 'bg-gray-300 mt-3 p-3 fixed-bottom w-25' : 'my-3 p-3 fixed-bottom'}`}>
      <button className="btn btn-info uppercase" onClick={toggleFormVisibility}>
        {showForm ? "Dismiss" : "Feedback"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>We would love to hear your feedback:</label>
          <textarea required
            className="form-control my-2"
            value={feedback}
            onChange={handleFeedbackChange}
          />
          <button className="btn btn-outline-primary uppercase" type="submit">
            Send Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
