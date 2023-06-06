import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  Alert,
  ActivityIndicator,
  TextInput,
  ImageBackground,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function RingMonth(props) {
  const [ring, setRing] = useState([]);

  useEffect(() => {
    if (JSON.parse(JSON.stringify(props.data)) === "0") {
      setRing([]);
    } else {
      setRing(JSON.parse(JSON.stringify(props.data)));
    }
  }, [props.data]);

  // View 컴포넌트의 너비와 높이를 저장하기 위한 state 생성
  const [viewWidth, setViewWidth] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);

  // onLayout 이벤트에서 View의 너비와 높이를 가져와서 state 업데이트
  const onViewLayout = (event) => {
    setViewWidth(event.nativeEvent.layout.width);
    setViewHeight(event.nativeEvent.layout.height);
  };

  return (
    <>
      <View onLayout={onViewLayout} style={styles.container}>
        {ring.length > 0 ? (
          <>
            <ProgressChart
            key={1}
              data={{
                labels: ring.map((item) => item.emotion_value),
                data: ring.map((item) => item.count / 5),
              }}
              width={SCREEN_WIDTH}
              height={250}
              strokeWidth={16}
              chartConfig={{
                backgroundGradientFrom: "#1E2923",
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: "#08130D",
                backgroundGradientToOpacity: 0,
                color: (opacity = 1) => `rgba(0, 84, 72, ${opacity})`,
                strokeWidth: 2, // optional, default 3
                barPercentage: 0.5,
                useShadowColorFromDataset: false, // optional
              }}
              radius={26}
              hideLegend={true}
            />
            <View
              style={{
                alignItems: "center",
                // justifyContent: "center",
              }}
            >
              {ring.map((item, index) => (  //key값 임시 지정
                <View  key={index}>
                  <Text key={index} style={{ fontSize: 18 }}>
                    {item.emotion_value}
                    {" : "}
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <ProgressChart
            data={{
              labels: ["sodam"],
              data: [1],
            }}
            width={SCREEN_WIDTH}
            height={250}
            strokeWidth={16}
            chartConfig={{
              backgroundGradientFrom: "#1E2923",
              backgroundGradientFromOpacity: 0,
              backgroundGradientTo: "#08130D",
              backgroundGradientToOpacity: 0,
              color: (opacity = 1) => `rgba(0, 84, 72, ${opacity})`,
              strokeWidth: 2, // optional, default 3
              barPercentage: 0.5,
              useShadowColorFromDataset: false, // optional
            }}
            radius={26}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    // backgroundColor: "yellow",
  },

  ringText: {
    flexDirection: "row",
  },
});

export default RingMonth;
