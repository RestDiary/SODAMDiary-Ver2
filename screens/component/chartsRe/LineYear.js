import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Animated, Alert, ActivityIndicator, TextInput, ImageBackground } from 'react-native';
import { LineChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function LineYear(props) {
    const [line, setLine] = useState([])
    const [year, setYear] = useState([])
    

    useEffect(() => {
        if (JSON.parse(JSON.stringify(props.data)) === "0") {
            setLine([])
        } else {
            setLine(JSON.parse(JSON.stringify(props.data)))
            setYear(props.yearData)
        }
    }, [props.data])

    // console.log("Line: ", line)
    // console.log("year: ", year) // year 관련되거 필요하면 쓰고, 필요없으면 지우시오.


    return (
        <>
            <View style={styles.container}>
                {line.length > 0 ? 
                <LineChart
                    data={ {
                        labels: line.map(item => item.emotion_value),
                        datasets: [
                            {
                            data: line.map(item => item.count),
                            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                            strokeWidth: 2 // optional
                            }
                        ],
                        legend: [year+"  "+"감정분석 키워드 수치"] // optional
                    }}
                    width={SCREEN_WIDTH}
                    height={256}
                    verticalLabelRotation={0}
                    chartConfig={{
                        backgroundGradientFrom: "#1E2923",
                        backgroundGradientFromOpacity: 0,
                        backgroundGradientTo: "#08130D",
                        backgroundGradientToOpacity: 0.5,
                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                        strokeWidth: 2, // optional, default 3
                        barPercentage: 0.5,
                        useShadowColorFromDataset: false, // optional
                    }}
                    bezier
                    horizontalLabelRotation={0}
                    fromZero
                    withInnerLines={false}
                    withHorizontalLines={false}
                /> :
                <LineChart
                data={ {
                    labels: ["sodam"],
                    datasets: [
                        {
                        data: [1],
                        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                        strokeWidth: 2 // optional
                        }
                    ],
                    legend: [year+"  "+"감정분석 키워드 수치"] // optional
                }}
                width={SCREEN_WIDTH}
                height={256}
                verticalLabelRotation={0}
                chartConfig={{
                    backgroundGradientFrom: "#1E2923",
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: "#08130D",
                    backgroundGradientToOpacity: 0.5,
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false, // optional
                }}
                bezier
                horizontalLabelRotation={0}
                fromZero
                withInnerLines={false}
                withHorizontalLines={false}
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
        margin: 5
    },
});

export default LineYear;