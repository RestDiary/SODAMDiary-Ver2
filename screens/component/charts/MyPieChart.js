import React, { useEffect, useState } from 'react';
import { Button, View, Text, Dimensions } from 'react-native';
import { PieChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function MyPieChart(props) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'rgba(0,0,0,0.4)', borderRadius:16, marginTop:8}}>
            <PieChart
                data={[
                    {
                        name: '긍정',
                        population: props.data[1][0].count,
                        color: '#58B19F',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    {
                        name: '보통',
                        population: props.data[2][0].count,
                        color: '#F8EFBA',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    {
                        name: '부정',
                        population: props.data[0][0].count,
                        color: '#FD7272',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                ]}

                width={SCREEN_WIDTH/1.05} 
                height={SCREEN_HEIGHT/4}

                chartConfig={{
                    //배경 색
                    backgroundGradientFrom: '#0000',
                    backgroundGradientTo: '#0000',

                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}

                accessor="population"
                backgroundColor="transparent"
                paddingLeft="20"
                absolute //for the absolute number remove if you want percentage
            />
        </View>
    );
}

export default MyPieChart;