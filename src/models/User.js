import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    // unique는 한 개일 경우
    email: { type : String, required : true, unique : true},
    avatarUrl : String,
    // user가 github로 로그인했는지 확인.
    socialOnly: { type : Boolean, default: false },
    username: { type : String, required : true, unique : true},
    password: { type: String },
    name: { type : String, required : true},
    location : String,
});

// this는 create되는 User를 가리킨다.
userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 5);
})

const User = mongoose.model('User', userSchema);
export default User;