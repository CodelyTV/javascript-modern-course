function testIteration() {
  let t1, t2;
  const data = Array(1000000).fill({ option: true });
  const newArray = [];

  t1 = performance.now();
  for (const item of data) {
    if (item.option) {
      newArray.push(item);
    }
  }
  t2 = performance.now();
  console.log(`for loop took ${t2 - t1} milliseconds`);

  t1 = performance.now();
  data.forEach(function (item) {
    if (item.option) {
      newArray.push(item);
    }
  });
  t2 = performance.now();

  console.log(`forEach took ${t2 - t1} milliseconds`);
}

testIteration();
