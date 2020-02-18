import decode from 'jwt-decode';
import auth0 from 'auth0-js';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const CLIENT_ID = 'YUVJyEu4uSuUgi3SRNLJaNrfUHBTQUr0';
const CLIENT_DOMAIN = 'dev-4arbelkb.auth0.com';
const REDIRECT = 'http://localhost:8080/callback';
const SCOPE = 'openid profile email standard_user';
const AUDIENCE = 'https://my-test-api.com';

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
});

export function login() {
  try{
    auth.authorize({
      responseType: 'token id_token',
      redirectUri: REDIRECT,
      audience: AUDIENCE,
      scope: SCOPE
    });
  }
  catch(error){
    console.log("error" + error);
  }
  
}


export function logout() {
  clearIdToken();
  clearAccessToken();
  window.location.href = '/';
}

export function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
  let accessToken = getParameterByName('access_token');
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken() {
  let idToken = getParameterByName('id_token');
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
  try{
    const idToken = getIdToken();
    return !!idToken && !isTokenExpired(idToken);
  }
  catch(error){
    console.log("error: " + error);
   logout();
    return false;
  }
  
}

export function getUserData(){
  try{
    const idToken = getIdToken();
    const token = decode(idToken);

    return {
      name: token.name,
      picture: token.picture
    };
  }
  catch(error){
    console.log("error: " + error);
    logout();
    return null;
  }

}


function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}