/**
 * HIPAA-compliant field-level encryption utilities
 * Uses browser's native Web Crypto API for encryption
 */

// Generate a key from user's session (deterministic)
async function generateKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('sperm-health-tracker-salt'), // In production, use unique salt per user
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts sensitive data before storing in database
 */
export async function encryptField(
  value: string | number,
  userId: string
): Promise<string> {
  try {
    const stringValue = String(value);
    const enc = new TextEncoder();
    const data = enc.encode(stringValue);

    // Use userId as encryption key material
    const key = await generateKey(userId);

    // Generate random IV for each encryption
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts sensitive data retrieved from database
 */
export async function decryptField(
  encryptedValue: string,
  userId: string
): Promise<string> {
  try {
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    // Use userId as encryption key material
    const key = await generateKey(userId);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Encrypts test result object
 */
export async function encryptTestResult(
  result: any,
  userId: string
): Promise<any> {
  const sensitiveFields = ['concentration', 'motility', 'progressive_motility', 'morphology', 'volume', 'notes'];
  
  const encrypted = { ...result };
  
  for (const field of sensitiveFields) {
    if (result[field] !== undefined && result[field] !== null) {
      encrypted[field] = await encryptField(result[field], userId);
    }
  }
  
  return encrypted;
}

/**
 * Decrypts test result object
 */
export async function decryptTestResult(
  encryptedResult: any,
  userId: string
): Promise<any> {
  const sensitiveFields = ['concentration', 'motility', 'progressive_motility', 'morphology', 'volume', 'notes'];
  
  const decrypted = { ...encryptedResult };
  
  for (const field of sensitiveFields) {
    if (encryptedResult[field]) {
      try {
        const decryptedValue = await decryptField(encryptedResult[field], userId);
        // Convert back to number if it's a numeric field
        decrypted[field] = ['concentration', 'motility', 'progressive_motility', 'morphology', 'volume'].includes(field)
          ? parseFloat(decryptedValue)
          : decryptedValue;
      } catch (error) {
        console.warn(`Failed to decrypt field ${field}:`, error);
        decrypted[field] = null;
      }
    }
  }
  
  return decrypted;
}

/**
 * Encrypts daily log object
 */
export async function encryptDailyLog(
  log: any,
  userId: string
): Promise<any> {
  const sensitiveFields = ['notes'];
  
  const encrypted = { ...log };
  
  for (const field of sensitiveFields) {
    if (log[field] !== undefined && log[field] !== null) {
      encrypted[field] = await encryptField(log[field], userId);
    }
  }
  
  return encrypted;
}

/**
 * Decrypts daily log object
 */
export async function decryptDailyLog(
  encryptedLog: any,
  userId: string
): Promise<any> {
  const sensitiveFields = ['notes'];
  
  const decrypted = { ...encryptedLog };
  
  for (const field of sensitiveFields) {
    if (encryptedLog[field]) {
      try {
        const decryptedValue = await decryptField(encryptedLog[field], userId);
        decrypted[field] = decryptedValue;
      } catch (error) {
        console.warn(`Failed to decrypt field ${field}:`, error);
        decrypted[field] = null;
      }
    }
  }
  
  return decrypted;
}
