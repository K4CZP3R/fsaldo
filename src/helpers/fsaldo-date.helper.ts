export class FsaldoDate {
  day: number;
  month: number;
  year: number;

  constructor(day: number, month: number, year: number) {
    this.day = day;
    this.month = month;
    this.year = year;
  }

  static now(): FsaldoDate {
    return FsaldoDate.fromDate(new Date());
  }

  static fromString(date: string): FsaldoDate {
    let split = date.split("-");
    let day = parseInt(split[0]);
    let month = parseInt(split[1]);
    let year = parseInt(split[2]);
    return new FsaldoDate(day, month, year);
  }

  static fromDate(date: Date): FsaldoDate {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return new FsaldoDate(day, month, year);
  }

  toString(): string {
    return `${this.day}-${this.month}-${this.year}`;
  }

  toDate(): Date {
    return new Date(this.year, this.month - 1, this.day);
  }

  toInt(): number {
    return this.year * 10000 + this.month * 100 + this.day;
  }
}
