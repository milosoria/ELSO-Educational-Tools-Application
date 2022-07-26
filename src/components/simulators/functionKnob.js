import { View } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { create } from '../../utils/normalize'
import { useContext, useEffect, useState } from 'react'
import FunctionsContext from '../../contexts/functionalitiesContext'
import { Audio } from 'expo-av'

// TODO: refactor this
const FUNCTIONS = ['off', 'alarmLow', 'alarmHigh', 'instantaneous', 'systolic', 'mean', 'diastolic']

const FunctionKnob = ({ type, soundPath, degRange, size, knobFrameSize, style, imagePath, step, resistance = 5 }) => {
    const {
        setUnblocked,
        setFunctionType,
        rotations,
        setRotations
    } = useContext(FunctionsContext)

    const rotation = useSharedValue(rotations[type])
    const savedRotation = useSharedValue(rotations[type])
    const [minDeg, maxDeg] = degRange
    const [sound, setSound] = useState()
    const functionsMap = {}

    const steps = [...new Array(Math.ceil((maxDeg - minDeg) / step) + 1).fill(0).map((value, index) => value + index * step)]
    steps.forEach((value, index) => {
        functionsMap[value] = FUNCTIONS[index]
    })

    useEffect(() => {
        return sound ? () => sound.unloadAsync() : undefined
    }, [sound])

    const playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(soundPath)
        setSound(sound)
        await sound.playAsync()
    }

    const rotationGesture = Gesture.Rotation()
        .onUpdate((e) => {
            let degrees = ((e.rotation / resistance) / Math.PI) * (maxDeg - minDeg) + savedRotation.value
            rotation.value = Math.ceil(degrees)
            if (rotation.value > maxDeg) rotation.value = maxDeg
            else if (rotation.value < minDeg) rotation.value = minDeg
        })
        .onEnd(() => {
            const inferior = rotation.value - step * Math.ceil(rotation.value / step) > step * Math.floor(rotation.value / step) - rotation.value
            rotation.value = inferior ? step * Math.ceil(rotation.value / step) : step * Math.floor(rotation.value / step)
            savedRotation.value = rotation.value
            runOnJS(playSound)()
        })

    useEffect(() => {
        const functionSelected = functionsMap[savedRotation.value]
        setFunctionType(functionSelected)
        if (functionSelected !== 'off') {
            if (functionSelected.includes('alarm')) {
                setUnblocked('alarm')
            } else {
                setUnblocked('zero')
            }
        } else {
            setUnblocked('none')
        }
        setRotations((prev) => {
            prev[type] = savedRotation.value
            return prev
        })
    }, [savedRotation.value])

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform : [{ rotateZ: `${rotation.value}deg` }],
        }
    })

    const styles = create({
        container : {
            // shadowOffset : { width: size / 30, height: 5 },
            // shadowRadius : 3,
            // shadowOpacity : 0.3,
            alignItems : 'center',
            justifyContent : 'center',
            width : knobFrameSize,
            height : knobFrameSize,
            borderRadius : (knobFrameSize) / 2,
        },
        knobImage : {
            width : size,
            height : size,
            borderRadius : size / 2,
            resizeMode : 'stretch',
        },
    })

    return (
        <GestureDetector gesture={rotationGesture}>
            <View
                style={[styles.container, style]}
            >
                <Animated.Image
                    style={[
                        styles.knobImage,
                        animatedStyle,
                    ]}
                    source={imagePath}
                />
            </View>
        </GestureDetector>
    )
}
export default FunctionKnob
