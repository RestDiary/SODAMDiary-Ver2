import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  RichText,
  Alert,
  Image,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { MaterialIcons } from "@expo/vector-icons";
import { Chip } from "react-native-paper";
import { API } from "../config.js";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable.js";
import { useNavigation, useIsFocused } from "@react-navigation/native";
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
import ImageModal from "react-native-image-modal";

import HorizontalBarGraph from "@chartiful/react-native-horizontal-bar-graph";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function PictureDetailScreen(Album) {
  //스크린 이동할 때 lifecycle 실행
  const isFocused = useIsFocused();
  //테마
  useEffect(() => {
    getTheme();
  }, [isFocused]);

  const [nowTheme, setNowTheme] = useState({});
  const [editorColor, setEditorColor] = useState({});

  //테마, 에디터 컬러 가져오기
  const getTheme = async () => {
    let selectedTheme = await AsyncStorage.getItem("theme");
    let editorOption = {};

    if (selectedTheme.includes("dark")) {
      setNowTheme(dark);
      editorOption = {
        backgroundColor: dark.cardBg,
        placeholderColor: "#456185",
        color: dark.font,
      };
    } else if (selectedTheme.includes("votanical")) {
      setNowTheme(votanical);
      editorOption = {
        backgroundColor: votanical.cardBg,
        placeholderColor: "#456185",
        color: votanical.font,
      };
    } else if (selectedTheme.includes("town")) {
      setNowTheme(town);
      editorOption = {
        backgroundColor: town.cardBg,
        placeholderColor: "#456185",
        color: town.font,
      };
    } else if (selectedTheme.includes("classic")) {
      setNowTheme(classic);
      editorOption = {
        backgroundColor: classic.cardBg,
        placeholderColor: "#456185",
        color: classic.font,
      };
    } else if (selectedTheme.includes("purple")) {
      setNowTheme(purple);
      editorOption = {
        backgroundColor: purple.cardBg,
        placeholderColor: "#456185",
        color: purple.font,
      };
    } else if (selectedTheme.includes("block")) {
      setNowTheme(block);
      editorOption = {
        backgroundColor: block.cardBg,
        placeholderColor: "#456185",
        color: block.font,
      };
    } else if (selectedTheme.includes("pattern")) {
      setNowTheme(pattern);
      editorOption = {
        backgroundColor: pattern.cardBg,
        placeholderColor: "#456185",
        color: pattern.font,
      };
    } else if (selectedTheme.includes("magazine")) {
      setNowTheme(magazine);
      editorOption = {
        backgroundColor: magazine.cardBg,
        placeholderColor: "#456185",
        color: magazine.font,
      };
    } else if (selectedTheme.includes("winter")) {
      setNowTheme(winter);
      editorOption = {
        backgroundColor: winter.cardBg,
        placeholderColor: "#456185",
        color: winter.font,
      };
    } else {
      setNowTheme(dark);
      editorOption = {
        backgroundColor: dark.cardBg,
        placeholderColor: "#456185",
        color: dark.font,
      };
    }

    setEditorColor(editorOption);
  };
  // console.log("Album: ", Album.route.params.album);

  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [day, setDay] = useState("");
  const [img, setImg] = useState("");
  const [keyword, setKeyword] = useState("");
  const [voice, setVoice] = useState("");
  const [checkImage, setCheckImage] = useState(false);

  // 감정분석 키워드, 카운트 데이터
  const [topEmot, setTopEmot] = useState("");
  const [secEmot, setSecEmot] = useState("");
  const [thirdEmot, setThirdEmot] = useState("");
  const [topNum, setTopNum] = useState("");
  const [secNum, setSecNum] = useState("");
  const [thirdNum, setThirdNum] = useState("");
  const [emotionData, setEmotionData] = useState({});

  const richText = React.useRef();

  //Top3 감정 키워드 각각의 개수
  const [labels, setLabels] = useState([]);
  const [datas, setData] = useState([]);

  // 일기데이터 불러오기, 감정데이터 세팅
  useEffect(() => {
    async function getDiaryDetails() {
      const resEmotData = await detail();
      setEmotionData(resEmotData);
    }
    getDiaryDetails();
  }, []);

  // 차트 세팅
  useEffect(() => {
    if (emotionData && Object.keys(emotionData).length > 0) {
      chartDataSet(emotionData);
    }
  }, [emotionData]);

  const detail = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `${API.DIARYINFO}`,
        params: {
          diarykey: Album.route.params.album,
        },
      });

      setTitle(res.data[0]["title"]);
      setContent(res.data[0]["content"]);
      setMonth(res.data[0]["month"]);
      setYear(res.data[0]["year"]);
      setDay(res.data[0]["day"]);
      setImg(res.data[0]["img"]);
      setKeyword(res.data[0]["keyword"]);
      setVoice(res.data[0]["voice"]);

      const emotionData = {
        top_emotion: res.data[0]["top_emotion"],
        second_emotion: res.data[0]["second_emotion"],
        third_emotion: res.data[0]["third_emotion"],
        top_number: res.data[0]["top_number"],
        second_number: res.data[0]["second_number"],
        third_number: res.data[0]["third_number"],
      };

      return emotionData;
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const check = () => {
    setCheckImage(true);
  };

  //서버 요청 로딩
  const [loading, setLoading] = useState(false);

  // 차트 값 설정
  const chartDataSet = () => {
    console.log("emotionData: ", emotionData);
    // console.log("topNum: ", topNum)

    if (emotionData.second_number === 0) {
      let first = emotionData.top_emotion.split("/");

      setLabels([first[0]]);
      setData([emotionData.top_number]);
    } else if (emotionData.third_number === 0) {
      let first = emotionData.top_emotion.split("/");
      let second = emotionData.second_emotion.split("/");

      setLabels([first[0], second[0]]);
      setData([emotionData.top_number, emotionData.second_number]);
    } else {
      let first = emotionData.top_emotion.split("/");
      let second = emotionData.second_emotion.split("/");
      let third = emotionData.third_emotion.split("/");

      setLabels([first[0], second[0], third[0]]);
      setData([
        emotionData.top_number,
        emotionData.second_number,
        emotionData.third_number,
      ]);
    }
  };

  // bottom sheet 테스트
  // ref
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  // variables
  const snapPoints = ["10%", "80%"];

  // View 컴포넌트의 너비와 높이를 저장하기 위한 state 생성
  const [viewWidth, setViewWidth] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);

  // onLayout 이벤트에서 View의 너비와 높이를 가져와서 state 업데이트
  const onViewLayout = (event) => {
    setViewWidth(event.nativeEvent.layout.width);
    setViewHeight(event.nativeEvent.layout.height);
  };
  return (
    <View style={{ ...styles.container, backgroundColor: nowTheme.cardBg }}>
      {/* 제목 */}
      <SafeAreaView
        style={{
          ...styles.titleLayout,
          backgroundColor: nowTheme.btn,
          borderColor: nowTheme.cardBorder,
        }}
      >
        <Text
          placeholder="제목:"
          placeholderTextColor={"#456185"}
          style={{ ...styles.title, color: nowTheme.bg, fontWeight: "bold" }}
          value={"title"}
          returnKeyType="next"
          maxLength={30}
          editable={false} // 수정누른 경우 true로 state 바꿔야 텍스트 편집가능 함.
        >
          제목: {title}
        </Text>
      </SafeAreaView>

      <SafeAreaView
        style={{
          ...styles.feelingLayout,
          backgroundColor: nowTheme.btn,
          borderColor: nowTheme.cardBorder,
        }}
      >
        {/* 날짜 */}
        <Text style={{ ...styles.date, color: nowTheme.bg }}>
          날짜: {year}년 {month}월 {day}일
        </Text>
      </SafeAreaView>

      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 0.95, borderColor: nowTheme.cardBorder }}
        >
          <SafeAreaView>
            <ScrollView>
              {/* {이미지 보이는 곳} */}
              <Pressable onPress={check}>
                {img && (
                  <TouchableOpacity
                    onPress={() => {
                      setCheckImage(true);
                    }}
                  >
                    <ImageModal
                      swipeToDismiss={false}
                      resizeMode="stretch"
                      imageBackgroundColor={nowTheme.cardBg}
                      style={{
                        marginLeft: 10,
                        marginTop: 16,
                        width: SCREEN_WIDTH / 1.5,
                        height: SCREEN_WIDTH / 1.5,
                        borderWidth: 1,
                        borderColor: nowTheme.font,
                        borderRadius: 20,
                      }}
                      source={{
                        uri: img,
                      }}
                    />
                    {/* <Image source={{ uri: imageUri }} style={styles.asd} /> */}
                  </TouchableOpacity>
                )}
              </Pressable>

              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 16,
                  fontSize: 20,
                  color: nowTheme.font,
                  fontWeight: "bold",
                }}
              >
                {content}
              </Text>
            </ScrollView>
          </SafeAreaView>
          {/* bottom sheet 테스트 */}
          {/* {labels !== "" ? */}
          <BottomSheet
            ref={sheetRef} // bottomSheet 참조
            snapPoints={snapPoints} // 슬라이드 올릴 시, 보여주는 화면 %
            enablePanDownToClose={false} // 슬라이드 올리고 다시 닫으면 사리지게 하는 기능
          >
            <BottomSheetView style={styles.bottomSheetView}>
              {/* 차트 제목용 텍스트 */}
              <View style={styles.chartTitle}>
                <Text style={styles.chartTitleText}>
                  {"[ "}감정분석 결과{" ]"}
                </Text>
              </View>

              {/* 차트 그래프 뷰 */}
              <View onLayout={onViewLayout} style={styles.barGraph}>
                {/* 차트 그래프 */}
                <HorizontalBarGraph
                  data={datas}
                  labels={labels}
                  // width={viewWidth*0.75}
                  // height={viewHeight*0.65}
                  width={330}
                  height={300}
                  baseConfig={{
                    xAxisLabelStyle: {
                      rotation: 0,
                      fontSize: 12,
                      // width: 70,
                      yOffset: 4,
                      // xOffset: -15
                    },

                    yAxisLabelStyle: {
                      rotation: 0,
                      fontSize: 13,
                      position: "bottom",
                      xOffset: 0,
                      height: 0,
                      decimals: 1,
                    },
                    hasYAxisBackgroundLines: true,
                  }}
                  barRadius={10}
                  barColor="green"
                  barWidthPercentage="0.15"
                />
              </View>
            </BottomSheetView>
          </BottomSheet>
          {/* : */}
          {/* <Text>
              데이터가 없습니다.
            </Text> */}
          {/* } */}
        </KeyboardAvoidingView>
      </>
    </View>
  );
}

