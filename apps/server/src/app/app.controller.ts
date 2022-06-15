import {Controller, Get, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import {KeyAuthGuard} from "@simple-auth/nestjs";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(KeyAuthGuard)
  @Get()
  getData() {
    return this.appService.getData();
  }
}
