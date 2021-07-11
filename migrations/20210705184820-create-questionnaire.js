"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Questionnaires", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      topic: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      questions: {
        type: Sequelize.TEXT,
        allowNull: true,
        get: function () {
          var data = this.getDataValue("questions");
          if (data) {
            return JSON.parse(data);
          }
          return data;
        },
        set: function (val) {
          return this.setDataValue("questions", JSON.stringify(val));
        },
      },
      total_score: {
        type: Sequelize.INTEGER,
      },
      closing_text: {
        type: Sequelize.STRING,
      },
      auto_presentation: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Questionnaires");
  },
};
