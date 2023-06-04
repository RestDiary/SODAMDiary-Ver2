import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  graphStyle,
  Button,
  View,
  Text,
  Dimensions,
  Animated,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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
} from "./../css/globalStyles";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";
import DayChart from "./chartsRe/DayChart";
import HorizontalBarGraph from "@chartiful/react-native-horizontal-bar-graph";


function Card({ data }) {
  //테마
  useEffect(() => {
    getTheme();
  }, []);

  const [nowTheme, setNowTheme] = useState({});

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
  };
  const [newContent, setNewContent] = useState("");
  const navigation = useNavigation();

  //링크 이동
  const moveNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const [emotionKor, setEmotionKor] = useState("");
  const [maxValue, setMaxValue] = useState();

  // Top3 감정 키워드
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  //Top3 감정 키워드 각각의 개수
  const [labels, setLabels] = useState([]);
  const [datas, setData] = useState([]);

  // // 차트 데이터 받아오기 및 차트 생성
  // useEffect(() => {
  //   if (data.second_number === 0) {
  //     let first = data.top_emotion.split("/");

  //     setLabels([first[0]]);
  //     setData([data.top_number]);
  //   } else if (data.third_number === 0) {
  //     let first = data.top_emotion.split("/");
  //     let second = data.second_emotion.split("/");

  //     setLabels([first[0], second[0]]);
  //     setData([data.top_number, data.second_number]);

  //   } else {
  //     let first = data.top_emotion.split("/");
  //     let second = data.second_emotion.split("/");
  //     let third = data.third_emotion.split("/");

  //     setLabels([first[0], second[0], third[0]]);
  //     setData([data.top_number, data.second_number, data.third_number]);
  //   }

  // 리렌더링 시 값이 초기화 되는 것을 막기 위해 ref 사용.
  const flipAnimation = useRef(new Animated.Value(0)).current;
  // 초깃 값 초기화
  let flipRotation = 0;
  // 뒤에서 앞으로 다시 뒤집기위해 값 초기화
  flipAnimation.addListener(({ value }) => (flipRotation = value));

  // 앞면 초깃값
  const flipToFrontStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          // Y축 측정 값
          inputRange: [0, 180],
          // Y축 범위값
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  // 뒷면 초깃값
  const flipToBackStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          // Y축 측정 값
          inputRange: [0, 180],
          // Y축 범위값
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  // 앞면 애니메이션
  const flipToFront = () => {
    Animated.timing(flipAnimation, {
      // Y축 변경 값
      toValue: 180,
      // 딜레이 ms값
      duration: 500,
      // 부드러운 움직임 향상 => (브릿지를 거치지 않고 네이티브에서 애니메이션을 수행)
      useNativeDriver: true,
    }).start();
  };

  // 뒷면 애니메이션
  const flipToBack = () => {
    Animated.timing(flipAnimation, {
      // Y축 변경 값
      toValue: 0,
      // 딜레이 ms값
      duration: 500,
      // 부드러운 움직임 향상 => (브릿지를 거치지 않고 네이티브에서 애니메이션을 수행)
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <Pressable
        style={{ ...styles.container }}
        // 카드 뒤집기
        onPress={() => (!!flipRotation ? flipToBack() : flipToFront())}
        // 상세화면
        onLongPress={() => navigation.navigate("Detail", { card: data })}
      >
        {/* 앞면 */}
        <Animated.View
          style={{
            ...styles.front,
            backgroundColor: nowTheme.front,
            ...flipToFrontStyle,
          }}
        >
          <ImageBackground
            style={{
              backgroundColor: nowTheme.front,
              height: (SCREEN_WIDTH / 1.8) * 1.6,
            }}
            source={nowTheme.image}
            resizeMode={"cover"}
          >
            {/* 키워드 */}
            <View style={{ ...styles.frontKeyWordBox }}>
              {/* <Text style={{ color: nowTheme.font, fontSize: SCREEN_WIDTH / 20 }}>{emotionKor}: {maxValue}%</Text> */}
              {/* {
              props.data.keyword.map(function(id,index){
                return(
                <Text style={{color: "#ED7C58"}}>
                {props.data.keyword[index]}
              </Text>
              )
              })
            } */}
            </View>
            {/* 아이콘  (아이콘은 테마마다 사용하는 아이콘이 다르다)*/}
            <View style={{ ...styles.frontIcon }}>{nowTheme.icon}</View>
            {/* 제목  */}
            <View style={{ ...styles.frontTitle }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: nowTheme.bg,
                  fontWeight: "bold",
                  fontSize: SCREEN_WIDTH / 14,
                  borderBottomWidth: 1,
                  borderBottomColor: nowTheme.font,
                  marginLeft: 16,
                  marginRight: 16,
                }}
              >
                {data.title}
              </Text>

              {/* {(data.keyword2 == null) ?
               <Text style={{ color: nowTheme.font, fontSize: SCREEN_WIDTH / 20, marginTop:4 }}>#{data.keyword}</Text> :
               (data.keyword3 == null) ?
               <Text style={{ color: nowTheme.font, fontSize: SCREEN_WIDTH / 20, marginTop:4 }}>#{data.keyword} #{data.keyword2}</Text> :
               <Text style={{ color: nowTheme.font, fontSize: SCREEN_WIDTH / 20, marginTop:4 }}>#{data.keyword} #{data.keyword2} #{data.keyword3}</Text>
              } */}
              {/* <BarChart

                style={{...styles.graphStyle}}

                data={chart}
                width={300}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showValuesOnTopOfBars
                withHorizontalLabels={false}
                withInnerLines={false}

                fromZero={true}\
              /> */}
            </View>
          </ImageBackground>

          {/* <HorizontalBarGraph
                data={datas}
                labels={labels}
                width={375}
                height={350}
                barRadius={15}
                baseConfig={{
                  hasYAxisBackgroundLines: false,
                  xAxisLabelStyle: {
                    rotation: 0,
                    fontSize: 12,
                    width: 70,
                    yOffset: 4,
                    xOffset: -15
                  },
                  yAxisLabelStyle: {
                    rotation: 0,
                    fontSize: 13,
                    position: 'bottom',
                    xOffset: 0,
                    height: 100,
                    decimals: 0
                  },
                  hasYAxisBackgroundLines: true,
                }}
                style={styles.chart}
                barColor='black'
                barWidthPercentage="0.3"
              /> */}
        </Animated.View>

        {/* 뒷면 */}
        <Animated.View
          style={{
            ...styles.back,
            backgroundColor: nowTheme.back,
            borderColor: nowTheme.cardBorder,
            ...flipToBackStyle,
          }}
        >
          {/* 대표 이미지 */}
          <View style={{ ...styles.backImageBox }}>
            {data.img !== null && data.img !== "" ? (
              <Image
                source={{ uri: data.img }}
                style={styles.imageSize}
                resizeMode={"stretch"}
              ></Image>
            ) : (
              <Image
                source={nowTheme.logo}
                style={styles.imageSize}
                resizeMode={"contain"}
              ></Image>
            )}
          </View>
          {/* 내용 */}
          <View
            style={{ ...styles.backTextView, borderColor: nowTheme.cardBorder }}
          >
            <Text
              style={{ ...styles.backText, color: nowTheme.font }}
              numberOfLines={7}
              ellipsizeMode="tail"
            >
              {/* {props.data.content} */}
              {data.content}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    marginBottom: 30,
    padding: 10,
    paddingTop: 20,
    borderRadius: 20,
    width: 375,
    backgroundColor: "white",
  },

  container: {
    fontSize: "3%",
    height: (SCREEN_WIDTH / 1.8) * 1.86,
    alignItems: "center",
    justifyContent: "center",
  },

  graphStyle: {
    alignSelf: "center",
  },

  front: {
    width: SCREEN_WIDTH / 1.8,
    height: (SCREEN_WIDTH / 1.8) * 1.6,
    backgroundColor: "#152F5E",
    marginRight: 16,
    marginLeft: 16,
    position: "absolute",
    backfaceVisibility: "hidden",
    //IOS
    shadowColor: "#000", //그림자색
    shadowOpacity: 0.7, //그림자 투명도
    shadowOffset: { width: 4, height: 4 }, //그림자 위치
    // ANDROID
    elevation: 3,
    // alignItems: "center",
    // justifyContent: "center",
  },

  frontKeyWordBox: {
    //
    justifyContent: "space-between",
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    minHeight: "20%",
    flexDirection: "row",
  },

  frontIcon: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50%",
  },

  frontTitle: {
    minHeight: "20%",
    alignItems: "center",
    justifyContent: "center",
  },

  back: {
    width: SCREEN_WIDTH / 1.8,
    height: (SCREEN_WIDTH / 1.8) * 1.6,
    backgroundColor: "#274180",
    marginRight: 16,
    marginLeft: 16,
    alignItems: "center",
    position: "relative",
    backfaceVisibility: "hidden",

    //IOS
    shadowColor: "#000", //그림자색
    shadowOpacity: 0.7, //그림자 투명도
    shadowOffset: { width: 4, height: 4 }, //그림자 위치
    // ANDROID
    elevation: 3,
  },

  backTitle: {
    minHeight: "20%",
  },

  backText: {
    color: "white",
  },

  backImageBox: {
    margin: 8,
    minHeight: "30%",
    width: "90%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 2.62,
    elevation: 4,
  },
  imageSize: {
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    height: "93%",
    borderRadius: 10,
  },

  backTextView: {
    margin: 6,
    alignItems: "center",
    width: "90%",
    borderTopWidth: 1,
    borderColor: "white",
    paddingTop: 10,
    paddingBottom: 10,
  },

  backVoiceView: {
    alignItems: "flex-end",
    justifyContent: "center",
    minHeight: "10%",
  },
});
export default Card;
