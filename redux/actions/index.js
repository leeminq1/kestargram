import { getFirestore, collection, getDocs, getDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { USER_STATE_CHANGE,USER_POSTS_STATE_CHANGE,USER_FOLLOWING_STATE_CHANGE,USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE,CLEAR_DATA,USERS_LIKES_STATE_CHANGE} from '../constant';




export const clearData=()=>{
    return (
        (dispatch)=>{
            dispatch({type:CLEAR_DATA})
        }
    )
}


// paramsUid는 다른 사람의 id를 클릭해서 profile로 연결할 때 생기는 값
export const fetchUsers=(paramsUid)=>{
    return(
        async(dispatch)=>{
            // user정보
            const auth = await getAuth();
            const {uid} = auth.currentUser;
            // console.log("userID는",uid)
            // FireStore DB
            const db = await getFirestore();
            // data 가져오기(db,collection이름,docID)
            const docRef = doc(db, "users", paramsUid?paramsUid:uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("user정보가 있음")
                // dispatch ( action생성함수 ) 이 들어간다. 
                // action생성함수는 actions/index.js에 정의되어 있고 
                // 실제 action에 대한 수행은 reducers/user
                dispatch({type: USER_STATE_CHANGE,currentUser:docSnap.data()})
            } else {
            // doc.data() will be undefined in this case
            console.log("user정보가 존재하지 않음")
            }
        }
    )
}

// paramsUid는 다른 사람의 id를 클릭해서 profile로 연결할 때 생기는 값
export const fetchUserPosts=(paramsUid)=>{
    return(
        async(dispatch)=>{
            // user정보
            const auth = await getAuth();
            const {uid} = auth.currentUser;
            // FireStore DB
            const db = await getFirestore();
            // 2중으로 중첩된 collection에서 data 가져오기(db,collection이름,docID,subCollection)
            // 정렬포함
            const docRef = await collection(db, "posts", paramsUid?paramsUid:uid,"userPosts");
            const q = await query(docRef, orderBy("creation", "asc"));
            const querySnapshot = await getDocs(q);
            // 여기서 querySanpshot에서 한개씩 가져오면 저장되어있는 object이다.
            // posts = [{},{},{}] 의 형태로 userPosts 아래 값들을 넣는다.
            const posts = querySnapshot.docs.map(doc => ({
                ...doc.data()
              }));
              dispatch({type: USER_POSTS_STATE_CHANGE,posts:posts})
        }
    )
}


// paramsUid는 다른 사람의 id를 클릭해서 profile로 연결할 때 생기는 값
export const fetchUserFollowing=()=>{
    return(
        async(dispatch)=>{
            
            // console.log("Follow Func 실행!")
            // user정보
            const auth = await getAuth();
            const {uid} = auth.currentUser;
            // FireStore DB
            const db = await getFirestore();
            const collectionRef =collection(db, "following", uid,"userFollowing");
            // const querySnapshot = await getDocs(collectionRef);
            // ID만 가져오게함
            await onSnapshot(collectionRef,(snapshot)=>{
                const following=snapshot.docs.map((doc)=>{
                    // console.log("doc의 map")
                    // console.log(doc.id)
                    return doc.id
                })
                dispatch({type: USER_FOLLOWING_STATE_CHANGE,following:following})
                // following 되어있는 user를 가져오기 위함
                // following 값은 follow 되어있는 user들의 id
                for (let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i]));
                }
            })


    }
)}

// 전체적인 순서 정리 
// 전체 시작 fetchUserFollowing -> fetchUsersData( following 수 만큼 following  사람의uid로 user 정보의 배열을 모음)
//                              -> fetchUserFollowingPosts ( following 수 만큼 following  사람의uid로 posts 배열을 만듦)

// 1) 내 uid로 조회해서 following 되어있는 사람들의 uid를 모아서 배열을 만듦 following : [followinguid,followinguid,followinguid..] 
// 2) following 되어있는 사람들의 배열을 가지고 하나씩 꺼내서 followinguid를 통해서 
//    fireStore에서 user 정보를 가지고 와서 배열로 만듦 , users : [{following user info},{},{} ...]
// 3) 2)과 동시에 following 된 id를 가지고 posts를 가지고 오기 위해서 fetchUserFollowingPosts()를 실행시킴
//    이때 posts collection에서 ollowing 된 id로 가져온 다음에 users내에 feed로 넘겨준다. 


