const setTokenCookies = (accessToken, refreshToken) => {
  // Calculate expiration dates
  let accessTokenExpires = new Date();
  accessTokenExpires.setDate(accessTokenExpires.getDate() + 1); // Expires in 1 day

  let refreshTokenExpires = new Date();
  refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 10); // Expires in 10 days

  let accessTokenExpiresUTC = accessTokenExpires.toUTCString();
  let refreshTokenExpiresUTC = refreshTokenExpires.toUTCString();

  document.cookie = `accessToken=${accessToken}; expires=${accessTokenExpiresUTC}; Path=/;`;
  document.cookie = `refreshToken=${refreshToken}; expires=${refreshTokenExpiresUTC}; Path=/;`;
};


export default setTokenCookies;