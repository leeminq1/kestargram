import React,{useEffect,useState} from 'react'
import {StyleSheet,View, Text,Image,FlatList } from 'react-native'
import { useSelector,useDispatch} from 'react-redux'
import { fetchUserPosts } from '../../redux/actions'

const Profile = () => {
  const currentUser= useSelector(state => state.userState.currentUser);
  const posts= useSelector(state => state.userState.posts);
  const dispatch = useDispatch(); 

  useEffect(()=>{
    // user가 올린 posts를 받아옴
    dispatch(fetchUserPosts());
  },[])


  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{currentUser.name}</Text>
        <Text>{currentUser.email}</Text>
      </View>
      <View style={styles.containerGallery}>

      </View>
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

  }
})

export default Profile