import React,{useEffect,useState} from 'react'
import {StyleSheet,View, Text,Image,FlatList,Button,ActivityIndicator} from 'react-native'
import { useSelector,useDispatch} from 'react-redux'
import { fetchUserPosts,fetchUsers} from '../../redux/actions';
import { getAuth } from "firebase/auth";
import { getFirestore,collection, getDocs,getDoc ,doc,query, orderBy} from 'firebase/firestore';


// 여기서 들어오는 paramsUid는 2가지의 경우로 들어온다.
// 1) user가 profile tab을 클릭시 본인의 uid를 getAuth부터 받아서 들어감
// 2) 다른 사람들의 id검색을 위해 Search 컴포넌트에서 검색을 통해 가져온 user의 uid
const Profile = ({route:{params:{uid:paramsUid}}}) => {

  const dispatch = useDispatch(); 

  const [loaindg,setLoaindg]=useState(true);
  const SelectedUser= useSelector(state => state.userState.currentUser);
  const posts= useSelector(state => state.userState.posts);
  
  // userEffect에서 rednder을 변경하기 위해 paramsUid변경시
  // 새로운 user의 profile이 렌더링 되야 함으로, 배열에 넣어줌
  useEffect(()=>{
    console.log(paramsUid)
    // 기존의 fechUserPosts를 사용하기 위해서 함수를 변경해줌
    // 계정 당사자가 proflie 클릭하는 경우
    // 위에서의 1번의 경우
    if(paramsUid===getAuth().currentUser.uid){
      // user가 올린 posts를 받아옴
      console.log("user Profle")
      dispatch(fetchUserPosts());
      dispatch(fetchUsers());
      setLoaindg(false)
    }
    // 다른 user의 post를 가져옴
    // 위에서의 2번의 경우
    else{
      console.log("another user Profle")
      dispatch(fetchUserPosts(paramsUid));
      dispatch(fetchUsers(paramsUid));
      setLoaindg(false)
    }

  },[paramsUid])


  // console.log("user변경",SelectedUser)

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{SelectedUser.name}</Text>
        <Text>{SelectedUser.email}</Text>
        <Button   
        title='LogOut'
        onPress={async()=>{
      await auth.signOut()
      }}></Button>
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
  }
})

export default Profile