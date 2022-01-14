// API?? fetch??
import User from "../models/User";
// 사용하지 못하는 함수는 찾아보고 import
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { trusted } from "mongoose";

// render와 send의 차이?
//send는 해당 url에 뭔가를 보내주기만 하는것?
export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});
export const postJoin = async(req, res) => {
    const {name, username, email, password, password2, location } = req.body; 
    const pageTitle = "Join";
    if(password !== password2) {
        return res.status(400).render("join", { pageTitle, errorMessage : "Password confirmation does not match."});
    }
    // 2가지 방법으로 중복을 찾을 수 있음.
    const exists = await User.exists({ $or: [{ username : req.body.username }, { email }] })
    if(exists){
        // status는 상태코드
        return res.status(400).render("join", { pageTitle, errorMessage : "This username is already taken."});
    }
    
    await User.create({
        name, 
        username, 
        email, 
        password,
        password2,
        location,
    });
    return res.redirect("/login");
};

export const getLogin = (req, res) => res.render("Login", {pageTitle : "Login"});

export const postLogin = async(req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    // const exists = await User.exists({ username });
    const user = await User.findOne({ username, socialOnly: false }); // true면 github로 로그인 가능.
    if(!user){
        return res.status(400).render("login", {pageTitle , errorMessage: "An account with this username does not exists"});
    }
    // 첫 번째 argument는 가입할 때 한 password 두 번째 argument는 방금 입력한 password
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong password",
        })
    }
    req.session.loggedIn = true;
    req.session.user = user;
    res.redirect("/");
};

// 매번 template에 url을 적어주기보다 controller로 한 번에 작성
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        // user프로필을 읽고 user의 email을 가져옴.
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

// user가 github에서 돌아올 때 실행되는 코드
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    // fetch가 뭔가? fetch는 브라우저에만 사용가능.
    const tokenRequest = await(
            await fetch(finalUrl, {
            // post를 통해 url에 뭔가를 보내주고 있음.
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();

    // post한 정보가 맞다면 github가 token을 준다. 
    if("access_token" in tokenRequest){
        // access_token은 github API와 상호작용할 때 사용.
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        // fetch를 통해 데이터를 받아오고 json으로 데이터 추출
        const userData = await ( 
                await fetch( `${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        // private한 email을 받지 못했는데 받는 방법
        const emailData = await ( 
                await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        // 받아온 email 중 primary와 verified가 true인 email을 찾는 것.
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        // email이 없으면 다시 로그인으로
        if(!emailObj){
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email});
        // github에 email과 가입시 사용한 email이 같은 유저를 login 시켜줌.
        if(!user){
            // wetube에 계정이 없을 경우 > github로 로그인 > socialOnly true 설정
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name : userData.name,
                username: userData.login,
                email: emailObj.email, 
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        // access_token이 없을 때 
        return res.redirect("/login");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/"); 
}
export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profil e" });
};
export const postEdit = async(req, res) => {
    // request object를 이용해 로그인된 유저의 정보를 가져옴.
    // 같은 의미 cosnt id = req.session.user.id
    // const {name, email, username, location} = req.body 와 함께 ES6로 한줄로 합침.
    const { session: {
            user: { _id }, 
        },
        body :{
            name, email, username, location
        }
    } = req;
    const updatedUser = await User.findByIdAndUpdate( _id, {
            name, email, username, location,
        },
        {new: true}
    );
    // db에만 업데이트된 정보를 session도 업데이트
    req.session.user = updatedUser;
    return res.render("edit-profile");
};
// delete는 사용 불가. 자바스크립트에서 사용할 수 없는 변수.
export const remove = (req, res) => res.send("Delete User");
export const see = (req, res) => res.send("See");
