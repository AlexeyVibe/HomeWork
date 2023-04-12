import {Test, TestingModule} from "@nestjs/testing";
import {UsersService} from "../src/users/users.service";
import {getModelToken} from "@nestjs/sequelize";
import {User} from "../src/users/users.model";
import {RolesService} from "../src/roles/roles.service";
import {HttpException} from "@nestjs/common";


describe('UsersService', () => {
    let service: UsersService;

    const mockUser = {id: 1, email: 'test1@example.com', password: 'password1',};
    const mockCreateUserDto = {email: 'test@example.com', password: 'password', phone: '1231313', name: 'asdads'};
    const mockRole = {id: 1, value: 'ADMIN'};
    const mockAddRoleDto = {value: 'ADMIN',userId: 1};

    const mockUsersRepository = {
        create: jest.fn().mockResolvedValue(mockUser),
        getAllUsers: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn().mockResolvedValue(mockUser),
        findByPk: jest.fn().mockResolvedValue(mockUser.id),
        update: jest.fn().mockResolvedValue(mockUser.id).mockResolvedValue(mockCreateUserDto),
        destroy: jest.fn().mockResolvedValue(mockUser.id),
    };

    const mockRolesService = {
        getRoleByValue: jest.fn().mockResolvedValue(mockRole),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService, {
                    provide: getModelToken(User),
                    useValue: mockUsersRepository
                },
                RolesService
            ],
        }).overrideProvider(RolesService).useValue(mockRolesService).compile();

        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createUser', () => {
        it('should create a user with role ADMIN', async () => {
            const result = await service.createUser(mockCreateUserDto);

            expect(mockUsersRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
            expect(mockRolesService.getRoleByValue).toHaveBeenCalledWith('ADMIN');
            expect(result).toEqual({...mockUser, roles: [mockRole]});
        });
    });

    describe('getAllUsers', () => {
        it('should return an array of users', async () => {
            const users = [{id: 1, email: 'test1@example.com', password: 'password1', roles: []},
                {id: 2, email: 'test2@example.com', password: 'password2', roles: []},
            ];
            mockUsersRepository.findAll.mockResolvedValue(users);

            expect(await service.getAllUsers()).toEqual(users);
            expect(mockUsersRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUserByEmail', () => {
        it('should return a user with the specified email', async () => {


            const user = await service.getUserByEmail(mockUser.email);

            expect(user).toBeDefined();
            expect(user).toEqual(mockUser);
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: {email: mockUser.email},
                include: {all: true},
            });
        });

        it('should return null if user is not found', async () => {


            const user = await service.getUserByEmail('invalid_email@example.com');

            expect(user).toBeNull();
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: {email: 'invalid_email@example.com'},
                include: {all: true},
            });
        });
    });

    describe('updateUser', () => {
        it('should update user', async () => {

            await service.updateUser(mockUser.id, mockCreateUserDto);

            expect(mockUsersRepository.update).toHaveBeenCalledWith(mockCreateUserDto, { where: { id:mockUser.id } });
        });
    });

    describe('deleteUser', () => {
        it('should delete user by id', async () => {
            await service.deleteUser(mockUser.id);

            expect(mockUsersRepository.destroy).toHaveBeenCalledWith({
                where: { id: mockUser.id },
            });
        });
    });

    describe('findById', () => {
        it('should return a user by id', async () => {

            jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(mockUser);

            const result = await service.findById(1);

            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { all: true },
            });
            expect(result).toEqual(mockUser);
        });

        it('should return null if user not found', async () => {
            jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(null);

            const result = await service.findById(1);

            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { all: true },
            });
            expect(result).toBeNull();
        });
    });


    describe('addRole', () => {
        it('should add role to user', async () => {

            expect(await service.addRole(mockAddRoleDto)).toEqual(mockAddRoleDto);
            expect(mockUsersRepository.findByPk).toHaveBeenCalledWith(mockAddRoleDto.userId);
            expect(mockRolesService.getRoleByValue).toHaveBeenCalledWith(mockAddRoleDto.value);

        });

        it('should throw HttpException if user or role not found', async () => {

            mockUsersRepository.findByPk.mockResolvedValue(undefined);
            mockRolesService.getRoleByValue.mockResolvedValue(undefined);

            await expect(service.addRole(mockAddRoleDto)).rejects.toThrow(HttpException);
            expect(mockUsersRepository.findByPk).toHaveBeenCalledWith(mockAddRoleDto.userId);
            expect(mockRolesService.getRoleByValue).toHaveBeenCalledWith(mockAddRoleDto.value);
        });
    });
});
