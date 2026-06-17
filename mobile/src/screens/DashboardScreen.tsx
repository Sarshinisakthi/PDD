import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { Heart, Droplets, Activity, Thermometer, LogOut } from 'lucide-react-native';

const VitalCard = ({ title, value, unit, icon: Icon, color }: any) => (
  <View className="bg-[#1B2238] rounded-2xl p-5 mb-4 border border-white/5 flex-1 mx-2">
    <View className="flex-row items-center mb-3">
      <View className={`w-10 h-10 rounded-xl ${color} items-center justify-center mr-3`}>
        <Icon color="white" size={20} />
      </View>
      <Text className="text-slate-400 font-medium">{title}</Text>
    </View>
    <View className="flex-row items-baseline">
      <Text className="text-white text-3xl font-bold">{value}</Text>
      <Text className="text-slate-500 ml-1">{unit}</Text>
    </View>
  </View>
);

export default function DashboardScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View className="flex-1 bg-[#0B1020]">
      <View className="h-24 bg-[#111827] px-6 pt-12 flex-row justify-between items-center border-b border-white/5">
        <View>
          <Text className="text-slate-400 text-sm">Welcome back,</Text>
          <Text className="text-white font-bold text-xl">{user?.displayName || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={logout} className="p-2">
          <LogOut color="#ef4444" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="text-white font-semibold text-lg mb-4 px-2">Live Vitals</Text>
        
        <View className="flex-row justify-between">
          <VitalCard title="Heart Rate" value="78" unit="bpm" icon={Heart} color="bg-rose-500" />
          <VitalCard title="SpO2" value="98" unit="%" icon={Droplets} color="bg-blue-500" />
        </View>
        
        <View className="flex-row justify-between">
          <VitalCard title="Blood Pressure" value="120/80" unit="mmHg" icon={Activity} color="bg-purple-500" />
          <VitalCard title="Body Temp" value="98.6" unit="°F" icon={Thermometer} color="bg-amber-500" />
        </View>

        <View className="bg-[#1B2238] rounded-2xl p-5 mx-2 mt-4 border border-white/5">
          <Text className="text-white font-semibold mb-2">Device Status</Text>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <Text className="text-slate-400">Connected & Monitoring</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
