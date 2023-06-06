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
  ActivityIndicator,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import axios from "axios";
// import { greaterOrEq } from 'react-native-reanimated';
import {
  Entypo,
  AntDesign,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
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
import { useIsFocused } from "@react-navigation/native";
import { API } from "../config.js";

import PieTop from "./component/chartsRe/PieTop";
import LineYear from "./component/chartsRe/LineYear";
import RingMonth from "./component/chartsRe/RingMonth";
import Card from "./component/Card";
import { YearPicker } from "react-native-propel-kit"; //년도 결정
import { Picker } from "@react-native-picker/picker"; //월 결정

//사용 디바이스 크기 값 받아오기
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function HomeScreen({ navigation }) {
  //스크린 이동할 때 lifecycle 실행
  const isFocused = useIsFocused();
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [ringData, setRingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [yearData, setYearData] = useState(new Date().getFullYear());
  const [monthData, setMonthData] = useState(new Date().getMonth() + 1);
  const [userId, setUserId] = useState(""); //이름 띄워주기 위함

  const [randomDiaryData, setRandomDiaryData] = useState([]);

  useEffect(() => {
    console.log("Pie차트 실행");
    getPieData();
    getRandomDate();
  }, [isFocused]);

  useEffect(() => {
    console.log("Line차트 실행");
    getLineData();
  }, [yearData, isFocused]);

  useEffect(() => {
    console.log("Ring차트 실행");
    getRingData();
  }, [monthData, isFocused]);

  //테마 값 가져오기
  useEffect(() =>{
    if(isFocused){
      getRandomDate()
    }
  },[isFocused])

  const getRandomDate = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("id");
    try {
      await axios(
        {
          method: "post",
          url: `${API.RANDOMDIARY}`,
          // url: 'http://192.168.0.10:3001/pieTop',
          params: {
            id: userId, //****작성자 id
          },
        },
        null
      )
        .then((res) => {
          setRandomDiaryData(res.data);
          // console.log(res.data);
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response");
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // -------------------- [ Top5 감정 data 요청 (PieChart 사용) ] --------------------
  const getPieData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("id");
    try {
      await axios(
        {
          method: "post",
          url: `${API.PIETOP_URL}`,
          // url: 'http://192.168.0.10:3001/pieTop',
          params: {
            id: userId, //****작성자 id
          },
        },
        null
      )
        .then((res) => {
          setPieData(res.data);
          console.log("vkdl: ",res.data)
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response");
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // -------------------- [ 한 해 감정 data 요청 (LineYear 사용) ] --------------------
  const getLineData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("id"); // 작성자 id

    try {
      await axios(
        {
          method: "post",
          url: `${API.LINEYEAR_URL}`,
          // url: 'http://192.168.0.10:3001/lineYear',
          params: {
            id: userId, //****작성자 id
            year: yearData, //현재 기준 연도
          },
        },
        null
      )
        .then((res) => {
          setLineData(res.data);
          // console.log("2: ", res.data.length);
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response");
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // -------------------- [ 월 별 감정 data 요청 (RingMonth 사용) ] --------------------
  const getRingData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("id"); // 작성자 id

    try {
      await axios(
        {
          method: "post",
          url: `${API.RINGMONTH_URL}`,
          // url: 'http://192.168.0.10:3001/ringMonth',
          params: {
            id: userId, // ****작성자 id
            month: monthData, // 현재 기준 월
          },
        },
        null
      )
        .then((res) => {
          setRingData(res.data);
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response");
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const [nowTheme, setNowTheme] = useState({});
  //테마 isFocused 변화 시 렌더링
  useEffect(() => {
    getTheme();
  }, [isFocused]);


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
      setNowTheme(votanical);
    }
  };

  //로그인 여부 확인
  React.useEffect(() => {
    isLogin();
  }, []);
  //로그인이 안돼있다면 로그인페이지 이동함수
  const isLogin = async () => {
    const userId = await AsyncStorage.getItem("id");
    if (!userId) {
      Alert.alert("로그인 후에 이용해 주세요.");
      navigation.navigate("Login");
    } else {
      setUserId(userId);
    }
  };

  //링크 이동
  const moveNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: nowTheme.bg }}>
      <SafeAreaView>
        <StatusBar barStyle="light-content" />
        <ScrollView>
          {/* 사용자 이름 표시 */}
          <View style={styles.memberContainer}>
            <Text style={styles.memberTop}>{userId}님과</Text>
            <Text style={styles.memberBottom}>즐거운 하루</Text>
          </View>

          <View>
            <Text style={{ marginLeft: SCREEN_WIDTH / 16, fontWeight: "bold" }}>
              최근 다이어리
            </Text>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              <View style={styles.notCard}></View>
              {loading && <ActivityIndicator size="large" color="white" />}
              {randomDiaryData[0] &&
                randomDiaryData.map((my, index) => {
                  // return <Card key={index} data={diaryData[index]} /> 일기데이터 받아오기전까지
                  return (
                    <Card key={index} data={randomDiaryData[index]}></Card>
                  );
                })}
              <View style={styles.notCard}></View>
            </ScrollView>
          </View>

          <Text
            style={{
              marginLeft: SCREEN_WIDTH / 16,
              marginTop: SCREEN_WIDTH / 16,
              fontWeight: "bold",
            }}
          >
            나의 감정 통계
          </Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled={true}
            style={styles.chartScrollView}
          >
            <View style={styles.topChartView}>
              {/* [ Top5 감정분석 차트 View ] */}
              {loading && <ActivityIndicator size="large" color="white" />}
              {pieData.length > 0 ? (
                <PieTop key={1} data={pieData} />
              ) : (
                <PieTop key={1} data={"0"} />
              )}
            </View>

            {/* [ 올해 감정분석 차트 View ] */}
            <View style={styles.yearChartView}>
              <TouchableOpacity>
                <YearPicker
                  style={{
                    ...styles.yearText,
                    color: nowTheme.font,
                    height: SCREEN_HEIGHT / 14,
                  }}
                  title="년도 선택"
                  value={yearData}
                  onChange={setYearData}
                />
              </TouchableOpacity>
              {lineData.length > 0 ? ( //key 값주라는 주의를 줘서 임시 지정
                <LineYear key={1} data={lineData} yearData={yearData} />
              ) : (
                <LineYear key={1} data={"0"} />
              )}
            </View>

            {/* [ 월 별 감정분석 차트 View ] */}
            <View style={styles.monthChartView}>
              {/* <TouchableOpacity>
                <Picker
                  selectedValue={monthData}
                  onValueChange={(item) => setMonthData(item)}
                  style={styles.pickerView}
                >
                  <Picker.Item label="1월" value="1" selected={monthData === '1'} />
                  <Picker.Item label="2월" value="2" selected={monthData === '2'} />
                  <Picker.Item label="3월" value="3" selected={monthData === '3'} />
                  <Picker.Item label="4월" value="4" selected={monthData === '4'} />
                  <Picker.Item label="5월" value="5" selected={monthData === '5'} />
                  <Picker.Item label="6월" value="6" selected={monthData === '6'} />
                  <Picker.Item label="7월" value="7" selected={monthData === '7'} />
                  <Picker.Item label="8월" value="8" selected={monthData === '8'} />
                  <Picker.Item label="9월" value="9" selected={monthData === '9'} />
                  <Picker.Item label="10월" value="10" selected={monthData === '10'} />
                  <Picker.Item label="11월" value="11" selected={monthData === '11'} />
                  <Picker.Item label="12월" value="12" selected={monthData === '12'} />
                </Picker>
              </TouchableOpacity> */}

              {ringData.length > 0 ? ( //key값 주라는 주의가 떠서 줬더니 안사라진다.
                <RingMonth key = {1} data={ringData} />
              ) : (
                <RingMonth key = {1}data={"0"} />
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default HomeScreen;

// 반응형 css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column",
    // width: SCREEN_WIDTH,
  },
  memberContainer: {
    marginTop: SCREEN_HEIGHT / 12,
    marginLeft: SCREEN_WIDTH / 12,
    height: SCREEN_HEIGHT / 6.3,
  },
  memberTop: {
    fontSize: SCREEN_HEIGHT / 22,
    fontWeight: "bold",
  },
  memberBottom: {
    fontSize: SCREEN_HEIGHT / 22,
    fontWeight: "bold",
  },

  year: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  yearText: {
    color: "#fff",
    fontSize: SCREEN_WIDTH / 14,
    fontWeight: "bold",
  },

  chartScrollView: {
    flex: 1,
  },

  topChartView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
    width: SCREEN_WIDTH,
  },

  yearChartView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "blue",
    width: SCREEN_WIDTH,
  },

  monthChartView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "yellow",
    width: SCREEN_WIDTH,
    flexDirection: "column",
  },

  // pickerView: {
  //   // flex: 1,
  //   height: "20%",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "pupple",
  // },

  weekChartView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    width: SCREEN_WIDTH,
  },

  // 참고용 (이전 css 코드)
  // content: {},
  // headWidgetContainer: {
  //   flexDirection: "row",
  //   width: SCREEN_WIDTH,
  //   height: SCREEN_HEIGHT / 2.4,
  // },
  // headWidgetDiv1: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   //IOS
  //   shadowColor: "#000", //그림자색
  //   shadowOpacity: 0.4, //그림자 투명도
  //   shadowOffset: { width: 4, height: 4 }, //그림자 위치
  //   // ANDROID
  //   elevation: 3,
  // },
  // headWidgetDiv2: {
  //   flexDirection: "column",
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // widgetContainer: {
  //   flexDirection: "row",
  //   width: SCREEN_WIDTH,
  //   height: SCREEN_HEIGHT / 4.8,
  // },
  // longWidget: {
  //   height: SCREEN_HEIGHT / 2.6,
  //   width: SCREEN_WIDTH / 2.4,
  //   borderRadius: 20,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // smallWidgetContaner: {
  //   flex: 1,
  //   height: "100%",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   //IOS
  //   shadowColor: "#000", //그림자색
  //   shadowOpacity: 0.4, //그림자 투명도
  //   shadowOffset: { width: 4, height: 4 }, //그림자 위치
  //   // ANDROID
  //   elevation: 3,
  // },
  // smallWidget: {
  //   height: SCREEN_HEIGHT / 5.8,
  //   width: SCREEN_WIDTH / 2.4,
  //   backgroundColor: "#de8260",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // smallWidget2: {
  //   height: SCREEN_HEIGHT / 5.8,
  //   width: SCREEN_WIDTH / 1.1,
  //   backgroundColor: "#de8260",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // textStyle: {
  //   color: "white",
  // },
  // loadingView: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: SCREEN_WIDTH / 1.05,
  //   height: SCREEN_HEIGHT / 4,
  // }
});
