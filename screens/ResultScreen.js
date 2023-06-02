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

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");


  // 이미지 뽑는 컴포넌트
  const ImageList =({imageUrls})=>{
    return(
      <View>
        {imageUrls.map((source, index)=>(
          <Image key={index} source={source} style = {{width:SCREEN_WIDTH,height:SCREEN_HEIGHT/3}} resizeMode="stretch"></Image>
        ))}
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
  const sources =[
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
        <Text style={{ fontSize: 32 }}>당신의 점수는...</Text>
        <Text style={{ fontSize: 64 }}>{totalScore}점</Text>
        <Text style={{ fontSize: 24 }}>{message}</Text>


        { totalScore >= 50 && totalScore <70 ?
          <>
            <View>
              <ImageList imageUrls={sources}></ImageList>
            </View>
          </>
        :
          <>

          </>
        }


        { totalScore >= 60 ?
          <TouchableOpacity style={{ marginTop: 40 }} onPress={handleButtonPress}>
            <Text style={{ fontSize: 24, color: 'blue' }}> 보건복지부 상담 전화하기 </Text>
          </TouchableOpacity>
        :
          <>

          </>
        }
        
        { totalScore >= 81 ?
          <TouchableOpacity style={{ marginTop: 40 }} onPress={handleButtonPress}>
            <Text style={{ fontSize: 24, color: 'blue' }}> 129번 전화하기 </Text>
          </TouchableOpacity>
        :
          <>

          </>
        }



        <TouchableOpacity style={{ marginTop: 40 }} onPress={handleEndButtonPress}>
            <Text style={{ fontSize: 24, color: 'black' }}>퀴즈 종료</Text>
        </TouchableOpacity>
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
});

export default ResultScreen;
