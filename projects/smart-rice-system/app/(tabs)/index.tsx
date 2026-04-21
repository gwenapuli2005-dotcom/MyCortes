import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface RecentScan {
  id: string;
  date: string;
  grade: string;
  price: number;
  gradeColor: string;
}

const RECENT_SCANS: RecentScan[] = [
  {
    id: "1",
    date: "Today, 2:30 PM",
    grade: "PREMIUM",
    price: 58,
    gradeColor: "#22C55E",
  },
  {
    id: "2",
    date: "Yesterday, 10:15 AM",
    grade: "WELL-MILLED",
    price: 48,
    gradeColor: "#3B82F6",
  },
  {
    id: "3",
    date: "2 days ago",
    grade: "REGULAR",
    price: 42,
    gradeColor: "#F59E0B",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();

  const handleScanPress = () => {
    router.push("/(tabs)/scan");
  };

  const handleViewHistory = () => {
    router.push("/(tabs)");
  };

  const handleViewMarket = () => {
    router.push("/(tabs)");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-8 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-3">
            <Text className="text-5xl">🌾</Text>
            <Text className="text-3xl font-bold text-foreground text-center">
              Smart Rice Grading
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              Get instant quality assessment and fair market prices for your rice
            </Text>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            onPress={handleScanPress}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 18,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: colors.primary,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
            activeOpacity={0.85}
          >
            <Text className="text-lg font-bold text-white">📸 Scan Rice Sample</Text>
          </TouchableOpacity>

          {/* Market Alert Banner */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-xs text-muted font-medium mb-2">Market Update</Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-2xl font-bold text-foreground">₱48</Text>
              <Text className="text-sm text-muted">/kg average (Well-milled)</Text>
            </View>
            <Text className="text-xs text-muted mt-2">Updated 2 hours ago</Text>
          </View>

          {/* Recent Results Section */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">Recent Scans</Text>
              <TouchableOpacity onPress={handleViewHistory}>
                <Text className="text-sm font-medium text-primary">View All</Text>
              </TouchableOpacity>
            </View>

            {RECENT_SCANS.length > 0 ? (
              <FlatList
                data={RECENT_SCANS}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row items-center justify-between">
                    <View className="flex-1 gap-1">
                      <Text className="text-sm text-muted">{item.date}</Text>
                      <View className="flex-row items-center gap-2">
                        <View
                          style={{
                            backgroundColor: item.gradeColor,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                          }}
                        >
                          <Text className="text-xs font-bold text-white">{item.grade}</Text>
                        </View>
                        <Text className="text-sm font-semibold text-foreground">₱{item.price}/kg</Text>
                      </View>
                    </View>
                    <Text className="text-lg text-muted">→</Text>
                  </View>
                )}
              />
            ) : (
              <View className="bg-surface rounded-xl p-6 items-center justify-center">
                <Text className="text-sm text-muted">No scans yet. Start by scanning a rice sample!</Text>
              </View>
            )}
          </View>

          {/* Quick Links */}
          <View className="gap-2">
            <TouchableOpacity
              onPress={handleViewMarket}
              className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between active:opacity-70"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">📊</Text>
                <View>
                  <Text className="text-base font-semibold text-foreground">Market Prices</Text>
                  <Text className="text-xs text-muted">Real-time price trends</Text>
                </View>
              </View>
              <Text className="text-lg text-muted">→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
