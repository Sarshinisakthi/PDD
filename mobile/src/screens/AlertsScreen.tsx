import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Bell, AlertTriangle } from 'lucide-react-native';

const mockAlerts = [
  { id: 1, type: 'Heart Rate', msg: 'Elevated heart rate detected (110 bpm)', time: '10 mins ago', severity: 'high' },
  { id: 2, type: 'System', msg: 'Device battery is low (15%)', time: '1 hour ago', severity: 'low' },
];

export default function AlertsScreen() {
  return (
    <View className="flex-1 bg-[#0B1020]">
      <View className="h-24 bg-[#111827] px-6 pt-12 flex-row items-center border-b border-white/5">
        <Text className="text-white font-bold text-xl">Notifications</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {mockAlerts.map(alert => (
          <View key={alert.id} className="bg-[#1B2238] rounded-2xl p-4 mb-4 border border-white/5 flex-row items-center">
            <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
              alert.severity === 'high' ? 'bg-red-500/20' : 'bg-blue-500/20'
            }`}>
              {alert.severity === 'high' ? (
                <AlertTriangle color="#ef4444" size={24} />
              ) : (
                <Bell color="#3b82f6" size={24} />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base mb-1">{alert.type}</Text>
              <Text className="text-slate-400 text-sm mb-2">{alert.msg}</Text>
              <Text className="text-slate-500 text-xs">{alert.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
