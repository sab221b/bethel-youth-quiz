'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('ParticipantResponses', 'time_taken', { type: Sequelize.DECIMAL }),
  ],

  down: async queryInterface => [
    await queryInterface.removeColumn('ParticipantResponses', 'time_taken'),
  ],
};
