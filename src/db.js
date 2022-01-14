import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, { 
    useNewUrlParser : true , 
    useUnifiedTopology : true,
});

// database와 연결이 되었는지 확인
// 2가지 event > on/once > on은 여러 번 가능/ once는 한 번만
const db = mongoose.connection;
const handleOpen = () => console.log("Connected to DB");
// error가 뜰때마다 알려줌.
db.on("error", (error) => console.log("DB Error", error));
db.once("open", handleOpen);