import createHmac from 'create-hmac';
import CryptoJS from 'crypto-js';

const secret = process.env.REQUESTS_SECRET_KEY;

// Startup account calls identify the user by the body `id`, not by x-Figma-id
const exceptedEndpoints = ['updateAccount', 'createAccount'];

export const encrypt = (value: string): string => {
  return CryptoJS.AES.encrypt(value, secret).toString();
};

export const generateSignature = (body: any) => {
  const hmac = createHmac('sha256', secret);
  return hmac.update(JSON.stringify(body)).digest('hex');
};

export const prepareHeaders = (
  headers: Headers,
  endpoint: string,
  figmaId?: string | null,
) => {
  // Never send a placeholder identity: omit the header until the account is loaded
  if (!exceptedEndpoints.includes(endpoint) && figmaId) {
    const encryptedId = encrypt(figmaId);
    headers.set('x-Figma-id', encryptedId);
  }

  const signature = generateSignature(endpoint);
  headers.set('x-Figma-Signature', signature);

  return headers;
};
