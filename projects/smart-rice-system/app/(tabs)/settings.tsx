import { Text, View, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");
  const [location, setLocation] = useState("Surigao del Sur");
  const [language, setLanguage] = useState("English");

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    // In a real app, this would persist and update the theme
  };

  const SettingRow = ({
    label,
    value,
    onPress,
  }: {
    label: string;
    value: string | React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row items-center justify-between active:opacity-70"
      activeOpacity={0.7}
    >
      <Text className="text-base font-medium text-foreground">{label}</Text>
      {typeof value === "string" ? (
        <Text className="text-sm text-muted">{value}</Text>
      ) : (
        value
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-6 py-6 gap-6">
          {/* Header */}
          <View>
            <Text className="text-2xl font-bold text-foreground mb-1">Settings</Text>
            <Text className="text-sm text-muted">Customize your app experience</Text>
          </View>

          {/* Display Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground px-2">Display</Text>
            <SettingRow
              label="Dark Mode"
              value={
                <Switch
                  value={darkMode}
                  onValueChange={handleDarkModeToggle}
                  trackColor={{ false: "#E5E7EB", true: "#2E7D32" }}
                  thumbColor={darkMode ? "#ffffff" : "#f5f5f5"}
                />
              }
            />
            <SettingRow label="Font Size" value="Default" />
          </View>

          {/* Location & Language Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground px-2">Preferences</Text>
            <SettingRow label="Location" value={location} />
            <SettingRow label="Language" value={language} />
          </View>

          {/* Data Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground px-2">Data & Storage</Text>
            <View className="bg-surface rounded-xl p-4 border border-border">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-medium text-foreground">Scan History</Text>
                <Text className="text-sm text-muted">5 scans</Text>
              </View>
              <TouchableOpacity className="bg-background rounded-lg py-2 px-3 border border-error/30 active:opacity-70">
                <Text className="text-sm font-medium text-error text-center">Clear History</Text>
              </TouchableOpacity>
            </View>
            <View className="bg-surface rounded-xl p-4 border border-border">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-medium text-foreground">Cache</Text>
                <Text className="text-sm text-muted">~12 MB</Text>
              </View>
              <TouchableOpacity className="bg-background rounded-lg py-2 px-3 border border-border active:opacity-70">
                <Text className="text-sm font-medium text-foreground text-center">Clear Cache</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground px-2">About</Text>
            <SettingRow label="App Version" value="1.0.0" />
            <SettingRow label="Build Number" value="20260421" />
            <TouchableOpacity className="bg-surface rounded-xl p-4 border border-border active:opacity-70">
              <Text className="text-base font-medium text-primary text-center">Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-surface rounded-xl p-4 border border-border active:opacity-70">
              <Text className="text-base font-medium text-primary text-center">Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-surface rounded-xl p-4 border border-border active:opacity-70">
              <Text className="text-base font-medium text-primary text-center">Send Feedback</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-xs font-semibold text-foreground mb-2">📱 Device Info</Text>
            <View className="gap-1">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Platform:</Text>
                <Text className="text-xs font-medium text-foreground">React Native</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Expo SDK:</Text>
                <Text className="text-xs font-medium text-foreground">54</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Offline Mode:</Text>
                <Text className="text-xs font-medium text-success">Enabled</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
