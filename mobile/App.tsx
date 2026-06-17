import React from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

export default function App() {
  // Dynamically get the host IP to support both Physical Devices (LAN IP) and Emulators
  const debuggerHost = Constants.expoConfig?.hostUri;
  const hostIp = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
  const targetUrl = `http://${hostIp}:5173`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <WebView 
        source={{ uri: targetUrl }} 
        style={styles.webview}
        allowsBackForwardNavigationGestures={true}
        bounces={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});
