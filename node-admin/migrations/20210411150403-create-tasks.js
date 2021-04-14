'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      userName: {
        type: Sequelize.STRING
      },
      shipNumber: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.BIGINT(11)
      },
      price: {
        type: Sequelize.FLOAT
      },
      number: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      remarks: {
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tasks');
   
  }
};