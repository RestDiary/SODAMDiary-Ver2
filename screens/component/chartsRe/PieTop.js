import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Defs, LinearGradient, Svg, Stop } from "react-native-svg";
import { VictoryPie } from "victory-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PieTop = (props) => {
  const [pie, setPie] = useState([]);


  useEffect(() => {
    if (props.data === "0") {
      setPie([]);
    } else {
      setPie(JSON.parse(JSON.stringify(props.data)));
    }
  }, [props.data]);

  const color = [
    ["#008773", "#00a773"],
    ["#caa31f", "#cad31f"],
    ["#6b9647", "#6bd647"],
  ];
  console.log("dddddd", pie);
  return (
    <View style={styles}>
      {pie.length > 0 ? (
        <Svg
          width={SCREEN_WIDTH}
          height={380}
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
        >
          <VictoryPie
            standalone={false}
            data={pie.map((item, index) => ({
              x: item.top_emotion,
              y: item.count,
            }))}
            width={SCREEN_WIDTH}
            height={380}
            innerRadius={70}
            labelRadius={({ innerRadius }) => innerRadius + 45}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
            style={{
              data: {
                fill: ({ datum, index }) =>
                  `url(#gradient-${index % color.length})`,
              },
              labels: {
                fill: "black",
                fontSize: 11,
                fontWeight: "500",
              },
            }}
          />
          {pie.map((_item, index) => (
            <Defs key={`gradient-${index}`}>
              <LinearGradient
                id={`gradient-${index}`}
                x1="100%"
                y1="100%"
                x2="30%"
                y2="30%"
              >
                <Stop offset="0%" stopColor={color[index % color.length][0]} />
                <Stop
                  offset="100%"
                  stopColor={color[index % color.length][1]}
                />
              </LinearGradient>
            </Defs>
          ))}
        </Svg>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
});

export default PieTop;
