import fs from 'fs';
import path from 'path';

const storePath = path.join(process.cwd(), '.otpStore.json');

export const otpStore = {
  set: (id: string, otp: string) => {
    let store: Record<string, any> = {};
    try {
      if (fs.existsSync(storePath)) {
        store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
      }
    } catch (e) {}
    store[id] = { otp, expires: Date.now() + 5 * 60 * 1000 };
    fs.writeFileSync(storePath, JSON.stringify(store));
  },
  get: (id: string) => {
    try {
      if (fs.existsSync(storePath)) {
        const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
        const record = store[id];
        if (record && record.expires > Date.now()) {
          return record.otp;
        }
      }
    } catch (e) {}
    return null;
  },
  delete: (id: string) => {
    try {
      if (fs.existsSync(storePath)) {
        const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
        delete store[id];
        fs.writeFileSync(storePath, JSON.stringify(store));
      }
    } catch (e) {}
  }
};
