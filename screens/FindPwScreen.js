import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Text,
  TouchableHighlight,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function FindPwScreen({ navigation }) {
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

  const [id, setId] = useState(""); //아이디
  const [email, setEmail] = useState(""); //이메일
  const [certified, setCertified] = useState(""); //사용자가 친 인증번호
  const [sendNum, setSendNum] = useState(""); // 받아온 인증번호
  const [red, setRed] = useState(""); //인증번호 틀리면 경고문구
  const [time, setTime] = useState(180); // 3분 시간제한
  const [time2, setTime2] = useState(false); //타이머 돌릴지 말지 결정
  const [minute, setMinute] = useState(); // 분 저장
  const [second, setSecond] = useState(); // 초 저장
  const [div, setDiv] = useState(""); // : 생성 유무

  //이메일 인증번호 발송
  const checkNum = () => {
    console.log("인증번호 보내러 옴");
    axios
      .post(`${API.CHECKNUM}`, null, {
        params: {
          id: id,
          email: email,
        },
      })
      .then((res) => {
        if (res.data !== 1) {
          // 1을 받아오면 없는 아이디 또는 이메일
          //   clearTimeout(timer);
          console.log(res.data.result);
          setSendNum(res.data.result); // 받아온 값 저장
          alert("인증번호를 발송했습니다.");
          setRed("");
          setTime2(true);
          setDiv(":");
          setTime(180 - 1);

          return;
        } else {
          // 0이외의 값이라면 실패
          console.log("없는 이메일 또는 아이디");
          alert("아이디 또는 이메일이 잘못되었습니다.");
          return;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const same = () => {
    console.log("인증번호 값: " + sendNum);
    console.log("내가 친 값 : " + certified);
    console.log(typeof sendNum.toString());
    console.log(typeof certified);
    if (sendNum.toString() === certified && certified !== "") {
      AsyncStorage.setItem("tempId", id);
      setSendNum("dlwpRmxskTek.ejdltkddmlalfosmsdjqtek.sjs smwdjTek.");
      console.log("인증됨");
      navigation.replace("ChangePw");
    } else {
      setRed("인증번호가 일치하지 않습니다.");
      return;
    }
  };

  //타이머
  useEffect(() => {
    if (time2) {
      let timer = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
      setMinute(parseInt(time / 60));
      setSecond(time % 60);

      if (time === 0) {
        setTime2(false);
        setSendNum("dlwpRmxskTek.ejdltkddmlalfosmsdjqtek.sjs smwdjTek.");
        setMinute("시간이 만료되었습니다.");
        setSecond("");
        setDiv("");
      }

      return () => clearTimeout(timer);
    }
  }),
    [time];

  return (
    <View style={{ ...styles.container, backgroundColor: nowTheme.cardBg }}>
      {/* 로고 박스 */}
      <View style={{ ...styles.logoBox }}>
        <Image
          resizeMode="contain"
          style={{ width: SCREEN_WIDTH / 2 }}
          source={nowTheme.logo}
        ></Image>
      </View>

      {/* 입력 레이아웃 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ ...styles.inputLayout }}>
          {/* 아이디 박스 */}
          <TextInput
            style={{ ...styles.inputBox }}
            placeholder="아이디 입력"
            placeholderTextColor={"#999999"}
            onChangeText={(text) => setId(text)}
          />
          {/* 아이디 유효성 검사 */}
          <View style={{ ...styles.inputCheck }}></View>
          {/* 이메일 박스 */}
          <TextInput
            style={{ ...styles.inputBox }}
            placeholder="이메일 입력"
            placeholderTextColor={"#999999"}
            onChangeText={(text) => setEmail(text)}
          />
          {/* 이메일 유효성 검사 */}
          <View style={{ ...styles.inputCheck }}></View>
          {/* 인증번호 발급 버튼 */}
          <TouchableHighlight
            style={{ marginBottom: 8 }}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={checkNum}
          >
            <View
              style={{
                ...styles.joinBtn,
                backgroundColor: nowTheme.btn,
                shadowColor: "black",
              }}
            >
              <Text style={{ ...styles.joinText, color: "white" }}>
                인증번호 발급
              </Text>
            </View>
          </TouchableHighlight>
          {/* margin */}
          <View style={{ ...styles.inputCheck }}></View>

          {/* 인증번호 박스 */}
          <TextInput
            style={{ ...styles.inputBox }}
            placeholder="인증번호 입력"
            placeholderTextColor={"#999999"}
            secureTextEntry
            onChangeText={(text) => setCertified(text)}
          />
          {/* 인증번호 유효성 검사 */}
          <View style={{ ...styles.inputCheck }}>
            <Text style={{ color: "red" }}>{red}</Text>
            <Text style={{ color: "white" }}>
              {minute}
              {div}
              {second}
            </Text>
          </View>

          {/* 새로운 비밀번호로 변경 버튼 */}
          <TouchableHighlight
            style={{ marginTop: 24 }}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={same}
          >
            <View
              style={{
                ...styles.joinBtn,
                backgroundColor: nowTheme.btn,
                shadowColor: "black",
              }}
            >
              <Text style={{ ...styles.joinText, color: "white" }}>
                새로운 비밀번호로 변경
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default FindPwScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column",
    width: SCREEN_WIDTH,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },

  logoBox: {
    height: SCREEN_HEIGHT / 20,
    justifyContent: "center",
    alignItems: "center",
  },

  inputLayout: {
    paddingLeft: 24,
    paddingRight: 24,
  },

  inputBox: {
    paddingLeft: 18,
    marginBottom: 8,
    height: SCREEN_HEIGHT / 16,
    backgroundColor: "#F1F1F5",
    width: "100%",
    borderRadius: 10,
    border: 1,
  },

  inputCheck: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  joinBtn: {
    padding: 18,
    justifyContent: "center",
    alignItems: "center",
    // IOS
    shadowColor: "#32CD99", //그림자색
    shadowOpacity: 0.4, //그림자 투명도
    shadowOffset: { width: 3, height: 3 }, //그림자 위치
    // ANDROID
    elevation: 3,
  },

  joinText: {
    fontWeight: "bold",
  },
});
