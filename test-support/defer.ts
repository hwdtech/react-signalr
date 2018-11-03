export function deferResolve<T>(ms: number, value?: T) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

export function deferReject(ms: number, reason: Error) {
  return new Promise((resolve, reject) => setTimeout(() => reject(reason), ms));
}
