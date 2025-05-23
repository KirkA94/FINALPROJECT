import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'fallback-secret-key'; // Use environment variable for JWT signing

/**
 * Generates a JWT for the given payload.
 * @param payload - The data to include in the token.
 * @returns A signed JWT.
 */
export function generateToken(payload: object) {
  try {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating token:', error.message);
    } else {
      console.error('Unexpected error generating token:', error);
    }
    throw new Error('Failed to generate token');
  }
}

/**
 * Verifies a JWT and decodes its payload.
 * @param token - The JWT to verify.
 * @returns The decoded payload if the token is valid, or null if invalid.
 */
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token has expired:', error.message);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', error.message);
    } else {
      console.error('Error verifying token:', error);
    }
    return null; // Return null for invalid or expired tokens
  }
}