import React,{useEffect,useState} from 'react'
import {StyleSheet,View, Text,Image,FlatList,Button,ActivityIndicator} from 'react-native'
import { useSelector,useDispatch} from 'react-redux'
import { fetchUserPosts,fetchUsers,fetchUserFollowing,fetchUserFollowingLikes,fetchUserFollowingPosts} from '../../redux/actions';
import { getAuth } from "firebase/auth";
import { getFirestore,collection,doc,setDoc,deleteDoc,addDoc,runTransaction } from 'firebase/firestore';


const Feed = ({navigation}) => {

  const dispatch = useDispatch(); 

  const [loaindg,setLoaindg]=useState(true);
  const [loadedPosts,setloadedPosts]=useState([]);

  const posts= useSelector(state => state.usersState.feed);
  const users= useSelector(state => state.usersState.users);
  const userLoaded=useSelector(state => state.usersState.userLoaded);
  const following=useSelector(state => state.userState.following);


  const onLikePress=async(followingUid,postId)=>{

    const auth = await getAuth();
    const {uid} = auth.currentUser;
    // FireStore DB
    const db = await getFirestore();
    // likes collection 안에 사용자의 uid가 들어있으면 내가 좋아요를 눌렀던 글이다.
    const collectionRef = await collection(db, "posts", followingUid,"userPosts",postId,"likes");
    // likeCount 변경 
    // 트랜잭션 외부에서 정보전달 
    // https://firebase.google.com/docs/firestore/manage-data/transactions?hl=ko#web-version-9_1
    const likeCollectionRef=await collection(db, "posts", followingUid,"userPosts")
    const likeDocRef = doc(likeCollectionRef,postId);
    await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(likeDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }
        const newlikeCount = sfDoc.data().likeCount + 1;
        transaction.update(likeDocRef, { likeCount: newlikeCount });
      });

    // setDoc 사용할 때 뒤에 doc () 써줘야함
    const postRef = await setDoc(doc(collectionRef,uid), {}).then(()=>{
          console.log("likes FireStore저장완료!")
      }).catch((err)=>{ console.log("FiresotreErr",err)}).finally(()=>{
        // 삭제한 다음에 다시 받아오기 위해서 dispatch를 사용함
        dispatch(fetchUserFollowingLikes(followingUid,postId))
      });
  }

  const onDisLikePress=async(followingUid,postId)=>{

    const auth = await getAuth();
    const {uid} = auth.currentUser;
    // FireStore DB
    const db = await getFirestore();

    // likes collection 안에 사용자의 uid가 들어있으면 내가 좋아요를 눌렀던 글이다.
    const collectionRef = await collection(db, "posts", followingUid,"userPosts",postId,"likes");
    // likeCount 변경 
    const likeCollectionRef=await collection(db, "posts", followingUid,"userPosts")
    const likeDocRef = doc(likeCollectionRef,postId);
    await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(likeDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }
        const newlikeCount = sfDoc.data().likeCount - 1;
        transaction.update(likeDocRef, { likeCount: newlikeCount });
      });
    // const docRef=await getDocs(q);
    const postRef = await deleteDoc(doc(collectionRef,uid), {}).then(()=>{
          console.log("likes FireStore 삭제완료!")
      }).catch((err)=>{ console.log("FiresotreErr",err)}).finally(()=>{
        dispatch(fetchUserFollowingLikes(followingUid,postId))
      });
  }

  // 맨처음 
  useEffect(()=>{
    // 내 follow 되어있는 사람의 수와 user정보가 loaindg된 수가 동일하면 posts로 로딩이 다 되었다는 것을 뜻함
    if(userLoaded===following.length && following.length!==0){
      console.log("이거실행")
      posts.sort((x,y)=>{
        return(
          x.creation.toDate() - y.creation.toDate()
        )
      })
      setloadedPosts(posts)
      setLoaindg(false)
    }
    
  },[userLoaded,posts])

  return (
    <View style={styles.container}>
    { loaindg?
      <View style={{flex:1}}>
        <ActivityIndicator color="purple" size={30}></ActivityIndicator>
      </View>:
    <View style={styles.containerGallery}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={loadedPosts}
        keyExtractor={(item)=>item.downloadURL+""}
        renderItem={({item})=>{
          // console.log(item)
          return(
            <View style={styles.containerImage}>
              <Text>{item.caption}</Text>
              <Text>{item.email}</Text>
              <Text>{item.userName}</Text>
              <Image
                style={styles.image}
                source={{uri:item.downloadURL}}
              >
              </Image>
              {item.currentUserLike?
              <Button title='Dislike'
                 onPress={()=>{onDisLikePress(item.followingUid,item.postId)}}
              ></Button>:
              <Button title='Like'
                 onPress={()=>{onLikePress(item.followingUid,item.postId)}}
              ></Button>
            }
              <Text>LikeCount : {item.likeCount}</Text>
              <Text onPress={()=>{navigation.navigate('Comment',{
                postId:item.postId,
                followingUid:item.followingUid
              })}}>View Comments...</Text>
            </View>
          )
        }}
      ></FlatList>
    </View>}
    </View>
    )
  }

const styles=StyleSheet.create({
  container:{
    flex:1,
  },
  containerInfo:{
    margin:20
  },
  containerGallery:{
    flex:1,
  },
  containerImage:{
    flex:1/3
  }
  ,
  image:{
    flex:1,
    aspectRatio:1/1
  },
  btnContainer:{
    flexDirection:"row",
    justifyContent:"space-evenly",
    alignItems:"center",
    marginTop:10
  },
  btn:{
    flex:1,
  }
})

export default Feed