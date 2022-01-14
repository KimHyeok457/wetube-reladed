import mongoose from "mongoose";

// schema 정해줌. > database의 생김새 (형태)
const videoSchema = new mongoose.Schema({
    title: { type: String, required : true, trim: true, maxLength: 80 },
    description: { type: String, required : true, trim: true,  minLength: 20},
    // date가 꼭 필요함을 required를 사용
    createdAt: { type: Date, required : true, default: Date.now },
    hashtags: [{type: String, trim: true}],
    meta: {
        views: { type: Number, default: 0, required : true },
        rating: { type: Number, default: 0, required : true },
    },
});

// static의 사용?
videoSchema.static('formatHashtags', function(hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
})

// Middleware로 hashtag를 처리해줌.
// this는 우리가 저장하고자하는 문서를 가리킨다.
/*
videoSchema.pre('save', async function(){
    this.hashtags = this.hashtags[0].split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
})
*/

// mogoose.model로 다양한 기능 지원
const Video = mongoose.model("Video", videoSchema);
export default Video;