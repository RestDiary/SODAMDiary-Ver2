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
  }, []);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: nowTheme.cardBg }}>
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
                  navigation.navigate("Album", { album: al.diarykey })
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
  );
}

export default PictureScreen;
