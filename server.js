const PORT = 3001;
const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();

const notes = require("./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

function createNotes(body, notesList) {
  const note = body;

  body.id = randomIdGenerator();

  notesList.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesList, null, 2)
  );
  return note;
}

app.post("/api/notes", (req, res) => {
  const note = createNotes(req.body, notes);
  res.json(note);
});

function deleteNote(id, notesList) {
  for (let i = 0; i < notesList.length; i++) {
    let note = notesList[i];

    if (note.id == id) {
      notesList.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesList, null, 2)
      );

      break;
    }
  }
}

app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id, notes);
  res.json(true);
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

function randomIdGenerator() {
  return Math.random().toString(36).substring(7);
}
