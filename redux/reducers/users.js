import {USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE,CLEAR_DATA} from "../constant"

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
        case CLEAR_DATA:
            return {
                users:[],
                userLoaded:0,
                feed: [],
            }
            
        default:
            return state;
        }
}


