import React, { useState, useEffect } from "react";
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

  const [titleText, onChangeTitleText] = useState("");
  const [feelingText, onChangeFeelingText] = useState("");
  const richText = React.useRef();
  const [descHTML, setDescHTML] = useState("");
  const [showDescError, setShowDescError] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [Emotions, setEmotions] = useState([]);
  const [date, setDate] = useState(new Date());
  const [id, setId] = useState("");
  const [checkImage, setCheckImage] = useState(false);
  const navigation = useNavigation();

  //이미지 업로드용
  const [image, setImage] = useState("");
  const [send, setSend] = useState("");
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const formData = new FormData();
  let url = ""; //서버에서 받아올 aws이미지 경로

  //일기 내용 저장
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [day, setDay] = useState("");
  const [img, setImg] = useState("");
  const [keyword, setKeyword] = useState("");
  const [voice2, setVoice] = useState("");

  useEffect(() => {
    detail();
  }, []);

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
          setKeyword(res.data[0]["keyword"]);
          setVoice(res.data[0]["voice"]);
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

  //일기 삭제
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
          style={{ ...styles.title, color: nowTheme.font, fontWeight: "bold" }}
          value={"data.title"}
          returnKeyType="next"
          maxLength={30}
          editable={false} // 수정누른 경우 true로 state 바꿔야 텍스트 편집가능 함.
        >
          제목: {card.route.params.card.title}
        </Text>
      </SafeAreaView>

      {/* 감정선택 */}
      <SafeAreaView
        style={{
          ...styles.feelingLayout,
          backgroundColor: nowTheme.btn,
          borderColor: nowTheme.cardBorder,
        }}
      >
        {/* 날짜 */}
        <Text style={{ ...styles.date, color: nowTheme.font }}>
          날짜: {card.route.params.card.year}년 {card.route.params.card.month}월{" "}
          {card.route.params.card.day}일
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
                      resizeMode="contain"
                      imageBackgroundColor={nowTheme.cardBg}
                      style={{
                        marginLeft: 10,
                        marginTop: 16,
                        width: SCREEN_WIDTH / 1.5,
                        height: SCREEN_WIDTH / 1.5,
                        borderWidth: 1,
                        borderColor: nowTheme.cardBorder,
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

              <Text style={{fontSize:20, color:"white", fontWeight:"bold"}}>
              {card.route.params.card.content}
              </Text>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>

        {/* 수정 버튼 */}
        <View style={{ ...styles.saveButtonView, marginTop: 16 }}>
          <TouchableOpacity
            style={{
              ...styles.saveButtonStyle,
              backgroundColor: nowTheme.btn,
            }}
            onPress={() => navigation.navigate("Modify", { card: card })}
          >
            <Text style={{ ...styles.textButtonStyle }}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.saveButtonStyle,
              backgroundColor: nowTheme.btn,
            }}
            onPress={alertDelete}
          >
            <Text style={styles.textButtonStyle}>삭제</Text>
          </TouchableOpacity>
        </View>
      </>
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
    height: SCREEN_HEIGHT / 20,
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
});
