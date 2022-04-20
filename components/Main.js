import { View, Text,Button} from 'react-native'
import React,{useEffect,useState} from 'react'
import { useSelector,useDispatch} from 'react-redux'
import { fetchUsers } from '../redux/actions'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Feed from './main/Feed';
import Profile from './main/Profile';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createMaterialBottomTabNavigator();

// Main으로 들어오면 아래에 TabNavigator로 들어오게 해서
// 여기서 실제적으로 tab으로 이동가능하게 한다.
// 특이한 점은 Add tab에는 그냥 빈 깡통 컴포넌트를 넣고 tabpress를 하면
// 상위의 add Screen으로 StackNavigator로 이동한다.
// 한개배운것은 sreen tag내에서 listener 등록하는 방법 !!

const Main = () => {
  const {currentUser,posts}= useSelector(state => state.userState);
  const dispatch = useDispatch(); 

  useEffect(()=>{
    // user Id를 currnet id에 넣음
    dispatch(fetchUsers());
  },[])

  if(currentUser==undefined){
    return(
      <View></View>
    )
  }

  // <Button title='Logout'
  // onPress={async()=>{
  //     await auth.signOut()
  // }}
  // ></Button>


  const EmptyScreen=()=>{
    return null;
  }
  return (
    <Tab.Navigator initialRouteName='Feed' labeled={false}>
      <Tab.Screen name="Feed" component={Feed} 
       options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" size={24} color={color} />
        ),
      }}/>
        <Tab.Screen name="AddContainer" component={EmptyScreen} 
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // console.log("Add tab press")
              // Prevent default action
              e.preventDefault();
              // Do something with the `navigation` object
              navigation.navigate('Add');
            },
          })}
          options={{
            tabBarLabel: 'Add',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus-box" size={24} color={color} />
            ),
          }}/>
        <Tab.Screen name="Profile" component={Profile} 
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={24} color={color} />
            ),
          }}/>
   </Tab.Navigator>
  )
}

export default Main