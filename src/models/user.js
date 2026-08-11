'use strict';
const {
  Model
} = require('sequelize');

const  bcrypt  = require("bcrypt");
const{serverConfig } = require("../config")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100] // Minimum length of 8 characters
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(function encrypt(user) {
    // console.log("user object before encryption", user);
    const encryptedPassword = bcrypt.hashSync(user.password, +serverConfig.SALT_ROUNDS);
    // console.log("encrypted password", encryptedPassword);
    user.password = encryptedPassword;

    // console.log("user object after encryption", user);
  });
  return User;
};