export function logInfo(event: string, data?: unknown) {
  console.log(JSON.stringify({ level: 'info', event, ...data && { data } }));
}
export function logError(event: string, err: unknown, data?: unknown) {
  console.error(JSON.stringify({
    level: 'error',
    event,
    error: err instanceof Error ? { message: err.message, stack: err.stack } : err,
    ...data && { data }
  }));
}
