const connection = require("../db-config");
const Joi = require("joi");

class Movie {
  getAll({ color, max_duration }) {
    let sql = "SELECT * FROM movies";
    const sqlValues = [];
    if (color || max_duration) sql += " WHERE";
    if (color) {
      sql += " color = ?";
      sqlValues.push(color);
    }
    if (color && max_duration) sql += " AND";
    if (max_duration) {
      sql += " duration <= ?";
      sqlValues.push(max_duration);
    }
    console.log(sql, sqlValues);
    return connection.promise().query(sql, sqlValues);
  }

  getById(id) {
    return connection
      .promise()
      .query("SELECT * FROM movies WHERE id = ?", [id]);
  }

  validate(data, required) {
    const presence = required ? "required" : "optional";
    return Joi.object({
      title: Joi.string().max(255).presence(presence),
      director: Joi.string().max(255).presence(presence),
      year: Joi.number().integer().min(1888).presence(presence),
      color: Joi.boolean().truthy(1).falsy(0).presence(presence),
      duration: Joi.number().integer().min(1).presence(presence),
    }).validate(data, { abortEarly: false }).error;
  }

  create(data) {
    let sql = "INSERT INTO movies SET ?";
    return connection.promise().query(sql, [data]);
  }

  update(data, id) {
    return connection
      .promise()
      .query("UPDATE movies SET ? WHERE id = ?", [data, id]);
  }

  delete(id) {
    return connection.promise().query("DELETE FROM movies WHERE id = ?", [id]);
  }
}

module.exports = Movie;
