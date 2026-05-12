import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera as CameraIcon, Image as ImageIcon, X } from 'lucide-react-native';
import api from '../api/client';

const CameraScreen = ({ navigation }: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    let result;
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera access to scan receipts');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.8,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    const uriParts = image.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('image', {
      uri: image,
      name: `receipt.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    try {
      const response = await api.post('/receipts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigation.replace('ReviewReceipt', { receipt: response.data });
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload Failed', 'Could not process receipt. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.preview} />
          <TouchableOpacity style={styles.closeBtn} onPress={() => setImage(null)}>
            <X color="#fff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.uploadBtn, uploading && styles.disabledBtn]} 
            onPress={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.uploadText}>Process Receipt</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>Scan Receipt</Text>
          <Text style={styles.subtitle}>Take a photo or upload from gallery</Text>
          
          <View style={styles.options}>
            <TouchableOpacity style={styles.optionBtn} onPress={() => pickImage(true)}>
              <CameraIcon color="#2563eb" size={40} />
              <Text style={styles.optionText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionBtn} onPress={() => pickImage(false)}>
              <ImageIcon color="#2563eb" size={40} />
              <Text style={styles.optionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  optionBtn: {
    backgroundColor: '#eff6ff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '40%',
  },
  optionText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  uploadBtn: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#2563eb',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#94a3b8',
  },
  uploadText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CameraScreen;
