import React,{useState} from 'react'
import { View, Text, TextInput, FlatList,TouchableOpacity} from 'react-native'
import { getFirestore,collection,where, getDocs,query} from 'firebase/firestore';


const Search = ({navigation}) => {
  const [searchUsers,setSearchUsers]=useState([]);

//   firebase에서 검색해서 맞는 user를 찾아옴
  const fetchSerchUsers=async(search)=>{
    const db = await getFirestore();
    const q = query(collection(db, "users"), where("name", ">=", search));
    const docSnap = await getDocs(q);
    const searchUsers = docSnap.docs.map(doc => ({
      ...doc.data()
    }));
    setSearchUsers(searchUsers)
  }
  return (
    <View>
      <Text>Search</Text>
      <TextInput 
      placeholder='Search User'
      onChangeText={(txt)=>{
        fetchSerchUsers(txt)
      }}></TextInput>
      <FlatList
        keyExtractor={(item)=>item.email+""}
        data={searchUsers}
        // user Id  클릭 시 profile을 확인
        renderItem={({item})=>{
          return(
            <TouchableOpacity style={{height:30}} 
              onPress={()=>{
                // console.log("Serach",item)
                navigation.navigate('Profile',{uid:item.uid})}
            }
             >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )
        }}
      ></FlatList>
    </View>
  )
}

export default Search