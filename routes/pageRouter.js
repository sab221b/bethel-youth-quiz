var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/quiz/:id', function(req, res, next) {
  res.render('attempt/landing', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/user-details', function(req, res, next) {
  res.render('attempt/user-details', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/attempt/quiz/:id', function(req, res, next) {
  res.render('attempt/quiz-main', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/questionnaire', function(req, res, next) {
  res.render('questionnaire/list', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/questionnaire', function(req, res, next) {
  res.render('questionnaire/list', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/questionnaire/:id', function(req, res, next) {
  res.render('questionnaire/view', { title: 'Weekly Youth Meet - Quiz session' });
});

module.exports = router;
