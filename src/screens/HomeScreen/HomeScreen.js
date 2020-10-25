import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, Card, TextInput, Button, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { useNavigation } from '@react-navigation/native'
import { Updates } from 'expo';

export default function HomeScreen(props) {

    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('CompanyEntities')
    const contactRef = firebase.firestore().collection('CompanyContact')
    const userID = props.extraData.id

    const navigation = useNavigation();

    useEffect(() => {
        entityRef
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newEntities = []
                    querySnapshot.forEach(doc => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    setEntities(newEntities)
                },
                error => {
                    console.log(error)
                }
            )
    }, [])

    const userSignOut = () => {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }).catch(function(error) {
            // An error happened.
        });
        Updates.reload();
    }


    const renderEntity = ({item}) => {
        return (
            <View style={styles.container}>
                <View style={styles.entityButton}>
                    <TouchableOpacity                             
                                onPress={() =>
                                navigation.navigate(
                                    'Job',
                                    { id: item.id, user: userID, company: item.authorID }
                                    )
                                }>
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: 100, height: 100 }}
                            PlaceholderContent={<ActivityIndicator />}
                            />
                        <Text style={styles.buttonText}>Apply</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.formContainer}>
                    <Text>
                        บริษัท {item.text}
                    </Text>
                    <Text>
                        งาน {item.job}
                    </Text>
                    <Text>
                        รายละเอียด {item.description}
                    </Text>
                    <Text>
                        รายได้ {item.Profit}
                    </Text>
                </View>
                <View style={styles.entityButton}>
                    <TouchableOpacity 
                            style={styles.button} 
                            onPress={() =>
                                navigation.navigate(
                                    'Job',
                                    { id: item.id, user: userID, company: item.authorID }
                                    )
                                }>
                        <Text style={styles.buttonText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View>
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                <View style={styles.entityButton}>
                    <TouchableOpacity style={styles.button} 
                        onPress={() =>
                            navigation.navigate(
                                'Profile',
                                { user: userID }
                            )}
                        >
                        <Text style={styles.buttonText}>
                            Profile
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.entityButton}>
                    <TouchableOpacity style={styles.button} 
                        onPress={userSignOut}
                        >
                        <Text style={styles.buttonText}>
                            Log out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
                { entities && (
                    <View>
                        <View>
                            <FlatList 
                                data={entities}
                                renderItem={renderEntity}
                                keyExtractor={(item) => item.id}
                                removeClippedSubviews={true}
                            />
                        </View>
                    </View>
                )}

        </View>
    )
}
