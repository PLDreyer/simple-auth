const ApiKeyStore = new Map();
const UserStore = new Map<string, Express.User>([
  [
    'asdfasdf67tasdg',
    { name: 'Max Mustermann', id: 'asdfasdf67tasdg', twoFaSecret: 'test' },
  ],
]);
const SessionStore = new Map<string, string>();
const RefreshStore = new Map<string, { id: string; rememberMe: boolean }>();
const TwoFaTokenStore = new Map<string, { id: string; rememberMe: boolean }>();

export default {
  async findOneApiKey(key: string): Promise<Express.User | null> {
    return ApiKeyStore.has(key) ? ApiKeyStore.get(key) : null;
  },
  async findOneUser(
    username: string,
    password?: string
  ): Promise<Express.User> {
    if (!password) {
      const user = UserStore.get(username);
      if (!user) return null;

      return {
        id: user.id,
        name: user.name,
        twoFaSecret: user.twoFaSecret,
      };
    }

    const user = [...UserStore.values()].find((user) => user.name === username);
    if (!user) return null;

    if ('1234' === password) {
      return {
        id: user.id,
        name: user.name,
        twoFaSecret: user.twoFaSecret,
      };
    }

    return null;
  },
  async findOneSession(id: string): Promise<Express.User> {
    const userId = SessionStore.get(id);
    if (!userId) return null;

    const user = UserStore.get(userId);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      twoFaSecret: user.twoFaSecret,
    };
  },
  async saveOneSession(id: string, user: Express.User): Promise<void> {
    SessionStore.set(id, user.id);
  },
  async deleteOneSession(id: string): Promise<void> {
    SessionStore.delete(id);
  },
  async findOneRefresh(
    id: string
  ): Promise<{ user: Express.User; rememberMe: boolean }> {
    const refresh = RefreshStore.get(id);
    if (!refresh) return null;

    const user = UserStore.get(refresh.id);
    if (!user) return null;

    return { user, rememberMe: refresh.rememberMe };
  },
  async saveOneRefresh(
    id: string,
    user: Express.User,
    rememberMe: boolean
  ): Promise<void> {
    RefreshStore.set(id, { id: user.id, rememberMe });
  },
  async deleteOneRefresh(id: string): Promise<void> {
    RefreshStore.delete(id);
  },
  async findTwoFaSessionToken(
    id: string
  ): Promise<{ user: Express.User; rememberMe: boolean } | null> {
    const twofa = TwoFaTokenStore.get(id);
    if (!twofa) return null;

    const user = UserStore.get(twofa.id);
    if (!user) return null;

    return {
      user,
      // TODO implement rememberMe
      rememberMe: twofa.rememberMe,
    };
  },
  async saveTwoFaSessionToken(
    id: string,
    user: Express.User,
    rememberMe: boolean
  ): Promise<void> {
    // TODO save remember me
    TwoFaTokenStore.set(id, { id: user.id, rememberMe });
  },
  async deleteTwoFaSessionToken(id: string): Promise<void> {
    TwoFaTokenStore.delete(id);
  },
  async shouldValidateTwoFaToken(user: Express.User): Promise<boolean> {
    return !!user.twoFaSecret;
  },
  async validateTwoFaCode(code: string): Promise<boolean> {
    // TODO
    return true;
  },
};
