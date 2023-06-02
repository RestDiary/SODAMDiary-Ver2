import React, { useState, useEffect, useRef } from "react";
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
  Keyboard,
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

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
  console.log("card: ", card.route.params.card.route.params.card);
  console.log("diarykey", card.route.params.card.route.params.card.diarykey);

  const [data, setData] = useState([]); // 기존 데이터 넣을 곳

  const [titleText, onChangeTitleText] = useState(
    card.route.params.card.route.params.card.title
  );
  const [feelingText, onChangeFeelingText] = useState("");
  const richText = useRef();
  const [descHTML, setDescHTML] = useState(
    card.route.params.card.route.params.card.content
  );
  const [showDescError, setShowDescError] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [Emotions, setEmotions] = useState([]);
  const [date, setDate] = useState(new Date());
  const [id, setId] = useState("");
  const navigation = useNavigation();

  // 특정 행동 시 반응(글 내용)
  const [content, setContent] = useState(
    card.route.params.card.route.params.card.content
  );
  let user_Q = [""];
  // let cb_answer = [];
  const [cb_answer, setCb_answer] = useState([]);
  const [cb_emotion, setCb_emotion] = useState([]);
  const [showA, setShowA] = useState("안녕하세요~");
  const [showE, setShowE] = useState("");
  const [use_content3, setUse_content3] = useState(""); // ., ?, !...등을 썼는지 확인하는 용도
  // let cb_emotion = [];

  //이미지 업로드용
  const [image, setImage] = useState(
    card.route.params.card.route.params.card.img
  );
  const [send, setSend] = useState("");
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const formData = new FormData();
  let url = card.route.params.card.route.params.card.img; //서버에서 받아올 aws이미지 경로
  let showImage = true;

  //날짜 선택 보일지 여부 선택
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [year, setYear] = useState(
    card.route.params.card.route.params.card.year
  );
  const [month, setMonth] = useState(
    card.route.params.card.route.params.card.month
  );
  const [day, setDay] = useState(card.route.params.card.route.params.card.day);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
    setDay(date.getDate());

    hideDatePicker();
  };

  useEffect(() => {
    getDiaryData();
  }, []);

  // 챗봇과 연결2
  const chatBotRink = async () => {
    // 특정 문자가 입력되었을 때 작동
    console.log("챗봇과 연결2");

    let message = use_content3.split(/[.!?~]/);
    let text = message[message.length - 1];
    console.log("text: " + message);
    console.log("text2: " + text);

    await axios
      .post("http://192.168.0.18:3001/flask", null, {
        params: {
          text: text,
        },
      })
      .then((res) => {
        console.log("결과", res.data.sentence);
        setCb_answer(cb_answer + "##" + res.data.sentence);
        setCb_emotion(cb_emotion + "##" + res.data.emotion);
        setShowA(res.data.sentence);
        setShowE(res.data.emotion);
        setUse_content3("");
      });
  };

  useEffect(() => {
    console.log("content: ", content);
    setUse_content3(content);
    let use_content4 = content.charAt(content.length - 1);
    console.log("use_content3: ", use_content3);
    console.log("use_content4: ", use_content4);

    if (
      use_content4 === "." ||
      use_content4 === "!" ||
      use_content4 === "?" ||
      use_content4 === "\n" ||
      use_content4 === "?" ||
      use_content4 === "~"
    ) {
      console.log("들어왔어!");
      chatBotRink();
    }
  }, [content]);

  //일기 data 요청
  const getDiaryData = async () => {
    setLoading(true);
    try {
      await axios(
        {
          method: "post",
          url: `${API.DIARYINFO}`,
          // url: 'http://192.168.0.18:3001/diaryInfo',
          params: {
            diarykey: card.route.params.card.route.params.card.diarykey,
          },
        },
        null
      )
        .then((res) => {
          setData(res.data);
          console.log("들어온", res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  //내 갤러리에서 사진 선택
  const pickImage = async () => {
    if (!status.granted) {
      // status로 권한이 있는지 확인
      const permission = await requestPermission();
      if (!permission.granted) {
        return null;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      aspect: [1, 1],
    });

    if (result.canceled) {
      return null;
    }

    setImage(result.assets[0].uri);

    const localUri = result.assets[0].uri;

    const filename = localUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename ?? "");
    const type = match ? `image/${match[1]}` : `image`;
    // const formData = new FormData();
    formData.append("image", { uri: localUri, name: filename, type });
    setSend(formData);
    console.log(formData);
    console.log(localUri);
    console.log(filename);
    console.log(type);
  };

  //링크이동
  const moveNavigate = (screen) => {
    navigation.navigate(screen);
  };

  //Modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  //키워드 제거
  const delEmotion = (keyword) => {
    let temp = [...Emotions];
    setEmotions(temp.filter((i) => i !== keyword));
  };

  //이미지 제거
  const delImg = () => {
    Alert.alert(
      "삭제",
      "이미지를 삭제하시겠습니까?",
      [
        {
          text: "네",
          onPress: () => delImg2(),
          style: "cancel",
        },
        { text: "아니오", onPress: () => console.log("안한대") },
      ],
      { cancelable: false }
    );
  };

  const delImg2 = () => {
    console.log("삭제한대");
    setImage("");
    showImage = false;
  };

  //id값 꺼내오기
  useEffect(() => {
    AsyncStorage.getItem("id", (err, result) => {
      setId(result);
    });
  }, []);

  //서버 요청 로딩
  const [loading, setLoading] = useState(false);

  //저장 버튼
  const submitContentHandle = async () => {
    if (titleText.length <= 0) {
      setShowDescError(true);
      Alert.alert("제목을 입력해 주세요.");
      return;
    }

    if (content.length <= 0) {
      setShowDescError(true);
      Alert.alert("내용을 입력해 주세요.");
      return;
    }

    if ((!card.route.params.card.route.params.card.img && image) != "") {
      // formData.append('multipartFileList' , {uri: localUri, name: filename, type});
      await axios({
        method: "post",
        url: "http://people-env.eba-35362bbh.ap-northeast-2.elasticbeanstalk.com:3001/upload",
        headers: {
          "content-type": "multipart/form-data",
        },
        data: send,
      })
        .then((res) => {
          // richText.current.insertImage(res.data);
          url = res.data;
          console.log(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // 서버 데이터 전송
    setLoading(true);

    try {
      await axios(
        {
          method: "post",
          url: "http://people-env.eba-35362bbh.ap-northeast-2.elasticbeanstalk.com:3001/diaryModify",
          // url: 'http://192.168.1.13:3001/diaryModify',
          params: {
            diarykey: card.route.params.card.route.params.card.diarykey,
            title: titleText,
            content: content,
            year: year,
            month: month,
            day: day,
            img: url, //****이미지 추가
            cb_sentence: cb_answer,
            cb_emotion: cb_emotion,
          },
        },
        null
      )
        .then((res) => {
          console.log("성공", res.data);
          Alert.alert("일기가 수정되었어요.");
          moveNavigate("Diary");
        })
        .catch(function (error) {
          console.log(error.response.data);
          Alert.alert("❗error : bad response");
        });
    } catch (error) {
      console.log(error.response.data);
    }

    setLoading(false);
  };

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
          <TextInput
            placeholder="제목"
            placeholderTextColor={"#456185"}
            style={{
              ...styles.title,
              color: nowTheme.font,
              fontWeight: "bold",
            }}
            onChangeText={onChangeTitleText}
            value={titleText}
            returnKeyType="next"
            maxLength={30}
            editable={true}
          />
        </SafeAreaView>
        <View
          style={{
            ...styles.feelingLayout,
            backgroundColor: nowTheme.btn,
            borderColor: nowTheme.cardBorder,
          }}
        >
          {/* 날짜 */}
          <TouchableOpacity onPress={showDatePicker}>
            <Text
              style={{
                ...styles.date,
                color: nowTheme.font,
                fontWeight: "bold",
              }}
            >
              {year + "년 " + month + "월 " + day + "일"}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              right: 0,
            }}
          >
            {/* 키보드 내리기 버튼 */}
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => Keyboard.dismiss()}
            >
              <MaterialIcons
                name="keyboard-hide"
                size={24}
                color={nowTheme.bg}
              />
            </TouchableOpacity>
            {/* 갤러리 버튼 */}
            <TouchableOpacity style={{ padding: 10 }} onPress={pickImage}>
              <MaterialCommunityIcons
                name="image-plus"
                size={24}
                color={nowTheme.bg}
              />
            </TouchableOpacity>
            {/* 저장 버튼 */}
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={submitContentHandle}
            >
              <Entypo name="save" size={24} color={nowTheme.bg} />
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={date}
        />
        {/* 챗봇 전체 뷰 */}
        <View
          style={{
            ...styles.chatBotView,
            backgroundColor: nowTheme.btn,
          }}
        >
          {/* 챗봇 이미지 뷰 */}
          <View style={{ ...styles.chatBotImageView }}>
            <Image
              source={require("../assets/images/SodamBot.png")}
              style={styles.imageSize}
              resizeMode={"contain"}
            ></Image>
          </View>
          {/* 챗봇 내용 뷰 */}
          <View
            style={{
              ...styles.chatBotContents,
              borderColor: nowTheme.btn,
              backgroundColor: nowTheme.bg,
              justifyContent: "center",
            }}
          >
            {/* 챗봇 텍스트 */}
            <Text
              style={{
                margin: 8,
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                alignSelf: "center",
              }}
            >
              끄덕끄덕, 듣고있어요~{showA} (평온){showE}
            </Text>
          </View>
        </View>
      </View>

      {/* 스크롤 뷰 시작 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 0.9 }}
      >
        <ScrollView>
          {/* {이미지 보이는 곳} */}
          <Pressable onLongPress={delImg}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  width: SCREEN_WIDTH / 1.5,
                  height: SCREEN_WIDTH / 1.5,
                  borderWidth: 1,
                  borderColor: nowTheme.cardBorder,
                  margin: 8,
                  borderRadius: 20,
                }}
              />
            )}
          </Pressable>

          {/* 글 작성 */}
          <TextInput
            placeholder="내용"
            placeholderTextColor={"#456185"}
            style={{
              ...styles.title,
              color: nowTheme.font,
              fontWeight: "bold",
            }}
            onChangeText={setContent}
            value={content}
            returnKeyType="next"
            multiline={true}
          />
        </ScrollView>
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
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonStyle: {
    backgroundColor: "#456185",
    borderRadius: 10,
    padding: 10,
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
    marginRight: 8,
  },

  textButtonStyle: {
    fontSize: 16,
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

  title: {
    color: "white",
    fontSize: SCREEN_HEIGHT / 36,
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

  chatBotView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chatBotContents: {
    flex: 0.84,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 16,
    height: SCREEN_HEIGHT / 12,
    maxHeight: SCREEN_HEIGHT / 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 2.62,
    elevation: 4,
  },

  chatBotImageView: {
    marginTop: 12,
    marginRight: 12,
    marginLeft: 12,
    marginBottom: 12,
    flex: 0.16,
    justifyContent: "center",
    height: SCREEN_HEIGHT / 12,
    maxHeight: SCREEN_HEIGHT / 12,
  },

  imageSize: {
    width: "110%",
    height: "110%",
  },
});
