'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Participant.hasMany(models.ParticipantResponse, {
        foreignKey: 'participant_id',
        as: 'participant_responses',
      });
    }
  };
  Participant.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    church: DataTypes.STRING,
    phone: DataTypes.STRING,
    preferred_language: DataTypes.STRING,
    extra_data: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Participant',
  });
  return Participant;
};