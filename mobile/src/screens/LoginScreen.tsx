import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { Activity, Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
      // Handle error gracefully in real implementation
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0B1020] justify-center px-8">
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-blue-600 rounded-3xl justify-center items-center mb-6 shadow-blue-500 shadow-lg">
          <Activity color="white" size={40} />
        </View>
        <Text className="text-white text-4xl font-extrabold tracking-tight">LifeLink</Text>
        <Text className="text-slate-400 text-lg mt-2">Mobile Health Monitor</Text>
      </View>

      <View className="space-y-4">
        <View className="relative">
          <View className="absolute left-4 top-4 z-10">
            <Mail color="#94a3b8" size={20} />
          </View>
          <TextInput
            className="w-full h-14 bg-[#1B2238] rounded-xl text-white pl-12 pr-4 border border-slate-700"
            placeholder="Email Address"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="relative">
          <View className="absolute left-4 top-4 z-10">
            <Lock color="#94a3b8" size={20} />
          </View>
          <TextInput
            className="w-full h-14 bg-[#1B2238] rounded-xl text-white pl-12 pr-4 border border-slate-700"
            placeholder="Password"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          className="w-full h-14 bg-blue-600 rounded-xl justify-center items-center mt-6 shadow-lg shadow-blue-500/50"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
