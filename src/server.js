// server.js 파일의 역할 > express와 configuration에 관련된 것들

// babel을 추가함으로써 import를 사용할 수 있음.
// nodemon은 파일이 수정되는 것을 감지
import express from "express";
import morgan from "morgan"; // const express = require("express");
import session from "express-session";
import MongoStore from "connect-mongo";

import globalRouter from "./routers/rootRouter"; // global router를 import해줌.
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { logout } from "./controllers/userController";
import { localsMiddleware } from "./middleware";

// application 생성
const app = express();
const logger = morgan("dev");

// set 함수를 통해 express에게 pug를 사용한다 알려줌.
app.set("view engine", "pug");
// 기본 directory를 views에서 src로 이동
app.set("views", process.cwd() + "/src/views");
// req.body 존재 X
app.use(express.urlencoded({extended:true}));
// req.body 존재 O
app.use(logger);

// router앞에 session을 적어줘야함. session middleware는 사이트로 들어오는 모든 것을 기억.
app.use(session({
    // 쿠키에 sign할 때 사용하는 string, string을 알아보기 어렵게 해놔야 github 같은 곳에 올릴 때 안전.
    secret: process.env.COOKIE_SECRET,
    resave: false,
    // login한 사람에게만 cookie를 줌.
    saveUninitialized: false,
    // cookie의 만료시간을 정해줌.
    cookie: {
        maxAge: 2000000,
    },
    // 드러내지 않고 싶은 정보는 .env로 
    store: MongoStore.create({mongoUrl : process.env.DB_URL}),
})
);

app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
        console.log(sessions);
        next();
    })
})

// template으로 변수를 보내는 방법, 순서도 중요 (session 다음)
app.use(localsMiddleware);

app.use("/",globalRouter);
app.use("/videos",videoRouter);
app.use("/users", userRouter);

export default app;

