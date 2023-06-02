import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Animated, Alert, ActivityIndicator, TextInput, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import HorizontalBarGraph from '@chartiful/react-native-horizontal-bar-graph';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function DayChart(props) {
     //Top3 감정 키워드 각각의 개수
  const [chart, setChart] = useState([]);


  //차트 데이터 받아오기 및 차트 생성
  useEffect(() => {
    if(props.data !== "0") {
    if(props.data.second_number === 0) {
      // setSecond("sodam");
      // setThird("sodam");
      let first = props.data.top_emotion.split("/")

      setChart({
        labels: [first[0]],
        data: [props.data.top_number]
      })

    }
    
    else if(props.data.third_number === 0) {
      // setThird("sodam");
      let first = props.data.top_emotion.split("/");
      let second = props.data.second_emotion.split("/");
      setChart({
        labels: [first[0], second[0]],
        data: [props.data.top_number, props.data.second_number]
      })
    }

    else {
      let first = props.data.top_emotion.split("/");
      let second = props.data.second_emotion.split("/");
      let third = props.data.third_emotion.split("/");
      setChart({
        labels: [first[0], second[0], third[0]],
        data: [props.data.top_number, props.data.second_number, props.data.third_number]
      })
    }
}else {
    setChart([])
}

  }, [props.data])

console.log("zzz",props.data)
console.log("uuu", chart.data.length)


  return(
    <>
    <View>
    {chart.data.length > 0 ?
    <HorizontalBarGraph
      data={chart.data.map(item => item.data)}
      labels={chart.data.map(item => item.labels)}
      width={375}
      height={350}
      barRadius={15}
      baseConfig={ {
        hasYAxisBackgroundLines: false,
        xAxisLabelStyle: {
          rotation: 0,
          fontSize: 12,
          width: 70,
          yOffset: 4,
          xOffset: -15
        },
        yAxisLabelStyle: {
          rotation: 30,
          fontSize: 13,
          prefix: '$',
          position: 'bottom',
          xOffset: 15,
          decimals: 2,
          height: 100
        }
      }}
      style={styles.chart}
    /> :
    <HorizontalBarGraph
      data={[1]}
      labels={['sodam']}
      width={375}
      height={350}
      barRadius={15}
      baseConfig={ {
        hasYAxisBackgroundLines: false,
        xAxisLabelStyle: {
          rotation: 0,
          fontSize: 12,
          width: 70,
          yOffset: 4,
          xOffset: -15
        },
        yAxisLabelStyle: {
          rotation: 30,
          fontSize: 13,
          prefix: '$',
          position: 'bottom',
          xOffset: 15,
          decimals: 2,
          height: 100
        }
      }}
      style={styles.chart}
    />
}

  </View>
    </>
  )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 5
    },
    chart: {
        marginBottom: 30,
        padding: 10,
        paddingTop: 20,
        borderRadius: 20,
        width: 375,
        backgroundColor: 'green'
      }
});

export default DayChart;
