import dayjs from "dayjs";


export class StringHelper {
  static valuta(value: number): string {
    // Get current locale
    return value.toLocaleString(window.navigator.language, {
      style: "currency",
      currency: "EUR",
    });
  }

  static date(value: Date | dayjs.Dayjs): string {
    let dayJsInstance = dayjs(value)
    return dayJsInstance.format("DD-MM-YYYY");
  }
}
