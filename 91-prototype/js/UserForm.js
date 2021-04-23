import { User } from "./User";

export function Form(id) {
  this.htmlForm = document.getElementById(id);
  this.formBody = this.htmlForm.querySelector(".js-form-body");
  this.errorMessage = this.htmlForm.querySelector(".js-form-error");
  this.thanksMessage = this.htmlForm.querySelector(".js-form-thanks");

  this.htmlForm.addEventListener("submit", (ev) => this.submit(ev));
}

Form.prototype.submit = function (ev) {
  ev.preventDefault();
  if (this.isValid()) {
    this.handleFormSuccess();
  }
};

Form.prototype.handleFormSuccess = function () {
  this.createUser();
  this.thanksMessage.classList.remove("hidden");
  this.formBody.classList.add("hidden");
};

Form.prototype.createUser = function () {
  const data = Object.values(this.htmlForm.elements).reduce((user, element) => {
    if (element.id) {
      user[element.id] = element.value;
    }
    return user;
  }, {});

  return new User(data);
};

Form.prototype.isValid = function () {
  this.errorMessage.classList.add("hidden");

  const formControls = Object.values(this.htmlForm.elements);

  formControls.forEach((control) => {
    control.classList.remove("error");
  });

  const isValid =
    this.validateRequiredField(this.htmlForm.elements.firstName) &&
    this.validateRequiredField(this.htmlForm.elements.lastName) &&
    this.validateEmail() &&
    this.validateDob() &&
    this.validateBio();

  if (!isValid) {
    this.errorMessage.classList.remove("hidden");
  }

  return isValid;
};

Form.prototype.validateRequiredField = function (field) {
  const isValid = !!field.value;

  if (!isValid) {
    field.classList.add("error");
  }
  return isValid;
};

Form.prototype.validateEmail = function () {
  const field = this.htmlForm.elements.email;
  const isValid = new RegExp(
    "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
  ).test(field.value);

  if (!isValid) {
    field.classList.add("error");
  }
  return isValid;
};

Form.prototype.validateDob = function () {
  const field = this.htmlForm.elements.dob;
  const date = +new Date(field.value);
  const now = +new Date();
  const isValid = Math.abs(new Date(now - date).getUTCFullYear() - 1970) > 18;

  if (!isValid) {
    field.classList.add("error");
  }
  return isValid;
};

Form.prototype.validateBio = function () {
  const field = this.htmlForm.elements.bio;
  const fieldLength = field.value.length;
  const isValid = fieldLength > 0 && field.value.length <= 200;

  if (!isValid) {
    field.classList.add("error");
  }
  return isValid;
};
