import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API } from "../config.js";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function PictureScreen({ navigation }) {
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
  const [albumData, setAlbumData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAlbumData();
    getAlbumCount();
  }, []);

  //앨범 개수 요청
  const getAlbumCount = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("id");
    try {
      await axios(
        {
          method: "post",
          url: `${API.ALBUMCNT}`,
          params: {
            id: userId, //****작성자 id
          },
        },
        null
      )
        .then((res) => {
          console.log("앨범개수", res.data[0].cnt);
          setAlbumCnt(res.data[0].cnt);
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response");
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  //앨범 data 요청
  const getAlbumData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("id");
    try {
      await axios(
        {
          method: "post",
          url: `${API.ALBUM}`,
          // url: 'http://people-env.eba-35362bbh.ap-northeast-2.elasticbeanstalk.com:3001/album',
          params: {
            id: userId, //****작성자 id
          },
        },
        null
      )
        .then((res) => {
          setAlbumData(res.data);
        })
        .catch(function (error) {
          Alert.alert("❗error : bad response");
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const [scrollOffset, setScrollOffset] = useState(0);
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0);
  const [albumCnt, setAlbumCnt] = useState();
  const [size, setSize] = useState(false);

  return (
    <>
      {size == true ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: nowTheme.cardBg }}>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => setSize(false)}
          >
            <MaterialCommunityIcons
              name="view-carousel-outline"
              size={48}
              color="black"
            />
          </TouchableOpacity>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                margin: 5,
              }}
            >
              {albumData.map((al, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("Album", { Album: al.diarykey })
                    }
                  >
                    {al.img !== null && al.img !== "" && (
                      <Image
                        source={{ uri: al.img }}
                        style={{
                          width: SCREEN_WIDTH / 3.3,
                          height: SCREEN_WIDTH / 3.3,
                          margin: 4,
                          borderRadius: 10,
                          borderWidth: 1,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: nowTheme.cardBg }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 60,
            }}
          >
            <TouchableOpacity onPress={() => setSize(true)}>
              <MaterialIcons name="grid-view" size={48} color="black" />
            </TouchableOpacity>
            {currentPictureIndex === 0 ? (
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                앨범 : 1 / {albumCnt}
              </Text>
            ) : currentPictureIndex > albumCnt ? (
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                앨범 : {albumCnt} / {albumCnt}
              </Text>
            ) : (
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                앨범 : {currentPictureIndex + 1} / {albumCnt}
              </Text>
            )}
          </View>
          <ScrollView
            horizontal={true}
            onScroll={(event) => {
              const contentOffsetX = event.nativeEvent.contentOffset.x;
              const contentWidth = event.nativeEvent.contentSize.width;
              const screenWidth = event.nativeEvent.layoutMeasurement.width;
              const index = Math.floor(
                (contentOffsetX / (contentWidth - screenWidth)) *
                  albumData.length
              );
              setCurrentPictureIndex(index);
            }}
          >
            <View style={{ padding: 30 }}></View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                margin: 16,
              }}
            >
              {albumData.map((al, index) => {
                const isCurrentPicture = index === currentPictureIndex;
                const pictureStyle = isCurrentPicture
                  ? {
                      width: SCREEN_WIDTH / 1.6,
                      height: (SCREEN_WIDTH / 1.6) * 1.6,
                      margin: 8,
                      borderRadius: 10,
                    }
                  : {
                      width: SCREEN_WIDTH / 2.2,
                      height: (SCREEN_WIDTH / 2.2) * 1.6,
                      margin: 30,
                      borderRadius: 10,
                    };

                return (
                  <View style={{ flexDirection: "column" }}>
                    <TouchableOpacity
                      style={{
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 4,
                          height: 4,
                        },
                        shadowOpacity: 0.7,
                        shadowRadius: 2.62,
                        elevation: 4,
                      }}
                      key={index}
                      onPress={() =>
                        navigation.navigate("Album", { Album: al.diarykey })
                      }
                    >
                      {al.img !== null && al.img !== "" && (
                        <Image
                          source={{ uri: al.img }}
                          resizeMode={"stretch"}
                          style={pictureStyle}
                        />
                      )}
                    </TouchableOpacity>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 16,
                      }}
                    >
                      <Text style={{ fontSize: 28, fontWeight: "800" }}>
                        {al.year}.{al.month}.{al.day}
                      </Text>
                      <Text style={{ fontSize: 18 }}>{al.title}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}

export default PictureScreen;
