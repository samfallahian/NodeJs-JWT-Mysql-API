'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {

    static associate(models) {
      // define association here
    }
  };
  users.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "This username is already taken.",
      },
      validate: {
        notNull: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notNull: {
          msg: "Please enter your email",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "USER",
    },
  }, {
    sequelize,
    modelName: 'users',
    freezeTableName: true,
  });
  return users;
};