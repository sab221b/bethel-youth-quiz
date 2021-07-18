function hookVuejs() {
    new Vue({
        el: "#quiz-main-page",
        data: {
            showLoading: true,
            showTimer: false,
            showQuiz: false,
            message: "",
            showNext: true,
            user: {},
            quizID: '',
            formError: {},
            questions: [],
            currentQuestion: null,
            language: '',
            currentTimer: 19,
            currentQuestionNo: 0,
            selectedOption: '',
            activeTimer: 'quiz_timer',
            start_time: new Date(),
            end_time: new Date()
        },
        computed: {
            getCurrentTimer: function() {
                return this.currentTimer;
            }
        },
        filters: {
            formatDate: function (dateValue) {
                return moment(dateValue).format("Do MMM, hh:mm A");
            },
        },
        mounted: function () {
            console.log("quiz-main-page mounted");
            this.checkUser();
        },
        methods: {
            checkUser: function () {
                this.user.id = localStorage.getItem('userID');
                this.user.church = localStorage.getItem('church');
                this.user.language = localStorage.getItem('language');
                this.language = this.user.language;
                this.user.email = localStorage.getItem('email');
                this.user.phone = localStorage.getItem('phone');
                var user = this.user;
                if (user.id && user.language && user.church && (user.email || user.phone)) {
                    this.getQuestionsById();
                } else {
                    localStorage.clear();
                    localStorage.setItem("quizID", window.location.pathname.split("/attempt/quiz/")[1]);
                    window.location.href = '/user/signup';
                }
            },

            getQuestionsById: function () {
                this.quizID = Number(window.location.pathname.split('/attempt/quiz/')[1]);
                var _self = this;
                axios.get("/api/questionnaire/" + this.quizID)
                    .then(function (response) {
                        _self.questions = JSON.parse(response.data.questions);
                        _self.showLoading = false;
                        _self.showTimer = true;
                        _self.showQuiz = false;
                        setTimeout(function () {
                            _self.showLoading = false;
                            _self.showTimer = false;
                            _self.showQuiz = true;
                            if (_self.questions.length) {
                                _self.startQuiz();
                            } else {

                            }
                        }, 2800)
                    }).catch(function (err) {
                        console.log('error at fetching questions')
                    })
            },

            startQuiz: function () {
                var questions = this.questions;
                this.currentQuestion = questions[this.currentQuestionNo];
                this.startTimer();
            },

            startTimer: function () {
                var _self = this;
                var startSec = 0;
                _self.start_time = new Date().toISOString();
                _self.activeTimer = setInterval(function () {
                    if (startSec < 20) {
                        console.log('seconds-left', 19 - startSec);
                        _self.currentTimer = 19 - startSec;
                        startSec++;
                        _self.$forceUpdate();
                    } else {
                        clearInterval(_self.activeTimer);
                        _self.nextQuestion();
                    }
                }, 1000);
            },

            nextQuestion: function () {
                clearInterval(this.activeTimer);
                if (this.currentQuestionNo < this.questions.length - 1) {
                    this.currentQuestionNo++;
                    this.currentQuestion = this.questions[this.currentQuestionNo];
                    this.startTimer();
                } else {
                    this.end_time = new Date().toISOString();
                    this.submitQuiz();
                }
            },

            selectAnswer: function(radioClass) {
                var _self = this;
              setTimeout(function() {
                _self.currentQuestion['user_answer'] = _self.selectedOption;
                _self.selectedOption = ''
                $('#' + radioClass).prop('checked', false);
                _self.nextQuestion();
              }, 500)
            },

            submitQuiz: function () {
                var _self = this;
                showLoader(true);
                var payload = {
                    participant_id: Number(this.user.id),
                    questionnaire_id: Number(this.quizID),
                    language: this.language,
                    start_time: this.start_time,
                    end_time: this.end_time,
                    responses: this.questions,
                }
                axios.post("/api/user-response/", payload)
                .then(function (res) {
                    showLoader(false);
                    window.location.href ='/attempt/quiz/end/' + _self.quizID + '/' + _self.user.id;
                })
                .catch(function (err) {
                    showLoader(false);
                    _self.showMessage(err.response.data.message);
                    setTimeout(() => {
                        window.location.href ='/attempt/quiz/end/' + _self.quizID + '/' + _self.user.id;
                    }, 3000);
                })
            },

            showMessage: function (message) {
                $('#show_message').modal('show');
                $('#show_message').on('shown.bs.modal', function (e) {
                    $('#message_content').text(message);
                })
            }
        },
    });
}

$(document).ready(function () {
    hookVuejs();
});
