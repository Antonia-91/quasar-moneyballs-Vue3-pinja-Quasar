export function useCurrencify(amount) {
  let posNegSymbol = "";
  if (amount < 0) {
    posNegSymbol = "-";
  } else {
    posNegSymbol = "+";
  }
  const currencySymbol = "$",
    amountPositive = Math.abs(amount),
    amountFormatted = amountPositive.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return `${posNegSymbol}${currencySymbol}${amountFormatted}`;
}
