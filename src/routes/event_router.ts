import { Router } from "express";
import { EventRepository } from "../repositories/event_repository";

import EventController from "../controllers/event/event_controller";

const router = Router();

const eventRepository: EventRepository = new EventRepository("events");
const _controller: EventController = new EventController(eventRepository);

router.post("/", _controller.create);

router.get("/", _controller.getAll);

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
