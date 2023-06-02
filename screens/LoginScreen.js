import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Image, TextInput, SafeAreaView, Text, TouchableHighlight, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from '../config'
import { dark, votanical, town, classic, purple, block, pattern, magazine, winter } from './css/globalStyles';
import {useIsFocused} from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function LoginScreen({ navigation }) {
  //테마
  const [nowTheme, setNowTheme] = useState({dark});

    const getTheme = async () => {
      // AsyncStorage.clear() // 스토리지 초기화

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
      else {
        setNowTheme(dark)
      }
    } 

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() =>{
    getTheme()
  }, [nowTheme])

  const isFocused = useIsFocused();

  //state 추가되면 실행
  useEffect(() => {
    isLogin()
  }, [isFocused])

  const isLogin = async () => {
    const userId = await AsyncStorage.getItem('id')
    if (userId) {
      navigation.navigate("Home")
    }
  }

  //링크 이동
  const moveNavigate = (screen) => {
    navigation.navigate(screen)
  }

  const login = async () => {
    await axios
      .post(`${API.LOGIN}`, null, {
        params: {
          id: id,
          pw: pw,
        },
      })
      .then((res) => {
        if (res.data === 0) {
          AsyncStorage.setItem('id', id);
          Alert.alert(id + "님 반갑습니다.")
          navigation.replace('Home')
        } else {
          // 1이라면 실패
          alert("로그인에 실패하셨습니다.");
        }
        return res;
      })
      .then((res) => {
        if (id === "") {
          alert("아이디를 입력해주세요.");
          return;
        } else if (pw === "") {
          alert("비밀번호를 입력해주세요.");
          return;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View style={{ ...styles.container, backgroundColor: nowTheme.cardBg }}>
      {/* 로고 박스 */}
      <View style={{ ...styles.logoBox }}>
        <Image resizeMode="contain" style={{ width: SCREEN_WIDTH / 2 }} source={nowTheme.logo} ></Image>
      </View>

      {/* 입력 레이아웃 */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={{ ...styles.inputLayout }}>
          {/* 아이디 박스 */}
          <TextInput style={{ ...styles.inputBox }}
            placeholder="아이디 입력"
            placeholderTextColor={"#999999"}
            onChangeText={text => setId(text)}
          />

          {/* margin */}
          <View style={{ ...styles.inputCheck }}>

          </View>

          {/* 비밀번호 박스 */}
          <TextInput style={{ ...styles.inputBox }}
            placeholder="비밀번호 입력"
            placeholderTextColor={"#999999"}
            secureTextEntry
            onChangeText={text => setPw(text)}
          />
          {/* 비밀번호 유효성 검사 */}
          <View style={{ ...styles.inputCheck }}>
            {/* <Text style={{color:"red"}}>아이디 또는 비밀번호가 일치하지 않습니다.</Text> */}
          </View>

          {/* 로그인 버튼 */}
          <TouchableHighlight
            style={{ marginTop: 24 }}

            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={login}>

            <View style={{ ...styles.loginBtn, backgroundColor: nowTheme.btn, shadowColor: nowTheme.btn }}>
              <Text style={{ ...styles.loginText, color: "white" }}>로그인</Text>
            </View>
          </TouchableHighlight>

          <View style={{ ...styles.loginMenu }}>
            <TouchableOpacity onPress={(screen) => moveNavigate('FindPw')}>
              <View>
                <Text style={{ color: nowTheme.font, fontSize: 16 }}>비밀번호 찾기 | </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => moveNavigate('Join')}>
              <View>
                <Text style={{ color: nowTheme.font, fontSize: 16, }}>회원가입</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default LoginScreen;

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