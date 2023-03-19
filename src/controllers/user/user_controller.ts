import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { LoginUserRequestDto } from "src/dtos/user/login_user_request_dto";
import { LoginUserResponseDto } from "src/dtos/user/login_user_response_dto";
import { RegisterUserRequestDto } from "src/dtos/user/register/register_user_request_dto";
import { UserEntity } from "src/entities/user";
import { UserRepository } from "src/repositories/user_repository";
import { GenericResponse } from "../../dtos/generic_response";
import { GenericController } from "../generic/generic_controller";

export default class UserController extends GenericController<UserEntity> {
  protected _repository: UserRepository;

  constructor(repository: UserRepository) {
    super(repository);
    this._repository = repository;
  }

  register = async (req: Request<RegisterUserRequestDto>, res: Response) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const registerModel: UserEntity = await this._repository.create(req.body);
    const token = jwt.sign(
      {
        id: registerModel.id,
        fullName: registerModel.fullName,
        email: registerModel.email,
      },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1h" }
    );
    let responseModel: LoginUserResponseDto = {
      email: registerModel.email,
      fullName: registerModel.fullName,
      id: registerModel.id,
      token,
      createdDate: registerModel.createdDate,
      isDeleted: registerModel.isDeleted,
      updatedDate: registerModel.updatedDate,
    };

    if (registerModel === null) {
      return res.json({ message: "Başarısız!" });
    }
    const registerResponse: GenericResponse<LoginUserResponseDto> = {
      data: responseModel === undefined ? {} : responseModel,
      isSuccess: true,
      message:
        responseModel === undefined
          ? "Böyle bir kayıt bulunamamıştır"
          : "İşlem Başarılı",
    };

    return res.json(registerResponse);
  };

  login = async (req: Request<LoginUserRequestDto>, res: Response) => {
    try {
      const user = await this._repository.getOneWithCondition({
        email: req.body.email,
      });
      const token = jwt.sign(
        {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        process.env.JWT_SECRET || "SECRET_KEY",
        { expiresIn: "1h" }
      );
      user.token = token;
      const registerResponse: GenericResponse<LoginUserResponseDto> = {
        data: user === undefined ? {} : user,
        isSuccess: true,
        message:
          user === undefined
            ? "Böyle bir kayıt bulunamamıştır"
            : "İşlem Başarılı",
      };

      return res.status(200).json(registerResponse);
    } catch (error) {
      return res.status(500).json({ message: "Hatalı İşlem" });
    }

    // const registerModel = await this._repository.login(req, res);
    // if (registerModel === null) {
    //   return res.json({ message: "Başarısız!" });
    // }
    // return await this.create(registerModel, res);
  };
}
