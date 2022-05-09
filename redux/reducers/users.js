import {USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE,CLEAR_DATA,USERS_LIKES_STATE_CHANGE} from "../constant"

// 여기서 users는 내가 following 사람들의 user정보
const initialState={
    users:[],
    userLoaded:0,
    feed: [],
}

export const users =(state=initialState,action)=>{
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users,action.user]
            }
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                userLoaded: state.userLoaded+1,
                feed: [...state.feed, ...action.posts]
            }
        case USERS_LIKES_STATE_CHANGE:
            // 모든 사람들의 post중에서 내가 보고있는 postId와 동일하다면 post 정보에 Likes를 했는지 추가하여 넘겨줌
            // 만약 같지 않는 경우는 그냥 내가 post 정보를 요청하지 않은 상황이므로 post를 넘겨줌
            return{
                ...state,
                feed : state.feed.map((post)=>
                    (post.id == action.postId ? 
                        {...post,currentUserLike:action.currentUserLike}:
                        {...post})
                )
            }

        case CLEAR_DATA:
            return initialState
            
        default:
            return state;
        }
}


