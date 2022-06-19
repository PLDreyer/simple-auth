import {Injectable} from "@nestjs/common";

@Injectable()
export class UsersService {
  async findOneApiKey(key: string): Promise<Express.User | null> {
    if(key == "123") return {
      id: "uuid",
      name: "test"
    };

    return null;
  }

  async findOneUser(username: string, password?: string): Promise<Express.User> {
    if(!password) {
      return {
        id: "uuid",
        name: username,
      }
    }

    console.log("username: ", username);
    console.log("password: ", password);

    if(username == "maxmustermann" && password == "1234") {
      return {
        id: "uuid",
        name: username,
      }
    }
    // TODO
    return null;
  }

  async findOneSession(id: string): Promise<Express.User> {
    // TODO
    return {
      id: "uuid",
      name: "test"
    }
  }

  async saveOneSession(id: string): Promise<void> {}

  async deleteOneSession(id: string): Promise<void> {}

  async findOneRefresh(id: string): Promise<Express.User> {
    // TODO
    return {
      id: "uuid",
      name: "test"
    }
  }

  async saveOneRefresh(id: string): Promise<void> {

  }

  async deleteOneRefresh(id: string): Promise<void> {

  }

  async findOneAnonymous<U>(id: string): Promise<Express.User> {
    // TODO
    return {
      id: "uuid",
      name: "test"
    }
  }

  async registerAnonymousUser() {

  }
}
