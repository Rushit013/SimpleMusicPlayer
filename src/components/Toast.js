import { ToastAndroid } from 'react-native';
import Toast from 'react-native-simple-toast';

export default function RenderToast(message) {
    // ToastAndroid.showWithGravityAndOffset(
    //     message,
    //     ToastAndroid.SHORT,
    //     ToastAndroid.BOTTOM,
    //     0,
    //     300,
    // );
    Toast.show(message, Toast.SHORT);
}
