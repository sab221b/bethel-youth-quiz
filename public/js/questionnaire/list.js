function hookVuejs() {
  new Vue({
    el: "#list-questionnaire",
    data: {
      myMessage: "",
      timestamp: `Timestamp ${new Date().toLocaleString()}`,
      listData: [],
    },
    computed: {},
    filters: {
      formatDate: function (dateValue) {
        return moment(dateValue).format("Do MMM, hh:mm A");
      },
    },
    mounted: function () {
      this.getAllQuestionniare();
    },
    methods: {
      getAllQuestionniare: function () {
        var _self = this;
        axios.get("/api/questionnaire/").then(function (response) {
          response.data.map((item) => {
            item.questions = JSON.parse(item.questions);
            return item;
          });
          _self.listData = response.data;
        });
      },

      viewQuestionnaire: function (id) {
        window.location.href = '/questionnaire/' + id
      },
    },
  });
}

$(document).ready(function () {
  hookVuejs();
});
