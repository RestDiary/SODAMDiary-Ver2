
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Animated, Alert, ActivityIndicator, TextInput, ImageBackground } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryPie, VictoryLabel, VictoryLine } from "victory-native";

function LineYear(props) {
    const [line, setLine] = useState([])

    useEffect(() => {
        if (JSON.parse(JSON.stringify(props.data)) === "0") {
            setLine([])
        } else {
            setLine(JSON.parse(JSON.stringify(props.data)))
        }
    }, [props.data])


    return (<>
        <View style={styles.container}>
            {line.length > 0 ?
                (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        {/* 차트 제목 Text */}
                        <Text style={{ color: "white", marginTop: 30 }}>
                            한 해 차트
                        </Text>

                        {/* 차트 넣는 곳*/}
                        


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
        // backgroundColor: "blue"
    }
});

export default LineYear;