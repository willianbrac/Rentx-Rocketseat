import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateUserController } from "@modules/accounts/useCases/CreateUser/CreateUserController";
import { ProfileUserController } from "@modules/accounts/useCases/profileUser/profileUserControler";
import { UpdateUserAvatarController } from "@modules/accounts/useCases/UpdateUserAvatar/updateUserAvatarController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticate";

const usersRouter = Router();
const uploadAvatar = multer(uploadConfig);
const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const profileUserController = new ProfileUserController();

usersRouter.post("/", createUserController.handle);
usersRouter.patch(
    "/avatar",
    ensureAuthenticated,
    uploadAvatar.single("avatar"),
    updateUserAvatarController.handle
);
usersRouter.get("/profile", ensureAuthenticated, profileUserController.handle);

export { usersRouter };
