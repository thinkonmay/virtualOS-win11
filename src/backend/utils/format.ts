export function numberFormat(num) {
    let fmt = new Intl.NumberFormat();
    return fmt.format(num);
}
