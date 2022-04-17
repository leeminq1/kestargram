import { View, Text,Button} from 'react-native'
import React,{useEffect,useState} from 'react'
import { useSelector,useDispatch} from 'react-redux'
import { fetchUsers } from '../redux/actions'
// import { user } from './../redux/reducers/user';

const Main = () => {
  const currentUser= useSelector(state => state.userState.currentUser);

  const dispatch = useDispatch(); 
  useEffect(()=>{
    dispatch(fetchUsers());

  },[])
 

  return (
    <View style={{flex:1,justifyContent:"center"}}>
        <Text>User Logged In</Text>
        {currentUser && <>
            <Text>{currentUser.email}</Text>
            <Text>{currentUser.name}</Text>
        </>}
        <Button title='Logout'
        onPress={async()=>{
            await auth.signOut()
        }}
        ></Button>
     </View>
  )
}

export default Main