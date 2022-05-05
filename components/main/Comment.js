import React,{useState,useEffect} from 'react'
import { View, Text,FlatList,Button,TextInput } from 'react-native'
import { useSelector,useDispatch} from 'react-redux'
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs,addDoc,serverTimestamp,query,orderBy} from 'firebase/firestore';


const Comment = ({route:{params:{postId:paramsPostId,followingUid}}}) => {

  const dispatch = useDispatch(); 

  const currentUser= useSelector(state => state.userState.currentUser);

  const [comments,setComments]=useState([])
  const [postId,setPostId]=useState("")
  const [commentText,setCommentText]=useState("")


//   console.log("redux currnetUser",currentUser)

  useEffect(async()=>{
      console.log("rendering")
      if(paramsPostId!==postId){
        const db = await getFirestore();
        // 이 문서의 마지막 collection이 어디 까지인지 찾아서 쭉 나열한담에 getDocs를 통해서 문서를 가져오면됨

        const collectionRef = await collection(db, "posts",followingUid,"userPosts",paramsPostId,"comments");
        const q = await query(collectionRef, orderBy("creation", "desc"));
        const querySnapshot = await getDocs(q);
        const comments = querySnapshot.docs.map(doc =>{
            let commentId=doc.id;
            let data=doc.data();
            return {
                commentId,...data
            }
        })
        setComments(comments)
    }
    setPostId(paramsPostId)
},[postId])


const onCommentSend=async ()=>{
    const auth =  await getAuth();
    const {uid} = auth.currentUser;
    const db = await getFirestore();
    // redux에 있는 user 정보를 받아옴

    // 이 문서의 마지막 collection이 어디 까지인지 찾아서 쭉 나열한담에 getDocs를 통해서 문서를 가져오면됨
    const collectionRef = await collection(db, "posts",followingUid,"userPosts",paramsPostId,"comments");
    const commentRef = await addDoc(collectionRef, {
        creator:uid,
        text:commentText,
        creation:serverTimestamp(),
        // redux에서 현재 user 정보를 가져와서 comment에다가 써줌
        // 나중에 누구 comment인지 email / name 확인해야 되서 변경해줌
        ...currentUser
      }).then(()=>{
          console.log("Comment FireStore저장완료!")
          
        //  save가 있는 stackNavigator에서 가장 상위인 Main.js로 가서
        //  Main.js에 있는 bottomNavigator의 inti 값인 Feed.js로 감
      }).catch((err)=>{ console.log("FiresotreErr",err)}).finally(
         ()=>{
            setCommentText("")
            // comment 저장하고 다시 렌더링해서 보여주기 위해서 PostId를 reset함
            setPostId("")
         }
      );
}

  return (
    <View>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={comments}
          keyExtractor={(item)=>(item.commentId)}
          renderItem={({item})=>(
              <View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                  <Text>text : {item.text}</Text>
                  <Text>작성자 : {item.name}</Text>
              </View>
          )}
        />
        <View>
            {/* 아래에 value에 commetText 써줘야 reset이 되는 듯 */}
            <TextInput 
                value={commentText}
                placeholder='comment...'
                onChangeText={(txt)=>{setCommentText(txt)}}
            ></TextInput>
            <Button 
                title='Send'
                onPress={()=>{
                    onCommentSend()
                 }}>
            </Button>
        </View>

    </View>
  )
}

export default Comment