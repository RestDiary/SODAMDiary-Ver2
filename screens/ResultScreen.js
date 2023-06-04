import React, { useEffect,useState } from 'react';
import {
    Button,
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ImageBackground,
    StatusBar,
    Linking,
    Image,
  } from "react-native";

  import {
    dark,
    votanical,
    town,
    classic,
    purple,
    block,
    pattern,
    magazine,
    winter,
  } from "./css/globalStyles";

  import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import {AntDesign,FontAwesome5,MaterialIcons, Entypo,Ionicons,MaterialCommunityIcons,Foundation } from "@expo/vector-icons";

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
  


  // 이미지 뽑는 컴포넌트
  const ImageList =({imageUrls})=>{
    return(
      <View>
        <ScrollView horizontal>
        {imageUrls.map((source, index)=>(
          <Image key={index} source={source} style = {{width:SCREEN_WIDTH/1.2,height:SCREEN_HEIGHT/3}} resizeMode="stretch"></Image>
          ))}
        </ScrollView>
      </View>
    )
  }


function ResultScreen ({ navigation, route }){
  const { totalScore } = route.params; //라우트 이용해서 점수 받아오기

  //메시지 저장공간
  const [message, setMessage] = useState("");

  //129 전화하는함수
  const handleButtonPress = () => {
    Linking.openURL(`tel:${'129'}`);
  };

  // 메인으로 나가는 함수
  const handleEndButtonPress = () => {
    navigation.popToTop();
  };

  //totalScore 들어오면 비동기 실행
  useEffect(() => {
    getMessage();
  },[totalScore])

  //점수에 따른 전달 메시지 선정
  const getMessage = () =>{
    if(totalScore < 50) {
      setMessage('정상입니다') ; //건강하다
    } else if(totalScore < 60) {
      setMessage('경증의 우울증입니다')
    } else if(totalScore < 70) {
      setMessage('중등도의 우울증 : 전문가의 정신건강 상담 필요')
    } else {
      setMessage('중증의 우울증: 전문의 상담 및 진료 필요')
            //우울증 연락처 및 사이트 접속하게 알려주기
    }
  }

  // 이미지 주소들
  const SymptomSources =[
    require('../assets/images/result/result1.jpg'),
    require('../assets/images/result/result2.jpg'),
    require('../assets/images/result/result3.jpg'),
    require('../assets/images/result/result4.jpg'),
    require('../assets/images/result/result5.jpg'),
    require('../assets/images/result/result6.jpg'),
    require('../assets/images/result/result7.jpg'),
    require('../assets/images/result/result8.jpg'),
    require('../assets/images/result/result9.jpg'),
    require('../assets/images/result/result10.jpg'),
  ];

  const resolutionSources =[
    require('../assets/images/result/result1.jpg'),
    require('../assets/images/result/result2.jpg'),
    require('../assets/images/result/result3.jpg'),
    require('../assets/images/result/result4.jpg'),
    require('../assets/images/result/result5.jpg'),
    require('../assets/images/result/result6.jpg'),
    require('../assets/images/result/result7.jpg'),
    require('../assets/images/result/result8.jpg'),
    require('../assets/images/result/result9.jpg'),
    require('../assets/images/result/result10.jpg'),
  ];
  

  

  return (
    <View style={styles.container}>
      <SafeAreaView>
      <ScrollView>
        <View style={styles.headerContainer}>
        <Text style={styles.headerText}>진단 점수는</Text>
        <View style = {{flexDirection:'row'}}>
        <Text style={[styles.headerText,{color:"#2699fb"}]}>{totalScore}</Text>
          <Text style={styles.headerText}>점 입니다</Text>
        </View>
  <Text style={{ fontSize:ScreenHeight/40,marginTop:ScreenHeight/20, fontWeight:'bold' }}>{message}</Text>
        </View>


        { totalScore >= 50 && totalScore <70 ?
          <>
            <View>
                <ImageList imageUrls={SymptomSources}></ImageList>
            </View>
            <View style={styles.headerContainer2}>
              <Text style={styles.headerText2}>당신을 위한</Text>
              <Text style={styles.headerText2}>우울증 솔루션</Text>
            </View>
            <View>
                <ImageList imageUrls={resolutionSources}></ImageList>
            </View>
          </>
        :
          <>
          </>
        }

        <View style={styles.buttonContainer}>
        { totalScore >= 60 ?
          <TouchableOpacity style={[styles.button,styles.shadowStyle,styles.buttonStyle,]} onPress={handleButtonPress}>
            <Foundation name="telephone" size={ScreenHeight/12} color="#2699fb" style={{marginLeft:30}} />
            <Text style={{ fontSize: ScreenHeight/40, color: 'black',fontWeight:'bold' ,marginLeft:30 }}> 전화상담 받기 </Text>
          </TouchableOpacity>
        :
          <>
          </>
        }
        
        {/* { totalScore >= 60 ?
          <TouchableOpacity style={{ marginTop: 40 }} onPress={handleButtonPress}>
            <Text style={{ fontSize: 24, color: 'blue' }}> 129번 전화하기 </Text>
          </TouchableOpacity>
        :
          <>

          </>
        } */}

        <TouchableOpacity style={[styles.button,styles.shadowStyle,styles.buttonStyle ,{alignItems:"center"}]} onPress={handleEndButtonPress}>
            <Text style={{ fontSize: ScreenHeight/36, color: 'red',fontWeight:'bold',}}>진단 종료</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
        </SafeAreaView>
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerContainer:{
    padding: SCREEN_WIDTH/8,
    
  },
  headerText:{
    fontSize: ScreenHeight/20,
    fontWeight:'bold',
  },
  headerContainer2:{
    marginTop:SCREEN_WIDTH/8,
    padding: SCREEN_WIDTH/8,
  },
  headerText2:{
    fontSize: ScreenHeight/30,
    fontWeight:'bold',
  },
  
  buttonContainer:{
    flexDirection:"column",
    alignItems:"center",
    marginTop: SCREEN_HEIGHT/20,
  },
  button:{
    marginTop: SCREEN_HEIGHT/30,
    marginVertical: 14,
    borderRadius: SCREEN_HEIGHT / 20,
    width:SCREEN_WIDTH/1.4,
    // alignItems:"center",
    shadowOffset:{width:2,height:4},
    backgroundColor: 'white'

  },
  shadowStyle: {
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },

  buttonStyle: {
    padding: SCREEN_HEIGHT / 80,
    // backgroundColor: '#2699fb',
  },
  

});

export default ResultScreen;
