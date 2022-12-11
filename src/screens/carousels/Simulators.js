import {
    FlatList,
    ImageBackground,
    SafeAreaView,
    Text,
    View,
} from 'react-native'
import { useCallback } from 'react'
import colors from '../../utils/color-palette'
import { create } from '../../utils/normalize'
import fontSizes from '../../utils/font-sizes'
import { Button } from '../../atoms/'
import useOrientation from '../../utils/orientation'

const SIMULATORS = [
    {
        id: '1',
        name: 'Blender',
        description: 'Air-oxygen mixer simulator',
        imagePath: require('../../assets/carousel/blender.png'),
    },
    {
        id: '2',
        name: 'PDB',
        description: 'Pressure display box simulator',
        imagePath: require('../../assets/carousel/pdb.png'),
    },
]

const Simulators = ({ navigation }) => {
    const isLandscape = useOrientation()
    const styles = create({
        container: {
            backgroundColor: colors.primary.darkBackground,
            flex: 1,
        },
        info: {
            height: '40%',
            backgroundColor: colors.primary.darkBackground,
        },
        cardContainer: {
            flexDirection: 'column-reverse',
            flex: 1,
            top: '5%',
        },
        item: {
            borderRadius: 10,
            width: isLandscape ? '55%' : '65%',
            height: isLandscape ? '85%' : '70%',
            shadowOpacity: 0.2,
            shadowOffset: { height: 4, width: 4 },
        },
        background: {
            height: '100%',
            width: '100%',
            borderRadius: 8,
            resizeMode: 'cover',
        },
        titleText: {
            color: colors.primary.white,
            fontSize: fontSizes.subtitles,
            fontFamily: 'SFPro-Bold',
        },
        subTitleText: {
            color: colors.primary.white,
            fontSize: fontSizes.medium,
            fontWeight: '300',
            fontFamily: 'SFPro-Regular',
        },
        cardInfo: {
            marginLeft: '10%',
            marginBottom: '2.5%',
        },
        listView: {
            flex: 1,
            left: '11%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexGrow: 1,
        },
        titleContainer: {
            marginLeft: '5%',
            marginBottom: '5%',
            flex: 1,
            flexDirection: 'column-reverse',
        },
        mainTitle: {
            color: colors.primary.white,
            fontSize: fontSizes.titles,
            fontFamily: 'SFPro-Bold',
        },
        mainSubTitle: {
            color: colors.primary.white,
            fontSize: fontSizes.body,
            fontFamily: 'SFPro-Medium',
        },
        shadowWrap: {
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            marginTop: '5%',
            width: '60%',
            alignSelf: 'center',
            flexDirection: 'row',
            borderRadius: 40,
        },
        button: {
            alignSelf: 'center',
            alignItems: 'center',
            flex: 1,
            paddingVertical: '4%',
            paddingHorizontal: '10%',
            borderRadius: 40,
        },
        buttonText: {
            marginVertical: '2.5%',
            fontFamily: 'SFPro-Medium',
            color: colors.primary.white,
            fontSize: fontSizes.large,
        },
    })

    const Item = ({ name, description, imagePath }) => (
        <ImageBackground
            style={styles.item}
            imageStyle={styles.background}
            source={imagePath}
        >
            <View style={styles.cardContainer}>
                <Button
                    style={{
                        marginTop: '5%',
                        width: '55%',
                    }}
                    onPress={() => navigation.navigate(name)}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </Button>
                <View style={styles.cardInfo}>
                    <Text style={styles.titleText}>{name}</Text>
                    <Text style={styles.subTitleText}>{description}</Text>
                </View>
            </View>
        </ImageBackground>
    )

    const renderItem = useCallback(({ item }) => <Item {...item} />, [])

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../../assets/navigation/simulators.png')}
                imageStyle={{ height: '100%', opacity: 0.8 }}
                style={styles.info}
            >
                <View style={styles.titleContainer}>
                    <Text style={styles.mainSubTitle}>
                        Scroll and select a simulator
                    </Text>
                    <Text style={styles.mainTitle}>Simulations</Text>
                </View>
            </ImageBackground>
            <FlatList
                contentContainerStyle={styles.listView}
                data={SIMULATORS}
                horizontal
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    )
}

export default Simulators
