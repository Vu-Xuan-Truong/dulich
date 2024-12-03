import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { RTCPeerConnection } from 'react-native-webrtc';

const IncomingCallScreen = ({ chatId, navigation }) => {
  const [callData, setCallData] = useState(null);
  const pc = useRef(new RTCPeerConnection());

  useEffect(() => {
    const callRef = firestore().collection('calls').doc(chatId);

    const unsubscribe = callRef.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        setCallData(snapshot.data());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  const acceptCall = async () => {
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    const callRef = firestore().collection('calls').doc(chatId);
    callRef.update({
      answer,
      status: "accepted", // Update status to accepted
    });

    navigation.replace('VideoCall', { chatId });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {callData ? (
        <>
          <Text>Incoming call from {callData.callerId}</Text>
          <Button title="Accept" onPress={acceptCall} />
          <Button title="Reject" onPress={() => navigation.goBack()} />
        </>
      ) : (
        <Text>Waiting for call...</Text>
      )}
    </View>
  );
};

export default IncomingCallScreen;
