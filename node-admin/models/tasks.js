'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tasks.init({
    date: DataTypes.DATE,
    userName: DataTypes.STRING,
    shipNumber: DataTypes.STRING,
    phone: DataTypes.BIGINT(11),
    price: DataTypes.FLOAT,
    number: DataTypes.INTEGER,
    status: DataTypes.STRING,
    remarks: DataTypes.STRING,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'tasks',
  });
  return tasks;
};