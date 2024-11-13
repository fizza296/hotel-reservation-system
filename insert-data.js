const connection = require('./db');

// Insert data into the 'Hotel' table
const insertHotelQuery = `
 INSERT INTO Hotels (name, formatted_address, latitude, longitude, rating, phone_number, website_url, google_maps_url, description, image_link) VALUES
('Hotel Crown Inn Karachi', '171 Frere Road, Clarke St، Passport Office، Opposite: FIA Headquarter High Court، Shahrah-e-Iraq, next to Passport Office، Saddar Artillery Maidan, Karachi, Karachi City, Sindh 74400, Pakistan', 24.8582845, 67.024148, 3.8, '+92 21 35622002', 'http://www.hotelcrowninn.com', 'https://maps.google.com/?cid=13392453923909495820', 'Casual hotel offering straightforward rooms, a restaurant & a 24-hour cafe, plus a gym.', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/231059043.jpg?k=1669280555affdc7f0deb7cad121e7bf5ee911bdf6d0d7748ea6c2eaf4c8cd89&o=&hp=1'),

('Pearl Inn Hotel', 'Dr Daud Pota Rd, Saddar Karachi, Karachi City, Sindh 74400, Pakistan', 24.8572687, 67.0317567, 4.5, '+92 333 1189937', 'https://linktr.ee/hotelpearlinn', 'https://maps.google.com/?cid=15982338462042719492', 'Laid-back hotel offering a rooftop restaurant, a cafe & a breakfast buffet, plus a prayer room.', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/541816515.jpg?k=7a7309cee757d13b94cfefb3e24c3dfe10115da2112545326790cfead730d4c8&o=&hp=1'),

('New Al Madina Hotel', 'V25J+CGH Chaudhry Street, Saddar Karachi, Karachi City, Sindh 74400, Pakistan', 24.8585706, 67.031348, 3.8, '+92 21 35620559', NULL, 'https://maps.google.com/?cid=1530306325043938796', NULL, 'https://images.trvl-media.com/lodging/103000000/102820000/102817800/102817781/a6e15e4e.jpg?impolicy=fcrop&w=469&h=201&p=1&q=medium'),

('Hotel Sarawan', 'V24J+M75, Raja Ghazanfar Ali Rd, Saddar Karachi, Karachi City, Sindh 74200, Pakistan', 24.8566326, 67.0307443, 3.5, '+92 21 35216001', NULL, 'https://maps.google.com/?cid=17807076707329205037', 'Casual rooms in an unassuming hotel featuring a cafe & a banquet hall, plus complimentary breakfast.', 'https://media-cdn.tripadvisor.com/media/photo-s/0a/aa/7a/37/hotel-sarawan.jpg'),

('Hotel Excelsior Karachi', 'Plot SB-21، Sarwar Shaheed Rd, opposite Atrium Mall، Saddar Saddar Town، Karachi, Karachi City, Sindh 75600, Pakistan', 24.8563898, 67.0298477, 4.3, '+92 21 35631751', NULL, 'https://maps.google.com/?cid=17829585103715522935', NULL, 'https://media-cdn.tripadvisor.com/media/photo-s/1d/24/9b/85/hotel-exterior.jpg'),

('Gulf Hotel', 'V25J+M6H, Dr Daud Pota Rd, Saddar Karachi, Karachi City, Sindh 74000, Pakistan', 24.8591766, 67.0305786, 3.6, '+92 21 35661235', NULL, 'https://maps.google.com/?cid=17329801973353660046', 'Straightforward property offering a lobby lounge & meeting space, plus breakfast.', 'https://i.ytimg.com/vi/2LKMRhdNXew/hqdefault.jpg'),

('Hotel Sky Towers', 'Raja Ghazanfar Ail, Khan, Road, Saddar Karachi, Karachi City, Sindh 74400, Pakistan', 24.8568117, 67.0302589, 4.1, '+92 300 2801072', NULL, 'https://maps.google.com/?cid=7131039629890740114', 'Straightforward rooms in a casual hotel offering a bakery & a 24-hour restaurant.', 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_534,q_40,w_800/hotelier-images/87/ba/41a1a33402486e96a5af28d1e1faeed706a273da56c2e55bff7b70506bdb.jpeg'),

('Hotel Al Harmain Tower', 'Raja Ghazanfar Ali Khan Road، Saddar Karachi, Karachi City, Sindh 74400, Pakistan', 24.8565915, 67.0304951, 3.8, '+92 21 35223970', 'http://www.hotelalharmaintower.com/', 'https://maps.google.com/?cid=17862236838868297331', 'Down-to-earth quarters in an unpretentious hotel offering a 24-hour restaurant/coffee shop.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/02/1d/b6/0c/hotel-al-harmain-tower.jpg?w=700&h=-1&s=1'),

('Signature By Hotel Crown Inn', 'Roof Top Hotel Crown Inn 171 Frere road, Clarke St, Shahrah-e-Iraq, Saddar Artillery Maidan, Karachi, Karachi City, Sindh 74400, Pakistan', 24.8583102, 67.0240571, 4.1, '+92 333 5622002', 'https://www.hotelcrowninn.com/', 'https://maps.google.com/?cid=2273392356957380470', NULL, 'https://c.otcdn.com/imglib/roomfotos/8/4671/signature-by-hotel-crown-inn-karachi-20240613083018043800.jpg'),

('Luxury Al Jannat Hotel', 'Suit No 41, HandiCraft Market, Abdullah Haroon Rd, Saddar City, Karachi, Karachi City, Sindh 75000, Pakistan', 24.8565023, 67.0276814, 4.1, '+92 300 8600607', NULL, 'https://maps.google.com/?cid=17834593926285739067', NULL, 'https://q-xx.bstatic.com/xdata/images/hotel/max500/486536886.jpg?k=174995e80c912d606e5768c6dc1640c3993cb35e0f0a457d0a86df48a81dddcd&o=');

`;
//insert rooms into hotels
const insertRoomQuery = `
INSERT INTO Rooms (hotel_id, room_type, is_available, amenities) VALUES
(1, 'Single', TRUE, 'WiFi, TV, AC'),
(1, 'Double', TRUE, 'WiFi, TV, AC, Mini Fridge'),
(1, 'Suite', FALSE, 'WiFi, TV, AC, Mini Fridge, Balcony'),
(1, 'Deluxe', TRUE, 'WiFi, TV, AC, Mini Fridge, View'),
(1, 'Single', TRUE, 'WiFi, TV'),
(1, 'Double', FALSE, 'WiFi, TV, AC'),
(1, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(1, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(1, 'Single', FALSE, 'WiFi'),
(1, 'Double', TRUE, 'WiFi, AC'),

-- Hotel 2
(2, 'Single', TRUE, 'WiFi, TV, AC'),
(2, 'Double', FALSE, 'WiFi, TV, AC, Mini Fridge'),
(2, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(2, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(2, 'Single', TRUE, 'WiFi, TV'),
(2, 'Double', FALSE, 'WiFi, TV, AC'),
(2, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(2, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(2, 'Single', FALSE, 'WiFi'),
(2, 'Double', TRUE, 'WiFi, AC'),

-- Hotel 3
(3, 'Single', TRUE, 'WiFi, TV, AC'),
(3, 'Double', TRUE, 'WiFi, TV, AC, Mini Fridge'),
(3, 'Suite', FALSE, 'WiFi, TV, AC, Mini Fridge, Balcony'),
(3, 'Deluxe', TRUE, 'WiFi, TV, AC, Mini Fridge, View'),
(3, 'Single', TRUE, 'WiFi, TV'),
(3, 'Double', FALSE, 'WiFi, TV, AC'),
(3, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(3, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(3, 'Single', FALSE, 'WiFi'),
(3, 'Double', TRUE, 'WiFi, AC'),

-- Hotel 4
(4, 'Single', TRUE, 'WiFi, TV, AC'),
(4, 'Double', TRUE, 'WiFi, TV, AC, Mini Fridge'),
(4, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(4, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(4, 'Single', FALSE, 'WiFi, TV'),
(4, 'Double', TRUE, 'WiFi, AC'),
(4, 'Suite', FALSE, 'WiFi, TV, AC, Balcony'),
(4, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(4, 'Single', TRUE, 'WiFi'),
(4, 'Double', FALSE, 'WiFi, TV, AC'),

-- Hotel 5
(5, 'Single', TRUE, 'WiFi, TV, AC'),
(5, 'Double', FALSE, 'WiFi, TV, AC, Mini Fridge'),
(5, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(5, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(5, 'Single', TRUE, 'WiFi, TV'),
(5, 'Double', TRUE, 'WiFi, TV, AC'),
(5, 'Suite', FALSE, 'WiFi, TV, AC, Balcony'),
(5, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(5, 'Single', TRUE, 'WiFi'),
(5, 'Double', FALSE, 'WiFi, TV, AC'),

-- Hotel 6
(6, 'Single', TRUE, 'WiFi, TV, AC'),
(6, 'Double', FALSE, 'WiFi, TV, AC, Mini Fridge'),
(6, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(6, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(6, 'Single', TRUE, 'WiFi, TV'),
(6, 'Double', TRUE, 'WiFi, TV, AC'),
(6, 'Suite', FALSE, 'WiFi, TV, AC, Balcony'),
(6, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(6, 'Single', FALSE, 'WiFi'),
(6, 'Double', TRUE, 'WiFi, AC'),

-- Hotel 7
(7, 'Single', TRUE, 'WiFi, TV, AC'),
(7, 'Double', FALSE, 'WiFi, TV, AC, Mini Fridge'),
(7, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(7, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(7, 'Single', TRUE, 'WiFi, TV'),
(7, 'Double', TRUE, 'WiFi, TV, AC'),
(7, 'Suite', FALSE, 'WiFi, TV, AC, Balcony'),
(7, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(7, 'Single', TRUE, 'WiFi'),
(7, 'Double', FALSE, 'WiFi, TV, AC'),

-- Hotel 8
(8, 'Single', TRUE, 'WiFi, TV, AC'),
(8, 'Double', FALSE, 'WiFi, TV, AC, Mini Fridge'),
(8, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(8, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(8, 'Single', TRUE, 'WiFi, TV'),
(8, 'Double', TRUE, 'WiFi, TV, AC'),
(8, 'Suite', FALSE, 'WiFi, TV, AC, Balcony'),
(8, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(8, 'Single', FALSE, 'WiFi'),
(8, 'Double', TRUE, 'WiFi, AC'),

-- Hotel 9
(9, 'Single', TRUE, 'WiFi, TV, AC'),
(9, 'Double', TRUE, 'WiFi, TV, AC, Mini Fridge'),
(9, 'Suite', FALSE, 'WiFi, TV, AC, Mini Fridge, Balcony'),
(9, 'Deluxe', TRUE, 'WiFi, TV, AC, Mini Fridge, View'),
(9, 'Single', TRUE, 'WiFi, TV'),
(9, 'Double', FALSE, 'WiFi, TV, AC'),
(9, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(9, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(9, 'Single', FALSE, 'WiFi'),
(9, 'Double', TRUE, 'WiFi, AC'),

-- Hotel 10
(10, 'Single', TRUE, 'WiFi, TV, AC'),
(10, 'Double', TRUE, 'WiFi, TV, AC, Mini Fridge'),
(10, 'Suite', FALSE, 'WiFi, TV, AC, Mini Fridge, Balcony'),
(10, 'Deluxe', TRUE, 'WiFi, TV, AC, Mini Fridge, View'),
(10, 'Single', TRUE, 'WiFi, TV'),
(10, 'Double', FALSE, 'WiFi, TV, AC'),
(10, 'Suite', TRUE, 'WiFi, TV, AC, Balcony'),
(10, 'Deluxe', TRUE, 'WiFi, TV, AC, View'),
(10, 'Single', FALSE, 'WiFi'),
(10, 'Double', TRUE, 'WiFi, AC');
`;


connection.query(insertHotelQuery, (err, results) => {
  if (err) {
    console.error('Error inserting hotels: ', err);
  } else {
    console.log('Hotels data inserted successfully');

    // Run room insertion query after hotels are inserted
    connection.query(insertRoomQuery, (err, results) => {
      if (err) {
        console.error('Error inserting rooms: ', err);
      } else {
        console.log('Rooms data inserted successfully');
      }
      // Close the connection after both inserts are completed
      connection.end();
    });
  }
});