// fetch Data
// following 되어 있는 다른 user들의 정보를 가져오기 위한 함수
// 여기서 return하는 user값에는 내가 follow한 사람들의 user정보가 들어있음.
export const fetchUsersData=(followingUid)=>{
    
    // getState는 redux에서 상태를 받아오는 함수
    // rootreducer 아래에 userState내에 있는 users array를 가져옴
    return (async(dispatch,getState)=>{
        // found는 기존내 있는 following 되어있는 redux에 있는 users 배열에서
        // following 되어 있는 사람들의 정보가 있는 없는지 확인함
        // 없을 경우 firestore에서 가져와서 redux users:[]에 없어줌
        const found =await getState().usersState.users.some(element=>element.uid===followingUid);
        // console.log("found",found)
        if (!found){
              // console.log("userID는",uid)
              // FireStore DB
              const db = await getFirestore();
              // data 가져오기(db,collection이름,docID)
              const docRef = doc(db, "users",followingUid);
              const docSnap = await getDoc(docRef);

            // FireStore에서 존재하는 followingUid 일경우 user 정보를 받아옴
              if (docSnap.exists()) {
                  let user=docSnap.data()
                //   user.uid=docSnap.id;
                //   following 되어있는 user의 정보를 받아올 때 사용함
                  dispatch({type: USERS_DATA_STATE_CHANGE,user:user})
                //   following 되어있는 user들의 posts를 받아올 때 사용함
                  dispatch(fetchUserFollowingPosts(user.uid))

              } else {
              // doc.data() will be undefined in this case
              console.log("user정보가 존재하지 않음")
              }

        }
    })

}

// user가 following 된사람들의 Posts를 가져옴
// 위에서 following 되어 있는 정보 중에는 본인의 uid도 들어갈 수 있음
export const fetchUserFollowingPosts=(followingUid)=>{
    return(
        async(dispatch,getState)=>{
            // user정보
            const auth = await getAuth();
            const {uid} = auth.currentUser;
            // FireStore DB
            const db = await getFirestore();
            // 2중으로 중첩된 collection에서 data 가져오기(db,collection이름,docID,subCollection)
            // 정렬포함
            const docRef = await collection(db, "posts", followingUid?followingUid:uid,"userPosts");
            const q = await query(docRef, orderBy("creation", "asc"));
            const querySnapshot = await getDocs(q);

            // 아래의 userState.users에는 내가 following 되어 있는 사람들의 정보가 들어있음
            // usrs : [{user정보},{user정보},{} ... ]
            // 그중에서 following 되어 있는 uid 와 본인의 uid일 경우
            // 이미 위에서 받아온 followingUid는 following 된 사람들의 uid이므로 posts collection내에서
            // 해당 followingUid로 되어있는 것을 다 가져오면 결국 following 된 사람들의 posts만
            // 가져올 수 있음
            // const user = getState().usersState.users.find(element => element.uid === followingUid || uid);
            
            // postId는 comment 확인을 위해서 어떤 post인지 알아야 되서 필요하고
            // data는 Feed에 들어있는 정보이며
            // followingUid commet를 찾기위해서 갈때 posts --> uid --> userPosts내에 postId로 찾아야 되서필요함
            const posts = querySnapshot.docs.map(doc => {
                let postId=doc.id
                let data=doc.data()
                return { postId, ...data,followingUid:followingUid }
            });

            console.log("fetchUserFollowingPosts",posts)
            // 사람들이 올린 모든 posts 에서 내가 좋아요를 했는 지 안했는 지 정보를 가져오기 위함
            // 여기서 followingUid는 post -> followingUid -> usePosts 할 때 사용하기 위함
            for (let i=0; i<posts.length; i++ ){
                dispatch(fetchUserFollowingLikes(followingUid,posts[i].postId))
            }
            
            dispatch({type: USERS_POSTS_STATE_CHANGE,posts:posts})
            // getState()는 redux내에 있는 모든 state 정보를 가지고 옴
            // console.log(getState())
        }
    )
}

// likes를 가져옴
export const fetchUserFollowingLikes=(followingUid,postId)=>{
    return(
        async(dispatch,getState)=>{
            // user정보
            const auth = await getAuth();
            const {uid} = auth.currentUser;
            // FireStore DB
            const db = await getFirestore();

            // likes collection 안에 사용자의 uid가 들어있으면 내가 좋아요를 눌렀던 글이다.
            const collectionRef = await collection(db, "posts", followingUid?followingUid:uid,"userPosts",postId,"likes");
            // collection으로 끝난 다음에 doc ("colleciton", 문서 id) 안에 문서 id를 넣으면 특정한 id의 문서를 찾을 수있다.
            const docRef = doc(collectionRef,uid);
            const docSnap = await getDoc(docRef);

            let currentUserLike=false;
            if (docSnap.exists()) {
                console.log("likes 존재")
                currentUserLike=true
            } else {
                // doc.data() will be undefined in this case
                console.log("likes 존재하지 않음")
            }

            dispatch({type: USERS_LIKES_STATE_CHANGE,postId:postId,currentUserLike:currentUserLike})

        }
    )
}