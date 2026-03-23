import * as bcrypt from "bcryptjs";

const TOKEN_KEY = "fetemi_auth_token";
const SALT_ROUNDS = 10;

// This key is for the mock "encryption" simulation as requested by the user
export const DECRYPTION_KEY = "FETEMI_EDITORIAL_SECURE_2024";

export interface UserSession {
  email: string;
  token: string;
}

export const auth = {
  /**
   * Generates a "secure" token by hashing the email with a timestamp and secret
   */
  async generateToken(email: string): Promise<string> {
    const data = `${email}:${Date.now()}:${DECRYPTION_KEY}`;
    return await bcrypt.hash(data, SALT_ROUNDS);
  },

  /**
   * Saves the session to sessionStorage
   */
  saveSession(email: string, token: string): void {
    const session: UserSession = { email, token };
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(session));
  },

  /**
   * Retrieves the current session
   */
  getSession(): UserSession | null {
    if (typeof window === "undefined") return null;
    const data = sessionStorage.getItem(TOKEN_KEY);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Validates if the user is authenticated
   */
  isAuthenticated(): boolean {
    const session = this.getSession();
    return !!session && !!session.token;
  },

  /**
   * Logs out the user
   */
  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }
};
