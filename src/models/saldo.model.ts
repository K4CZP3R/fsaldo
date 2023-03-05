export type ISaldo = {
  id: string;
  name: string;
  saldoEntry: SaldoEntry[];
  debitLimit?: number;
};

export class Saldo implements ISaldo {
  id: string;
  name: string;
  saldoEntry: SaldoEntry[];
  debitLimit?: number | undefined;

  constructor(
    id: string,
    name: string,
    saldoEntry: SaldoEntry[],
    debitLimit?: number | undefined
  ) {
    this.id = id;
    this.name = name;
    this.saldoEntry = saldoEntry;
    this.debitLimit = debitLimit;
  }

  static fromObject(obj: ISaldo): Saldo {
    return new Saldo(obj.id, obj.name, obj.saldoEntry, obj.debitLimit);
  }

  // Wat de neuk, ik zit gewoon met in VR te typen, dit is echt te gek
  // En ik zie gewoon mijn echte toetsenbord en mijn echte handen
  // Lol

  // Ik heb dit in VR geschreven, ik ben echt een nerd
  // xD

  // wat gaaaf
  // Je ziet mijn rommel gewoon op mijn bureau

  // en mijn handen :p
}

export type SaldoEntry = {
  id: string;
  name: string;
  amount: number;
  date: string;
};

export type SaldoEntryUpdate = {
  name?: string;
  amount?: number;
  date?: string;
};
