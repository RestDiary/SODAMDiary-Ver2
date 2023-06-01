
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Animated, Alert, ActivityIndicator, TextInput, ImageBackground } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryPie, VictoryLabel } from "victory-native";

function PieTop(props) {
  const [pie, setPie] = useState([])

  useEffect(() => {
    if(JSON.parse(JSON.stringify(props.data)) === "0") {
      setPie([])
    }else {
      setPie(JSON.parse(JSON.stringify(props.data)))
    }
  },[props.data]) 


  return (<>
    <View style={styles.container}>
      {pie.length > 0 ?
        (
          <View style={{justifyContent: "center", alignItems: "center"}}>
            <Text style={{color: "white", marginTop: 30}}>
              감정분석 Top5 차트
            </Text>
            <VictoryPie
              padAngle={({ datum }) => datum.y}
              innerRadius={90}
              style={{ labels: {fontSize: 10, fill: "white"}}}
              width={350}
              
              data={pie.map(item => ({ x: item.top_emotion, y: item.count }))}
            /> 
          </View>
        ) :
        <VictoryPie
          data={[
            { x: "Sodam", y: 100 },
          ]}
        />
      }
    </View>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default PieTop;