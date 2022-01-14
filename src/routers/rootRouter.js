import express from "express";
// {}는 default export가 아닌 경우 사용 > default는 아무 이름이나 가능
import {getLogin, postLogin, getJoin, postJoin} from "../controllers/userController"
import {search, home} from "../controllers/videoController"
import {publicOnlyMiddleware} from "../middleware";

// clean code를 위해 다시 정리
const rootRouter = express.Router();

rootRouter.get("/",home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/search",search);

// 다른 파일로부터 private한 상태 > export의 절차가 필요
export default rootRouter;


