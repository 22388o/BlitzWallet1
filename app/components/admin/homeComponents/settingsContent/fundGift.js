import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {BTN, COLORS, FONT, ICONS, SIZES} from '../../../../constants';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';
import {useGlobalContextProvider} from '../../../../../context-store/context';
import HowToSteps from '../fundGift/howToSteps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ANDROIDSAFEAREA} from '../../../../constants/styles';

export default function FundWalletGift() {
  const navigate = useNavigation();
  const {theme} = useGlobalContextProvider();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.globalContainer,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
          paddingTop: insets.top < 20 ? ANDROIDSAFEAREA : insets.top,
          paddingBottom: insets.bottom < 20 ? ANDROIDSAFEAREA : insets.bottom,
        },
      ]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={[styles.contentContainer]}>
          <View style={{flex: 1, alignItems: 'center', marginBottom: 5}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center', width: '90%'}}>
              <View style={[styles.contentItem]}>
                <Text
                  style={[
                    styles.contentHeader,
                    {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
                  ]}>
                  What is this?
                </Text>
                <View
                  style={[
                    styles.contentDescriptionContainer,
                    {
                      backgroundColor: theme
                        ? COLORS.darkModeBackgroundOffset
                        : COLORS.lightModeBackgroundOffset,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.contentDescription,
                      {
                        color: theme
                          ? COLORS.darkModeText
                          : COLORS.lightModeText,
                      },
                    ]}>
                    Self-custodial lightning can be intimidating at first. What
                    are channels? How do I restore my wallet if I get a new
                    phone? How do I set up my account? All of these questions
                    are valid and pain points for people.
                  </Text>
                  <Text
                    style={[
                      styles.contentDescription,
                      {
                        color: theme
                          ? COLORS.darkModeText
                          : COLORS.lightModeText,
                      },
                    ]}>
                    Here at Blitz, we believe in easing the transition to
                    self-custodial lighting. And because of our passion for
                    that, we created the gift-a-wallet feature.
                  </Text>
                  <Text
                    style={[
                      styles.contentDescription,
                      {
                        color: theme
                          ? COLORS.darkModeText
                          : COLORS.lightModeText,
                      },
                    ]}>
                    By using this feature, you can pre-fund someonbody's wallet
                    so as soon as they open it for the first time, they can send
                    and receive Bitcoin over the lightning network instantly.
                  </Text>
                  <Text
                    style={[
                      styles.contentDescription,
                      {
                        color: theme
                          ? COLORS.darkModeText
                          : COLORS.lightModeText,
                        marginBottom: 0,
                      },
                    ]}>
                    This feature is trust based and needs to be used with
                    extreme care.
                  </Text>
                </View>
              </View>
              <View style={[styles.contentItem]}>
                <Text
                  style={[
                    styles.contentHeader,
                    {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
                  ]}>
                  How to do this?
                </Text>
                <View
                  style={[
                    styles.contentDescriptionContainer,
                    {
                      backgroundColor: theme
                        ? COLORS.darkModeBackgroundOffset
                        : COLORS.lightModeBackgroundOffset,
                    },
                  ]}>
                  <HowToSteps />
                </View>
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity
            onPress={() => {
              (async () => {
                try {
                  // Alert.alert('Coming Soon....');
                  navigate.navigate('AmountToGift');
                } catch (err) {
                  Alert.alert(
                    'Not connected to node',
                    'Please connect to node to start this process',
                  );
                }
              })();
            }}
            style={[
              BTN,
              {
                backgroundColor: COLORS.primary,
                marginTop: 'auto',
                marginBottom: 0,
              },
            ]}>
            <Text style={styles.buttonText}>Start process</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarIcon: {
    width: 25,
    height: 25,
  },
  topBarText: {
    fontSize: SIZES.large,
    marginRight: 'auto',
    marginLeft: 'auto',
    transform: [{translateX: -12.5}],
    fontFamily: FONT.Title_Bold,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  contentItem: {
    width: '100%',
    marginVertical: 10,
  },
  contentHeader: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },
  contentDescriptionContainer: {
    padding: 10,
    borderRadius: 8,
  },
  contentDescription: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },

  buttonText: {
    color: COLORS.white,
    fontFamily: FONT.Other_Regular,
  },
});
