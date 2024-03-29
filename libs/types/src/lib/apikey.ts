import type { ApiKeyHandler } from './handler';

/**
 * Header configuration
 */
export type ApiKeyOptions<U, I> = {
  /**
   * Header configuration for api keys
   */
  header?: {
    /**
     * Header names to get api key from
     */
    names?: Array<string>;
  };
  /**
   * Query configuration for api keys
   */
  query?: {
    /**
     * Query names to get api key from
     */
    names?: Array<string>;
  };
  /**
   * Body configuration for api keys
   */
  body?: {
    /**
     * Body names to get api key from
     */
    names?: Array<string>;
  };
  /**
   * Method to find user with api key
   */
  find: ApiKeyHandler<U>['findApiKey'];
};
