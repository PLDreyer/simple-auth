/**
 * All required authentication methods
 */
export interface AuthHandler<U>
  extends ApiKeyHandler<U>,
    LoginHandler<U>,
    TwoFaHandler<U>,
    SessionHandler<U>,
    RefreshHandler<U> {}

/**
 * Handler to find user with api key
 */
export interface ApiKeyHandler<U> {
  /**
   * Find user with api key
   * @param key string api key
   * @returns Promise<User|null>
   */
  findApiKey: (key: string) => Promise<U | null>;
}

/**
 * Handler to get user with credentials
 */
export interface LoginHandler<U> {
  /**
   * Find user with credentials
   * @param username string
   * @param password string
   * @returns Promise<User|null>
   */
  findLogin: (username: string, password: string) => Promise<U | null>;
}

/**
 * Handler to check/validate for 2fa
 */
export interface TwoFaHandler<U> {
  /**
   * Save 2fa session token for later usage
   * @param id string 2fa token id
   * @param user User user to save token for
   * @param rememberMe boolean if cookies should be session sticky
   * @returns Promise<void>
   */
  saveTwoFaSessionToken: (
    id: string,
    user: U,
    rememberMe: boolean
  ) => Promise<void>;
  /**
   * Find 2fa session token for validating 2fa authentication request
   * @param id string 2fa token id
   * @returns Promise<{ user: User.Express | null, rememberMe: boolean } | null>
   */
  findTwoFaSessionToken: (
    id: string
  ) => Promise<{ user: U; rememberMe: boolean } | null>;
  /**
   * Delete 2fa session token after usage
   * @param id string 2fa token id
   * @returns Promise<void>
   */
  deleteTwoFaSessionToken: (id: string) => Promise<void>;
  /**
   * Check if user has 2fa activated
   * @param user User user to check for 2fa
   * @returns Promise<boolean>
   */
  shouldValidateTwoFa: (user: U) => Promise<boolean>;
  /**
   * Validating 2fa code from request
   * @param code string code for 2fa (totp)
   * @returns Promise<boolean>;
   */
  validateTwoFaCode: (user: U, code: string) => Promise<boolean>;
}

/**
 * Handler to handle session
 */
export interface SessionHandler<U> {
  /**
   * Find user with session id
   * @param id string session
   * @returns Promise<User|null>
   */
  findSession: (id: string) => Promise<U | null>;
  /**
   * Save session for user with id
   * @param id string session id
   * @param user User user to save session for
   * @returns Promise<void>
   */
  saveSession: (id: string, user: U) => Promise<void>;
  /**
   * Delete session from user with id
   * @param id string session id
   * @returns Promise<void>
   */
  deleteSession: (id: string) => Promise<void>;
}

/**
 * Handler to handle refresh
 */
export interface RefreshHandler<U> {
  /**
   * Find user with refresh id
   * @param id string refresh id
   * @returns Promise<{ user: User, rememberMe: boolean } |null>
   */
  findRefresh: (id: string) => Promise<{ user: U; rememberMe: boolean } | null>;
  /**
   * Save refresh id for user
   * @param id string refresh id
   * @param user User user to save refresh id for
   * @param rememberMe boolean remember user login
   * @returns Promise<void>
   */
  saveRefresh: (id: string, user: U, rememberMe: boolean) => Promise<void>;
  /**
   * Delete refresh token after usage
   * @param id string refresh id
   * @returns Promise<void>
   */
  deleteRefresh: (id: string) => Promise<void>;
}
