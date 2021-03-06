const ParticipantResponse = require("../models").ParticipantResponse;
var moment = require('moment');

module.exports = {
    list(req, res) {
        console.log('res', res);
        return ParticipantResponse.findAll({
            where: req.query,
            include: ["participant"],
            order: [
                ['my_score', 'DESC'],
                ['time_taken', 'ASC'],
            ]
        })
            .then((userResp) => {
               return res.status(200).send(userResp);
            })
            .catch((error) => {
                res.status(400).send(error);
            });
    },

    getById(req, res) {
        return ParticipantResponse.findByPk(req.params.id, {
            include: [],
            // order: [["createdAt", "DESC"]],
        })
            .then((questionnaire) => {
                if (!questionnaire) {
                    return res.status(404).send({
                        message: "user response Not Found",
                    });
                }
                return res.status(200).send(questionnaire);
            })
            .catch((error) => res.status(400).send(error));
    },

    async add(req, res) {
        req.query = { participant_id: req.body.participant_id, questionnaire_id: req.body.questionnaire_id }
        const userResponses = await ParticipantResponse.findAll({
            where: req.query
        })
        if (userResponses.length > 0) {
            return res.status(406).send({ message: "You have already attempted this quiz, view your previous attempt" })
        }

        const questions = req.body.responses;
        let total_score = 0;
        if (questions.length) {
            total_score = questions.reduce(function (accumulator, current) {
                return accumulator + current.score;
            }, 0);
        }
        let my_score = 0;
        if (questions.length) {
            my_score = questions.reduce(function (accumulator, current) {
                if ((current.user_answer === current.answer.tamil) || current.user_answer === current.answer.english) {
                    return accumulator + current.score;
                } else {
                    return accumulator;
                }
            }, 0);
        }

        const start_time = moment(req.body.start_time);
        const end_time = moment(req.body.end_time);
        const timeTaken =  end_time.diff(start_time, "milliseconds")/1000;

        return ParticipantResponse.create({
            participant_id: req.body.participant_id,
            questionnaire_id: req.body.questionnaire_id,
            language: req.body.language,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            responses: JSON.stringify(req.body.responses),
            total_score: total_score,
            my_score: my_score,
            time_taken: timeTaken,
        })
            .then((userResp) => res.status(201).send(userResp))
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {
        return ParticipantResponse.findByPk(req.params.id)
            .then((userResp) => {
                if (!userResp) {
                    return res.status(400).send({
                        message: "ParticipantResponse Not Found",
                    });
                }
                return userResp
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
};
