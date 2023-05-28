const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb" }));

// Create MySQL connection
const connection = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12621264",
  password: "NiPhUVfpp3",
  database: "sql12621264",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to fetch user data
app.get("/api/user", (req, res) => {
  const name = req.query.name;
  // Fetch user data from MySQL
  const query = "SELECT name, image FROM user WHERE name = ?";
  connection.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error fetching user data from MySQL:", err);
      res.status(500).json({ error: "Failed to fetch user data from MySQL" });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = result[0];
    res.status(200).json({
      name: user.name,
      image: user.image,
    });
  });
});

// Route to handle form submission
app.post("/api/submit", (req, res) => {
  const { name, image } = req.body;
  // Insert data into MySQL
  const query = "INSERT INTO user (name, image) VALUES (?, ?)";
  connection.query(query, [name, image], (err, result) => {
    if (err) {
      console.error("Error inserting data into MySQL:", err);
      res.status(500).json({ error: "Failed to insert data into MySQL" });
      return;
    }
    console.log("Data inserted successfully!");
    res.status(200).json({ success: true });
  });
});

// Route to handle update request
app.put("/api/update", (req, res) => {
  // const name = req.query.name;
  const { image, name } = req.body;

  // Update data in MySQL
  const query = "UPDATE user SET image = ? WHERE name = ?";
  connection.query(query, [image, name], (err, result) => {
    if (err) {
      console.error("Error updating data in MySQL:", err);
      res.status(500).json({ error: "Failed to update data in MySQL" });
      return;
    }
    console.log("Data updated successfully!");
    res.status(200).json({ success: true });
  });
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
