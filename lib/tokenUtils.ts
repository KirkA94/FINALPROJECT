/**
 * Utility function to decode a JWT token and check if it is expired.
 * @param token The JWT token to decode.
 * @returns `true` if the token is expired, `false` otherwise.
 */
export function isTokenExpired(token: string): boolean {
  try {
    if (!token) {
      console.error("Token is undefined or empty");
      return true; // Treat undefined or empty tokens as expired
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid token format");
      return true; // Treat invalid tokens as expired
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decodedToken = JSON.parse(jsonPayload);

    if (decodedToken.exp) {
      return decodedToken.exp * 1000 < Date.now(); // Compare expiration time
    }
    return false; // If no `exp` field, assume token is valid
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error decoding token:", error.message);
    } else {
      console.error("Error decoding token:", error);
    }
    return true; // Treat token as expired if it can't be decoded
  }
}