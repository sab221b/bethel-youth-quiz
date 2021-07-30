function hookVuejs() {
    new Vue({
      el: "#user-login-page",
      data: {
        message: "",
        showNext: true,
        user: {
          phone_email: "",
          preferred_language: "",
        },
        requiredFields: [
          "phone_email",
          "preferred_language",
        ],
        formError: {},
      },
      computed: {},
      filters: {
        formatDate: function (dateValue) {
          return moment(dateValue).format("Do MMM, hh:mm A");
        },
      },
      mounted: function () {
        console.log("user-details-page mounted");
      },
      methods: {
        toggleNextBtn: function (value, field) {
          if (window.screen.width < 576) {
            this.showNext = value;
          }
          this.formError[field] = "";
          this.$forceUpdate();
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
          var mailformat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
          if (payload.phone_email.length) {
            if (!isNaN(payload.phone_email)) {
              if (payload.phone_email.length > 9 && payload.phone_email.length < 13) {
                delete _self.formError.phone_email;
              } else {
                _self.formError.phone_email = 'phone number is invalid';
              }
            } else if (payload.phone_email.match(mailformat)) {
              delete _self.formError.phone_email;
            } else {
              _self.formError.phone_email = 'Email is invalid';
            }
          } else {
            _self.formError.phone_email = 'Email or phone is required'
          }
          _self.$forceUpdate();
          if (Object.keys(_self.formError).length) {
            return false;
          } else {
            return true;
          }
        },
  
        next: function (event) {
          event.preventDefault();
          var _self = this;
          var payload = _self.user;
          if (!_self.validatePayload(payload)) {
            return;
          }
          showLoader(true);
          if (isNaN(payload.phone_email)) {
            payload.email = payload.phone_email;
          } else {
            payload.phone = payload.phone_email;
          }
          delete payload.phone_email;
          _self.payload = payload;
          axios.put("/api/participant/login" + '?' + Object.keys(_self.payload)[1] + '=' + Object.values(_self.payload)[1], payload)
            .then(function (response) {
             showLoader(false);
             if(response.data) {
                console.log('user-login-success', response.data)
                var user = response.data;
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userID', user.id);
                localStorage.setItem('church', user.church);
                localStorage.setItem('language', user.preferred_language);
                if(_self.payload.email) {
                  localStorage.setItem('email', user.email);
                } else {
                  localStorage.setItem('phone', user.phone);
                }
                var quizID = Number(localStorage.getItem('quizID'));
                window.location.href = '/attempt/quiz/' + quizID;
             } else {
              _self.formError.phone_email = "User not found";
              _self.$forceUpdate();
              _self.showMessage(err.response.data.message)
                 return;
             }
            })
            .catch(function (err) {
              showLoader(false);
              _self.formError.phone_email = "User not found";
              _self.$forceUpdate();
              _self.showMessage(err.response.data.message)
              console.log('error occured creating user', err)
            });
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
  