import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLORS, FONT, SHADOWS, SIZES, CENTER} from '../../../../../constants';
import {useNavigation} from '@react-navigation/native';
import {useGlobalContextProvider} from '../../../../../../context-store/context';
import {ThemeText} from '../../../../../functions/CustomElements';
import handleBackPress from '../../../../../hooks/handleBackPress';
import {useEffect} from 'react';

export default function ConfirmActionPage(props) {
  const navigate = useNavigation();
  const {theme} = useGlobalContextProvider();

  function handleBackPressFunction() {
    navigate.goBack();
    return true;
  }
  useEffect(() => {
    handleBackPress(handleBackPressFunction);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => navigate.goBack()}>
      <View style={styles.globalContainer}>
        <TouchableWithoutFeedback style={{flex: 1}}>
          <View
            style={[
              styles.content,
              {
                backgroundColor: theme
                  ? COLORS.darkModeBackground
                  : COLORS.lightModeBackground,
              },
            ]}>
            <ThemeText
              styles={{...styles.headerText}}
              content={
                props.route.params?.confirmMessage
                  ? props.route.params.confirmMessage
                  : `Are you sure you want to drain your wallet?`
              }
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (props.route.params.deleteMint) {
                    props.route.params.deleteMint();
                  } else props.route.params.wantsToDrainFunc(true);
                  navigate.goBack();
                }}
                style={[styles.button]}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                    },
                  ]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  height: '100%',
                  width: 2,
                  backgroundColor: theme
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                }}></View>
              <TouchableOpacity
                onPress={() => {
                  navigate.goBack();
                }}
                style={styles.button}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                    },
                  ]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: COLORS.opaicityGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  button: {
    width: '50%',
    height: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: SIZES.large,
  },

  content: {
    width: '95%',
    maxWidth: 300,
    borderRadius: 8,
  },
  headerText: {
    width: '90%',
    paddingVertical: 15,
    textAlign: 'center',
    ...CENTER,
  },
  border: {
    height: '100%',
    width: 1,
  },
});
