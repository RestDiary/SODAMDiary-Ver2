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
import { API } from "../config.js";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function JoinScreen({ navigation }) {
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
  var mailRegExp =
    /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{2,3}$/;
  var idRegExp = /^[a-zA-z0-9]{5,12}$/; //아이디 유효성 검사
  var pwRegExp = /^[a-zA-z0-9!@#$%^*+=-]{4,15}$/; //비밀번호 유효성 검사
  const [id, setId] = React.useState(""); //아이디
  const [email, setEmail] = React.useState(""); //이메일
  const [pw, setPw] = React.useState(""); //비밀번호
  const [pw2, setPw2] = React.useState(""); //비밀번호 재확인
  const [checkId, setCheckId] = React.useState(true); //아이디 중복체크
  const [checkPw, setCheckPw] = React.useState(false); //비밀번호 동일 여부 체크
  const [changeId, setChangeId] = React.useState(
    "아이디는 5~12글자 사이의 영문자와 숫자만 가능합니다."
  );
  const [changePW, setChangePW] =
    React.useState("비밀번호가 일치하지 않습니다.");
  const [changeEmail, setChangeEmail] = React.useState("");

  //회원가입
  const register = async () => {
    console.log("회원가입 하러 옴");

    if (id === "") {
      alert("아이디 입력해주세요");
      return;
    } else if (email === "") {
      alert("이메일을 입력해주세요.");
      return;
    } else if (pw === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    } else if (pw2 === "") {
      alert("비밀번호 재입력을 해주세요.");
      return;
    } else if (!checkPw) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    } else if (!checkId) {
      alert("존재하는 아이디입니다.");
      return;
    } else if (!mailRegExp.test(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    } else if (!idRegExp.test(id)) {
      alert("아이디 형식이 올바르지 않습니다.");
      return;
    } else if (!pwRegExp.test(pw)) {
      alert("비밀번호 형식이 올바르지 않습니다.");
      return;
    }

    await axios
      .post(`${API.REGISTER}`, null, {
        params: {
          id: id,
          email: email,
          pw: pw,
        },
      })
      .then((res) => {
        console.log(res.data);
        navigation.replace("Login"); // 성공하면 이동
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //닉네임 중복체크
  const overlap = () => {
    console.log("중복체크 하러 옴");
    axios
      .post(`${API.OVERLAP}`, null, {
        params: {
          id: id,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === 0) {
          // 0을 받아오면 성공
          console.log("없는 아이디");
          setCheckId(true);
          setChangeId("사용할 수 있는 아이디입니다.");
          return;
        } else {
          // 0이외의 값이라면 실패
          console.log("있는 아이디");
          setCheckId(false);
          setChangeId("사용할 수 없는 아이디입니다.");
          return;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //아이디 중복체크 실시간
  React.useEffect(() => {
    if (id.length > 4) {
      overlap();
    } else {
      setChangeId("아이디는 5~12글자 사이의 영문자와 숫자만 가능합니다.");
      setCheckId(true);
    }
  }, [id]);

  React.useEffect(() => {
    if (pw2 === "") {
      setChangePW("");
    } else if (pw === pw2) {
      setCheckPw(true);
      setChangePW("비밀번호가 일치합니다.");
    } else {
      setCheckPw(false);
      setChangePW("비밀번호가 일치하지 않습니다.");
    }
  }, [pw2]);

  React.useEffect(() => {
    if (email === "") {
      setChangeEmail("");
    } else if (!mailRegExp.test(email)) {
      setChangeEmail("이메일 형식이 올바르지 않습니다.");
    } else {
      setChangeEmail("사용할 수 있는 이메일입니다.");
    }
  }, [email]);

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
          <View style={{ ...styles.inputCheck }}>
            <Text
              style={checkId ? { color: nowTheme.btn } : { color: "#ff0000" }}
            >
              {changeId}
            </Text>
          </View>
          {/* 이메일 박스 */}
          <TextInput
            style={{ ...styles.inputBox }}
            placeholder="이메일 입력"
            placeholderTextColor={"#999999"}
            onChangeText={(text) => setEmail(text)}
          />
          {/* 이메일 유효성 검사 */}
          <View style={{ ...styles.inputCheck }}>
            <Text
              style={
                mailRegExp.test(email)
                  ? { color: nowTheme.btn }
                  : { color: "#ff0000" }
              }
            >
              {changeEmail}
            </Text>
          </View>

          {/* 비밀번호 박스 */}
          <TextInput
            style={{ ...styles.inputBox }}
            placeholder="비밀번호 입력"
            placeholderTextColor={"#999999"}
            secureTextEntry
            onChangeText={(text) => setPw(text)}
          />
          {/* margin */}
          <View style={{ ...styles.inputCheck }}>
            <Text style={{ color: nowTheme.btn }}>
              비밀번호는 4~15글자 사이의 문자만 사용할 수 있습니다.
            </Text>
          </View>

          {/* 비밀번호 확인 박스 */}
          <TextInput
            style={{ ...styles.inputBox }}
            placeholder="비밀번호 재입력"
            placeholderTextColor={"#999999"}
            secureTextEntry
            onChangeText={(text) => setPw2(text)}
          />
          {/* 비밀번호 유효성 검사 */}
          <View style={{ ...styles.inputCheck }}>
            <Text
              style={!checkPw ? { color: "#ff0000" } : { color: nowTheme.btn }}
            >
              {changePW}
            </Text>
          </View>

          {/* 회원가입 버튼 */}
          <TouchableHighlight
            style={{ marginTop: 24 }}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={register}
          >
            <View
              style={{
                ...styles.joinBtn,
                backgroundColor: nowTheme.btn,
                shadowColor: "black",
              }}
            >
              <Text style={{ ...styles.joinText, color: "white" }}>
                회원가입
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default JoinScreen;

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
