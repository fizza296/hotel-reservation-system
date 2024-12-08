const connection = require('./db');

// Queries for creating tables
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

const createHotelsTable = `
  CREATE TABLE IF NOT EXISTS Hotels (
    hotel_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    formatted_address VARCHAR(255),
    area VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    rating FLOAT CHECK (rating BETWEEN 0 AND 5),
    phone_number VARCHAR(15),
    website_url VARCHAR(255),
    google_maps_url VARCHAR(255),
    description TEXT,
    image_link varchar(255)
  );
`;

const createRoomsTable = `
  CREATE TABLE IF NOT EXISTS Rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    amenities VARCHAR(255),
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id) ON DELETE CASCADE
  );
`;

const createBookingsTable = `
  CREATE TABLE IF NOT EXISTS Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Confirmed', 'Cancelled', 'Modified')) DEFAULT 'Confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    special_requests TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id),
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id)
  );
`;

const createReviewsTable = `
  CREATE TABLE IF NOT EXISTS Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id)
  );
`;

const createReceiptsTable = `
  CREATE TABLE IF NOT EXISTS Receipts (
    receipt_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    receipt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
  );
`;



// Trigger to validate booking dates
const createValidateBookingDatesTrigger = `
  DELIMITER //
  CREATE TRIGGER validate_booking_dates
  BEFORE INSERT ON Bookings
  FOR EACH ROW
  BEGIN
    DECLARE conflicting_count INT;

    IF NEW.check_out_date <= NEW.check_in_date THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Check-out date must be after check-in date.';
    END IF;

    SELECT COUNT(*) INTO conflicting_count
    FROM Bookings
    WHERE room_id = NEW.room_id
      AND status = 'Confirmed'
      AND ((NEW.check_in_date BETWEEN check_in_date AND check_out_date - INTERVAL 1 DAY)
           OR (NEW.check_out_date BETWEEN check_in_date + INTERVAL 1 DAY AND check_out_date)
           OR (check_in_date BETWEEN NEW.check_in_date AND NEW.check_out_date - INTERVAL 1 DAY));

    IF conflicting_count > 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'This room is already booked for the selected dates.';
    END IF;
  END;
  //
  DELIMITER ;
`;

// Procedure to update room availability based on booking status
const createUpdateRoomAvailabilityProcedure = `
  DELIMITER //
  CREATE PROCEDURE update_room_availability (IN bookingRoomId INT, IN bookingStatus VARCHAR(20))
  BEGIN
    IF bookingStatus = 'Confirmed' THEN
      UPDATE Rooms SET is_available = FALSE WHERE room_id = bookingRoomId;
    ELSEIF bookingStatus = 'Cancelled' THEN
      UPDATE Rooms SET is_available = TRUE WHERE room_id = bookingRoomId;
    END IF;
  END;
  //
  DELIMITER ;
`;

// Trigger to call procedure after booking insert or update
const createAfterBookingTriggers = `
  DELIMITER //
  CREATE TRIGGER after_booking_update
  AFTER UPDATE ON Bookings
  FOR EACH ROW
  BEGIN
    CALL update_room_availability(NEW.room_id, NEW.status);
  END;

  CREATE TRIGGER after_booking_insert
  AFTER INSERT ON Bookings
  FOR EACH ROW
  BEGIN
    CALL update_room_availability(NEW.room_id, NEW.status);
  END;
  //
  DELIMITER ;
`;

// Stored procedure to update room availability after checkout
const createUpdateRoomAvailabilityAfterCheckoutProcedure = `
  DELIMITER //

  CREATE PROCEDURE update_room_availability_after_checkout()
  BEGIN
      UPDATE Rooms r
      INNER JOIN Bookings b ON r.room_id = b.room_id
      SET r.is_available = TRUE
      WHERE b.check_out_date < CURDATE() AND b.status = 'Confirmed';
  END;
  //

  DELIMITER ;
`;

// Event to run the stored procedure daily
const createDailyRoomAvailabilityUpdateEvent = `
  SET GLOBAL event_scheduler = ON;

  CREATE EVENT IF NOT EXISTS daily_room_availability_update
  ON SCHEDULE EVERY 1 DAY
  STARTS CURRENT_DATE + INTERVAL 1 DAY
  DO
  CALL update_room_availability_after_checkout();
`;


const prevent_past_check_in_date_on_insert = `
CREATE TRIGGER prevent_past_check_in_date_on_insert
BEFORE INSERT ON Bookings
FOR EACH ROW
BEGIN
    -- Check if the new check_in_date is before the current date
    IF NEW.check_in_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Check-in date cannot be in the past.';
    END IF;
END;
`;

const prevent_past_check_in_date = `
CREATE TRIGGER prevent_past_check_in_date
BEFORE UPDATE ON Bookings
FOR EACH ROW
BEGIN
    -- Check if the new check_in_date is before the current date
    IF NEW.check_in_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Check-in date cannot be in the past.';
    END IF;
END;
//
`;





connection.query(createUsersTable, 'Users table');
connection.query(createHotelsTable, 'Hotels table');
connection.query(createRoomsTable, 'Rooms table');
connection.query(createBookingsTable, 'Bookings table');
connection.query(createReviewsTable, 'Reviews table');
connection.query(createReceiptsTable, 'Receipts table');

connection.query(createValidateBookingDatesTrigger, 'Validate booking dates trigger');
connection.query(createUpdateRoomAvailabilityProcedure, 'Update room availability procedure');
connection.query(createAfterBookingTriggers, 'After booking insert/update triggers');

// Close connection after all queries are executed
connection.end(); 


