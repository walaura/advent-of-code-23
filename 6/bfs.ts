const values = [...Array(100).keys()].map((v) => `Value ${v}`);


function find(process, isValidValue, start, end) {
  const half = Math.round((end - start) / 2 + start);
  const value = process(half);
  if (isValidValue(value)) {
    return value;
  }
  console.log(end, start, half, values[half]);
  if (end - half < 1) {
    return null;
  }
  return (
    find(process, isValidValue, start, half) ??
    find(process, isValidValue, half, end)
  );
}

function process(half) {
  return values[half];
}
function isValidValue(value) {
  return value === "Value 89";
}

console.log(find(process, isValidValue, 0, 100));
