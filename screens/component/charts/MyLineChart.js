import React, { useEffect, useState } from 'react';
import { Button, View, Text, Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function MyLineChart(props) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <LineChart
                data={{
                    labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [
                        {
                            data: [
                                25.40,
                                76.66,
                                43.48,
                                65.80,
                                35.40,
                                50.48,
                                79.52,
                            ]
                        }
                    ]
                }}

                //너비, 높이
                width={SCREEN_WIDTH/1.05} 
                height={SCREEN_HEIGHT/4}

                //y축 라벨
                yAxisLabel=""
                yAxisSuffix=""

                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp

                    backgroundGradientFrom: '#0000',
                    backgroundGradientTo: '#0000',
                    backgroundGradientFromOpacity: 0.4,
                    backgroundGradientToOpacity: 0.4,

                    //색깔 넣는 곳
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

                    style: {
                        borderRadius: 16
                    },

                    propsForDots: {
                        r: "2.5",
                        strokeWidth: "2",
                        stroke: "white"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
}

export default MyLineChart;