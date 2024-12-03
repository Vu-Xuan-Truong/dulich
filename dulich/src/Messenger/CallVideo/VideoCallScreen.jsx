import React, { useEffect, useRef, useState } from 'react';
import { View, Button, Text } from 'react-native';
import { RTCView, mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // Thay bằng địa chỉ server
const VideoCallScreen = ({ route, navigation }) => {
  const { roomId } = route.params;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const socket = useRef(null);
  const pc = useRef(new RTCPeerConnection());

  useEffect(() => {
    // Kết nối đến server Socket.IO
    socket.current = io(SERVER_URL);

    socket.current.emit('join', roomId);

    // Xử lý tín hiệu nhận được từ server
    socket.current.on('signal', async (data) => {
      if (data.type === 'offer') {
        await pc.current.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        socket.current.emit('signal', { roomId, data: answer });
      } else if (data.type === 'answer') {
        await pc.current.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.candidate) {
        await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    // Khởi tạo WebRTC
    const setupWebRTC = async () => {
      const stream = await mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);

      stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));

      pc.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit('signal', { roomId, data: event.candidate });
        }
      };
    };

    setupWebRTC();

    return () => {
      socket.current.disconnect();
      pc.current.close();
    };
  }, [roomId]);

  const startCall = async () => {
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.current.emit('signal', { roomId, data: offer });
  };

  return (
    <View style={{ flex: 1 }}>
      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={{ flex: 1, backgroundColor: 'black' }}
        />
      )}
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{ flex: 1, backgroundColor: 'black' }}
        />
      )}
      <Button title="Bắt đầu cuộc gọi" onPress={startCall} />
      <Button title="Kết thúc cuộc gọi" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default VideoCallScreen;
