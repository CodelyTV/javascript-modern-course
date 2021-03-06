import "../css/sakura.css";
import "../css/custom.css";

import { countChars, createUser, show, hide } from "./utils";

const CodelyBackoffice = {
  /*******************************************************************************************************************
   * Common features
   ******************************************************************************************************************/
  initCommon() {
    /**
     * Show/hide an element based on a change in another field.
     */
    const trigger = document.querySelector(".js-trigger-container");

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
    const contentCounters = document.querySelectorAll(".js-count-content");

    for (let i = 0; i < contentCounters.length; ++i) {
      const counter = contentCounters[i];
      const form_field = counter.parentElement.querySelector(
        ".js-form-control"
      );
      const char_counter_container = counter.querySelector(".js-count-chars");

      char_counter_container.innerHTML = countChars(form_field.value);

      form_field.addEventListener("keyup", function () {
        char_counter_container.innerHTML = countChars(form_field.value);
      });
    }

    /**
     * Load select data
     */
    const dataLoaders = document.querySelectorAll(".js-load-data");

    dataLoaders.forEach(function (select) {
      const domain =
        document.domain == "localhost" ? "localhost:8080" : document.domain;
      const type = select.getAttribute("data-type");

      fetch(`http://${domain}/data/${type}.json`)
        .then((response) => response.json())
        .then(({ data }) => {
          for (const item of data) {
            const option = document.createElement("option");
            option.textContent = item.name;
            select.append(option);
          }
        })
        .catch(() => {
          console.error(`Could not find ${type}.json`);
        });
    });
  },
  /*******************************************************************************************************************
   * Filter courses by category
   ******************************************************************************************************************/
  initCategoryFilter() {
    const filter = document.getElementById("category");

    function getSelectedValues(node) {
      const checkboxes = node.querySelectorAll(
        'input[type="checkbox"]:checked'
      );

      const selectedValues = Array.from(checkboxes).map(
        (checkbox) => checkbox.value
      );

      return selectedValues;
    }

    function isInList(item, list) {
      return list.includes(item);
    }

    filter.addEventListener("change", function () {
      const categories = getSelectedValues(this);

      const elementsToFilter = document.querySelectorAll(".js-filtered-item");

      for (const element of elementsToFilter) {
        if (categories.length === 0) {
          show(element);
          continue;
        }

        const elementCategory = element.getAttribute("data-category");

        if (isInList(elementCategory, categories)) {
          show(element);
        } else {
          hide(element);
        }
      }
    });
  },
  /*******************************************************************************************************************
   * Create user form
   ******************************************************************************************************************/
  initUserForm() {
    function validateRequiredField(field) {
      const isValid = !!field.value;

      if (!isValid) {
        field.classList.add("error");
      }
      return isValid;
    }

    function validateEmail() {
      const field = document.getElementById("email");
      const isValid = new RegExp(
        "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
      ).test(field.value);

      if (!isValid) {
        field.classList.add("error");
      }
      return isValid;
    }

    function validateDob() {
      const field = document.getElementById("dob");
      const date = +new Date(field.value);
      const now = +new Date();
      const isValid =
        Math.abs(new Date(now - date).getUTCFullYear() - 1970) > 18;

      if (!isValid) {
        field.classList.add("error");
      }
      return isValid;
    }

    function validateBio() {
      const field = document.getElementById("bio");
      const fieldLength = field.value.length;
      const isValid = fieldLength > 0 && field.value.length <= 200;

      if (!isValid) {
        field.classList.add("error");
      }
      return isValid;
    }

    function isFormValid() {
      hide(document.getElementById("user_form_error"));

      const formControls = document.querySelectorAll(".js-form-control");

      formControls.forEach(function (control) {
        control.classList.remove("error");
      });

      const isValid =
        validateRequiredField(document.getElementById("firstName")) &&
        validateRequiredField(document.getElementById("lastName")) &&
        validateEmail() &&
        validateDob() &&
        validateRequiredField(document.getElementById("country")) &&
        validateRequiredField(document.getElementById("courseCategory")) &&
        validateBio();

      if (!isValid) {
        show(document.getElementById("user_form_error"));
      }

      return isValid;
    }

    function sanitize(strings, ...values) {
      let output = "";
      // eslint-disable-next-line no-var
      for (var index = 0; index < values.length; index++) {
        let valueString = values[index].toString();

        if (valueString.indexOf(">") !== -1) {
          valueString = "-";
        }

        output += strings[index] + valueString;
      }

      output += strings[index];
      return output;
    }

    function handleFormError() {
      show(document.getElementById("network_form_error"));
    }

    function handleFormSuccess(form, newUser) {
      const thanksBlock = document.getElementById("thanks");
      const title = thanksBlock.querySelector("h3");
      const content = thanksBlock.querySelector("p");

      title.innerHTML = sanitize`Thank you ${newUser.firstName} for registering!`;
      content.innerHTML = sanitize`We sent a confirmation email to <strong>${newUser.email}</strong>`;

      hide(form);
      show(thanksBlock);
    }

    document
      .getElementById("user_form")
      .addEventListener("submit", function (ev) {
        ev.preventDefault();
        const form = ev.target;

        if (isFormValid()) {
          createUser(form).then(({ success, data: newUser }) => {
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
