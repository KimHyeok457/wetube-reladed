# Wetube Reloaded
라우터는 우리가 작업중인 주제를 기반으로 URL을 그룹화해줌.

global router
/ -> HOME
/join -> join
/login -> Login
/search -> Search

users router
/users/:id -> see User Profile
/users/edit -> Edit My Profile
/users/delete -> Delete My Profile

videos router
/videos/:id -> Watch Video
/videos/upload -> upload Video
/videos/:id/edit -> Edit Viedo
/videos/:id/delete -> Delete Video
