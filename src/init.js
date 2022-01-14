// database file import > 서버와 데이터베이스를 연결
// initalilze 파일 

// require("dotenv").config();
import "dotenv/config"; // 위의 내용과 같다. 하지만 require는 사용하는 모든곳에 써야함.
import "./db";
import "./models/Video";
import "./models/User";

import app from "./server";

const PORT = 4000;

// 외부 접속을 listen
const handleListening = () => console.log(`Server listeting on port http://localhost:${PORT}`);
// sever가 시작할 때 호출되는 함수
app.listen(PORT , handleListening);