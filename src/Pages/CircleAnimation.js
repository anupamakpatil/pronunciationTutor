import { View, Text } from 'react-native'
import React, { useRef, useEffect } from 'react'
import Svg, { Circle, G } from 'react-native-svg';

const CircleAnimation = ({score}) => {

    const circleRef = useRef(null);
    const radius = 55; // or any other radius you desire
    const circumference = 2 * Math.PI * radius;
  
    useEffect(() => {
      if (circleRef.current) {
        const progress = score / 100;
        const strokeDashoffset = circumference * (1 - progress);
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    }, [score, circumference]);

  return (
    <View>
      <View style={{ alignItems: 'center', justifyContent: 'center' }} >

       <Svg height="150" width="130">
        <G rotation="-90" origin={`${radius},${radius}`}>
          <Circle
            ref={circleRef}
            cx="33" // Adjust the cx and cy values to center the circle
            cy="65"
            r={radius}
            fill="transparent"
            stroke="#fff"
            strokeWidth="15"
            strokeDasharray={`${circumference}, ${circumference}`}
            strokeLinecap="round"
          />
          <Text
            fill="#fff"
            fontWeight="bold"
            style={{color: '#fff', fontSize: 40, left:40, top:55}}
          >
             {/* {score}  */}
           </Text>
        </G>
      </Svg> 
    </View>
    </View>
  )
}

export default CircleAnimation  