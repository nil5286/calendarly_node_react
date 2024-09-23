import React, { useState } from "react";

const EventDetailsForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    bookedby_name: "",
    bookedby_email: "",
    guestEmails: "",
    preparation_material: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="col-span-2">
      {/* <div class="bg-gray-100 flex items-center justify-center min-h-screen"> */}
      {/* <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"> */}
      <div className="bg-gray-100 p-3 rounded-lg shadow-inner">
        <div class="min-h-0">
          <h1 className="text-2xl font-bold mb-6 text-left">Enter Details</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="bookedby_name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                name="bookedby_email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="name"
              >
                Guest Email(s)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="guestEmails"
                placeholder="Guest Emails (comma separated)"
                value={formData.guestEmails}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="details"
              >
                Please share anything that will help prepare for our event
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="preparation_material"
                placeholder="Preparation Material"
                value={formData.preparation_material}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-left">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsForm;
