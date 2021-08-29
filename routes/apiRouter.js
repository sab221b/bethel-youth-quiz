var express = require("express");
var router = express.Router();

const participantController = require("../controllers").participant;
const questionnaireController = require("../controllers").questionnaire;
const userResponseController = require("../controllers").userResponse;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("error", { message: "Access Restricted", error: { status: 403, stack: 'Forbidden' } });
});

/* Participant Router */
router.put("/participant/login", participantController.login);
router.get("/participant", participantController.list);
router.get("/participant/:id", participantController.getById);
router.post("/participant", participantController.add);
router.put("/participant/:id", participantController.update);
router.delete("/participant/:id", participantController.delete);

/* Questionnaire Router */
router.get("/questionnaire", questionnaireController.list);
router.get("/questionnaire/:id", questionnaireController.getById);
router.post("/questionnaire", questionnaireController.add);
router.put("/questionnaire/:id", questionnaireController.update);
router.delete("/questionnaire/:id", questionnaireController.delete);

/* Participant-Response Router */
router.get("/user-response", userResponseController.list);
router.get("/user-response/:id", userResponseController.getById);
// router.post("/user-response", userResponseController.add);
router.delete("/user-response/:id", userResponseController.delete);

module.exports = router;
