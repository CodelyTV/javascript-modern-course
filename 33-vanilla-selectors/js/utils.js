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
