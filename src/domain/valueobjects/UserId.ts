export class UserId {
  private readonly value: number;

  constructor(id: number) {
    if (id <= 0) {
      throw new Error('UserId doit être positif');
    }
    this.value = id;
  }

  toNumber(): number {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}