import res from "express/lib/response";
import Video from "../models/Video";

// controller와 router는 역할이 다르므로 다른 모듈(폴더)에 저장
// controller는 함수로 기능을 구현

// await를 사용한 방법 > database를 기다려줌.
export const home = async(req, res) => {
    // mongoose queries를 통해 sort를 간편히 할 수 있음.
    const videos = await Video.find({}).sort({createdAt : 'asc'});
    return res.render("home", {pageTitle : "Home", videos});    
};
export const watch = async(req, res) =>{
    const { id } = req.params; //ES6를 사용한 표현
    // id를 통해서 video를 찾음.
    const video = await Video.findById(id);
    if(video){
        // return이 없으면 if문이 끝나고 밑의 코드도 실행됨.
        return res.render("watch", {pageTitle : video.title, video});
    }
    return res.render("404", { pageTitle: "Video not found."});
} 

export const getEdit = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    // error가 발생할 경우를 먼저 처리하는 순서로.
    if(!video){
        return res.status(404).render("404", { pageTitle: "Video not found."}); 
    }
    return res.render("edit", {pageTitle: `Edit ${video.title}`, video});
}
export const postEdit = async(req, res) => {
    const { id } = req.params;
    const { title, description, hashtags} = req.body;
    // video object가 필요하지 않아서 exists를 통해 true or false만 검사
    const video = await Video.exists({_id : id});
    if(!video){
        return res.status(404).render("404", { pageTitle: "Video not found."}); 
    }
    // 일일이 나열하지 않아도 밑 한 줄로 update
    // array 형태의 hashtags를 받아서 comma를 기준으로 나누고 시작이 #인지 확인.
    await Video.findByIdAndUpdate(id, {
        title, 
        description, 
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle : "Upload Video"});
}

export const postUpload = async(req, res) => {
    // upload.pug에 사용된 name을 가져오는 변수
    const { title, desciption, hashtags } = req.body;
    try {
        // javascript object를 사용하지 않고 promise를 사용하여 data가 입력되기를 기다리기.
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
            meta: {
                views: 0,
                rating: 0,
            }
        });
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("upload", 
        {   pageTitle: "Upload Video", 
            errorMessage: error._message
        })
    }
}

export const deleteVideo = async(req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async(req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                // $regex 는 mongodb에 속한 표현. 문자를 검색할 때 사용.
                // regular expresstion을 사용 keyword가 포함된 대소문자 무시하고 i(ignore) 검색
                $regex: new RegExp(`${keyword}`, "i")
            },
        });
    }
    return res.render("search", {pageTitle : "Search", videos});
}

