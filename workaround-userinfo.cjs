const os = require('node:os');
const originalUserInfo = os.userInfo;
os.userInfo = function userInfo(options) {
  try {
    return originalUserInfo.call(os, options);
  } catch {
    return {
      uid: -1,
      gid: -1,
      username: process.env.USERNAME || 'local-user',
      homedir: process.env.USERPROFILE || process.cwd(),
      shell: null,
    };
  }
};
// Keep named ESM imports (used by tsx) in sync with the patched built-in.
require('node:module').syncBuiltinESMExports();
