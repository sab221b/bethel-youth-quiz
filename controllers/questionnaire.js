const Questionnaire = require("../models").Questionnaire;

module.exports = {
  list(req, res) {
    return Questionnaire.findAll({
      include: [],
      order: [["createdAt", "DESC"]],
    })
      .then((user) => res.status(200).send(user))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return Questionnaire.findByPk(req.params.id, {
      include: [],
      order: [["createdAt", "DESC"]],
    })
      .then((questionnaire) => {
        if (!questionnaire) {
          return res.status(404).send({
            message: "User Not Found",
          });
        }
        return res.status(200).send(questionnaire);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    const questions = req.body.questions;
    let total_score = 0;
    if(questions.length) {
       total_score = questions.reduce(function (accumulator, current) {
        return accumulator + current.score;
    }, 0);
    }
    return Questionnaire.create({
      topic: req.body.topic,
      description: req.body.description,
      questions: JSON.stringify(req.body.questions),
      total_score: total_score,
      closing_text: req.body.closing_text,
      auto_presentation: req.body.auto_presentation || true,
    })
      .then((questionnaire) => res.status(201).send(questionnaire))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Questionnaire.findByPk(req.params.id, {
      include: [],
    })
      .then((questionnaire) => {
        if (!questionnaire) {
          return res.status(404).send({
            message: "User Not Found",
          });
        }
        return questionnaire
          .update({
            topic: req.body.topic,
            description: req.body.description,
            questions: req.body.questions,
            total_score: req.body.total_score,
            closing_text: req.body.closing_text,
            auto_presentation: req.body.auto_presentation || true,
          })
          .then(() => res.status(200).send(questionnaire))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Questionnaire.findByPk(req.params.id)
      .then((questionnaire) => {
        if (!questionnaire) {
          return res.status(400).send({
            message: "Questionnaire Not Found",
          });
        }
        return questionnaire
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
