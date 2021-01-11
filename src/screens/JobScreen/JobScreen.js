import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, Card, TextInput, Button, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'

export default function JobScreen({ navigation, route }) {

    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const user = route.params.user
    const itemId = route.params.id
    const company = route.params.company

    const entityRef = firebase.firestore().collection('CompanyEntities').where(firebase.firestore.FieldPath.documentId(), '==', itemId)
    const contactRef = firebase.firestore().collection('CompanyContact')


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
            )
    }, [])

    const onAddButtonPress = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            companyID: company,
            userID: user,
            itemID: itemId,
            createdAt: timestamp,
        };
        contactRef
            .add(data)
            .then(_doc => {
                setEntityText('')
                Keyboard.dismiss()
                
            })
            .catch((error) => {
                alert(error)
            });
        
    }

    const renderEntity = ({item}) => {
        return (
            <View style={styles.container}>
                <View style={styles.entityButton}>
                    <Image
                                source={{ uri: item.image }}
                                style={{ width: 100, height: 100 }}
                                PlaceholderContent={<ActivityIndicator />}
                                />
                            <Text style={styles.buttonText}>Apply</Text>
                    </View>
                <View style={styles.formContainer}>
                    <Text>
                        บริษัท {item.text}
                    </Text>
                    <Text>
                        ที่อยู่ {item.address}
                    </Text>
                    <Text>
                        จังหวัด {item.province}
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
                    <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                        <Text style={styles.buttonText}>Apply</Text>
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
                <Text>
                    {itemId}
                </Text>
        </View>
    )
}
