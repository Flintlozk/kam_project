export const environment = {
  production: false,
  gqlUrl: 'http://localhost:3333/graphql',
  facebookAppID: '388548175646542',
  facebookAppSecret: '966b1944e2062ce868aa80cb312d76db',
  facebookLoginScope: ['email', 'public_profile'],
  lineClientID: '1653765753',
  lineSecret: '05ced82362a58d9119b8bd8fd8841b5d',
  lineRedirectUrl: 'https://localhost:4200/oauth/line',
  lineState: 'ak47',
  googleAuthScope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'].join(' '),
  googleCookiePolicy: 'single_host_origin',
  googleClientID: '971440548408-vkm7bknj9ruapulal7unhpt6tn6spdfc.apps.googleusercontent.com',
  googleClientSecret: 'BF8Ei8QachOC7EA3lM95fEXu',
  googleRedirectUri: 'urn:ietf:wg:oauth:2.0:oob',
  googleGrantType: 'authorization_code',
};
