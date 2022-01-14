import express from "express";
import {watch, getEdit, postEdit, deleteVideo, getUpload, postUpload} from "../controllers/videoController";
import { protectorMiddleware } from "../middleware";

const videoRouter = express.Router();

// /watch에 request를 요청하면 handleWatch 함수가 실행
// expression(정규식)을 사용하여 id의 값을 digit으로 정함.
videoRouter.route("/:id([0-9a-f]{24})").get(watch);
// 2개를 합친 표현
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(postUpload);
// 원래는 upload보다 :id가 아래에 있어야함. upload도 변수로 인식하기 때문.
// 정규식(regular expresstion)을 사용하면 숫자만 인식하게 할 수 있음.

export default videoRouter;