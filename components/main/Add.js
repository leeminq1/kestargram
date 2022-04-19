import React, { useState, useEffect,useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Button,Image,Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// 카메라를 클릭하는 것을 감지하기 위해 ref 사용?
// 카메라가 사진을 찍으면 ref 안에 값이 들어가게 되고
// 카메라가 찍은 사진의 uri 값을 알아와서 미리보기를 할 수 있게함.

export default function Add({navigation}) {
  const [camerahasPermission, setCameraHasPermission] = useState(null);
  const [galleyhasPermission, setGalleyHasPermission] = useState(null);
//   const [camera,setCamera]=useState(null);
  const [image,setImage]=useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
//   아래이거는 image.picker가 오류나서 StackOverFlow 보고 수정함.
  const [isFocused,setIsFocused]=useState(true)
  
// 카메라에 접근해서 사진촬영된 image를 불러오기 위해 takePictureAsync를 사용하려면
// useRef로 접근해야함
const cameraRef=useRef(null);

//  아래 코드는 카메라를 누르면 카메라를 찍은 것과 동시에 uri 값을 가져오게함
//  파일 저장은 자동으로 안되는 데 이게 기본 카메라 설정에 따라서 다른건지 api가 그런건지는 모르겠음
// 아래에서 cameraRef.currnet로 접근함
  const takePicture= async()=>{
      if(cameraRef){
        const data=await cameraRef.current.takePictureAsync(null)
        // console.log(data.uri)
        setImage(data.uri)
    }
  }

  const pickImage = async () => {
    setIsFocused(false);
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setIsFocused(true);
    }else{
      setIsFocused(true);
    }
  };

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setCameraHasPermission(cameraPermission.status === 'granted');
    
      const galleyPermission = await ImagePicker.requestCameraPermissionsAsync ();
      setGalleyHasPermission(galleyPermission.status === 'granted');
      setIsFocused(true)
    })();
  }, []);

 
  if (camerahasPermission === null || galleyhasPermission===null ) {
    return <View />;
  }
  if (camerahasPermission === false || galleyhasPermission===false) {
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>No access to Camera or Galley</Text>
        </View>
    );
  }

 if (!isFocused){
    return null
  }


  if(isFocused){
    return (<>
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <Camera 
                  ref={cameraRef}
                  style={styles.fixedRatio} 
                  type={type} 
                  ratio={"1:1"}/>
            </View>
            <View style={styles.btnContainer}>
                <Button
                    title='Flip'
                    onPress={() => {
                        setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                    }}>
                </Button>
                <Button title='Take Pickture' 
                        onPress={()=>{
                            takePicture();
                        }}>   
                </Button>
                <Button title='Take Galley' 
                        onPress={()=>{
                            pickImage();
                        }}>   
                </Button>
                <Button title='Save' 
                        onPress={()=>{
                            if(image){
                                navigation.navigate('Save',{image});
                            }
                            else{
                                Alert.alert("사진을 선택해주세요")
                            }
                        }}>   
                </Button>
            </View>
            <View style={{flex:1}}>
                {image && <Image style={StyleSheet.absoluteFill} source={{uri:image}}></Image>}
            </View>
    </View>             
      </>);
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
    },    
    cameraContainer:{
        flex:1,
        flexDirection:'row'
    },
    fixedRatio:{
        // flex:1,
        width:"100%",
        aspectRatio:1
    },
    btnContainer:{
        width:"100%",
        flexDirection:'row',
        justifyContent:"space-evenly",
        alignItems:"flex-end",
        paddingVertical:15
    }
  });