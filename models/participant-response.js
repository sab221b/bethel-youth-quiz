'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParticipantResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ParticipantResponse.belongsTo(models.Participant, {
        foreignKey: 'participant_id',
        as: 'participant'
      });
      ParticipantResponse.belongsTo(models.Questionnaire, {
        foreignKey: 'questionnaire_id',
        as: 'questionnaire'
      });
    }
  };
  ParticipantResponse.init({
    participant_id: DataTypes.INTEGER,
    questionnaire_id: DataTypes.INTEGER,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    language: DataTypes.STRING,
    responses: DataTypes.TEXT,
    total_score: DataTypes.INTEGER,
    my_score: DataTypes.INTEGER,
    time_taken: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'ParticipantResponse',
  });
  return ParticipantResponse;
};