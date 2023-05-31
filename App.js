import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import axios from "axios";
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
} from "./screens/css/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
//screen
import CalenderScreen from "./screens/CalenderScreen";
import WriteScreen from "./screens/WriteScreen";
import PictureScreen from "./screens/PictureScreen";
import JoinScreen from "./screens/JoinScreen";
import DiaryScreen from "./screens/DiaryScreen";
import ChartScreen from "./screens/ChartScreen";
import HomeScreen from "./screens/Home";
import FindPwScreen from "./screens/FindPwScreen";
import ChangePwScreen from "./screens/ChangePwScreen";
import NewPwScreen from "./screens/NewPwScreen";
import ChangeEmailScreen from "./screens/ChangeEmailScreen";
import UserInfoScreen from "./screens/UserInfoScreen";
import LoginScreen from "./screens/LoginScreen";
import ThemeScreen from "./screens/ThemeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DetailScreen from "./screens/DetailScreen";
import ModifyScreen from "./screens/ModifyScreen";
import PictureDeailScreen from "./screens/PictureDeailScreen";
import MyPieChart from "./screens/component/charts/MyPieChart";
import EmotionPieChart from "./screens/component/charts/EmotionPieChart";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

//사용 디바이스 크기 값 받아오기
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

//Drawer
function CustomDrawerContent(props) {
  //스크린 이동할 때 lifecycle 실행
  const isFocused = useIsFocused();
  //테마
  const [nowTheme, setNowTheme] = useState(dark);

  useEffect(() => {
    getTheme();
  }, [isFocused]);

  // useEffect(() => {
  //   getPieData();
  // }, []);

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

  const [id, setId] = useState("");
  const navigation = useNavigation();
  const [pieData, setPieData] = useState([]);

  //로그아웃 버튼
  const logOut = async () => {
    try {
      await AsyncStorage.removeItem("id");
      Alert.alert("로그아웃 되었습니다.");
      navigation.navigate("Login");
    } catch (e) {
      console.log(e);
    }
  };

  //초기화 버튼 클릭 시
  const deleteAll = () => {
    Alert.alert(
      "일기를 모두 지우시겠어요?",
      "한 번 초기화하면 돌이킬 수 없어요!",
      [
        {
          text: "네",
          onPress: () => deleteAll2(),
          style: "cancel",
        },
        { text: "아니오", onPress: () => console.log("안한대") },
      ],
      { cancelable: false }
    );
  };

  const deleteAll2 = async () => {
    await axios(
      {
        method: "post",
        url: `${API.DELETEALL}`,
        params: {
          id: id,
        },
      },
      null
    )
      .then((res) => {
        alert("일기가 초기화 되었습니다.");
      })
      .catch(function (error) {
        Alert.alert("❗error : bad response");
      });
  };

  // 계정 탈퇴 버튼 클릭 시
  const withdrawal = () => {
    Alert.alert(
      "정말 탈퇴하시겠어요?",
      "모든 추억이 다 사라져요!",
      [
        {
          text: "네",
          onPress: () => withdrawal2(),
          style: "cancel",
        },
        { text: "아니오", onPress: () => console.log("안한대") },
      ],
      { cancelable: false }
    );
  };

  //계정 탈퇴
  const withdrawal2 = async () => {
    await axios(
      {
        method: "post",
        url: `${API.WITHDRAWAL}`,
        params: {
          id: id,
        },
      },
      null
    )
      .then(async (res) => {
        await AsyncStorage.removeItem("id");
        alert("탈퇴되었습니다.");
        navigation.navigate("Login");
      })
      .catch(function (error) {
        Alert.alert("❗error : bad response");
      });
  };

  useEffect(() => {
    AsyncStorage.getItem("id", (err, result) => {
      setId(result);
    });
  }, []);

  // //getPiedata
  // const getPieData = async () => {
  //   let userId = await AsyncStorage.getItem("id");

  //   await axios(
  //     {
  //       method: "post",
  //       url: "http://people-env.eba-35362bbh.ap-northeast-2.elasticbeanstalk.com:3001/ratio",
  //       params: {
  //         id: userId,
  //       },
  //     },
  //     null
  //   )
  //     .then((res) => {
  //       setPieData(res.data);
  //     })
  //     .catch(function (error) {
  //       Alert.alert("❗error : bad response");
  //     });
  // };

  return (
    <DrawerContentScrollView
      style={{ ...styles.drawerBox, backgroundColor: nowTheme.drawer }}
      {...props}
      contentContainerStyle={{ flex: 1 }}
    >
      <View
        style={{
          height: SCREEN_HEIGHT / 5,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Image
          resizeMode="contain"
          style={{ height: SCREEN_HEIGHT / 5 }}
          source={nowTheme.logo}
        />
      </View>

      {/* <DrawerItemList {...props} /> */}

      <View style={{ alignItems: "flex-end", marginRight: 24 }}>
        <TouchableOpacity
          style={{ ...styles.nameBox, backgroundColor: nowTheme.btn }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{id} 님</Text>
        </TouchableOpacity>
      </View>

      {/* 파이차트 */}
      {pieData.length > 0 ? (
        <EmotionPieChart data={pieData} />
      ) : (
        <ActivityIndicator size="large" color="white" />
      )}

      {/* 테마변경 기능 */}
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={{ ...styles.drawerItem, backgroundColor: nowTheme.btn }}
          // label="Close drawer"
          onPress={() => props.navigation.navigate("Theme")}
        >
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={24}
            color="white"
          />
          <Text style={styles.drawerItemText}>테마변경</Text>
        </TouchableOpacity>
      </View>

      {/* 개인정보 변경 기능 */}
      <View>
        <TouchableOpacity
          style={{ ...styles.drawerItem, backgroundColor: nowTheme.btn }}
          // label="Close drawer"
          onPress={() => props.navigation.navigate("UserInfo")}
        >
          <FontAwesome5 name="user" size={24} color="white" />
          <Text style={styles.drawerItemText}> 개인정보</Text>
        </TouchableOpacity>
      </View>

      {/* 초기화 기능 */}
      <View>
        <TouchableOpacity
          style={{ ...styles.drawerItem, backgroundColor: nowTheme.btn }}
          // label="Close drawer"
          onPress={() => deleteAll()}
        >
          <Ionicons name="refresh" size={24} color="red" />
          <Text style={styles.drawerItemText}>초기화</Text>
        </TouchableOpacity>
      </View>

      {/* 로그아웃 기능 */}
      <View style={{}}>
        <TouchableOpacity
          style={{ ...styles.drawerItem, backgroundColor: nowTheme.btn }}
          // label="Close drawer"
          onPress={() => logOut()}
        >
          <MaterialIcons name="logout" size={24} color="white" />
          <Text style={styles.drawerItemText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* 계정탈퇴 기능 */}
      <View>
        <TouchableOpacity
          style={{ ...styles.drawerItem, backgroundColor: nowTheme.btn }}
          // label="Close drawer"
          onPress={() => withdrawal()}
        >
          <AntDesign name="deleteuser" size={24} color="red" />
          <Text style={styles.drawerItemText}>계정탈퇴</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerStyle={{ backgroundColor: "#C6CBEF" }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="home"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
    </Drawer.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, headerTintColor: "black" }}
      />
      <Stack.Screen
        name="Home"
        component={MyDrawer}
        options={{ headerShown: false, headerTintColor: "black" }}
      />

      {/* Home */}
      <Stack.Screen
        name="Calender"
        component={CalenderScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="Chart"
        component={ChartScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="Write"
        component={WriteScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="Diary"
        component={DiaryScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="Picture"
        component={PictureScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />

      {/* 기타 스크린 */}
      <Stack.Screen
        name="Join"
        component={JoinScreen}
        options={{
          title: "회원가입",
          headerTintColor: "black",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FindPw"
        component={FindPwScreen}
        options={{
          title: "비밀번호 찾기",
          headerTintColor: "black",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePw"
        component={ChangePwScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="NewPw"
        component={NewPwScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="ChangeEmail"
        component={ChangeEmailScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="Theme"
        component={ThemeScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="Modify"
        component={ModifyScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
      <Stack.Screen
        name="Album"
        component={PictureDeailScreen}
        options={{ headerTintColor: "black", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    defaultTheme();
  }, []);

  const defaultTheme = async () => {
    let theme = await AsyncStorage.getItem("theme");
    if (!theme) {
      await AsyncStorage.setItem("theme", "dark");
    }
  };

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  nameBox: {
    padding: 6,
    backgroundColor: "#456185",
    borderRadius: 10,
  },
  drawerBox: {
    backgroundColor: "#071D3A",
    borderRightWidth: 1,
    borderColor: "#555",
  },

  drawerChart: {
    width: "90%",
    height: "3%",
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#555",
    backgroundColor: "white",
  },

  drawerInnerChart: {
    width: "70%",
    height: "100%",
    borderRadius: 100,
    borderRightWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#9f3e8f",
  },

  drawerInnerChart2: {
    width: "40%",
    height: "100%",
    borderRadius: 100,
    borderRightWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#c17c7c",
  },

  drawerInnerChart3: {
    width: "50%",
    height: "100%",
    borderRadius: 100,
    borderRightWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#1e654b",
  },

  drawerItem: {
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    backgroundColor: "#456185",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.8,
  },

  drawerItemText: {
    marginLeft: 4,
    color: "white",
    fontWeight: "bold",
  },
});
