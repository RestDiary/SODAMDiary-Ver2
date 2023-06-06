
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
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
  } from "react-native";

  import {
    RadioButton, shadow
  }from 'react-native-paper';
  import RadioGroup from 'react-native-radio-buttons-group';

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
    
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
    


  const questions = [
    {
      question: '1. 나는 매사에 의욕이 없고 우울하거나 슬플 때가 있다.',
      options: [
        { text: '전혀 아니다', score: 1 },
        { text: '가끔 그렇다', score: 2 },
        { text: '자주 그렇다', score: 3 },
        { text: '항상 그렇다', score: 4 },
      ],
    },
    {
      question: '2. 나는 하루 중 기분이 가장 좋은 때는 아침이다.',
      options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
      ],
    },
    {
        question: '3. 나는 갑자기 얼마동안 울음을 터뜨리거나 울고 싶을 때가 있다.',
        options: [
          { text: '전혀 아니다', score: 1 },
          { text: '가끔 그렇다', score: 2 },
          { text: '자주 그렇다', score: 3 },
          { text: '항상 그렇다', score: 4 },
        ],
      },{
        question: '4. 나는 밤에 잠을 설칠 때가 있다.',
        options: [
          { text: '전혀 아니다', score: 1 },
          { text: '가끔 그렇다', score: 2 },
          { text: '자주 그렇다', score: 3 },
          { text: '항상 그렇다', score: 4 },
        ],
      },{
        question: '5. 나는 전과 같이 밥맛이 있다(식욕이 좋다).',
        options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
        ],
      },{
        question: '6. 나는 매력적인 여성(남성)을 보거나, 앉아서 얘기하는 것이 좋다.',
        options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
        ],
      },{
        question: '7. 나는 요즈음 체중이 줄었다.',
        options: [
          { text: '전혀 아니다', score: 1 },
          { text: '가끔 그렇다', score: 2 },
          { text: '자주 그렇다', score: 3 },
          { text: '항상 그렇다', score: 4 },
        ],
      },{
        question: ' 8. 나는 변비 때문에 고생한다.',
        options: [
          { text: '전혀 아니다', score: 1 },
          { text: '가끔 그렇다', score: 2 },
          { text: '자주 그렇다', score: 3 },
          { text: '항상 그렇다', score: 4 },
        ],
      },{
        question: ' 9. 나는 요즈음 가슴이 두근거린다.',
        options: [
          { text: '전혀 아니다', score: 1 },
          { text: '가끔 그렇다', score: 2 },
          { text: '자주 그렇다', score: 3 },
          { text: '항상 그렇다', score: 4 },
        ],
      },{
        question: '10. 나는 별 이유 없이 잘 피로하다.',
        options: [
          { text: '전혀 아니다', score: 1 },
          { text: '가끔 그렇다', score: 2 },
          { text: '자주 그렇다', score: 3 },
          { text: '항상 그렇다', score: 4 },
        ],
      },{
        question: '11. 내 머리는 한결 같이 맑다.',
        options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
        ],
      },{
        question: '12. 나는 전처럼 어려움 없이 일을 해낸다.',
        options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
        ],
      },{
        question: '13. 나는 안절부절해서 진정할 수가 없다.',
        options: [
          { text: '전혀 아니다', score: 1 },
          { text: '가끔 그렇다', score: 2 },
          { text: '자주 그렇다', score: 3 },
          { text: '항상 그렇다', score: 4 },
        ],
      },{
        question: '14. 나의 장래는 희망적이라고 생각한다.',
        options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
        ],
      },{
        question: '15. 나는 전보다도 더 안절부절한다.',
        options: [
          { text: '전혀 아니다', score: 1 },
          { text: '가끔 그렇다', score: 2 },
          { text: '자주 그렇다', score: 3 },
          { text: '항상 그렇다', score: 4 },
        ],
      },{
        question: '16. 나는 결단력이 있다고 생각한다.',
        options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
        ],
      },{
        question: '17. 나는 사회에 유용하고 필요한 사람이라고 생각한다.',
        options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
        ],
      },{
        question: '18. 내 인생은 즐겁다.',
        options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
        ],
      },{
        question: '19. 내가 죽어야 다른 사람들 특히 가족들이 편할 것 같다.',
        options: [
          { text: '전혀 아니다', score: 1 },
          { text: '가끔 그렇다', score: 2 },
          { text: '자주 그렇다', score: 3 },
          { text: '항상 그렇다', score: 4 },
        ],
      },{
        question: '20. 나는 전과 다름없이 일하는 것은 즐겁다.',
        options: [
        { text: '전혀 아니다', score: 4 },
        { text: '가끔 그렇다', score: 3 },
        { text: '자주 그렇다', score: 2 },
        { text: '항상 그렇다', score: 1 },
        ],
      },
  ];





  //자가진단 페이지
