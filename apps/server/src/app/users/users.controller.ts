import {Controller, Get, Req, UseGuards} from "@nestjs/common";
import {UsersService} from "./users.service";
import {Request} from "express";
import {GeneralAuthGuard} from "@simple-auth/nestjs";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(GeneralAuthGuard)
  @Get("me")
  async me(@Req() req: Request) {
    console.log("req.user: ", req.user);
    return this.usersService.findOneUser("");
  }
}
