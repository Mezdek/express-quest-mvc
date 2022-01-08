const connection = require("../db-config");
const Joi = require("joi");

class User {
  getAll({ language }) {
    let sql = "SELECT * FROM users";
    const sqlValues = [];
    if (language) {
      sql += " WHERE language = ?";
      sqlValues.push(language);
    }
    return connection.promise().query(sql, sqlValues);
  }

  getById(id) {
    return connection.promise().query("SELECT * FROM users WHERE id = ?", [id]);
  }

  validate(data, required) {
    const presence = required ? "required" : "optional";
    return Joi.object({
      email: Joi.string().email().max(255).presence(presence),
      firstname: Joi.string().max(255).presence(presence),
      lastname: Joi.string().max(255).presence(presence),
      city: Joi.string().allow(null, "").max(255),
      language: Joi.string().allow(null, "").max(255),
    }).validate(data, { abortEarly: false }).error;
  }

  emailId(email) {
    return connection
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email])
      .then(([result]) => {
        if (result[0]) return Promise.resolve(result[0].id);
        else return Promise.resolve(0);
      });
  }

  create(data) {
    let sql = "INSERT INTO users SET ?";
    return connection.promise().query(sql, [data]);
  }

  update(data, id) {
    return connection
      .promise()
      .query("UPDATE users SET ? WHERE id = ?", [data, id]);
  }

  delete(id) {
    return connection.promise().query("DELETE FROM users WHERE id = ?", [id]);
  }
}

module.exports = User;
