const config = require('../../package.json').projectConfig;
const BACKEND_BASE_URL = config.backendBaseUrl;

const BACKEND_API = {
  BASE_API_URL: `${BACKEND_BASE_URL}/api`,
  REGISTER: '/register',
  LOGIN: '/login',
};

export default {BACKEND_API};
