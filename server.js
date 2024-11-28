const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Query error: ' + error.stack);
      res.status(500).send('Error retrieving patients');
      return;
    }
    res.status(200).json(results); 
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Query error: ' + error.stack);
      res.status(500).send('Error retrieving providers');
      return;
    }
    res.status(200).json(results); 
  });
});

// 3. Filter patients by First Name
app.get('/patients/first-name/:firstName', (req, res) => {
  const { firstName } = req.params;
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  connection.query(sql, [firstName], (error, results) => {
    if (error) {
      console.error('Query error: ' + error.stack);
      res.status(500).send('Error retrieving patients by first name');
      return;
    }
    res.status(200).json(results); 
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  connection.query(sql, [specialty], (error, results) => {
    if (error) {
      console.error('Query error: ' + error.stack);
      res.status(500).send('Error retrieving providers by specialty');
      return;
    }
    res.status(200).json(results); 
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is running on Port 3000');
});
