export function validateNull(
  object: any,
  message: string,
  statusCode: number
): void {
  if (!object) {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    throw error;
  }
}
