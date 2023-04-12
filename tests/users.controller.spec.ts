import {Test, TestingModule} from "@nestjs/testing";
import {UsersController} from "../src/users/users.controller";
import {UsersService} from "../src/users/users.service";
import {AddRoleDto} from "../src/users/dto/add-role.dto";



describe('UsersController', () => {
    let controller: UsersController;

    const mockUsersService = {
        getAllUsers: jest.fn(),
        createUser: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
        addRole: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
            ],
        }).overrideProvider(UsersService).useValue(mockUsersService).compile();

        controller = module.get<UsersController>(UsersController);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('should return an array of users', async () => {
            const users = [
                {id: 1, email: 'test1@example.com', password: 'password1'},
                {id: 2, email: 'test2@example.com', password: 'password2'},
            ];
            mockUsersService.getAllUsers.mockResolvedValue(users);

            expect(await controller.getAll()).toEqual(users);
            expect(mockUsersService.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe('addRole', () => {
        it('should call userService.addRole with correct parameters', async () => {
            const mockAddRoleDto: AddRoleDto = {
                userId: 1,
                value: 'USER',
            };

            mockUsersService.addRole.mockResolvedValue(AddRoleDto);

            expect(await controller.addRole(mockAddRoleDto)).toBeDefined();
            expect(mockUsersService.addRole).toHaveBeenCalledWith(mockAddRoleDto);
        });
    });
});

