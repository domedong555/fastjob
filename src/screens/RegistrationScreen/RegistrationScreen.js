import React, { useEffect,useState } from 'react'
import { Image, Text, Picker, TextInput, Button, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { firebase } from '../../firebase/config'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alert } from 'react-native';

export default function RegistrationScreen({navigation}) {

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [gender,setGender] = useState('')
    const [education,setEducation] = useState('')
    const [exp,setExp] = useState('')
    const [birth,setBirth] = useState('')
    const [image, setImage] = useState(null);

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
            setImage(result.uri) 
            .then(() => {
                Alert.alert("Success");
            })
            .catch((error) => {
                Alert.alert(error)
            })
        }
      };


    const onRegisterPress = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
    
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const data = {
                    image: image,
                    id: uid,
                    email,
                    fullName,
                    gender,
                    education,
                    exp,
                };
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                        navigation.navigate('Home', {user: data})
                    })
                    .catch((error) => {
                        alert(error)
                    });
                var message = uri;
                ref.putString(message, 'data_url').then(function(snapshot) {
                    console.log('Uploaded a data_url string!');
                    });
            })
            .catch((error) => {
                alert(error)
        });
    }


    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Picker
                    selectedValue={gender}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                >
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                </Picker>

                <Picker
                    selectedValue={education}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) => setEducation(itemValue)}
                >
                    <Picker.Item label="Software Engineer" value="Software Engineer" />
                    <Picker.Item label="Computer Engineer" value="Computer Engineer" />
                    <Picker.Item label="Accounting" value="Accounting" />
                    <Picker.Item label="Tourism and Hotel" value="Tourism and Hotel" />
                    <Picker.Item label="Graphic Designer" value="Graphic Designer" />
                </Picker>
                <TextInput
                    style={styles.input}
                    placeholder='Experience'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setExp(text)}
                    value={exp}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.buttonText}>Select Image</Text>
                        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                    </TouchableOpacity>  
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}
