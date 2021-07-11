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
            formError: {},
            questions: [],
        },
        computed: {},
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
                this.user.email = localStorage.getItem('email');
                this.user.phone = localStorage.getItem('phone');
                var user = this.user;
                if(user.id && user.language && user.church && (user.email || user.phone)) {
                    this.getQuestionsById();
                } else {
                    localStorage.clear();
                    localStorage.setItem("quizID", Number(quizID));
                    window.location.href = '/user-details';
                }
            },

            getQuestionsById: function () {
                var quizID = Number(window.location.pathname.split('/attempt/quiz/')[1]);
                var _self = this;
                axios.get("/api/questionnaire/" + quizID)
                    .then(function (response) {
                        _self.questions = JSON.parse(response.data.questions);
                        _self.showLoading = false;
                        _self.showTimer = true;
                        _self.showQuiz = false;
                    }).catch(function (err) {
                        console.log('error at fetching questions')
                    })
            },

            toggleNextBtn: function (value, field) {
                if (window.screen.width < 576) {
                    this.showNext = value;
                }
                this.formError[field] = "";
                this.$forceUpdate();
            },

            next: function (event) {
                event.preventDefault();
                var _self = this;
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
