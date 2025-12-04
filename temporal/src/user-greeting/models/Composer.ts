export abstract class Composer<T> {
  abstract compose(payload: T): string;
}
