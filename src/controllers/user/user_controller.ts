import { Request, Response } from "express";
import {
  GenericListResponse,
  GenericResponse,
} from "src/dtos/generic_response";
import { UserDto } from "../../dtos/userDto";
import { UserEntity } from "../../entities/user";
import { UserRepository } from "../../repositories/user_repository";

export default class UserController {
  private _repository: UserRepository;

  constructor() {
    this._repository = new UserRepository("users");
  }

  getUsers = async (_: Request, res: Response) => {
    try {
      const resp: UserEntity[] = await this._repository.getAll();

      const userDto: UserDto[] = resp.map((element) => {
        const dto: UserDto = {
          email: element.email,
          fullName: element.fullName,
          id: element.id,
          createdDate: element.createdDate,
          isDeleted: element.isDeleted,
          updatedDate: element.updatedDate,
        };
        return dto;
      });

      const genericList: GenericListResponse<UserDto> = {
        data: userDto,
        isSuccess: true,
        message: "İşlem Başarılı.",
      };

      return res.json(genericList);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };

  createUser = async (req: Request<UserEntity>, res: Response) => {
    try {
      const resp: UserEntity = await this._repository.create(req.body);
      const genericResponse: GenericResponse<UserEntity> = {
        data: resp,
        isSuccess: true,
        message: "İşlem Başarılı.",
      };
      return res.json(genericResponse);
    } catch (error) {
      return res.json({ message: error.message });
    }
  };
}

// export const
