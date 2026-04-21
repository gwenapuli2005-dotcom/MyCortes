import { Text, View, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface PriceCategory {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  color: string;
  trend: "up" | "down" | "stable";
  trendPercent: number;
}

const PRICE_CATEGORIES: PriceCategory[] = [
  {
    id: "1",
    name: "Regular Milled",
    minPrice: 38,
    maxPrice: 45,
    avgPrice: 42,
    color: "#F59E0B",
    trend: "stable",
    trendPercent: 0.5,
  },
  {
    id: "2",
    name: "Well-Milled",
    minPrice: 45,
    maxPrice: 52,
    avgPrice: 48,
    color: "#3B82F6",
    trend: "up",
    trendPercent: 2.3,
  },
  {
    id: "3",
    name: "Premium",
    minPrice: 52,
    maxPrice: 65,
    avgPrice: 58,
    color: "#22C55E",
    trend: "up",
    trendPercent: 1.8,
  },
];

const PRICE_HISTORY = [
  { day: "Mon", price: 47 },
  { day: "Tue", price: 47.5 },
  { day: "Wed", price: 48 },
  { day: "Thu", price: 47.8 },
  { day: "Fri", price: 48.2 },
  { day: "Sat", price: 48.5 },
  { day: "Sun", price: 48 },
];

export default function MarketScreen() {
  const colors = useColors();
  const [selectedLocation, setSelectedLocation] = useState("Surigao del Sur");

  const renderPriceCard = ({ item }: { item: PriceCategory }) => (
    <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3 flex-1">
          <View
            style={{
              backgroundColor: item.color,
              width: 12,
              height: 12,
              borderRadius: 6,
            }}
          />
          <Text className="text-base font-semibold text-foreground">{item.name}</Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-foreground">₱{item.avgPrice}</Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Text className="text-xs font-semibold" style={{ color: item.trend === "up" ? "#EF4444" : item.trend === "down" ? "#22C55E" : "#687076" }}>
              {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→"} {item.trendPercent}%
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-background rounded-lg p-3">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs text-muted mb-1">Min</Text>
            <Text className="text-sm font-semibold text-foreground">₱{item.minPrice}</Text>
          </View>
          <View className="flex-1 mx-4 h-1 bg-border rounded-full" />
          <View>
            <Text className="text-xs text-muted mb-1">Max</Text>
            <Text className="text-sm font-semibold text-foreground">₱{item.maxPrice}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-6 py-6 gap-6">
          {/* Header */}
          <View>
            <Text className="text-2xl font-bold text-foreground mb-1">Market Prices</Text>
            <Text className="text-sm text-muted">Real-time rice pricing in the Philippines</Text>
          </View>

          {/* Location & Season Info */}
          <View className="bg-surface rounded-xl p-4 border border-border gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">Location:</Text>
              <TouchableOpacity className="bg-background rounded-lg px-3 py-2 border border-border">
                <Text className="text-sm font-medium text-foreground">{selectedLocation}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">Season:</Text>
              <View
                style={{
                  backgroundColor: "#F59E0B",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text className="text-xs font-bold text-white">Harvest Season</Text>
              </View>
            </View>
            <Text className="text-xs text-muted">Last updated: 2 hours ago</Text>
          </View>

          {/* Price Categories */}
          <View>
            <Text className="text-base font-semibold text-foreground mb-3">Current Prices (per kg)</Text>
            <FlatList
              data={PRICE_CATEGORIES}
              keyExtractor={(item) => item.id}
              renderItem={renderPriceCard}
              scrollEnabled={false}
            />
          </View>

          {/* 7-Day Trend */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-base font-semibold text-foreground mb-4">7-Day Trend (Well-Milled)</Text>
            <View className="flex-row items-end justify-between h-32 gap-2">
              {PRICE_HISTORY.map((item, idx) => {
                const maxPrice = Math.max(...PRICE_HISTORY.map((h) => h.price));
                const minPrice = Math.min(...PRICE_HISTORY.map((h) => h.price));
                const range = maxPrice - minPrice;
                const heightPercent = ((item.price - minPrice) / range) * 100;

                return (
                  <View key={idx} className="flex-1 items-center gap-2">
                    <View
                      style={{
                        height: `${Math.max(heightPercent, 10)}%`,
                        backgroundColor: colors.primary,
                        width: "100%",
                        borderRadius: 4,
                      }}
                    />
                    <Text className="text-xs text-muted">{item.day}</Text>
                  </View>
                );
              })}
            </View>
            <View className="mt-4 pt-4 border-t border-border">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Avg: ₱{(PRICE_HISTORY.reduce((a, b) => a + b.price, 0) / PRICE_HISTORY.length).toFixed(2)}</Text>
                <Text className="text-xs text-muted">High: ₱{Math.max(...PRICE_HISTORY.map((h) => h.price))}</Text>
                <Text className="text-xs text-muted">Low: ₱{Math.min(...PRICE_HISTORY.map((h) => h.price))}</Text>
              </View>
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <Text className="text-xs font-semibold text-foreground mb-2">💡 Pricing Factors</Text>
            <View className="gap-1">
              <Text className="text-xs text-muted">• Quality grade (milling degree, defects)</Text>
              <Text className="text-xs text-muted">• Season (harvest vs. lean season)</Text>
              <Text className="text-xs text-muted">• Supply & demand dynamics</Text>
              <Text className="text-xs text-muted">• Regional market conditions</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
