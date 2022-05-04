import React,{useEffect,useState} from 'react'
import {StyleSheet,View, Text,Image,FlatList,Button,ActivityIndicator} from 'react-native'
import { useSelector,useDispatch} from 'react-redux'
import { fetchUserPosts,fetchUsers,fetchUserFollowing} from '../../redux/actions';
import { getAuth } from "firebase/auth";
import { getFirestore,collection,doc,setDoc,deleteDoc,addDoc} from 'firebase/firestore';


// 여기서 들어오는 paramsUid는 2가지의 경우로 들어온다.
// 1) user가 profile tab을 클릭시 본인의 uid를 getAuth부터 받아서 들어감
// 2) 다른 사람들의 id검색을 위해 Search 컴포넌트에서 검색을 통해 가져온 user의 uid
const Profile = ({route:{params:{uid:paramsUid}}}) => {

  const dispatch = useDispatch(); 

  const [loaindg,setLoaindg]=useState(true);
  // folling system
  const [following,setFollowing]=useState(false);
  const [currentUser,setCurrentUser]=useState(false);

  const SelectedUser= useSelector(state => state.userState.currentUser);
  const posts= useSelector(state => state.userState.posts);
  const followingMember= useSelector(state => state.userState.following);
  

  // save FireStor Following
  const saveFireStoreFollow=async()=>{
    setLoaindg(true)
    // FireStorage에 업로드 후 FireStore에 저장
    // 구조는 posts/uid/userPosts/{downloadURL,caption.creation}의 형태로 저장함.
    const db =await getFirestore();
    const uid=await getAuth().currentUser.uid
    const docRef = await doc(db, "following", uid);
    // 여기서 정리하면 collection / doc로 나뉘어져 있으며
    // doc는 (db명,collection이름,문서id) 의 형태로 저장할 수 있으며 최종으로 가져오는 것이 doc이다.
    // collection은 (db명,collection이름) 의 형태로 볼 수 있으며 최종으로 가져오는 것이 collection이다.
    // 즉 doc에 id를 지정해 줄때는 위와같이  doc를 쓸고 setDoc(doc(db명,collection이름,doc id),{ 저장할 obj })
    // doc에 그냥 id 안 지정해 줄때는  addDoc(collection(db명,collection이름),{ 저장할 obj })
    // 이렇게 써주면 doc id는 랜덤으로 해서 저장됨
    const postRef = await setDoc(doc(docRef, "userFollowing",paramsUid), {
      // 여기에 doc에 저장될 obj가 쓰여야 되지만 follow 기능은 필요가 없어서 비워둠
    }).then(()=>{
          console.log("userPost FireStore저장완료!")
        //  save가 있는 stackNavigator에서 가장 상위인 Main.js로 가서
        //  Main.js에 있는 bottomNavigator의 inti 값인 Feed.js로 감
      }).catch((err)=>{ console.log("FiresotreErr",err)}).finally(()=>{
        setLoaindg(false)
      });
 }


 const deleteFireStoreFollow=async()=>{
  setLoaindg(true)
  // FireStorage에 업로드 후 FireStore에 저장
  // 구조는 posts/uid/userPosts/{downloadURL,caption.creation}의 형태로 저장함.
  const db =await getFirestore();
  const uid=await getAuth().currentUser.uid
  const docRef = await doc(db, "following", uid);
  const postRef = await deleteDoc(doc(docRef, "userFollowing",paramsUid), {}).then(()=>{
        console.log("userPost FireStore 삭제완료!")
      //  save가 있는 stackNavigator에서 가장 상위인 Main.js로 가서
      //  Main.js에 있는 bottomNavigator의 inti 값인 Feed.js로 감
    }).catch((err)=>{ console.log("FiresotreErr",err)}).finally(()=>{
      setLoaindg(false)
    });
}

  // userEffect에서 rednder을 변경하기 위해 paramsUid변경시
  // 새로운 user의 profile이 렌더링 되야 함으로, 배열에 넣어줌
  useEffect(()=>{
    // following 정보받아옴

    // 기존의 fechUserPosts를 사용하기 위해서 함수를 변경해줌
    // 계정 당사자가 proflie 클릭하는 경우
    // 위에서의 1번의 경우
    if(paramsUid==getAuth().currentUser.uid){
      // user가 올린 posts를 받아옴
      console.log("user Profle")
      dispatch(fetchUserPosts());
      dispatch(fetchUsers());
      setCurrentUser(true)
      setLoaindg(false)
      

    }
    // 다른 user의 post를 가져옴
    // 위에서의 2번의 경우
    else{
      console.log("another user Profle")
      dispatch(fetchUserPosts(paramsUid));
      dispatch(fetchUsers(paramsUid));
      setCurrentUser(false)
      dispatch(fetchUserFollowing());
      setLoaindg(false)
    }
    
  // following 인지 확인
  // followingMember값을 state에서 받아오며 변화가 되면 다시 unFollw/Follow 정보를 받아오기위하여
  // lenth가 변경되면 다시 실행되게함.
  if (followingMember.indexOf(paramsUid)>-1 ){
    console.log("follow 포함")
    setFollowing(true)
  }else{
    console.log("follow 미포함")
    setFollowing(false)
  }
  },[paramsUid,followingMember.length])

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{SelectedUser.name}</Text>
        <Text>{SelectedUser.email}</Text>
        <View style={styles.btnContainer}>
          {/* cuurnetUser값이 false이면 현재 Login ID 사용자 이므로
          Follow /UnFollow 버튼을 보여주어야한다.
          */}
          {!currentUser?
          // follow 여부에 따라서 FireStor에서 저장하고 삭제하고, 함수를 다르게 사용함.
          <View>
            {following?
              <Button Button title='Unfollow' onPress={()=>{deleteFireStoreFollow()}}></Button>:
              <Button title='Follow' onPress={()=>{saveFireStoreFollow()}}></Button>
            }
          </View>  :null
        }
            <Button   
            title='LogOut'
            style={styles.btn}
            onPress={async()=>{
          await auth.signOut()
          }}></Button>
      </View>
      </View>
      { loaindg?
        <View style={{flex:1}}>
          <ActivityIndicator color="purple" size={30}></ActivityIndicator>
        </View>:
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          keyExtractor={(item)=>item.downloadURL+""}
          renderItem={({item})=>{
            return(
              <View style={styles.containerImage}>
                <Image
                  style={styles.image}
                  source={{uri:item.downloadURL}}
                >
                </Image>
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

export default Profile