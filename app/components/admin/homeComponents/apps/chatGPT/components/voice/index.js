import {TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../../../../../../constants';
import {
  GlobalThemeView,
  ThemeText,
} from '../../../../../../../functions/CustomElements';
import {useNavigation} from '@react-navigation/native';
import UserSpeaking from './userSpeaking';
import {useGlobalAppData} from '../../../../../../../../context-store/appData';

export default function ChatGPTVoiceFeature() {
  const {decodedChatGPT} = useGlobalAppData();
  const navigate = useNavigation();

  const totalAvailableCredits = decodedChatGPT.credits;

  return (
    <GlobalThemeView
      useStandardWidth={true}
      styles={{
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
        </TouchableOpacity>
        <UserSpeaking totalAvailableCredits={totalAvailableCredits} />
      </View>
    </GlobalThemeView>
  );
}
