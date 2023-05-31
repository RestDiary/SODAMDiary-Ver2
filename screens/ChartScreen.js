import React, { useEffect, useState } from 'react';
import { Button, View, Text, Dimensions, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { dark, votanical, town, classic, purple, block, pattern, magazine, winter } from './css/globalStyles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyLineChart from './component/charts/MyLineChart';
import MyBarChart from './component/charts/MyBarChart';
import MyPieChart from './component/charts/MyPieChart';
import MyContributionGraph from './component/charts/MyContributionGraph';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { API } from "../config.js";
import Modal from "react-native-modal";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function ChartScreen({ navigation }) {
  const [nowTheme, setNowTheme] = useState({});
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  //차트데이터
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [contribution, setContribution] = useState([]);
  const [firstData, setFirstData] = useState([
    {"cnt":1, "keyword":"소담"},
  ]);
  // const [lineData, setLineData] = useState([]);

  useEffect(() => {
    getTheme()
    getBarData()
    getScore()
    getPieData()
    getContriButionData()
  }, [])

  //테마
  const getTheme = async () => {
    let selectedTheme = await AsyncStorage.getItem('theme');

    if (selectedTheme.includes("dark")) setNowTheme(dark);
    else if (selectedTheme.includes("votanical")) setNowTheme(votanical);
    else if (selectedTheme.includes("town")) setNowTheme(town);
    else if (selectedTheme.includes("classic")) setNowTheme(classic);
    else if (selectedTheme.includes("purple")) setNowTheme(purple);
    else if (selectedTheme.includes("block")) setNowTheme(block);
    else if (selectedTheme.includes("pattern")) setNowTheme(pattern);
    else if (selectedTheme.includes("magazine")) setNowTheme(magazine);
    else if (selectedTheme.includes("winter")) setNowTheme(winter);
  }

  //알럿
  const showAlert = (msg) => {
    Alert.alert(msg)
  }

  //모달
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  //감정스코어
  const getScore = async () => {
    setLoading(true)
    const userId = await AsyncStorage.getItem("id");
    setId(userId)
    try {
      await axios({
        method: "post",
        url: `${API.SCORE}`,
        params: {
          id: userId,
        }
      }, null)
        .then(res => {
          setScore(res.data[0].score)
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response")
        })
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  //BarChart
  const getBarData = async () => {
    setLoading(true)
    const userId = await AsyncStorage.getItem("id");
    try {
      await axios({
        method: "post",
        url: `${API.BAR}`,
        params: {
          id: userId, //****작성자 id
        }
      }, null)
        .then(res => {
          console.log(res.data.length)
          if(res.data.length < 1) {
            setBarData(firstData)
          }else {
            setBarData(res.data)
          }
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response")
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  //PieChart
  const getPieData = async () => {                                             
    setLoading(true)
    const userId = await AsyncStorage.getItem("id");
    try {
      await axios({
        method: "post",
        url: `${API.PIE}`,
        params: {
          id: userId, //****작성자 id
        }
      }, null)
        .then(res => {
          //만일 아무 감정을 사용하지 않아 어떤 감정도 없다면 각 감정에 1씩 대입
          if(res.data[0][0].count == 0 && res.data[1][0].count == 0 && res.data[2][0].count == 0) {
            res.data[0][0].count = 1
            res.data[1][0].count = 1
            res.data[2][0].count = 1
          }
          setPieData(res.data)
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response")
        })
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  //ContriChart
  const getContriButionData = async () => {
    setLoading(true)
    const userId = await AsyncStorage.getItem("id");
    try {
      await axios({
        method: "post",
        url: `${API.CONTRIBUTION}`,
        params: {
          id: userId, //****작성자 id
        }
      }, null)
        .then(res => {
          setContribution(res.data)
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response")
        })  
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <View style={{ ...styles.container, backgroundColor: nowTheme.cardBg }}>
      {/* Modal */}
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 0.3, padding:5, backgroundColor: '#456185', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.whiteText}>감정점수는 일기에서 분석한 감정을 토대로 소담의 알고리즘을 적용한 점수에요.</Text>
          <View style={{height:15}}/>
          <Text style={styles.whiteText}>점수가 30점 보다 낮아지면 스트레스가 많이 쌓인 상태에요. 적절한 관리가 필요해요.</Text>
          <View style={{height:20}}/>
          <Button title='확인했어요!' style={{marginTop:'auto'}} onPress={toggleModal} ></Button>
        </View>
      </Modal>
      
      <SafeAreaView>
        <ScrollView>
          {/* 나의 감정 점수 */}
          <View style={styles.emotionScoreView}>
            <Text style={{ color: '#32CD99', fontSize: SCREEN_HEIGHT / 40 }}> {id && id}</Text>
            <Text style={{ color: 'white', fontSize: SCREEN_HEIGHT / 40 }}> 님의 감정점수는</Text>
            <Text style={{ color: '#32CD99', fontSize: SCREEN_HEIGHT / 40 }}> {score}</Text>
            <Text style={{ color: 'white', fontSize: SCREEN_HEIGHT / 40 }}> 점이에요.</Text>
          </View>

          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={{ ...styles.whiteText, marginLeft: 'auto', color: '#0984e3', marginRight:12 }}>감정점수란?</Text>
            </TouchableOpacity>
          </View>

          {/* 파이차트 */}
          <View style={{ marginTop: 13, flexDirection:'row', alignItems:'center' }}>
            <Text style={styles.whiteText}>감정 비율</Text>
            <TouchableOpacity onPress={(msg)=>showAlert("일기를 통해 어떤 감정을 느꼈는지 횟수를 나타냅니다.")}>
              <AntDesign style={{marginLeft:5}} name="questioncircleo" size={20} color="#0984e3" />
            </TouchableOpacity>
            </View>
          {pieData.length > 0 ?
            <MyPieChart data={pieData} />
            :
            <View style={styles.loadingView}>
              <ActivityIndicator size="large" color="white" />
            </View>
          }

          {/* 라인차트 */}
          <View style={{ marginTop: 13, flexDirection:'row', alignItems:'center' }}>
            <Text style={styles.whiteText}>감정 변화</Text>
            <TouchableOpacity onPress={(msg)=>showAlert("최근 6개월간 감정의 평균이 표시됩니다.")}>
              <AntDesign style={{marginLeft:5}} name="questioncircleo" size={20} color="#0984e3" />
            </TouchableOpacity>
          </View>
          <MyLineChart/>

          {/* 막대차트 */}
          <View style={{ marginTop: 18, flexDirection:'row', alignItems:'center' }}>
            <Text style={styles.whiteText}>자주 사용한 키워드</Text>
            <TouchableOpacity onPress={(msg)=>showAlert("일기에 자주 사용한 키워드 TOP5를 나타냅니다.")}>
              <AntDesign style={{marginLeft:5}} name="questioncircleo" size={20} color="#0984e3" />
            </TouchableOpacity>
          </View>
          {barData.length>0 ?
            <MyBarChart data = {barData}/>
            :
            <View style={styles.loadingView}>
              <ActivityIndicator size="large" color="white" />
            </View>
          }

          {/* 기여그래프 */}
          <View style={{ marginTop: 13, flexDirection:'row', alignItems:'center' }}>
            <Text style={styles.whiteText}>일기 통계</Text>
            <TouchableOpacity onPress={(msg)=>showAlert("최근 105일 동안 일기를 쓴 날이 표시가 됩니다. 많이 일기를 작성해 보세요!")}>
              <AntDesign style={{marginLeft:5}} name="questioncircleo" size={20} color="#0984e3" />
            </TouchableOpacity>
          </View>
          <View style={{marginTop:8}}/>
          {contribution.length>0 ?
            <MyContributionGraph data={contribution}/>
            :
            <View style={styles.loadingView}>
              <ActivityIndicator size="large" color="white" />
            </View>
          }

          <View style={{height:SCREEN_HEIGHT/25}}/>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default ChartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071D3A',
  },
  emotionScoreView:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:15,
    width: SCREEN_WIDTH/1.05,
    height:SCREEN_HEIGHT/9,
    borderRadius: 16,
    backgroundColor:'rgba(0, 0, 0, 0.7)',
    flexDirection:'row',
  },
  whiteText:{
    marginLeft:3,
    color:'white',
    fontSize:SCREEN_HEIGHT/52,
  },
  loadingView:{
    justifyContent:'center',
    alignItems:'center',
    width:SCREEN_WIDTH/1.05, 
    height:SCREEN_HEIGHT/4,
  }
})