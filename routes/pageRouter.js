var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/quiz/:id', function(req, res, next) {
  res.render('attempt/landing', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/user/login', function(req, res, next) {
  res.render('attempt/login', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/user/signup', function(req, res, next) {
  res.render('attempt/signup', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/attempt/quiz/:id', function(req, res, next) {
  res.render('attempt/quiz-main', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/attempt/quiz/end/:quizID/:userID', function(req, res, next) {
  res.render('attempt/quiz-end', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/attempt/quiz/result/:quizID/:userID', function(req, res, next) {
  res.render('attempt/quiz-result', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/attempt/quiz/:quizID/:userID', function(req, res, next) {
  res.render('attempt/quiz-result', { title: 'Weekly Youth Meet - Quiz session' });
});

router.get('/attempt/quiz/leaderboard', function(req, res, next) {
  res.render('attempt/leaderboard', { title: 'Weekly Youth Meet - Quiz session' });
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
