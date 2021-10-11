function hookVuejs() {
    new Vue({
        el: "#vue-app-upsert-questionnaire",
        data: {
            myMessage: "",
            timestamp: `Timestamp ${new Date().toLocaleString()}`,
            questionnaire: {
                topic: '',
                description: '',
                auto_presentation: true,
                questions: [],
                closing_text: '',
                showList: false,
            },
            editQId: null,
            formError: {
                questions: []
            },
            requiredFields: [
                "topic",
                "description",
                "auto_presentation",
                "questions",
                "closing_text",
            ],
        },
        computed: {},
        filters: {
            formatDate: function (dateValue) {
                return moment(dateValue).format("Do MMM, hh:mm A");
            },
        },
        mounted: function () {
            if (window.location.pathname.split('/questionnaire/edit/')[1]) {
                this.editQId = Number(window.location.pathname.split('/questionnaire/edit/')[1])
                console.log('Questionnaire-edit-mounted');
                this.getQuestionnaireById();
            } else {
                console.log('Questionnaire-create-mounted');
            }
        },
        methods: {
            addQuestion: function () {
                var question = {
                    question: {
                        tamil: "",
                        english: ""
                    },
                    showList: false,
                    list: {
                        tamil: ["", "", ""],
                        english: ["", "", ""]
                    },
                    options: {
                        tamil: ["", "", ""],
                        english: ["", "", ""]
                    },
                    answer: {
                        tamil: "",
                        english: ""
                    },
                    score: 1
                }
                this.questionnaire.questions.push(question);
                this.$forceUpdate();
            },

            getQuestionnaireById: function () {
                var _self = this;
                showLoader(true);
                axios.get("/api/questionnaire/" + _self.editQId).then(function (response) {
                    _self.questionnaire = response.data;
                    _self.questionnaire.questions = JSON.parse(response.data.questions);
                    showLoader(false);
                }).catch((err) => {
                    console.log('error fetching questionnaire', err);
                    showLoader(false);
                })
            },

            validatePayload: function (payload) {
                var _self = this;
                for (var i = 0; i < Object.keys(payload).length; i++) {
                    if (jQuery.inArray(Object.keys(payload)[i], _self.requiredFields) > -1) {
                        if (payload[Object.keys(payload)[i]] == undefined || !payload[Object.keys(payload)[i]].toString().replace(/ /g, "").length) {
                            _self.formError[Object.keys(payload)[i]] = Object.keys(payload)[i].split('_').join(' ').replace(Object.keys(payload)[i][0], Object.keys(payload)[i][0].toUpperCase()) + ' is invalid';
                        } else {
                            delete _self.formError[Object.keys(payload)[i]]
                        }
                    } else {
                        if (payload[Object.keys(payload)[i]] && payload[Object.keys(payload)[i]].toString().length && !payload[Object.keys(payload)[i]].toString().replace(/ /g, "").length) {
                            _self.formError[Object.keys(payload)[i]] = Object.keys(payload)[i].split('_').join(' ').replace(Object.keys(payload)[i][0], Object.keys(payload)[i][0].toUpperCase()) + ' is invalid';
                        }
                    }
                }

                _self.formError.questions = [];
                for (var i = 0; i < payload.questions.length; i++) {
                    if (payload.questions[i].question.english == undefined || !payload.questions[i].question.english.toString().replace(/ /g, "").length) {
                        if (!_self.formError.questions[i]) {
                            _self.formError.questions[i] = { question: { english: "invalid question" } }
                        } else {
                            _self.formError.questions[i].question['english'] = "invalid question";
                        }
                    } else {
                        delete _self.formError.questions[i].question.english;
                    }

                    if (payload.questions[i].question.tamil == undefined || !payload.questions[i].question.tamil.toString().replace(/ /g, "").length) {
                        if (!_self.formError.questions[i]) {
                            _self.formError.questions[i] = { question: { tamil: "invalid question" } }
                        } else {
                            _self.formError.questions[i].question['tamil'] = "invalid question";
                        }
                    } else {
                        delete _self.formError.questions[i].question.tamil;
                    }


                    if (payload.questions[i].answer.english == undefined || !payload.questions[i].answer.english.toString().replace(/ /g, "").length) {
                        if (!_self.formError.questions[i]) {
                            _self.formError.questions[i] = { answer: { english: "invalid answer" } }
                        } else {
                            _self.formError.questions[i].answer['english'] = "invalid answer";
                        }
                    } else {
                        delete _self.formError.questions[i].answer.english;
                    }

                    if (payload.questions[i].answer.tamil == undefined || !payload.questions[i].answer.tamil.toString().replace(/ /g, "").length) {
                        if (!_self.formError.questions[i]) {
                            _self.formError.questions[i] = { answer: { tamil: "invalid answer" } }
                        } else {
                            _self.formError.questions[i].answer['tamil'] = "invalid answer";
                        }
                    } else {
                        delete _self.formError.questions[i].answer.tamil;
                    }
                }

                _self.$forceUpdate();
                if (Object.keys(_self.formError) != 'questions' && Object.keys(_self.formError)) {
                    return false;
                } else {
                    return true;
                }
            },

            updateQuestionnaire: function (event) {
                event.preventDefault();
                var _self = this;
                var payload = _self.questionnaire;
                showLoader(true);

            },

            submitQuestionnare: function (event) {
                event.preventDefault();
                var _self = this;
                var payload = _self.questionnaire;
                // if (!_self.validatePayload(payload)) {
                //     return;
                // }
                _self.questionnaire.questions = _self.questionnaire.questions.map(function(item) {
                    if(!item.showList) {
                        delete item.list;
                    }
                    return item;
                })
                showLoader(true);
                if (_self.editQId) {
                    axios.put("/api/questionnaire/" + payload.id, payload)
                        .then(function (result) {
                            showLoader(false);
                            $('#show_message').modal('show');
                            $('#show_message').on('shown.bs.modal', function (e) {
                                $('#message_content').html("<p>Questionnaire updated successfully</p>" + "<p>link => https://bible-quiz-app.herokuapp.com/quiz/" + result.data.id + "</p>");
                            })
                        })
                        .catch(function (err) {
                            showLoader(false);
                            $('#show_message').modal('show');
                            $('#show_message').on('shown.bs.modal', function (e) {
                                $('#message_content').text("Questionnaire update failed");
                            })
                        })
                } else {
                    axios.post("/api/questionnaire/", payload)
                        .then(function (result) {
                            showLoader(false);
                            $('#show_message').modal('show');
                            $('#show_message').on('shown.bs.modal', function (e) {
                                $('#message_content').html("<p>Questionnaire created successfully</p>" + "<p>link => https://bible-quiz-app.herokuapp.com/quiz/" + result.data.id + "</p>");
                            })
                        })
                        .catch(function (err) {
                            showLoader(false);
                            $('#show_message').modal('show');
                            $('#show_message').on('shown.bs.modal', function (e) {
                                $('#message_content').text("Questionnaire creation failed");
                            })
                        })
                }
            },
        },
    });
}

$(document).ready(function () {
    hookVuejs();
});
