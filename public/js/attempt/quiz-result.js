function hookVuejs() {
    new Vue({
        el: "#quiz-result-page",
        data: {
            showLoading: true,
            showQuiz: false,
            showScore: false,
            message: "",
            user: {},
            quizID: '',
            questions: [],
            currentQuestion: null,
            language: '',
            currentQuestionNo: 0,
            selectedOption: '',
            totalScore: 0,
            myScore: 0,
            timeTook: 0,
            isPhone: null,
        },
        computed: {},
        filters: {
            formatDate: function (dateValue) {
                return moment(dateValue).format("Do MMM, hh:mm A");
            },
        },
        mounted: function () {
            console.log("quiz-result-page mounted");
            this.checkUser();
            window.screen.width < 576 ? this.isPhone = true : this.isPhone = false;
        },
        methods: {
            checkUser: function () {
                this.user.name = localStorage.getItem('userName');
                this.user.id = localStorage.getItem('userID');
                this.user.church = localStorage.getItem('church');
                this.user.language = localStorage.getItem('language');
                this.language = this.user.language;
                this.user.email = localStorage.getItem('email');
                this.user.phone = localStorage.getItem('phone');
                var user = this.user;
                if (user.id && user.language && user.church) {
                    this.getQuizResult();
                } else {
                    localStorage.setItem("quizID", Number(this.quizID));
                    window.location.href = '/user/signup';
                }
            },

            getQuizResult: function () {
                var _self = this;
                var pathname = window.location.pathname.split('/');
                axios.get("/api/user-response" + `?questionnaire_id=${Number(pathname[4])}&participant_id=${Number(pathname[5])}`)
                    .then(function (response) {
                        _self.questions = JSON.parse(response.data[0].responses);
                        _self.viewResult();
                        _self.myScore = response.data[0].my_score
                        _self.totalScore = response.data[0].total_score
                        _self.showLoading = false;
                        _self.showQuiz = false;
                        _self.showScore = true;
                        _self.timeTook = response.data[0].time_taken

                    }).catch(function (err) {
                        console.log('error at fetching questions')
                    })
            },

            viewResult: function() {
                this.showLoading = false;
                this.showQuiz = true;
                this.showScore = false;
                this.viewResponse();
            },

            viewResponse: function () {
                this.currentQuestionNo = 0;
                var questions = this.questions;
                this.currentQuestion = questions[this.currentQuestionNo];
                this.selectedOption = questions[this.currentQuestionNo].user_answer
            },

            prevResponse: function () {
                if (this.currentQuestionNo > 0) {
                    this.currentQuestionNo--;
                    this.currentQuestion = this.questions[this.currentQuestionNo];
                    this.selectedOption = this.questions[this.currentQuestionNo].user_answer;
                } else {
                    this.currentQuestion = null;
                    this.showLoading = false;
                    this.showQuiz = false;
                    this.showScore = true;
                }
            },
            nextResponse: function () {
                if (this.currentQuestionNo < this.questions.length - 1) {
                    this.currentQuestionNo++;
                    this.currentQuestion = this.questions[this.currentQuestionNo];
                    this.selectedOption = this.questions[this.currentQuestionNo].user_answer;
                } else {
                    this.currentQuestion = null;
                    this.showLoading = false;
                    this.showQuiz = false;
                    this.showScore = true;
                }
            },

            logout: function() {
                localStorage.clear();
                localStorage.setItem("quizID", window.location.pathname.split("/attempt/quiz/result/1/")[1]);
                window.location.href = '/user/signup';
            },
            showMessage: function (response) {
                $('#show_message').modal('show');
                $('#show_message').on('shown.bs.modal', function (e) {
                    $('#message_content').text(response.data.message);
                })
            }
        },
    });
}

$(document).ready(function () {
    hookVuejs();
});
