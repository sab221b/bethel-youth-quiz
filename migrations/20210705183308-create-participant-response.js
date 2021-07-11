'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ParticipantResponses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      participant_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      questionnaire_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      start_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      end_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      language: {
        allowNull: false,
        type: Sequelize.STRING
      },
      responses: {
        type: Sequelize.TEXT
      },
      total_score: {
        type: Sequelize.INTEGER
      },
      my_score: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('ParticipantResponses');
  }
};