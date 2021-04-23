import { User } from "./User";

export class Form {
  constructor(id) {
    this.htmlForm = document.getElementById(id);
    this.formBody = this.htmlForm.querySelector(".js-form-body");
    this.errorMessage = this.htmlForm.querySelector(".js-form-error");
    this.thanksMessage = this.htmlForm.querySelector(".js-form-thanks");

    this.htmlForm.addEventListener("submit", (ev) => this.submit(ev));
  }
  submit(ev) {
    ev.preventDefault();
    if (this.isValid()) {
      this.handleFormSuccess();
    }
  }
  handleFormSuccess() {
    this.createUser();
    this.thanksMessage.classList.remove("hidden");
    this.formBody.classList.add("hidden");
  }
  createUser() {
    const data = Object.values(this.htmlForm.elements).reduce(
      (user, element) => {
        if (element.id) {
          user[element.id] = element.value;
        }
        return user;
      },
      {}
    );

    return new User(data);
  }
  isValid() {
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
  }
  validateRequiredField(field) {
    const isValid = !!field.value;

    if (!isValid) {
      field.classList.add("error");
    }
    return isValid;
  }
  validateEmail() {
    const field = this.htmlForm.elements.email;
    const isValid = new RegExp(
      "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    ).test(field.value);

    if (!isValid) {
      field.classList.add("error");
    }
    return isValid;
  }
  validateDob() {
    const field = this.htmlForm.elements.dob;
    const date = +new Date(field.value);
    const now = +new Date();
    const isValid = Math.abs(new Date(now - date).getUTCFullYear() - 1970) > 18;

    if (!isValid) {
      field.classList.add("error");
    }
    return isValid;
  }
  validateBio() {
    const field = this.htmlForm.elements.bio;
    const fieldLength = field.value.length;
    const isValid = fieldLength > 0 && field.value.length <= 200;

    if (!isValid) {
      field.classList.add("error");
    }
    return isValid;
  }
}
