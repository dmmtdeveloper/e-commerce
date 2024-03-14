import {Router} from "express"
import { createUser, loginUser } from "../controllers/users"

const userRouter = Router()

userRouter.route("/auth").post(loginUser)
userRouter.route("/user").post(createUser)
userRouter.route("/user").get()



export default userRouter