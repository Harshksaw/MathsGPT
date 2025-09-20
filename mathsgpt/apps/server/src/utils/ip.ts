
export function getClientIp(headers: Headers): string {

  const xff = headers.get('x-forwarded-for');
  if (xff) {

    return xff.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();


  return 'unknown';
}
