export function getStartOfDay(offset: number | string = 0): string {
  const now = new Date();

  // 处理字符串参数
  if (typeof offset === 'string') {
    switch (offset) {
      case '1m':
        now.setDate(1);
        now.setHours(0, 0, 0, 0);
        break;
      case '1y':
        now.setMonth(0);
        now.setDate(1);
        now.setHours(0, 0, 0, 0);
        break;
      default:
        throw new Error('Invalid string parameter');
    }
  } else if (typeof offset === 'number') {
    now.setDate(now.getDate() - offset);
    now.setHours(0, 0, 0, 0);
  } else {
    throw new Error('Invalid parameter type');
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
