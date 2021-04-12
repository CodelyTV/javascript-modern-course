export function countWords(str) {
  return str.split(" ").length;
}

export function countChars(str) {
  return str.split("").length;
}

export function iterateNodes(array, callback) {
  for (var i = 0; i < array.length; ++i) {
    callback(array[i]);
  }
}

export function createUser(form, callback) {
  callback({
    success: true,
    data: {
      firstName: form.elements.first_name.value,
      lastName: form.elements.last_name.value,
      email: form.elements.email.value,
      dob: form.elements.dob.value,
      country: form.elements.country.value,
      bio: form.elements.bio.value,
    },
  });
}
