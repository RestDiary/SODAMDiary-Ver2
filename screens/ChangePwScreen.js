import React, { useEffect, useState } from 'react';
import { dark, votanical, town, classic, purple, block, pattern, magazine, winter } from './css/globalStyles';
import { StyleSheet, Dimensions, View, Image, TextInput, SafeAreaView, Text, TouchableHighlight, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function ChangePwScreen({ navigation }) {
  //테마
  useEffect(() => {
    getTheme()
  }, [])

  const [nowTheme, setNowTheme] = useState({});

  const getTheme = async () => {
    let selectedTheme = await AsyncStorage.getItem('theme');

    if (selectedTheme.includes("dark")) setNowTheme(dark);
    else if (selectedTheme.includes("votanical")) setNowTheme(votanical);
    else if (selectedTheme.includes("town")) setNowTheme(town);
    else if (selectedTheme.includes("classic")) setNowTheme(classic);
    else if (selectedTheme.includes("purple")) setNowTheme(purple);
    else if (selectedTheme.includes("block")) setNowTheme(block);
    else if (selectedTheme.includes("pattern")) setNowTheme(pattern);
    else if (selectedTheme.includes("magazine")) setNowTheme(magazine);
    else if (selectedTheme.includes("winter")) setNowTheme(winter);
  }
  const [id, setId] = React.useState(""); //아이디
  var pwRegExp = /^[a-zA-z0-9!@#$%^*+=-]{4,15}$/; //비밀번호 유효성 검사
  const [pw, setPw] = React.useState(""); //비밀번호
  const [pw2, setPw2] = React.useState(""); //비밀번호 재확인
  const [checkPw, setCheckPw] = React.useState(false); //비밀번호 동일 여부 체크
  const [changePW, setChangePW] = React.useState("비밀번호가 일치하지 않습니다.");


  //링크 이동
  const moveNavigate = (screen) => {
    navigation.navigate(screen)
  }

  //비밀번호 변경
  const pwChange = () => {
    if (!pwRegExp.test(pw)) {
      alert("비밀번호 형식이 올바르지 않습니다.");
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
    }
    console.log("비밀번호 바꾸러 옴");
    axios.post(`${API.PWRESET}`, null, {
      params: {
        id: id,
        pw: pw
      }
    })
      .then(res => {
        console.log(res.data);
        navigation.replace('Login');

      })
      .catch(function (error) {
        console.log(error);
      })
  }

  //아이디 저장
  React.useEffect(() => {
    AsyncStorage.getItem('tempId', (err, result) => {
      console.log(result); // User1 출력
      setId(result);
    });
  }, [])

  //비밀번호 재확인
  React.useEffect(() => {
    if (pw2 === "") {
      setChangePW("");
    }
    else if (pw === pw2) {
      setCheckPw(true);
      setChangePW("비밀번호가 일치합니다.");
    } else {
      setCheckPw(false);
      setChangePW("비밀번호가 일치하지 않습니다.");

    }
  }), [pw2];


  return (
    <View style={{ ...styles.container, backgroundColor: nowTheme.cardBg }}>
      {/* 로고 박스 */}
      <View style={{ ...styles.logoBox }}>
        <Image resizeMode="contain" style={{ width: SCREEN_WIDTH / 2 }} source={nowTheme.logo} ></Image>
      </View>

      {/* 입력 레이아웃 */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={{ ...styles.inputLayout }}>
          {/* 비밀번호 박스 */}
          <TextInput style={{ ...styles.inputBox }}
            placeholder="새로운 비밀번호 입력"
            placeholderTextColor={"#999999"}
            secureTextEntry
            onChangeText={text => setPw(text)}
          />

          {/* margin */}
          <View style={{ ...styles.inputCheck }}></View>

          {/* 비밀번호 재학인 박스 */}
          <TextInput style={{ ...styles.inputBox }}
            placeholder="새로운 비밀번호 재입력"
            placeholderTextColor={"#999999"}
            secureTextEntry
            onChangeText={text => setPw2(text)}
          />
          {/* 비밀번호 유효성 검사 */}
          <View style={{ ...styles.inputCheck }}>
            <Text style={!checkPw ? { color: "#ff0000" } : { color: "#32CD99" }}>{changePW}</Text>
          </View>

          {/* 비밀번호 변경 버튼 */}
          <TouchableHighlight
            style={{ marginTop: 24 }}

            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={pwChange}>

            <View style={{ ...styles.loginBtn, backgroundColor: nowTheme.btn, shadowColor: nowTheme.btn }}>
              <Text style={{ ...styles.loginText, color: "white" }}>비밀번호 변경</Text>
            </View>
          </TouchableHighlight>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default ChangePwScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    width: SCREEN_WIDTH,
  },

  logoBox: {
    height: SCREEN_HEIGHT / 20,
    justifyContent: 'center',
    alignItems: 'center',
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

  loginBtn: {
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    // IOS
    shadowColor: "#32CD99", //그림자색
    shadowOpacity: 0.4,//그림자 투명도
    shadowOffset: { width: 3, height: 3 }, //그림자 위치
    // ANDROID
    elevation: 3,
  },

  loginText: {
    fontWeight: "bold",
  },

  loginMenu: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },

});