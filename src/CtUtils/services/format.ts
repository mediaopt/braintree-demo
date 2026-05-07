export const formatPrice = (centAmount: number, currencyCode: string, fractionDigits: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode })
    .format(centAmount / Math.pow(10, fractionDigits));
