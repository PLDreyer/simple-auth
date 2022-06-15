import {Injectable} from "@nestjs/common";

@Injectable()
export class UsersService {
  async findOneApiKey<U>(key: string): Promise<U> {
    // TODO
    return {} as U;
  }

  async findOneUser<U>(username: string, password?: string): Promise<U> {
    if(!password) {
      return {
        username,
      } as unknown as U;
    }

    console.log("username: ", username);
    console.log("password: ", password);

    if(username == "maxmustermann" && password == "1234") {
      return {
        username,
      } as unknown as U;
    }
    // TODO
    return null;
  }

  async findOneSession<U>(id: string): Promise<U> {
    // TODO
    return {} as U;
  }

  async saveOneSession(id: string): Promise<void> {

  }

  async findOneRefresh(id: string): Promise<boolean> {
    // TODO
    return true;
  }

  async saveOneRefresh(id: string): Promise<void> {

  }

  async findOneAnonymous<U>(id: string): Promise<U> {
    // TODO
    return {} as U;
  }

  async registerAnonymousUser() {

  }
}
