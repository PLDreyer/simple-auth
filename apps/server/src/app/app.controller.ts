import {Controller, Get, UseGuards, Req} from '@nestjs/common';
import { AppService } from './app.service';
import {KeyAuthGuard} from "@simple-auth/nestjs";
import {Request} from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(KeyAuthGuard)
  @Get()
  async getData(@Req() req: Request) {
    return this.appService.getData();
  }
}
