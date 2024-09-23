import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Calendar from "./MyCalendar";
import TimeslotList from "./TimeslotList";
import EventDetailsForm from "./EventDetailsForm";
import axiosInstance from "./axios";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const App = () => {
  // Extract `userId` from the URL
  const { userId } = useParams();
  const [availableDates, setAvailableDates] = useState([]);
  const [partiallyBookedDates, setPartiallyBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  // State to keep track of the currently clicked button
  const [activeIndex, setActiveIndex] = useState(null);

  // Fetch available dates for User B (userId) when the app mounts
  useEffect(() => {
    const userId = 1; // Example user ID
    axiosInstance
      .get(`/api/users/${userId}/available-dates`)
      .then((response) => {
        const { available, partiallyBooked } = response.data;
        setAvailableDates(available); // Dates with available time slots
        setPartiallyBookedDates(partiallyBooked); // Dates with partial bookings
      });
  }, []);

  // Fetch available timeslots for a specific date
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    axiosInstance
      .get(`/api/users/${userId}/timeslots?date=${date}`)
      .then((response) => {
        setActiveIndex(null);
        setTimeslots(response.data.availableSlots);
      });
  };

  // Handle form submission for event booking
  const handleBookingSubmit = (formData) => {
    const bookingData = {
      ...formData,
      selectedDate: selectedDate,
      selectedTimeslot: selectedTimeslot,
      user_id: userId,
    };

    axiosInstance
      .post(`/api/users/${userId}/bookings`, bookingData)
      .then((response) => {
        setBookingConfirmed(true);
      });
  };

  const handleBackButton = () => {
    setSelectedTimeslot(null);
    setSelectedDate(null);
  };

  return (
    <div>
      {!bookingConfirmed ? (
        <div>
          <div>
            <div className="App bg-gray-100 min-h-screen flex justify-center items-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                {selectedTimeslot && (
                  <div className="flex items-center mb-4">
                    <button
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      onClick={handleBackButton}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                      </svg>
                    </button>
                    <h1 className="text-2xl font-semibold ml-3 w-full"></h1>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Column 1: Meeting Information */}
                  <div className="col-span-1">
                    <div className="bg-gray-100 p-3 rounded-lg shadow-inner text-left">
                      <img
                        className="w-14 h-14 rounded-full mb-4"
                        src="https://via.placeholder.com/150"
                        alt="Avatar"
                      />
                      <h2 className="text-xl font-bold mb-2">Nilesh Lulla</h2>
                      <h1 className="text-2xl font-bold mb-2 text-left">
                        30 Minute Meeting
                      </h1>
                      {/* <h2 className="text-xl font-semibold mb-2">
                        Technical Discussion
                      </h2> */}
                      <div className="flex items-start mb-2">
                        <span className="material-icons mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </span>
                        <p className="text-gray-600">30 mins</p>
                      </div>
                      {selectedTimeslot && (
                        <div className="flex items-center mb-2">
                          <span className="material-icons mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                              />
                            </svg>
                          </span>
                          <p className="text-gray-600">
                            {selectedDate} {selectedTimeslot}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="material-icons mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                          </svg>
                        </span>
                        <p className="text-gray-600">Office</p>
                      </div>
                    </div>
                  </div>
                  {/* Column 2: Calendar */}
                  {!selectedTimeslot && (
                    <div className="col-span-1">
                      <div className="bg-gray-100 p-3 rounded-lg shadow-inner">
                        <h3 className="text-lg font-medium mb-4">
                          Select a Date
                        </h3>
                        <Calendar
                          availableDates={availableDates}
                          partiallyBookedDates={partiallyBookedDates}
                          onDateSelect={handleDateSelect}
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          Time zone: India Standard Time
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Column 3: Time Slots */}
                  {selectedDate && !selectedTimeslot && (
                    <TimeslotList
                      selectedDate={selectedDate}
                      timeslots={timeslots}
                      onTimeslotSelect={setSelectedTimeslot}
                      activeIndex={activeIndex}
                      setActiveIndex={setActiveIndex}
                    />
                  )}
                  {selectedTimeslot && (
                    <EventDetailsForm onSubmit={handleBookingSubmit} />
                  )}
                </div>
              </div>

              {/* <p className="mt-4 text-center">Selected Date: {date.toDateString()}</p> */}
            </div>
          </div>
        </div>
      ) : (
        <div>Booking Confirmed!</div>
      )}
    </div>
  );
};

export default App;
