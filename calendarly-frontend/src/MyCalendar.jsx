import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const MyCalendar = ({ availableDates, partiallyBookedDates, onDateSelect }) => {
  // it reduces the date by 1 bcs toISOString() method converts the date to UTC,
  // which can lead to incorrect dates if the original date is in a different time zone (like IST in your case).
  // const formattedDate = row.DATE.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD

  // Utility function to format the date to 'YYYY-MM-DD'
  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Intl.DateTimeFormat("en-CA", options).format(
      date
    );
    return formattedDate;
  };

  // Check if the date is available
  const isAvailable = (date) => availableDates.includes(formatDate(date));

  // Check if the date is partially booked
  const isPartiallyBooked = (date) =>
    partiallyBookedDates.includes(formatDate(date));

  // Function to check if a date is available
  // const isAvailable = (date) => {
  //   const formattedDate = date.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
  //   return availableDates.includes(formattedDate); // Check if the date is in availableDates array
  // };

  return (
    <Calendar
      minDate={new Date()}
      onClickDay={(date) => {
        const selectedDate = formatDate(date);
        if (isAvailable(date) || isPartiallyBooked(date)) {
          onDateSelect(selectedDate); // Call the passed in onDateSelect function when a date is selected
        }
      }}
      // Disable all dates that are not available or partially booked
      tileDisabled={({ date, view }) => {
        if (view === "month") {
          return !(isAvailable(date) || isPartiallyBooked(date));
        }
        return false; // Only disable dates for 'month' view
      }}
      tileClassName={({ date, view }) => {
        if (view === "month") {
          if (isPartiallyBooked(date)) {
            return "partially-booked"; // Apply class for partially booked dates
          }
          if (isAvailable(date)) {
            return "available"; // Apply class for available dates
          }
        }
        return ""; // No special class for other dates
      }}
    />
  );

  // return (
  //   <div>
  //     <h3>Select a Date:</h3>
  //     <div>
  //       {availableDates.map((date) => (
  //         <button
  //           key={date.date}
  //           onClick={() => handleDateClick(date)}
  //           disabled={date.isGreyedOut}
  //           className={date.isGreyedOut ? "bg-gray-200" : "bg-blue-500"}
  //         >
  //           {date.date}
  //         </button>
  //       ))}
  //     </div>
  //   </div>
  // );

  // return (
  //   <Calendar
  //     // Disable all dates that are not in available or partially booked dates
  //     tileDisabled={({ date, view }) => {
  //       if (view === "month") {
  //         return !(isAvailable(date) || isPartiallyBooked(date));
  //       }
  //       return false; // Only disable dates for 'month' view
  //     }}
  //     tileClassName={({ date, view }) => {
  //       if (view === "month") {
  //         if (isPartiallyBooked(date)) {
  //           return "partially-booked"; // Apply class for partially booked dates
  //         }
  //         if (isAvailable(date)) {
  //           return "available"; // Apply class for available dates
  //         }
  //       }
  //       return ""; // No special class for other dates
  //     }}
  //   />
  // );
};

export default MyCalendar;
