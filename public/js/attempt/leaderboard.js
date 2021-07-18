function hookVuejs() {
    new Vue({
        el: "#quiz-leaderboard-page",
        data: {
            message: "",
            user: {},
            quizID: '',
            QuizResponses: []
        },
        computed: {},
        filters: {
            formatDate: function (dateValue) {
                return moment(dateValue).format("Do MMM, hh:mm A");
            },
        },
        mounted: function () {
            console.log("quiz-leader-board mounted");
            this.viewLeaderBoard();
        },
        methods: {
            viewLeaderBoard: function() {
                var _self = this;
                _self.quizID = window.location.pathname.split('/')[2];
                showLoader(true);
                axios.get("/api/user-response?questionnaire_id=" + _self.quizID)
                .then(function (response) {
                    _self.QuizResponses = response.data;
                    _self.$forceUpdate();
                    showLoader(false);
                })
                .catch((err) => {
                    showLoader(false);
                    console.log('err', err);
                })
            },
        },
    });
}

$(document).ready(function () {
    hookVuejs();
});
