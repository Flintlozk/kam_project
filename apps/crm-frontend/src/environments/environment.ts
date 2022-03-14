// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  gqlUrl: 'http://localhost:3333/graphql',
  backendUrl: 'http://localhost:3333',
  googleAuthScope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'].join(' '),
  cookiePolicy: 'single_host_origin',
  client_id: '971440548408-7hv9hp9gp4amsqqci17nl53onufkgrad.apps.googleusercontent.com',
  client_secret: 'A_EI0xJ6jNb9GOwpFMC-fWSS',
  redirect_uri: 'https://localhost:4200',
  grant_type: 'authorization_code',
};
