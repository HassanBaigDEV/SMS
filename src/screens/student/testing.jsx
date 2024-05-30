import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export default function ImageUpload() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const source = { uri: response.assets[0].uri };
                setImage(source);
            }
        });
    };

    const uploadImage = async () => {
        if (!image) {
            Alert.alert('Please select an image first');
            return;
        }

        const { uri } = image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        setUploading(true);
        setTransferred(0);

        const task = storage().ref(`images/${filename}`).putFile(uploadUri);

        task.on('state_changed', snapshot => {
            setTransferred(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        });

        try {
            await task;
            setUploading(false);
            Alert.alert('Photo uploaded!', 'Your photo has been uploaded to Firebase Cloud Storage!');
            setImage(null);
        } catch (e) {
            console.error(e);
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Firebase Storage Image Upload</Text>
            <Button title="Select Image" onPress={selectImage} />
            {image && (
                <Image source={image} style={styles.image} />
            )}
            {uploading ? (
                <View style={styles.progressBarContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>{transferred}% Completed!</Text>
                </View>
            ) : (
                <Button title="Upload Image" onPress={uploadImage} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        width: 200,
        height: 200,
        margin: 10,
        borderRadius: 10,
    },
    progressBarContainer: {
        marginTop: 20,
    },
});
