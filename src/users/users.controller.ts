import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

@Controller('users')
export class UsersController {

    @Get()
    getUsers() {
        return 'we get all dogs';
    }    

    @Post()
    create(@Body() dogDto: DogDto) {
        return dogDto;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return `we get the dog with the id ${id}`;
    }

    @Put(':id')
    update(@Param('id') id: string) {
        return `we update the dog with the id ${id}`;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return `we delete the dog with the id ${id}`;
    }    
}
