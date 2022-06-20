import {Injectable} from "@nestjs/common";

const ApiKeyStore = new Map();
const UserStore = new Map<string, Express.User>([["asdfasdf67tasdg", {name: "Max Mustermann", id: "asdfasdf67tasdg"}]]);
const SessionStore = new Map<string, string>();
const RefreshStore = new Map<string, string>();

@Injectable()
export class UsersService {
  async findOneApiKey(key: string): Promise<Express.User | null> {
    return ApiKeyStore.has(key) ?
      ApiKeyStore.get(key) : null;
  }

  async findOneUser(username: string, password?: string): Promise<Express.User> {
    if(!password) {
      const user = UserStore.get(username);
      if(!user) return null;

      return {
        id: user.id,
        name: user.name,
      }
    }

    const user = [...UserStore.values()].find(user => user.name === username);
    if(!user) return null;

    if("1234" === password) {
      return {
        id: user.id,
        name: user.name,
      }
    }

    return null;
  }

  async findOneSession(id: string): Promise<Express.User> {
    const userId = SessionStore.get(id);
    if(!userId) return null;

    const user = UserStore.get(userId);
    if(!user) return null;

    return {
      id: user.id,
      name: user.name,
    }
  }

  async saveOneSession(id: string, user: Express.User): Promise<void> {
    SessionStore.set(id, user.id);
    this.debugHook();
  }

  async deleteOneSession(id: string): Promise<void> {
    SessionStore.delete(id);
    this.debugHook();
  }

  async findOneRefresh(id: string): Promise<Express.User> {
    const userId = RefreshStore.get(id);
    if(!userId) return null;

    const user = UserStore.get(userId);
    if (!user) return null;

    return user;
  }

  async saveOneRefresh(id: string, user: Express.User): Promise<void> {
    RefreshStore.set(id, user.id);
    this.debugHook();
  }

  async deleteOneRefresh(id: string): Promise<void> {
    RefreshStore.delete(id);
    this.debugHook();
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
