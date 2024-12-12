import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';

const MediaViewerScreen = ({ route, navigation }) => {
  const { mediaUrl, mediaType } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Icon name="times" size={30} color="white" />
      </TouchableOpacity>
      {mediaType === 'image' ? (
        <Image source={{ uri: mediaUrl }} style={styles.media} resizeMode="contain" />
      ) : (
        <Video
          source={{ uri: mediaUrl }}
          style={styles.media}
          controls
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
});

export default MediaViewerScreen;
