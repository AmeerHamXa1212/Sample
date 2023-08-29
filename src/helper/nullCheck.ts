export function validateNull<T extends Array<any>>(object: T): boolean {
  if (!object || object.length === 0) {
    return true;
  }
  return false;
}
