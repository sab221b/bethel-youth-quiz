'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Questionnaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Questionnaire.hasMany(models.ParticipantResponse, {
        foreignKey: 'questionnaire_id',
        as: 'participant_responses',
      });
    }
  };
  Questionnaire.init({
    topic: DataTypes.STRING,
    description: DataTypes.STRING,
    questions: DataTypes.STRING,
    total_score: DataTypes.INTEGER,
    closing_text: DataTypes.STRING,
    auto_presentation: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Questionnaire',
  });
  return Questionnaire;
};