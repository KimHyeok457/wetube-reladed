export const localsMiddleware = (req, res, next) => {
    // loacl object의 이름은 마음대로 쓸 수 있다. 
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    // || {}는 아이디가 없는 사람
    res.locals.loggedInUser = req.session.user || {};
    next();
} 

// 로그인하지 않은 사람이 페이지로 가는걸 방지.
export const protectorMiddleware = (req, res, next) => {
    // 로그인 되어있을 경우 next()
    if(req.session.loggedIn){
        next();
    }else {
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req,res,next) => {
    if(!req.session.loggedIn){
        return next();
    } else{
        return res.redirect("/")
    }
}