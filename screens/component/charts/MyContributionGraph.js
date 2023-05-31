import React, { useEffect, useState } from 'react';
import { Button, View, Text, Dimensions } from 'react-native';
import { ContributionGraph } from "react-native-chart-kit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function MyContributionGraph(props) {
    const [date, setDate] = useState(new Date())

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ContributionGraph
                values={props.data}

                endDate={date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()}
                numDays={105}

                width={SCREEN_WIDTH/1.05} 
                height={SCREEN_HEIGHT/4}

                chartConfig={{
                    backgroundColor: '#1cc910',

                    backgroundGradientFrom: '#0000',
                    backgroundGradientTo: '#0000',
                    backgroundGradientFromOpacity: 0.4,
                    backgroundGradientToOpacity: 0.4,
                    
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(51, 184, 100, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
            />
        </View>
    );
}

export default MyContributionGraph;