const Participant = require("../models").Participant;

module.exports = {
  list(req, res) {
    return Participant.findAll({
      where: req.query,
      include: [],
      order: [["createdAt", "DESC"]],
    })
      .then((user) => res.status(200).send(user))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return Participant.findByPk(req.params.id, {
      include: [],
      order: [["createdAt", "DESC"]],
    })
      .then((participant) => {
        if (!participant) {
          return res.status(404).send({
            message: "User Not Found",
          });
        }
        return res.status(200).send(participant);
      })
      .catch((error) => res.status(400).send(error));
  },

  async add(req, res) {
    var where = req.body.phone ? { phone: req.body.phone } : { email: req.body.email }
    Participant.findOne({
      where: where,
    })
      .then((user) => {
        if (!user) {
          return Participant.create({
            name: req.body.name,
            email: req.body.email,
            preferred_language: req.body.preferred_language,
            church: req.body.church,
            phone: req.body.phone,
          })
            .then((user) => res.status(201).send(user))
            .catch((error) => res.status(400).send(error));
        } else {
          return user.update({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            preferred_language: req.body.preferred_language,
            church: req.body.church,
          })
            .then((success) =>
              res.status(200).send(success))
            .catch((error) =>
              res.status(400).send(error));
        }
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  update(req, res) {
    return Participant.findByPk(req.params.id, {
      include: [],
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "User Not Found",
          });
        }
        return user
          .update({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            church: req.body.church,
            phone: req.body.phone,
          })
          .then(() => res.status(200).send(user))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Participant.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(400).send({
            message: "Participant Not Found",
          });
        }
        return user
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  login(req, res) {
    return Participant.findOne({
      where: req.query
    })
      .then((participant) => {
        if (!participant) {
          return res.status(404).send({
            message: "User Not Found",
          });
        } else {
          return participant
            .update({
              preferred_language: req.body.preferred_language,
            })
            .then((success) =>
              res.status(200).send(success))
            .catch((error) =>
              res.status(400).send(error));
        }
      })
      .catch((error) =>
        res.status(400).send(error));
  },
};
