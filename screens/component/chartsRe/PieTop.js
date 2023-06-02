
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Animated, Alert, ActivityIndicator, TextInput, ImageBackground } from 'react-native';
import { PieChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const color = ["lightgreen", "lightskyblue", "orangered", "darkslateblue", "gold"];

function PieTop(props) {
  const [pie, setPie] = useState([])

  useEffect(() => {
    if (JSON.parse(JSON.stringify(props.data)) === "0") {
      setPie([])
    } else {
      setPie(JSON.parse(JSON.stringify(props.data)))
    }
  }, [props.data])

  // console.log("data: ", props.data)

  return (<>
    <View style={styles.container}>
      {pie.length > 0 ?
      <PieChart
        data={pie.map((item, index) => ({ name: item.top_emotion, population: item.count, color: color[index], legendFontColor: "#ffffff", legendFontSize: 15 }))}
        width={SCREEN_WIDTH / 1}
        height={300}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 0]}
        absolute
      /> :
      <PieChart
        data={[{
          name: "sodam",
          population: 1,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }]}
        width={SCREEN_WIDTH / 1}
        height={300}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 0]}
        absolute
      />
}
    </View>
  </>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5
  }
});

export default PieTop;