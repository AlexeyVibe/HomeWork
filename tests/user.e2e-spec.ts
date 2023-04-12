import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {UsersModule} from "../src/users/users.module";
import {getModelToken} from "@nestjs/sequelize";
import {User} from "../src/users/users.model";

import {Role} from "../src/roles/roles.model";
import {UserRoles} from "../src/roles/user-role";

describe('UsersController (e2e)', () => {
    let app: INestApplication;

    const mockUser = {id: 1, email: 'test1@example.com', password: 'password1',};
    const mockUsers = [{id: 1, email: 'test1@example.com', password: 'password1',}];
    const mockAddRoleDto = {value: 'ADMIN',userId: 1};

    const mockUsersRepository = {
        create: jest.fn().mockResolvedValue(mockUser),
        findAll: jest.fn().mockResolvedValue(mockUsers),
        findByPk: jest.fn().mockResolvedValue(mockAddRoleDto.userId),
    };

    const mockRolesRepository = {
        findOne: jest.fn().mockResolvedValue(mockAddRoleDto.value),
    };

    const mockUserRolesRepository = {
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
        }).overrideProvider(getModelToken(User)).useValue(mockUsersRepository)
            .overrideProvider(getModelToken(Role)).useValue(mockRolesRepository)
            .overrideProvider(getModelToken(UserRoles)).useValue(mockUserRolesRepository).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/users (GET)', () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect(200)
            .expect('Content-Type',/json/)
            .expect(mockUsers)
    });

    it('/users POST', () => {
        return request(app.getHttpServer())
            .post('/users/role')
            .send(mockAddRoleDto)
            .expect(201)
            .expect('Content-Type',/json/)
            .then(response => {
                expect(response.body).toEqual(mockAddRoleDto)
            })
    });
});
