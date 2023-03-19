import { BaseEntity } from "src/entities/base_entity";
import { GenericRepository } from "src/repositories/generic_repository";
import { Request, Response } from "express";
import {
  GenericListResponse,
  GenericResponse,
} from "src/dtos/generic_response";
export abstract class GenericController<T extends BaseEntity> {
  protected _repository: GenericRepository<T>;

  constructor(repository: GenericRepository<T>) {
    console.log("repository");
    this._repository = repository;
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const entities = await this._repository.getAll();
      const genericListResponse: GenericListResponse<T> = {
        data: entities,
        isSuccess: true,
        message: "İşlem Başarılı",
      };
      res.status(200).json(genericListResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (_req: Request, res: Response, id: number): Promise<void> => {
    try {
      const entities: T = await this._repository.getById(id);
      const genericResponse: GenericResponse<T> = {
        data: entities === undefined ? {} : entities,
        isSuccess: true,
        message:
          entities === undefined
            ? "Böyle bir kayıt bulunamamıştır"
            : "İşlem Başarılı",
      };
      res.status(200).json(genericResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  create = async (req: Request<T>, res: Response): Promise<void> => {
    try {
      const entities = await this._repository.create(req.body);
      const genericResponse: GenericResponse<T> = {
        data: entities,
        isSuccess: true,
        message: "Ekleme Başarılı",
      };
      res.status(200).json(genericResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response, id: number): Promise<void> => {
    try {
      const entity = await this._repository.update(id, req.body);
      const genericResponse: GenericResponse<T> = {
        data: entity,
        isSuccess: true,
        message: "Güncelleme Başarılı",
      };
      res.status(200).json(genericResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (_req: Request, res: Response, id: number): Promise<void> => {
    try {
      const entity = await this._repository.delete(id);
      const genericResponse: GenericResponse<T> = {
        data: entity,
        isSuccess: true,
        message: "Silme Başarılı",
      };
      res.status(200).json(genericResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
