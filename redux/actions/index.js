import { getFirestore,collection, getDoc ,doc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { USER_STATE_CHANGE } from '../constant';

export const fetchUsers=()=>{
    return(
        async(dispatch)=>{
            // user정보
            const auth = await getAuth();
            const {uid} = auth.currentUser;
            console.log("userID는",uid)
            // FireStore DB
            const db = await getFirestore();
            // data 가져오기(db,collection이름,docID)
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("user정보가 있음")
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