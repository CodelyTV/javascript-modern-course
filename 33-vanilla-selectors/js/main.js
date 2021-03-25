import "../css/sakura.css";
import "../css/custom.css";

import $ from "jquery";

import { countChars } from "./utils";

var CodelyBackoffice = {
  /*******************************************************************************************************************
   * Common features
   ******************************************************************************************************************/
  initCommon: function () {
    /**
     * Show/hide an element based on a change in another field.
     */
    $(".js-trigger-container").on("click", function () {
      $("#" + $(this).attr("rel")).toggle(500);
    });
  },
  /*******************************************************************************************************************
   * Common forms functions
   ******************************************************************************************************************/
  initForms: function () {
    /**
     * Count character in selected fields
     */
    $(".js-count-content").each(function () {
      var form_field = $(this).parent().find(".js-form-control");
      var char_counter_container = $(".js-count-chars", this);

      char_counter_container.html(countChars(form_field.val()));

      form_field.on("keyup", function () {
        char_counter_container.html(countChars(form_field.val()));
      });
    });

    /**
     * Load select data
     */
    $(".js-load-data").each(function () {
      var select = $(this);

      $.getJSON(
        "http://" +
          ("localhost" == document.domain
            ? "localhost:8080"
            : document.domain) +
          "/data/" +
          $(this).attr("data-type") +
          ".json",
        function (json) {
          if (json && json.data) {
            for (var i = 0, len = json.data.length; i < len; i++) {
              select.append($("<option></option>").text(json.data[i].name));
            }
          } else {
            console.warn(
              "Could not find" + $(this).attr("data-type") + ".json"
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
    var filter = $("#category");

    filter.on("change", function () {
      var category = $(this).val();

      $(".js-filtered-item").each(function () {
        if (category && category !== $(this).attr("data-category")) {
          $(this).addClass("hidden");
        } else {
          $(this).removeClass("hidden");
        }
      });
    });
  },
  /*******************************************************************************************************************
   * Create user form
   ******************************************************************************************************************/
  initUserForm: function () {
    function validateRequiredField(field) {
      var isValid = !!field.val();

      if (!isValid) {
        field.addClass("error");
      }
      return isValid;
    }

    function validateEmail() {
      var field = $("#email");
      var isValid = new RegExp(
        "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
      ).test(field.val());

      if (!isValid) {
        field.addClass("error");
      }
      return isValid;
    }

    function validateDob() {
      var field = $("#dob");
      var date = +new Date(field.val());
      var now = +new Date();
      var isValid = Math.abs(new Date(now - date).getUTCFullYear() - 1970) > 18;

      if (!isValid) {
        field.addClass("error");
      }
      return isValid;
    }

    function validateBio() {
      var field = $("#bio");
      var fieldLength = field.val().length;
      var isValid = fieldLength > 0 && field.val().length <= 200;

      if (!isValid) {
        field.addClass("error");
      }
      return isValid;
    }

    function isFormValid() {
      $("#user_form_error").addClass("hidden");
      $(".js-form-control").each(function () {
        $(this).removeClass("error");
      });

      var isValid =
        validateRequiredField($("#first_name")) &&
        validateRequiredField($("#last_name")) &&
        validateEmail() &&
        validateDob() &&
        validateRequiredField($("#country")) &&
        validateBio();

      if (!isValid) {
        $("#user_form_error").removeClass("hidden");
      }

      return isValid;
    }

    $("#user_form").on("submit", function (ev) {
      ev.preventDefault();

      if (isFormValid()) {
        $(this).addClass("hidden");
        $("#thanks").removeClass("hidden");
      }
    });
  },
};

/**
 * Init functions
 */
$(function () {
  CodelyBackoffice.initCommon();

  if ($("#category").length) CodelyBackoffice.initCategoryFilter();
  if ($("form").length) CodelyBackoffice.initForms();
  if ($("#user_form").length) CodelyBackoffice.initUserForm();
});
