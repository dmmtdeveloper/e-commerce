import { Router } from "express";
import { createUser, deleteUser, getMe, loginUser, updateUser } from "../controllers/users";
import { isAuthenticated } from "../middlewares/auth";
const userRouter = Router();

userRouter.route("/auth").post(loginUser);
userRouter.route("/user").post(createUser);
userRouter.route("/user/:id").get(isAuthenticated, getMe);
userRouter.route("/user/:id").delete(deleteUser).put(updateUser);


export default userRouter;
