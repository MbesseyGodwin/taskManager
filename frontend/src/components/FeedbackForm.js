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
    <div className="bg-gray-300 my-3 p-3 fixed-bottom w-full">
      <button className="btn btn-outline-info" onClick={toggleFormVisibility}>
        {showForm ? "Hide Feedback Form" : "Provide Feedback"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>We would love to hear your feedback:</label>
          <textarea
            className="form-control my-2"
            value={feedback}
            onChange={handleFeedbackChange}
          />
          <button className="btn btn-outline-primary" type="submit">
            Send Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
