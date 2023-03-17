import { Router } from "express";

import postgresClient from "../config/db";
import UserController from "../controllers/user/user_controller";

const router = Router();

const _controller = new UserController();

router.post("/addUser", _controller.createUser);

router.get("/", _controller.getUsers);

router.get("/:userId", async (req, res) => {
  try {
    const query = "SELECT*FROM users where id= $1";
    const { rows } = await postgresClient.query(query, [req.params.userId]);
    return res.status(200).json({
      users: rows[0],
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.put("/updateUser/:id", async (req, res) => {
  try {
    const { email, fullName } = req.body;
    const query =
      "UPDATE users SET email = $1, fullName = $2 WHERE id = $3 RETURNING *";
    console.log(req.params);
    const values = [email, fullName, parseInt(req.params.id)];
    const { rows } = await postgresClient.query(query, values);
    if (!rows.length) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({
      user: rows[0],
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const query = "DELETE from users where id = $1 Returning *";
    const { rows } = await postgresClient.query(query, [req.params.userId]);
    if (!rows.length) return res.json({ message: "User Not Found" });
    return res.json({
      message: "User Deleted",
      user: rows[0],
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
