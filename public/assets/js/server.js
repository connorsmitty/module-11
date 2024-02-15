const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route handler for GET requests to /api/notes
app.get('/api/notes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Route handler for POST requests to /api/notes
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const notes = JSON.parse(data);
    newNote.id = notes.length + 1; // Assign a new ID
    notes.push(newNote);
    fs.writeFile('db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error('Error writing to db.json:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).json(newNote);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
