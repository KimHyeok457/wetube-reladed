import express from "express";
import {remove,
        see, 
        logout, 
        startGithubLogin, 
        finishGithubLogin, 
        getEdit, 
        postEdit
} from "../controllers/userController";
import {protectorMiddleware, publicOnlyMiddleware} from "../middleware";

const userRouter = express.Router();

// route의 역할
userRouter.get("/logout", protectorMiddleware, logout);
// all은 middleware를 모두 적용하겠다.
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/delete", remove);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(":id", see);

export default userRouter;