// import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Animated, Alert, ActivityIndicator, TextInput, ImageBackground } from 'react-native';
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import HorizontalBarGraph from '@chartiful/react-native-horizontal-bar-graph';
// import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");


// function DayChart(...props) {
//   //Top3 감정 키워드 각각의 개수
//   const [labels, setLabels] = useState([]);
//   const [datas, setData] = useState([]);


//   //차트 데이터 받아오기 및 차트 생성
//   useEffect(() => {
//     if (props.data !== "0") {
//       if (props.data.second_number === 0) {
//         // setSecond("sodam");
//         // setThird("sodam");
//         let first = props.data.top_emotion.split("/")

//         setLabels([first[0]]);
//         setData([props.data.top_number]);
//       }

//       else if (props.data.third_number === 0) {
//         // setThird("sodam");
//         let first = props.data.top_emotion.split("/");
//         let second = props.data.second_emotion.split("/");

//         setLabels([first[0], second[0]]);
//         setData([props.data.top_number, props.data.second_number]);
//       }

//       else {
//         let first = props.data.top_emotion.split("/");
//         let second = props.data.second_emotion.split("/");
//         let third = props.data.third_emotion.split("/");

//         setLabels([first[0], second[0]]);
//         setData([props.data.top_number, props.data.second_number]);
//       }
//     } else {
//       setChart([])
//     }
//   }, [props.data])

//   console.log("zzz", props.data)
//   console.log("uuu", props.data.length)



//   // bottom sheet 테스트
//   // ref
//   const sheetRef = useRef(null);
//   const [isOpen, setIsOpen] = useState(true);
//   // variables
//   const snapPoints = ["5%", "80%"];


//   // View 컴포넌트의 너비와 높이를 저장하기 위한 state 생성
//   const [viewWidth, setViewWidth] = useState(0);
//   const [viewHeight, setViewHeight] = useState(0);

//   // onLayout 이벤트에서 View의 너비와 높이를 가져와서 state 업데이트
//   const onViewLayout = (event) => {
//     setViewWidth(event.nativeEvent.layout.width);
//     setViewHeight(event.nativeEvent.layout.height);
//   };



//   return (
//       <View>
     

//         {/* bottom sheet 테스트 */}
//         {props.data.length > 0 ?
//           <BottomSheet
//             ref={sheetRef}                // bottomSheet 참조
//             snapPoints={snapPoints}       // 슬라이드 올릴 시, 보여주는 화면 %
//             enablePanDownToClose={false}  // 슬라이드 올리고 다시 닫으면 사리지게 하는 기능
//           >
//             <BottomSheetView style={styles.bottomSheetView}>
//               {/* 차트 제목용 텍스트 */}
//               <View style={styles.chartTitle}>
//                 <Text style={styles.chartTitleText}>
//                   {"[ "}감정분석 결과{" ]"}
//                 </Text>
//               </View>

//               {/* 차트 그래프 뷰 */}
//               <View onLayout={onViewLayout} style={styles.barGraph}>
//                 {/* 차트 그래프 */}
//                 <HorizontalBarGraph
//                   data={datas}
//                   labels={labels}
//                   // width={viewWidth*0.75}
//                   // height={viewHeight*0.65}
//                   width={330}
//                   height={300}

//                   baseConfig={{
//                     xAxisLabelStyle: {
//                       rotation: 0,
//                       fontSize: 12,
//                       // width: 70,
//                       yOffset: 4,
//                       // xOffset: -15
//                     },

//                     yAxisLabelStyle: {
//                       rotation: 0,
//                       fontSize: 13,
//                       position: 'bottom',
//                       xOffset: 0,
//                       height: 0,
//                       decimals: 0
//                     },
//                     hasYAxisBackgroundLines: true,
//                   }}
//                   barRadius={10}
//                   barColor='green'
//                   barWidthPercentage="0.15"
//                 />
//               </View>
//             </BottomSheetView>
//           </BottomSheet>
//           :
//           <Text>
//             데이터가 없습니다.
//           </Text>
//         }

//       </View>
//   )
// }
// export default DayChart;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     margin: 5
//   },
//   bottomSheetView: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   chartTitle: {
//     height: "10%",
//     alignItems: 'center',
//     justifyContent: "center",
//     // backgroundColor: "blue",
//     width: SCREEN_WIDTH,
//   },
//   chartTitleText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   barGraph: {
//     width: SCREEN_WIDTH,
//     height: "90%",
//     alignItems: 'center',
//     paddingTop: 20,
//     // justifyContent: 'center',
//     // backgroundColor: 'green',
//   },
// });

