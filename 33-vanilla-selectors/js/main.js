import "../css/sakura.css";
import "../css/custom.css";

import $ from "jquery";

import { countChars, iterateNodes } from "./utils";

var CodelyBackoffice = {
  /*******************************************************************************************************************
   * Common features
   ******************************************************************************************************************/
  initCommon: function () {
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
  initForms: function () {
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
        function (json) {
          if (json && json.data) {
            for (var i = 0, len = json.data.length; i < len; i++) {
              var option = document.createElement("option");
              option.textContent = json.data[i].name;
              select.append(option);
            }
          } else {
            console.warn(
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
  initCategoryFilter: function () {
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
  initUserForm: function () {
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

    document
      .getElementById("user_form")
      .addEventListener("submit", function (ev) {
        ev.preventDefault();

        if (isFormValid()) {
          this.classList.add("hidden");
          document.getElementById("thanks").classList.remove("hidden");
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
