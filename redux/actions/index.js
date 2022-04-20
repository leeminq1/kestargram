import { getFirestore,collection, getDocs,getDoc ,doc ,collectionGroup,query, orderBy, limit,onSnapshot } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { USER_STATE_CHANGE,USER_POSTS_STATE_CHANGE } from '../constant';

export const fetchUsers=()=>{
    return(
        async(dispatch)=>{
            // user정보
            const auth = await getAuth();
            const {uid} = auth.currentUser;
            // console.log("userID는",uid)
            // FireStore DB
            const db = await getFirestore();
            // data 가져오기(db,collection이름,docID)
            const docRef = doc(db, "users", uid);
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


export const fetchUserPosts=()=>{
    return(
        async(dispatch)=>{
            // user정보
            const auth = await getAuth();
            const {uid} = auth.currentUser;
            // FireStore DB
            const db = await getFirestore();
            // 2중으로 중첩된 collection에서 data 가져오기(db,collection이름,docID,subCollection)
            // 정렬포함
            const docRef = await collection(db, "posts", uid,"userPosts");
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