function DiagnosisScreen({navigation}){
    //테마 가져오는 코드 한번 실행
    useEffect(() => {
      getTheme();
    }, []);
    const [nowTheme, setNowTheme] = useState(dark);
    
  
    //어싱크 스토리지 저장된 테마 가지고 와서 적용시키기
  const getTheme = async () => {
    let selectedTheme = await AsyncStorage.getItem("theme");
    
    if (selectedTheme.includes("dark")) setNowTheme(dark);
    else if (selectedTheme.includes("votanical")) setNowTheme(votanical);
    else if (selectedTheme.includes("town")) setNowTheme(town);
    else if (selectedTheme.includes("classic")) setNowTheme(classic);
    else if (selectedTheme.includes("purple")) setNowTheme(purple);
    else if (selectedTheme.includes("block")) setNowTheme(block);
    else if (selectedTheme.includes("pattern")) setNowTheme(pattern);
    else if (selectedTheme.includes("magazine")) setNowTheme(magazine);
    else if (selectedTheme.includes("winter")) setNowTheme(winter);
    else {
        setNowTheme(dark)
    };
}



//자가진단 data로 버튼 누를 시 넘어가는 기능/ 뒤로가기버튼 누르면 이전 문제로 넘감 / 결과보기 누르면 쌓인 점수를 보여준다.
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); //현재 문제 index
const [scores, setScores] = useState(Array(21).fill(null)); //20개의 원소를 가진 배열 생성하고 null로 채운다


