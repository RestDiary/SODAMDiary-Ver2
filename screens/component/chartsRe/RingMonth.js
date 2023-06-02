import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Animated, Alert, ActivityIndicator, TextInput, ImageBackground } from 'react-native';
import { ProgressChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function RingMonth(props) {
    const [ring, setRing] = useState([])

    useEffect(() => {
        if (JSON.parse(JSON.stringify(props.data)) === "0") {
            setRing([])
        } else {
            setRing(JSON.parse(JSON.stringify(props.data)))
        }
    }, [props.data])


    return (<>
        <View style={styles.container}>
            {ring.length > 0 ?
            <ProgressChart
                data={{
                    labels: ring.map(item => item.emotion_value),
                    data: ring.map(item => item.count/10)
                }}
                width={SCREEN_WIDTH}
                height={250}
                strokeWidth={16}
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
                radius={26}
            /> :
            <ProgressChart
                data={{
                    labels: ["sodam"],
                    data: [1]
                }}
                width={SCREEN_WIDTH}
                height={250}
                strokeWidth={16}
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
                radius={26}
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
    }
});

export default RingMonth;