const notes = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json')
    .then((notes) => {
      let parsedNotes = [];
      try {
        parsedNotes = [].concat(JSON.parse(notes))
      } catch {
        parsedNotes = []
      } 
      return parsedNotes
    })
    .then((data) => res.json(data)).catch((err) => console.log(err))
});

// POST Route for a new note
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, body } = req.body;

  if (req.body) {
    const newNote = {
      title,
      body,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Not added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

notes.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  readFromFile('./db/db.json')
    .then((notes) => {
      let parsedNotes = [];
      try {
        parsedNotes = [].concat(JSON.parse(notes))
      } catch {
        parsedNotes = []
      } 
      return parsedNotes
    })
    .then((data) => {
      const filteredNotes = data.filter(note => {
      return note.id !== req.params.id
      });
      writeToFile('./db/db.json', filteredNotes);
      res.end();
    }).catch((err) => console.log(err))
});

module.exports = notes;
