export function countWords(str) {
  return str.split(" ").length;
}

export function countChars(str) {
  return str.split("").length;
}

export function show(element) {
  element.classList.remove("hidden");
}

export function hide(element) {
  element.classList.add("hidden");
}

export function createUser(form, callback) {
  callback({
    success: true,
    data: {
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value,
      email: form.elements.email.value,
      dob: form.elements.dob.value,
      country: form.elements.country.value,
      bio: form.elements.bio.value,
    },
  });
}
