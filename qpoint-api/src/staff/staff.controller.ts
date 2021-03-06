import {Body, Controller, Get, Param, Post, UsePipes} from "@nestjs/common";
import {ValidationPipe} from "../utils/validation.pipe";
import {StaffService} from "./staff.service";
import {StaffLoginDto, StaffRegisterDto, ShowClassWithStaffIdDto} from "./staff.dto";


@Controller('staff')
export class StaffController {
    constructor(private staffService: StaffService) {
    }

    @Post('show-all-staffs')
    @UsePipes(new ValidationPipe())
    showAllStaffs() {
        return this.staffService.showAllStaffs();
    }

    // @Get('api/users/:username')
    // showOneUser(@Param('username') username: string) {
    //     return this.staffService.read(username);
    // }

    // @Get('auth/whoami')
    // showMe(@User('username') username: string) {
    //     return this.staffService.read(username);
    // }

    @Post('get-admin-account-details')
    getAdminAccountDetails(@Body() payload: any) {
        return this.staffService.getAdminAccountDetails(payload);
    }

    @Get('auth/get-account-details-by-username/:username')
    getAccountDetailsByUsername(@Param() params) {
        return this.staffService.getAccountDetailsByUsername(params.username);
    }

    @Post('auth/login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: StaffLoginDto) {
        return this.staffService.login(data);
    }

    @Post('admin-login')
    @UsePipes(new ValidationPipe())
    adminLogin(@Body() data: StaffLoginDto) {
        return this.staffService.adminLogin(data);
    }

    @Post('auth/register')
    @UsePipes(new ValidationPipe())
    adminRegister(@Body() data: StaffRegisterDto) {
        return this.staffService.adminRegister(data);
    }

    @Post('auth/change-password')
    @UsePipes(new ValidationPipe())
    changePassword(@Body() payload: any) {
        return this.staffService.changePassword(payload);
    }

    @Get('api/check-staff-exists/:username')
    checkStaffExists(@Param() params) {
        return this.staffService.checkStaffExists(params.username);
    }

    @Post('auth/admin/send-forget-password-email')
    @UsePipes(new ValidationPipe())
    sendForgetPasswordEmail(@Body() payload: any) {
        return this.staffService.sendForgetPasswordEmail(payload);
    }

    @Post('auth/admin/verify-password-reset-token')
    @UsePipes(new ValidationPipe())
    verifyPasswordResetToken(@Body() payload: any) {
        return this.staffService.verifyPasswordResetToken(payload);
    }

    @Post('show-class-with-staffId')
    @UsePipes(new ValidationPipe())
    showClassWithStaffId(@Body() payload: ShowClassWithStaffIdDto) {
        return this.staffService.showClassWithStaffId(payload)
    }

}