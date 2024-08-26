import {Button, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ANDROIDSAFEAREA} from '../../../../../../../constants/styles';
import {COLORS} from '../../../../../../../constants';
import {ThemeText} from '../../../../../../../functions/CustomElements';
import {useEffect, useState} from 'react';
import {useGlobalContextProvider} from '../../../../../../../../context-store/context';
import {useNavigation} from '@react-navigation/native';
// import Voice from '@react-native-voice/voice';
// import * as Speech from 'expo-speech';
// import UserSpeeking from './userSpeaking';

export default function ChatGPTVoiceFeature() {
  const {masterInfoObject} = useGlobalContextProvider();
  const insets = useSafeAreaInsets();
  const navigate = useNavigation();
  const [totalAvailableCredits, setTotalAvailableCredits] = useState(
    masterInfoObject.chatGPT.credits,
  );
  //   const speak = text => {
  //     Speech.speak(text);
  //   };

  //   async function setUpOptions() {
  //     const voices = await Speech.getAvailableVoicesAsync();

  //     console.log(voices, maxLen);
  //   }

  useEffect(() => {
    navigate.navigate('ErrorScreen', {
      errorMessage:
        'Make sure your phone is not on silent mode in order to hear the chatGPTs response',
    });
    // setUpOptions();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top < ANDROIDSAFEAREA ? ANDROIDSAFEAREA : insets.top,
        paddingTop:
          insets.bottom < ANDROIDSAFEAREA ? ANDROIDSAFEAREA : insets.bottom,
        backgroundColor: COLORS.darkModeBackground,
      }}>
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={navigate.goBack}>
          <ThemeText
            styles={{
              textAlign: 'center',
              color: COLORS.darkModeText,
              marginTop: 20,
            }}
            content={`Available credits: ${totalAvailableCredits.toFixed(2)}`}
          />

          {/* <Button title="Press to hear some words" onPress={speak} /> */}
        </TouchableOpacity>
        {/* <UserSpeeking /> */}
      </View>
    </View>
  );
}