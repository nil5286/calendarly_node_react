const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
// Instantiate express app
const app = express();

app.use(express.json()); // This middleware is essential to parse JSON bodies

// Use CORS middleware
app.use(cors());

// Define sever port
// const port = 3200;
const PORT = process.env.PORT || 3200;

// MySQL connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "calendardb",
});

// Helper function to format time to 12-hour format
const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12; // Convert 0 hours to 12
  return `${formattedHours}:${minutes}${period}`;
};

// Helper function convertToMySQLTime
const convertToMySQLTime = (time) => {
  const [timePart, period] = time.split(/(am|pm)/);
  let [hours, minutes] = timePart.split(":").map(Number);

  // Convert hours to 24-hour format
  if (period === "pm" && hours < 12) {
    hours += 12;
  } else if (period === "am" && hours === 12) {
    hours = 0;
  }

  // Format to HH:MM:SS
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:00`;
  return formattedTime;
};

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

const dbQuery = (query, params) => {
  console.log("Executing query:", query, "with params:", params);
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Create a default route.
app.get("/", (req, res) => {
  res.send("Express Server");
});

// API endpoint to fetch available dates
app.get("/api/users/:userId/available-dates", (req, res) => {
  const query = `
        SELECT 
            D.DATE, 
            D.is_fully_booked, 
            T.is_booked 
        FROM 
            Days D 
        LEFT JOIN 
            TimeSlots T ON D.day_id = T.day_id
        WHERE D.DATE >= CURDATE() 
    `;

  dbQuery(query)
    .then((results) => {
      const response = {
        available: [],
        partiallyBooked: [],
      };

      results.forEach((row) => {
        if (row.is_fully_booked) {
          // Skip fully booked days
          return;
        }

        // it reduces the date by 1 bcs toISOString() method converts the date to UTC,
        // which can lead to incorrect dates if the original date is in a different time zone (like IST in your case).
        // const formattedDate = row.DATE.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD

        const formattedDate = (date) => {
          const options = { year: "numeric", month: "2-digit", day: "2-digit" };
          const formattedDate = new Intl.DateTimeFormat(
            "en-CA",
            options
          ).format(date);
          return formattedDate;
        };

        if (row.is_booked) {
          response.partiallyBooked.push(formattedDate(row.DATE));
        } else {
          response.available.push(formattedDate(row.DATE));
        }
      });

      res.json(response);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Internal server error" });
    });
});

// API endpoint to fetch available time slots for a specific date
app.get("/api/users/:userId/timeslots", (req, res) => {
  const { date } = req.query;
  const { userId } = req.params;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  // Query to fetch available time slots for the given date
  const query = `
        SELECT start_time, end_time 
        FROM TimeSlots T 
        JOIN Days D ON T.day_id = D.day_id 
        WHERE D.DATE = ? AND T.is_booked = FALSE
    `;

  dbQuery(query, [date])
    .then((results) => {
      // Format the response
      const availableSlots = results.map((slot) => ({
        start_time: formatTime(slot.start_time),
        end_time: formatTime(slot.end_time),
      }));

      res.json({ availableSlots });
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Internal server error" });
    });
});

// Helper function to check if a time slot is available
const isTimeSlotAvailable = (selectedDate, selectedTimeslot) => {
  const query = `
        SELECT T.slot_id, T.is_booked 
        FROM TimeSlots T 
        JOIN Days D ON T.day_id = D.day_id 
        WHERE D.DATE = ? AND T.start_time = ? AND T.is_booked = FALSE
    `;
  return dbQuery(query, [selectedDate, selectedTimeslot])
    .then((results) => (results.length > 0 ? results[0] : null))
    .catch((err) => {
      console.error("Error checking availability:", err);
      throw new Error("Internal server error");
    });
};
app.post("/api/users/:userId/bookings", async (req, res) => {
  const { userId } = req.params;
  const {
    selectedDate,
    selectedTimeslot,
    bookedby_name,
    bookedby_email,
    guestEmails,
    preparation_material,
  } = req.body;

  try {
    // Step 1: Check availability
    const availableSlot = await isTimeSlotAvailable(
      selectedDate,
      convertToMySQLTime(selectedTimeslot)
    );

    if (!availableSlot) {
      return res
        .status(400)
        .json({ error: "Selected time slot is not available" });
    }

    // Step 2: Insert booking data
    const bookingData = {
      slot_id: availableSlot.slot_id,
      user_id: userId,
      bookedby_name,
      bookedby_email,
      guestEmails,
      preparation_material,
    };

    const insertBookingQuery = `
            INSERT INTO Bookings (slot_id, user_id, bookedby_name, bookedby_email, preparation_material)
            VALUES (?, ?, ?, ?, ?)
        `;

    const result = await dbQuery(insertBookingQuery, [
      bookingData.slot_id,
      bookingData.user_id,
      bookingData.bookedby_name,
      bookingData.bookedby_email,
      bookingData.preparation_material,
    ]);

    const bookingId = result.insertId;

    // Step 3: Update TimeSlots
    await dbQuery(`UPDATE TimeSlots SET is_booked = TRUE WHERE slot_id = ?`, [
      bookingData.slot_id,
    ]);

    // Update GuestEmails table
    await dbQuery(
      `INSERT INTO GuestEmails (booking_id, guest_email) VALUES (?, ?)`,
      [bookingId, bookingData.guestEmails]
    );

    // Check if all time slots for the day are booked
    const dayResults = await dbQuery(
      `
            SELECT COUNT(*) AS total_slots, SUM(T.is_booked) AS booked_slots 
            FROM TimeSlots T 
            JOIN Days D ON T.day_id = D.day_id 
            WHERE D.DATE = ?
        `,
      [selectedDate]
    );

    const { total_slots, booked_slots } = dayResults[0];

    // If all slots are booked, update Days table
    if (total_slots === booked_slots) {
      await dbQuery(`UPDATE Days SET is_fully_booked = TRUE WHERE DATE = ?`, [
        selectedDate,
      ]);
    }

    res
      .status(201)
      .json({ message: "Booking created successfully", bookingId });
  } catch (err) {
    console.error("Error processing booking:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//Test API getBookedTimes
app.get("/getBookedTimes", (req, res) => {
  console.log(req);
  res.send({ status: "ok", result: ["9:00AM"] });
});

// Start listenting to the requests on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
