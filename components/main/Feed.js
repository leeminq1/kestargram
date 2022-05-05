import React,{useEffect,useState} from 'react'
import {StyleSheet,View, Text,Image,FlatList,Button,ActivityIndicator} from 'react-native'
import { useSelector,useDispatch} from 'react-redux'
import { fetchUserPosts,fetchUsers,fetchUserFollowing} from '../../redux/actions';
import { getAuth } from "firebase/auth";
import { getFirestore,collection,doc,setDoc,deleteDoc,addDoc} from 'firebase/firestore';


const Feed = ({navigation}) => {

  const dispatch = useDispatch(); 

  const [loaindg,setLoaindg]=useState(true);
  const [loadedPosts,setloadedPosts]=useState([]);

  const posts= useSelector(state => state.usersState.feed);
  const users= useSelector(state => state.usersState.users);
  const userLoaded=useSelector(state => state.usersState.userLoaded);
  const following=useSelector(state => state.userState.following);


  // 맨처음 
  useEffect(()=>{


    // 내 follow 되어있는 사람의 수와 user정보가 loaindg된 수가 동일하면 posts로 로딩이 다 되었다는 것을 뜻함
    if(userLoaded===following.length){
      posts.sort((x,y)=>{
        return(
          x.creation.toDate() - y.creation.toDate()
        )
      })
      setloadedPosts(posts)
      setLoaindg(false)
    }
    
  },[userLoaded])

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