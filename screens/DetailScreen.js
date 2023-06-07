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
import { Picker } from "@react-native-picker/picker";
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
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function DetailScreen(card) {
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

  // 데이터 useState
  const [titleText, onChangeTitleText] = useState("");
  const [feelingText, onChangeFeelingText] = useState("");
  const richText = React.useRef();
  const [descHTML, setDescHTML] = useState("");
  const [showDescError, setShowDescError] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [date, setDate] = useState(new Date());
  const [id, setId] = useState("");
  const [checkImage, setCheckImage] = useState(false);
  const navigation = useNavigation();

  // 이미지 업로드용
  const [image, setImage] = useState("");
  const [send, setSend] = useState("");
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const formData = new FormData();
  let url = ""; //서버에서 받아올 aws이미지 경로

  // 일기 내용 저장
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [day, setDay] = useState("");
  const [img, setImg] = useState("");
  const [gptText, setGptText] = useState("");

  //Top3 감정 키워드 각각의 개수
  const [labels, setLabels] = useState([]);
  const [datas, setData] = useState([]);

  useEffect(() => {
    detail(); // 일기 내용 가져오기
    chartDataSet(); // 차트 데이터 값 set
  }, []);

  // 일기 내용 가져오기(read)
  const detail = async () => {
    try {
      await axios(
        {
          method: "post",
          url: `${API.DIARYINFO}`,
          params: {
            diarykey: card.route.params.card.diarykey,
          },
        },
        null
      )
        .then((res) => {
          setTitle(res.data[0]["title"]);
          setContent(res.data[0]["content"]);
          setMonth(res.data[0]["month"]);
          setYear(res.data[0]["year"]);
          setDay(res.data[0]["day"]);
          setImg(res.data[0]["img"]);
          setGptText(res.data[0]["cb_sentence"]);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const check = () => {
    setCheckImage(true);
  };

  // 일기 삭제(delete)
  const deletDiary = () => {
    let lmgkey = image.split("com/");
    axios(
      {
        method: "post",
        url: `${API.DELETE}`,
        params: {
          diarykey: card.route.params.card.diarykey,
          imgKey: lmgkey[1],
        },
      },
      null
    )
      .then((res) => {
        console.log("삭제함");
        Alert.alert("삭제되었습니다.");
        navigation.pop();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //삭제 알림창
  const alertDelete = () => {
    Alert.alert(
      "일기를 삭제하시겠어요?",
      "삭제한 일기는 복구할 수 없어요!",
      [
        {
          text: "네",
          onPress: () => deletDiary(),
          style: "cancel",
        },
        { text: "아니오", onPress: () => console.log("안한대") },
      ],
      { cancelable: false }
    );
  };

  //링크이동
  const moveNavigate = (screen) => {
    navigation.navigate(screen);
  };

  //id값 꺼내오기
  useEffect(() => {
    AsyncStorage.getItem("id", (err, result) => {
      setId(result);
    });
  }, []);

  //서버 요청 로딩
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgcolor] = ["#fdeebb", "#d5f0ff", "#ffd5fd"];
  const [gdColor, setGdColor] = [
    ["#ffad06", "#ffcd06", "#ffdd06"],
    ["#00b1f0", "#00d1f0", "#00e1f0"],
    ["#f00080", "#f04080", "#f08080"],
  ];

  // 차트 값 설정
  const chartDataSet = () => {
    if (card.route.params.card.second_number === 0) {
      setLabels([card.route.params.card.top_emotion]);
      setData([100]);
    } else if (card.route.params.card.third_number === 0) {
      let one = card.route.params.card.top_number;
      let two = card.route.params.card.second_number;

      let oneData = (one / (one + two)) * 100;
      let twoData = (two / (one + two)) * 100;

      setLabels([
        card.route.params.card.top_emotion,
        card.route.params.card.second_emotion,
      ]);
      setData([Math.round(oneData), Math.round(twoData)]);
    } else {
      let one = card.route.params.card.top_number;
      let two = card.route.params.card.second_number;
      let three = card.route.params.card.third_number;

      let oneData = (one / (one + two + three)) * 100;
      let twoData = (two / (one + two + three)) * 100;
      let threeData = (three / (one + two + three)) * 100;

      setLabels([
        card.route.params.card.top_emotion,
        card.route.params.card.second_emotion,
        card.route.params.card.third_emotion,
      ]);
      setData([
        Math.round(oneData),
        Math.round(twoData),
        Math.round(threeData),
      ]);
    }
    console.log("label", labels);
  };

  // bottom sheet 테스트
  // ref
  const sheetRef = useRef(null);
  // variables
  const snapPoints = ["10%", "98%"];

  return (
    <View style={{ ...styles.container, backgroundColor: nowTheme.cardBg }}>
      <View style={styles.topView}>
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
            style={{
              ...styles.title,
              color: nowTheme.bg,
              fontWeight: "bold",
            }}
            value={"data.title"}
            returnKeyType="next"
            maxLength={30}
            editable={false} // 수정누른 경우 true로 state 바꿔야 텍스트 편집가능 함.
          >
            제목: {card.route.params.card.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* 수정 버튼 */}
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.navigate("Modify", { card: card })}
            >
              <FontAwesome5 name="pen" size={18} color={nowTheme.bg} />
            </TouchableOpacity>

            {/* 삭제 버튼 */}
            <TouchableOpacity style={{ padding: 10 }} onPress={alertDelete}>
              <MaterialIcons name="delete" size={24} color={nowTheme.bg} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <SafeAreaView
          style={{
            ...styles.feelingLayout,
            backgroundColor: nowTheme.btn,
            borderColor: nowTheme.cardBorder,
          }}
        >
          {/* 날짜 */}
          <Text style={{ ...styles.date, color: nowTheme.cardBg }}>
            날짜: {card.route.params.card.year}년 {card.route.params.card.month}
            월 {card.route.params.card.day}일
          </Text>
        </SafeAreaView>

        <View
          style={{
            ...styles.shadowView,
          }}
        ></View>
      </View>
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
                fontSize: 17,
                color: nowTheme.font,
                fontWeight: "bold",
              }}
            >
              {card.route.params.card.content}
            </Text>
          </ScrollView>
        </SafeAreaView>

        {/* bottom sheet 테스트 */}

        <BottomSheet
          ref={sheetRef} // bottomSheet 참조
          snapPoints={snapPoints} // 슬라이드 올릴 시, 보여주는 화면 %
          enablePanDownToClose={false} // 슬라이드 올리고 다시 닫으면 사리지게 하는 기능
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.7,
            shadowRadius: 2.62,
            elevation: 4,
          }}
        >
          <BottomSheetView
            style={{
              ...styles.bottomSheetView,
            }}
          >
            <SafeAreaView>
              <ScrollView pagingEnabled={true}>
                <View>
                  {/* 차트 제목용 텍스트 */}
                  <View style={styles.chartTitle}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: SCREEN_WIDTH,
                        marginHorizontal: 16,
                      }}
                    >
                      <View
                        style={{
                          padding: 4,
                          backgroundColor: "#404040",
                          borderRadius: 100,
                        }}
                      ></View>
                      <View
                        style={{
                          padding: 4,
                          backgroundColor: "#404040",
                          borderRadius: 100,
                        }}
                      ></View>
                    </View>

                    <Text style={styles.chartTitleText}>감정분석 결과</Text>
                  </View>
                  <View style={styles.barContents}>
                    <View
                      style={{
                        ...styles.sodamView,
                        backgroundColor: nowTheme.btn,
                      }}
                    >
                      <View style={{ ...styles.sodamTitleView }}>
                        <Text
                          style={{ ...styles.sodamText, color: nowTheme.bg }}
                        >
                          소담이가 하고 싶은 말이 있대요!
                        </Text>
                      </View>

                      <View style={{ ...styles.chatBotImageView }}>
                        <Image
                          source={require("../assets/images/neutral.png")}
                          style={styles.imageSize}
                          resizeMode={"contain"}
                        ></Image>
                      </View>
                    </View>
                    <View
                      style={{
                        ...styles.sodamChatView,
                      }}
                    >
                      <Text style={{ ...styles.sodamChat }}>{gptText}</Text>
                    </View>
                  </View>
                </View>

                {/* 차트 그래프 뷰 */}
                <View style={styles.barContents}>
                  {/* 기쁨 */}
                  <View style={styles.barGraph}>
                    {labels.map((label, index) => {
                      return (
                        <View key={index} style={styles.emotionView}>
                          {index === 0 ? (
                            <View
                              style={{
                                ...styles.emtionImage,
                                backgroundColor: "#fdeebb",
                              }}
                            ></View>
                          ) : index === 1 ? (
                            <View
                              style={{
                                ...styles.emtionImage,
                                backgroundColor: "#d5f0ff",
                              }}
                            ></View>
                          ) : (
                            <View
                              style={{
                                ...styles.emtionImage,
                                backgroundColor: "#ffd5fd",
                              }}
                            ></View>
                          )}
                          <View style={{ ...styles.columnView }}>
                            <View style={{ ...styles.emotionDic }}>
                              <Text style={{ ...styles.emotionKey }}>
                                {label}
                              </Text>
                              <Text style={{ ...styles.emotionValue }}>
                                {datas[index]}%
                              </Text>
                            </View>

                            <View style={{ ...styles.emotionBarView }}>
                              <View style={{ ...styles.emotionBarKey }}>
                                {index === 0 ? (
                                  <LinearGradient
                                    style={{
                                      ...styles.emotionBarValue,
                                      width: `${datas[index]}%`, // 이 값이 유동적이여야 함.
                                    }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={["#ffad06", "#ffcd06", "#ffdd06"]}
                                  ></LinearGradient>
                                ) : index === 1 ? (
                                  <LinearGradient
                                    style={{
                                      ...styles.emotionBarValue,
                                      width: `${datas[index]}%`, // 이 값이 유동적이여야 함.
                                    }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={["#00b1f0", "#00d1f0", "#00e1f0"]}
                                  ></LinearGradient>
                                ) : (
                                  <LinearGradient
                                    style={{
                                      ...styles.emotionBarValue,
                                      width: `${datas[index]}%`, // 이 값이 유동적이여야 함.
                                    }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={["#f00080", "#f04080", "#f08080"]}
                                  ></LinearGradient>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </BottomSheetView>
        </BottomSheet>
      </KeyboardAvoidingView>
    </View>
  );
}

export default DetailScreen;

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
    shadowColor: "#000",
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
    justifyContent: "space-between",
    flexDirection: "row",
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
  },

  chartTitle: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: SCREEN_WIDTH,
    marginBottom: 16,
  },

  chartTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#404040",
  },
  barContents: {
    flex: 1,
    backgroundColor: "red",
    borderRadius: 20,
    backgroundColor: "#F9F9F9",
    borderColor: "#ccc",
    borderWidth: 1,
    maxWidth: SCREEN_WIDTH,
    margin: 8,
  },

  barGraph: {
    flex: 0.9,
    alignItems: "center",
    margin: 18,
  },

  shadowView: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 2.62,
    elevation: 4,
  },

  topView: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 2.62,
    elevation: 4,
  },

  emotionView: {
    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 10,
    width: SCREEN_WIDTH / 1.2,
    height: SCREEN_HEIGHT / 13,
    padding: 8,
    margin: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },

  emtionImage: {
    padding: 12,
    borderRadius: 100,
  },

  columnView: {
    flex: 1,
    margin: 4,
  },

  emotionDic: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 0.6,
  },

  emotionKey: {
    fontWeight: "400",
  },

  emotionValue: {
    color: "#a6a6a6",
  },

  emotionBarView: {
    flex: 0.4,
    borderRadius: 100,
  },

  emotionBarKey: {
    flex: 0.6,
    borderRadius: 100,
    backgroundColor: "#F2F2F2",
  },

  emotionBarValue: {
    height: "100%",
    borderRadius: 100,
  },
  chatBotImageView: {
    marginTop: 12,
    marginRight: 12,
    marginLeft: 12,
    marginBottom: 12,
    flex: 0.5,
    justifyContent: "center",
    height: SCREEN_HEIGHT / 12,
    maxHeight: SCREEN_HEIGHT / 12,
  },
  imageSize: {
    width: "85%",
    height: "85%",
  },

  sodamView: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderColor: "#c6c6c6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    maxHeight: SCREEN_HEIGHT / 12,
  },

  sodamTitleView: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    maxHeight: SCREEN_HEIGHT / 12,
  },
  sodamText: {
    fontSize: SCREEN_HEIGHT / 46,
    fontWeight: "bold",
  },

  sodamChatView: {
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 16,
  },

  sodamChat: { fontSize: SCREEN_HEIGHT / 50, fontWeight: "600" },
});
