import { Router } from "express";
import { UserRepository } from "../repositories/user_repository";

import UserController from "../controllers/user/user_controller";

const router = Router();

const userRepository: UserRepository = new UserRepository("users");
const _controller: UserController = new UserController(userRepository);

router.post("/", _controller.create);
router.post("/register", _controller.register);
router.get("/", _controller.getAll);

router.post("/login", _controller.login);

router.get("/:userId", (req, res) =>
  _controller.getById(req, res, parseInt(req.params.userId))
);

router.put("/:id", (req, res) =>
  _controller.update(req, res, parseInt(req.params.id))
);

router.delete("/:userId", (req, res) =>
  _controller.delete(req, res, parseInt(req.params.userId))
);

export default router;