//문제 푸는 버튼 클릭시 발생하는 이벤트(함수)
  const handleOptionPress = (optionIndex) => {      
    const score = questions[currentQuestionIndex].options[optionIndex].score;       //객체[인덱스].옵션[인덱스].점수를 const에 넣는다
    setScores([...scores.slice(0, currentQuestionIndex), score, ...scores.slice(currentQuestionIndex + 1)]);  //기존 점수에더한다.
    setCurrentQuestionIndex(currentQuestionIndex + 1); //다음 인덱스로 넘어갑니다.
  }

  //뒤로가기 버튼 클릭시
  const handlePreviousButtonPress = () => {
    if (currentQuestionIndex > 0) {
      // 선택한 답변이 있으면 초기화
      if (scores[currentQuestionIndex] !== null) { //문제점수배열이 비었다면
        setScores([...scores.slice(0, currentQuestionIndex),scores, ...scores.slice(currentQuestionIndex +1)]); 
      }
      setCurrentQuestionIndex(currentQuestionIndex - 1); //이전 문제로 돌아갑니다.
    }
  };

  //결과보기 클릭시 배열을 전부 더한다.
  const getTotalScore = () => {
    return scores.reduce((prevScore, currentScore) => prevScore + currentScore, 0);
  }


  // 퀴즈 끝나면 결과 페이지 이동
  useEffect(() =>{  //한문제 풀때마다 실행
    if(currentQuestionIndex ===questions.length){       //만약 문제가 마지막 문제라면 실행
      navigation.navigate('ResultScreen',{              //totalScore들고 네이게이션 ResultScreen이동
        totalScore:scores.reduce((a,b) => a+b,0),
      }
  )}
  },[currentQuestionIndex]);



  return (
    <>
      <View style={styles.memberContainer}>
        <Text style={styles.memberTop}>나의 우울증</Text>
        <Text style={styles.memberBottom}>진단검사</Text>
      </View>
      {   //20번 넘어갔을때 불러오려하면 터진다. 문제가 20 즉 21번이라면 가려주자
            currentQuestionIndex !==20 &&(<>
      <View style={styles.questionBox}>
        <Text style={{fontSize: SCREEN_HEIGHT/46,fontWeight:'bold'}}>{questions[currentQuestionIndex].question}</Text> 
      </View>
      </>)
      }
      <View style={{ ...styles.selfContainer}}>
        {/* 문제 가지고오기( state가 변함에 따라 문제도 바뀐다) */}
        {   //20번 넘어갔을때 불러오려하면 터진다. 문제가 20 즉 21번이라면 가려주자
            currentQuestionIndex !==20 &&(<>
        {/* <View>
            <Text>'currentQuestionIndex : '{currentQuestionIndex}</Text>
        </View>
        <View>
            <Text>'score: '{scores}</Text>
        </View> */}

        {/* 문제에따른 선택지 4개 가지고오기   === (아니다/ 가끔그렇다/ 자주그렇다/ 항상그렇다) */}
        <View style={styles.selectBox}>
        {
            questions[currentQuestionIndex].options.map((option, index) => (    //맵으로 0번부터 3번까지 돌린다 (총 4번)
            <TouchableOpacity
              style={[styles.buttonStyle, styles.shadowStyle, styles.touchStyle]}
              key={'option_' + index}
              onPress={() => handleOptionPress(index)} //0번 선택시 인덱스 0을 보낸다. 함수에서 해당 value값을 score에 저장
            >
                <Text style={{fontSize:SCREEN_HEIGHT/46, color:'white'}}>{option.text}</Text>
            </TouchableOpacity>
            ))
        }
        </View>
        </>)
        }

        <View style={styles.naviButton}>
            <TouchableOpacity onPress={handlePreviousButtonPress} >
                <Text style={{ color: currentQuestionIndex === 0 ? 'gray' : 'black' }}>이전</Text>
            </TouchableOpacity>
        </View>
    </View>
    </>
  );


}
export default DiagnosisScreen;








const styles = StyleSheet.create({
    selfContainer: {
      flex:0.6,
        justifyContent:"center",
        alignItems:"center",
        

    },
    problem:{
        fontWeight:'bold',
        marginLeft:40,
        fontSize:18,
        marginBottom:14,
    },
    radioGroupBox:{
        flexDirection:'row'
    },
    memberContainer: {

      marginTop:SCREEN_HEIGHT /40,
      marginLeft:SCREEN_WIDTH / 12,
      height: SCREEN_HEIGHT /6.3,
    },
    memberTop: {
      fontSize:SCREEN_HEIGHT / 24,
      fontWeight:"bold",
    },
    memberBottom:{
      fontSize:SCREEN_HEIGHT / 24,
      fontWeight:"bold",
    },
    questionBox:{
      flex:0.16,
      fontWeight:'bold',
      alignItems:'center',
      // justifyContent:"center"

    },

    selectBox:{
      
      flexDirection: "column"
    },

    touchStyle:{
      // borderWidth: 1,
      // borderColor: scores[currentQuestionIndex] === index-1 ? 'green' : 'black',
      padding: SCREEN_HEIGHT / 40,
      marginVertical: 14,
      borderRadius: SCREEN_HEIGHT / 1,
      width:SCREEN_WIDTH/1.4,
      alignItems:"center",
      shadowOffset:{width:2,height:4},
      backgroundColor: '#2699fb'
      // shadowColor:"black",
      // shadowOpacity: 0.26,
      // shadowRadius: 10 ,
    },

    shadowStyle: {
      shadowColor: 'black',
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 1,
    },
    buttonStyle: {
      padding: 10,
      // backgroundColor: '#2699fb',
      borderRadius: 5,
    },


    naviButton:{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' ,
      paddingTop:30
    },

    

})