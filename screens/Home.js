import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
// import { greaterOrEq } from 'react-native-reanimated';
import {
  Entypo,
  AntDesign,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

//사용 디바이스 크기 값 받아오기
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function HomeScreen({ navigation }) {
  //스크린 이동할 때 lifecycle 실행
  const isFocused = useIsFocused();

  //테마
  useEffect(() => {
    getTheme();
  }, [isFocused]);

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

  //로그인 여부 확인
  React.useEffect(() => {
    isLogin();
  }, []);

  const isLogin = async () => {
    const userId = await AsyncStorage.getItem("id");
    if (!userId) {
      Alert.alert("로그인 후에 이용해 주세요.");
      navigation.navigate("Login");
    }
  };

  //링크 이동
  const moveNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: nowTheme.bg }}>
      <SafeAreaView>
        <StatusBar barStyle="light-content" />
        <ScrollView>
          {/* 테마 대표 이미지 넣기 */}
          <View style={styles.imgBox}>
            {/* 이미지 들어가는 자리 */}
            <ImageBackground
              style={{ height: "100%", width: "100%" }}
              source={nowTheme.image}
            >
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <View style={{ marginLeft: "5.5%", marginTop: "6%" }}>
                  {nowTheme.menu}
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.content}>
            {/* 새로로 긴 위젯을 위한 위젯 나누기 View */}
            <View style={styles.headWidgetContainer}>
              <View style={styles.headWidgetDiv1}>
                <TouchableOpacity
                  onPress={(screen) => moveNavigate("Calender")}
                >
                  <View
                    style={{
                      ...styles.longWidget,
                      backgroundColor: nowTheme.calender,
                      borderRadius: 20,
                    }}
                  >
                    <Entypo name="calendar" size={24} color="white" />
                    <Text style={styles.textStyle}>calender</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.headWidgetDiv2}>
                <View style={styles.smallWidgetContaner}>
                  <TouchableOpacity onPress={(screen) => moveNavigate("Chart")}>
                    <View
                      style={{
                        ...styles.smallWidget,
                        backgroundColor: nowTheme.chart,
                        borderRadius: 20,
                      }}
                    >
                      <AntDesign name="piechart" size={24} color="white" />
                      <Text style={styles.textStyle}>chart</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.smallWidgetContaner}>
                  <TouchableOpacity onPress={(screen) => moveNavigate("Diary")}>
                    <View
                      style={{
                        ...styles.smallWidget,
                        backgroundColor: nowTheme.diary,
                        borderRadius: 20,
                      }}
                    >
                      <Entypo name="list" size={24} color="white" />
                      <Text style={styles.textStyle}>diary</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.widgetContainer}>
              <View style={styles.smallWidgetContaner}>
                <TouchableOpacity onPress={(screen) => moveNavigate("Picture")}>
                  <View
                    style={{
                      ...styles.smallWidget,
                      backgroundColor: nowTheme.picture,
                      borderRadius: 20,
                    }}
                  >
                    <MaterialIcons name="photo-album" size={24} color="white" />
                    <Text style={styles.textStyle}>picture</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.smallWidgetContaner}>
                <TouchableOpacity onPress={(screen) => moveNavigate("Write")}>
                  <View
                    style={{
                      ...styles.smallWidget,
                      backgroundColor: nowTheme.write,
                      borderRadius: 20,
                    }}
                  >
                    <FontAwesome
                      name="pencil-square-o"
                      size={24}
                      color="white"
                    />
                    <Text style={styles.textStyle}>write</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default HomeScreen;

// 반응형 css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column",
    width: SCREEN_WIDTH,
  },
  imgBox: {
    height: SCREEN_HEIGHT / 3,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {},
  headWidgetContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 2.4,
  },
  headWidgetDiv1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //IOS
    shadowColor: "#000", //그림자색
    shadowOpacity: 0.4, //그림자 투명도
    shadowOffset: { width: 4, height: 4 }, //그림자 위치
    // ANDROID
    elevation: 3,
  },
  headWidgetDiv2: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  widgetContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 4.8,
  },
  longWidget: {
    height: SCREEN_HEIGHT / 2.6,
    width: SCREEN_WIDTH / 2.4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  smallWidgetContaner: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    //IOS
    shadowColor: "#000", //그림자색
    shadowOpacity: 0.4, //그림자 투명도
    shadowOffset: { width: 4, height: 4 }, //그림자 위치
    // ANDROID
    elevation: 3,
  },
  smallWidget: {
    height: SCREEN_HEIGHT / 5.8,
    width: SCREEN_WIDTH / 2.4,
    backgroundColor: "#de8260",
    alignItems: "center",
    justifyContent: "center",
  },
  smallWidget2: {
    height: SCREEN_HEIGHT / 5.8,
    width: SCREEN_WIDTH / 1.1,
    backgroundColor: "#de8260",
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    color: "white",
  },
});
