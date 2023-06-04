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
            backgroundColor: nowTheme.bg,
            ...flipToFrontStyle,
          }}
        >
          {/* 대표 이미지 */}
          <View style={{ ...styles.frontImageBox }}>
            {data.img !== null && data.img !== "" ? (
              <Image
                source={{ uri: data.img }}
                style={styles.imageSize}
                resizeMode={"stretch"}
              ></Image>
            ) : (
              <Image
                source={nowTheme.logo}
                style={{ ...styles.imageSize, opacity: 0.8 }}
                resizeMode={"contain"}
              ></Image>
            )}
          </View>

          {/* 제목  */}
          <View style={{ ...styles.frontTitle }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                ...styles.frontTitleText,
                color: nowTheme.font,
              }}
            >
              {data.title}
            </Text>
          </View>
        </Animated.View>

        {/* 뒷면 */}
        <Animated.View
          style={{
            ...styles.back,
            ...flipToBackStyle,
          }}
        >
          <View style={styles.backView}>
            <Image
              style={styles.backImage}
              source={nowTheme.image}
              resizeMode="cover"
            />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize: "3%",
    height: (SCREEN_WIDTH / 3) * 1.86,
    alignItems: "center",
    justifyContent: "center",
  },

  front: {
    width: SCREEN_WIDTH / 3,
    height: (SCREEN_WIDTH / 3) * 1.6,
    position: "absolute",
    backfaceVisibility: "hidden",
    //IOS
    shadowColor: "#000", //그림자색
    shadowOpacity: 0.7, //그림자 투명도
    shadowOffset: { width: 4, height: 4 }, //그림자 위치
    // ANDROID
    elevation: 3,
    borderRadius: 30,
  },

  frontImageBox: {
    flex: 1,
  },

  imageSize: {
    flex: 1,
    width: null,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "black",
  },

  frontTitle: {
    flex: 1,
    alignItems: "center",
    margin: 16,
  },

  frontTitleText: {
    fontSize: SCREEN_WIDTH / 20,
    borderBottomWidth: 1,
    marginLeft: 16,
    marginRight: 16,
    fontWeight: "bold",
  },

  back: {
    width: SCREEN_WIDTH / 3,
    height: (SCREEN_WIDTH / 3) * 1.6,
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

  backView: {
    width: "100%",
    height: "100%",
  },

  backImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
});
export default Card;
