function isZeroDimension(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    value.value === 0 &&
    (value.unit === 'ms' || value.unit === 's')
  );
}

function isZeroString(value) {
  return value === '0ms' || value === '0s';
}

export function isZeroDuration(value) {
  return value === 0 || isZeroString(value) || isZeroDimension(value);
}
