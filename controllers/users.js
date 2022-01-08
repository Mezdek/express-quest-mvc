const express = require("express");
const usersRouter = express.Router();
const User = require("../models/user");

usersRouter.get("/", (req, res) => {
  const { language } = req.query;
  const user = new User();
  user
    .getAll({ language })
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving users from database");
    });
});

usersRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  const user = new User();
  user
    .getById(id)
    .then(([results]) => {
      if (results.length) res.json(results[0]);
      else res.status(404).send("User not found");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving user from database");
    });
});

usersRouter.post("/", (req, res) => {
  const user = new User();
  const errors = user.validate(req.body, true);
  if (errors) {
    res.status(422).json({ "Invalid Data": errors });
  } else {
    user
      .emailId(req.body.email)
      .then((results) => {
        if (results > 0) res.status(409).send("Email already exists");
        else
          user.create(req.body).then(([results]) => {
            res.status(201).json({ id: results.insertId, ...req.body });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error creating user in database");
      });
  }
});

usersRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const user = new User();
  const errors = user.validate(req.body, false);
  if (errors) {
    res.status(422).json({ "Invalid Data": errors });
  } else {
    user
      .getById(id)
      .then(([results]) => {
        if (results.length) {
          user.emailId(req.body.email).then((results) => {
            if (results === +id) {
              user.update(req.body, id).then(() => {
                user.getById(id).then(([results]) => {
                  res.json(results[0]);
                });
              });
            } else {
              res.status(409).send("Email already exists");
            }
          });
        } else {
          res.status(404).send("User not found");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error updating user in database");
      });
  }
});

usersRouter.delete("/:id", (req, res) => {
  const id = req.params.id;
  const user = new User();
  user
    .delete(id)
    .then(([results]) => {
      if (results.affectedRows) res.status(200).send("User deleted");
      else res.status(404).send("User not found");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting user from database");
    });
});

module.exports = usersRouter;
