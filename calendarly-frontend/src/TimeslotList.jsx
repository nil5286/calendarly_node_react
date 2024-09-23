import React, { useState } from "react";

const TimeslotList = ({
  selectedDate,
  timeslots,
  onTimeslotSelect,
  activeIndex,
  setActiveIndex,
}) => {
  // Helper function
  const convertDateToLongForm = (originaldate) => {
    const date = new Date(originaldate);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date
      .toLocaleDateString("en-US", options)
      .replace(/(\d+)(th|st|nd|rd)/, "$1");

    return formattedDate; // Output: "Friday, September 27"
  };

  const convertedSelectedDate = convertDateToLongForm(selectedDate);

  return (
    <div className="col-span-1">
      <div className="bg-gray-100 p-3 rounded-lg shadow-inner">
        <h3 className="text-base font-medium mb-4">{convertedSelectedDate}</h3>
        <div className="grid grid-cols-1 gap-2">
          {timeslots.map((slot, i) => (
            <div key={i}>
              {!activeIndex || activeIndex !== slot.start_time ? (
                <button
                  className=" bg-white w-full py-2 border rounded-lg text-blue-600 font-semibold hover:border-blue-800"
                  key={i}
                  onClick={() => setActiveIndex(slot.start_time)}
                  // className="bg-blue-500 m-2 p-2 rounded"
                >
                  {slot.start_time}
                </button>
              ) : (
                activeIndex &&
                activeIndex === slot.start_time && (
                  <div className="bg-white w-full py-2 border rounded-lg flex px-4 justify-between items-center hover:border-blue-800">
                    <div className="bg-gray-600 py-2 px-4 rounded-lg mr-4 w-full text-white font-medium">
                      {slot.start_time}
                    </div>
                    <button
                      className="bg-blue-500 py-2 px-4 rounded-lg w-full text-white hover:bg-blue-600"
                      key={i}
                      onClick={() => onTimeslotSelect(slot.start_time)}
                    >
                      Next
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeslotList;
