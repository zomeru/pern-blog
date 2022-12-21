export * from './getUserFromToken';

export function emailValidator(email: string) {
  const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/;

  return pattern.test(email);
}
