export function formatAMD(value) {
  const amount = Number(value);

  if (isNaN(amount)) {
    return "0 դր.";
  }

  return `${amount.toLocaleString("hy-AM")} դր.`;
}