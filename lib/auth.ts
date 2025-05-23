import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key"; // Use an environment variable for security

/**
 * Generates a JWT for the given payload.
 * @param payload - The data to include in the token.
 * @returns A signed JWT.
 */
export function generateToken(payload: object) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Token expires in 1 hour
}

/**
 * Verifies a JWT and decodes its payload.
 * @param token - The JWT to verify.
 * @returns The decoded payload if the token is valid, or null if invalid.
 */
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}