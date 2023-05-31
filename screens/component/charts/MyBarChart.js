import React, { useEffect, useState } from 'react';
import { Button, View, Text, Dimensions } from 'react-native';
import { BarChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function MyBarChart(props) {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <BarChart
                data={{
                    labels: props.data.map(item => item.keyword),
                    datasets: [
                        {
                            data: props.data.map(item => item.cnt),
                        },
                    ],
                }}

                width={SCREEN_WIDTH/1.05} 
                height={SCREEN_HEIGHT/4}

                showValuesOnTopOfBars={true}
                fromZero={true}
                withInnerLines={false}

                chartConfig={{
                    backgroundColor: '#1cc910',
                    //배경 색
                    backgroundGradientFrom: '#0000',
                    backgroundGradientTo: '#0000',
                    backgroundGradientFromOpacity: 0.4,
                    backgroundGradientToOpacity: 0.4,

                    //막대 색
                    fillShadowGradientOpacity: 1, //투명도
                    fillShadowGradientTo : '#f780f4',
                    
                    //소수점
                    decimalPlaces: 0,

                    // 레이블, 전체적인 색
                    color: (opacity = 1) => `rgba(255, 255, 255, 1)`,
                    
                    style: {
                        borderRadius: 16,
                    },
                }}
                
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
}

export default MyBarChart;