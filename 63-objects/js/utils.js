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
  const newUser = Object.keys(form.elements).reduce((user, key) => {
    const element = form.elements[key];
    if (element.id) {
      user[element.id] = element.value;
    }
    return user;
  }, {});

  callback({
    success: true,
    data: newUser,
  });
}
