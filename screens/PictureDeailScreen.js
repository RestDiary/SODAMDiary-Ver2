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

  const richText = React.useRef();
  const [Emotions, setEmotions] = useState([]);

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
            diarykey: Album.route.params.album,
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
          // console.log(res)
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

  //키워드 제거
  const delEmotion = (keyword) => {
    let temp = [...Emotions];
    setEmotions(temp.filter((i) => i !== keyword));
  };

  //자식에서 부모에게 Audio 데이터 전달
  const [audio, setAudio] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const getAudio = (audio, isRecording) => {
    setAudio(audio);
    setIsRecording(isRecording);
  };

  const richTextHandle = (descriptionText) => {
    if (descriptionText) {
      setShowDescError(false);
      setDescHTML(descriptionText);
    } else {
      setShowDescError(true);
      setDescHTML("");
    }
  };

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
          value={"title"}
          returnKeyType="next"
          maxLength={30}
          editable={false} // 수정누른 경우 true로 state 바꿔야 텍스트 편집가능 함.
        >
          제목: {title}
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
          날짜: {year}년 {month}월 {day}일
        </Text>
      </SafeAreaView>

      {/*--------------------- 에디터 --------------------- */}
      {editorColor.backgroundColor && (
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
                <Text style={{fontSize:20, color:"white", fontWeight:"bold"}}>{content}</Text>
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </>
      )}
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
