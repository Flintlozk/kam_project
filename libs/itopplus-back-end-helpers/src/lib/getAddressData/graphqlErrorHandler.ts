export function graphQLErrorHandler(err: Error): void {
  const errType = err.name;
  switch (errType) {
    // start: errors / pages.error.ts
    case 'PagesError':
      throw err;
    case 'PagesNotExistError':
      throw err;
    // end: errors / pages.error.ts
    // ---------------------------
    // start: errors / auth.error.ts
    case 'RegisterError':
      throw err;
    case 'UserNotFoundError':
      throw err;
    case 'AuthError':
      throw err;
    // end: errors / auth.error.ts
    // ---------------------------
    // start: generic error
    case 'TypeError':
      throw new Error(`[${errType}]Message: ${err.message}`);
    default:
      throw new Error(`[Unexpected Internal Error]Message: ${err.message ? err.message : ''}`);
    // end: generic error
  }
}
