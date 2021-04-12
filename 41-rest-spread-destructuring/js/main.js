import "../css/sakura.css";
import "../css/custom.css";

import $ from "jquery";

import { countChars, iterateNodes, createUser } from "./utils";

var CodelyBackoffice = {
  /*******************************************************************************************************************
   * Common features
   ******************************************************************************************************************/
  initCommon() {
    /**
     * Show/hide an element based on a change in another field.
     */
    var trigger = document.querySelector(".js-trigger-container");

    trigger.addEventListener("click", function () {
      document
        .getElementById(trigger.getAttribute("rel"))
        .classList.toggle("hidden");
    });
  },
  /*******************************************************************************************************************
   * Common forms functions
   ******************************************************************************************************************/
  initForms() {
    /**
     * Count character in selected fields
     */
    var contentCounters = document.querySelectorAll(".js-count-content");

    iterateNodes(contentCounters, function (counter) {
      var form_field = counter.parentElement.querySelector(".js-form-control");
      var char_counter_container = counter.querySelector(".js-count-chars");

      char_counter_container.innerHTML = countChars(form_field.value);

      form_field.addEventListener("keyup", function () {
        char_counter_container.innerHTML = countChars(form_field.value);
      });
    });

    /**
     * Load select data
     */
    var dataLoaders = document.querySelectorAll(".js-load-data");

    iterateNodes(dataLoaders, function (select) {
      // eslint-disable-next-line jquery/no-ajax
      $.getJSON(
        "http://" +
          ("localhost" == document.domain
            ? "localhost:8080"
            : document.domain) +
          "/data/" +
          select.getAttribute("data-type") +
          ".json",
        function ({ data }) {
          if (data) {
            for (var i = 0, len = data.length; i < len; i++) {
              var option = document.createElement("option");
              option.textContent = data[i].name;
              select.append(option);
            }
          } else {
            console.error(
              "Could not find" + select.getAttribute("data-type") + ".json"
            );
          }
        }
      );
    });
  },
  /*******************************************************************************************************************
   * Filter courses by category
   ******************************************************************************************************************/
  initCategoryFilter() {
    var filter = document.getElementById("category");

    filter.addEventListener("change", function () {
      var category = this.value;

      var elementsToFilter = document.querySelectorAll(".js-filtered-item");

      iterateNodes(elementsToFilter, function (element) {
        if (category && category !== element.getAttribute("data-category")) {
          element.classList.add("hidden");
        } else {
          element.classList.remove("hidden");
        }
      });
    });
  },
  /*******************************************************************************************************************
   * Create user form
   ******************************************************************************************************************/
  initUserForm() {
    function validateRequiredField(field) {
      var isValid = !!field.value;

      if (!isValid) {
        field.classList.add("error");
      }
      return isValid;
    }

    function validateEmail() {
      var field = document.getElementById("email");
      var isValid = new RegExp(
        "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
      ).test(field.value);

      if (!isValid) {
        field.classList.add("error");
      }
      return isValid;
    }

    function validateDob() {
      var field = document.getElementById("dob");
      var date = +new Date(field.value);
      var now = +new Date();
      var isValid = Math.abs(new Date(now - date).getUTCFullYear() - 1970) > 18;

      if (!isValid) {
        field.classList.add("error");
      }
      return isValid;
    }

    function validateBio() {
      var field = document.getElementById("bio");
      var fieldLength = field.value.length;
      var isValid = fieldLength > 0 && field.value.length <= 200;

      if (!isValid) {
        field.classList.add("error");
      }
      return isValid;
    }

    function isFormValid() {
      document.getElementById("user_form_error").classList.add("hidden");

      var formControls = document.querySelectorAll(".js-form-control");

      iterateNodes(formControls, function (control) {
        control.classList.remove("error");
      });

      var isValid =
        validateRequiredField(document.getElementById("first_name")) &&
        validateRequiredField(document.getElementById("last_name")) &&
        validateEmail() &&
        validateDob() &&
        validateRequiredField(document.getElementById("country")) &&
        validateBio();

      if (!isValid) {
        document.getElementById("user_form_error").classList.remove("hidden");
      }

      return isValid;
    }

    function handleFormSuccess(form, newUser) {
      var thanksBlock = document.getElementById("thanks");
      var title = thanksBlock.querySelector("h3");
      var content = thanksBlock.querySelector("p");

      title.innerHTML = "Thank you " + newUser.firstName + " for registering!";
      content.innerHTML =
        "We have sent a confirmation email to " + newUser.email;

      form.classList.add("hidden");
      thanksBlock.classList.remove("hidden");
    }

    function handleFormError() {
      document.getElementById("network_form_error").classList.remove("hidden");
    }

    document
      .getElementById("user_form")
      .addEventListener("submit", function (ev) {
        ev.preventDefault();
        var form = ev.target;

        if (isFormValid()) {
          createUser(form, function ({ success, data: newUser }) {
            if (!success) {
              handleFormError();
              return;
            }

            handleFormSuccess(form, newUser);
          });
        }
      });
  },
};

/**
 * Init functions
 */
window.addEventListener("DOMContentLoaded", () => {
  CodelyBackoffice.initCommon();

  if (document.getElementById("category")) {
    CodelyBackoffice.initCategoryFilter();
  }
  if (document.querySelector("form")) {
    CodelyBackoffice.initForms();
  }
  if (document.getElementById("user_form")) {
    CodelyBackoffice.initUserForm();
  }
});