export default PictureDetailScreen;

const styles = StyleSheet.create({
  errorTextStyle: {
    color: "#fff",
  },

  keyboardButtonView: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 12,
    marginBottom: 8,
  },

  saveButtonView: {
    justifyContent: "space-evenly",
    flexDirection: "row",
  },

  saveButtonStyle: {
    backgroundColor: "#456185",
    borderRadius: 10,
    padding: 10,
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fff",
    shadowOffset: {
      width: 2,
      height: 2,
    },

    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },

  textButtonStyle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },

  headerStyle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },

  richTextEditorStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    fontSize: 20,
  },

  richTextToolbarStyle: {
    backgroundColor: "#152F5E",
  },

  container: {
    backgroundColor: "#071D3A",
    flex: 1,
  },

  title: {
    color: "white",
    fontSize: SCREEN_HEIGHT / 36,
    height: SCREEN_HEIGHT / 28,
    margin: 10,
  },

  titleLayout: {
    borderColor: "white",
    justifyContent: "center",
  },

  extendLayout: {
    flexDirection: "row",
  },

  feelingLayout: {
    flexDirection: "row",

    borderColor: "white",
  },

  feeling: {
    width: SCREEN_WIDTH / 3,
    color: "#456185",
  },

  feelingBtnBox: {
    flexDirection: "row",
    width: SCREEN_WIDTH / 1.5,
    height: SCREEN_HEIGHT / 14.5,
    color: "#456185",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },

  date: {
    color: "white",
    padding: 10,
  },

  dateLayout: {
    height: SCREEN_HEIGHT / 20,
    width: SCREEN_WIDTH / 2,
    borderBottomWidth: 1,
    borderColor: "white",
  },

  contents: {
    padding: 10,
    flexShrink: 1,
    color: "white",
  },

  modalView: {
    flex: 0.3,
    backgroundColor: "#456185",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheetView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  chartTitle: {
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "blue",
    width: SCREEN_WIDTH,
  },

  chartTitleText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  barGraph: {
    width: SCREEN_WIDTH,
    height: "90%",
    alignItems: "center",
    paddingTop: 20,
    // justifyContent: 'center',
    // backgroundColor: 'green',
  },
});
