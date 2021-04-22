import "../css/sakura.css";
import "../css/custom.css";

const app = {
  form: null,
  initForm() {
    console.log("init form");
    this.form = document.getElementById("user_form");

    this.form.addEventListener("submit", this.submit.bind(this));
  },
  submit(ev) {
    ev.preventDefault();
    console.log("submit");
    this.createUser();
  },
  createUser() {
    console.log("createUser");
  },
};

document.addEventListener("DOMContentLoaded", app.initForm.bind(app));
