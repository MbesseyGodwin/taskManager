import React from 'react';

const DateFormatter = ({ dateString }) => {
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
  return <span>{formattedDate}</span>;
};

export default DateFormatter;
