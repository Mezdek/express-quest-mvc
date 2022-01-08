const express = require("express");
const moviesRouter = express.Router();
const Movie = require("../models/movie");

moviesRouter.get("/", (req, res) => {
  const { color, max_duration } = req.query;
  const movie = new Movie();
  movie
    .getAll({ color, max_duration })
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      res.status(500).send("Error retrieving movies from database");
    });
});

moviesRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  const movie = new Movie();
  movie
    .getById(id)
    .then(([results]) => {
      if (results.length) res.json(results[0]);
      else res.status(404).send("Movie not found");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving movie from database");
    });
});

moviesRouter.post("/", (req, res) => {
  const movie = new Movie();
  const errors = movie.validate(req.body, true);
  console.log(errors);
  if (errors) {
    res.status(422).json({ "Invalid Data": errors });
  } else {
    movie
      .create(req.body)
      .then(([results]) => {
        res.status(201).json({ id: results.insertId, ...req.body });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error creating movie in database");
      });
  }
});

moviesRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const movie = new Movie();
  const errors = movie.validate(req.body, false);
  if (errors) {
    res.status(422).json({ "Invalid Data": errors });
  } else {
    movie
      .update(req.body, id)
      .then(([results]) => {
        if (results.affectedRows) {
          movie.getById(id).then(([results]) => {
            res.json(results[0]);
          });
        } else {
          res.status(404).send("Movie not found");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error updating movie in database");
      });
  }
});

moviesRouter.delete("/:id", (req, res) => {
  const id = req.params.id;
  const movie = new Movie();
  movie
    .delete(id)
    .then(([results]) => {
      if (results.affectedRows) res.status(200).send("Movie deleted");
      else res.status(404).send("Movie not found");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting movie from database");
    });
});

module.exports = moviesRouter;
