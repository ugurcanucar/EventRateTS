import { UserEntity } from "src/entities/user";
import { GenericRepository } from "./generic_repository";

export class UserRepository extends GenericRepository<UserEntity> {}
