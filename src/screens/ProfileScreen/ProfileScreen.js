import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, Card, TextInput, Button, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'

export default function ProfileScreen({ navigation, route }) {

    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const user = route.params.user

    const entityRef = firebase.firestore().collection('users').where(firebase.firestore.FieldPath.documentId(), '==', user)


    useEffect(() => {
        entityRef
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
            );
    }, [])

    const renderEntity = ({item}) => {
        return (
            <View style={styles.container}>
                <View style={styles.entityButton}>
                    <Image
                                source={{ uri: item.image }}
                                style={{ width: 250, height: 250 }}
                                PlaceholderContent={<ActivityIndicator />}
                                />
                    </View>
                <View style={styles.formContainer}>
                    <Text>
                        ชื่อ {item.fullName}
                    </Text>
                    <Text>
                        เพศ {item.gender}
                    </Text>
                    <Text>
                        การศึกษา {item.education}
                    </Text>
                    <Text>
                        ประสบการณ์ {item.exp}
                    </Text>
                </View>
                <View style={styles.entityButton}>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() =>
                            navigation.navigate(
                                'EditProfile',
                                { user: user }
                        )}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View>
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
