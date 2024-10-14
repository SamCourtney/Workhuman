const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
// Importing  express framework, sql libary

const app = express();
const PORT = 3000; // State the port in which this will run

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));


// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'countries' 
    // Information about my database in order to access it
});

// Connect to database and error check
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Form submission
app.post('/check-country', (req, res) => {
    const userInput = req.body.userInput;
    console.log(`User input: ${userInput}`); // Log user input

    
    
    // Check full and partial user input ie den in Sweden
    const query = `
        SELECT * FROM country_table 
        WHERE LOWER(name) LIKE LOWER(?) OR LOWER(name) = LOWER(?)
    `;

    // Execute query
    db.query(query, [`%${userInput}%`, userInput], (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).send('Internal server error');
        }

        console.log('Query results:', results); // Log query results

        // Check if there are any matches
        if (results.length > 0) {
            const countries = results.map(row => row.Name).join(', '); // Return matches seperated by a ','
            res.send(`Country matches: ${countries}`);
        } else {
            res.send(`No countries match your search for "${userInput}".`);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});