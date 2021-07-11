'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Participants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      church: {
        type: Sequelize.STRING
      },
      phone: {
        unique: true,
        type: Sequelize.STRING
      },
      preferred_language: {
        type: Sequelize.STRING
      },
      extra_data: {
        type: Sequelize.TEXT,
        allowNull: true,
        get: function () {
          var data = this.getDataValue('extra_data')
          if (data) {
            return JSON.parse(data)
          }
          return data
        },
        set: function (val) {
          return this.setDataValue('extra_data', JSON.stringify(val))
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Participants');
  }
};