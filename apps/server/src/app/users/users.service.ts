import { Injectable } from '@nestjs/common';

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

@Injectable()
export class UsersService {
  async findOneApiKey(key: string): Promise<Express.User | null> {
    return ApiKeyStore.has(key) ? ApiKeyStore.get(key) : null;
  }

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
  }

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
  }

  async saveOneSession(id: string, user: Express.User): Promise<void> {
    SessionStore.set(id, user.id);
    this.debugHook();
  }

  async deleteOneSession(id: string): Promise<void> {
    SessionStore.delete(id);
    this.debugHook();
  }

  async findOneRefresh(
    id: string
  ): Promise<{ user: Express.User; rememberMe: boolean }> {
    const refresh = RefreshStore.get(id);
    if (!refresh) return null;

    const user = UserStore.get(refresh.id);
    if (!user) return null;

    return { user, rememberMe: refresh.rememberMe };
  }

  async saveOneRefresh(
    id: string,
    user: Express.User,
    rememberMe: boolean
  ): Promise<void> {
    RefreshStore.set(id, { id: user.id, rememberMe });
    this.debugHook();
  }

  async deleteOneRefresh(id: string): Promise<void> {
    RefreshStore.delete(id);
    this.debugHook();
  }

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
  }

  async saveTwoFaSessionToken(
    id: string,
    user: Express.User,
    rememberMe: boolean
  ): Promise<void> {
    // TODO save remember me
    TwoFaTokenStore.set(id, { id: user.id, rememberMe });
  }

  async deleteTwoFaSessionToken(id: string): Promise<void> {
    TwoFaTokenStore.delete(id);
  }

  async shouldValidateTwoFaToken(user: Express.User): Promise<boolean> {
    return !!user.twoFaSecret;
  }

  async validateTwoFaCode(code: string): Promise<boolean> {
    // TODO
    return true;
  }

  private debugHook() {
    /*
    console.log("UserStore: ", JSON.stringify([...UserStore.values()], null, 2));
    console.log("SessionStore: ", JSON.stringify([...SessionStore.values()], null, 2));
    console.log("RefreshStore: ", JSON.stringify([...RefreshStore.values()], null, 2));
    console.log("ApiKeyStore: ", JSON.stringify([...ApiKeyStore.values()], null, 2));
     */
  }
}
