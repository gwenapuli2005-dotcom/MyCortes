import { Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface ScanRecord {
  id: string;
  date: string;
  grade: string;
  gradeColor: string;
  price: number;
  millingDegree: string;
  brokenRice: number;
  defects: string[];
}

const MOCK_HISTORY: ScanRecord[] = [
  {
    id: "1",
    date: "Today, 2:30 PM",
    grade: "PREMIUM",
    gradeColor: "#22C55E",
    price: 58,
    millingDegree: "Well-milled",
    brokenRice: 2.5,
    defects: [],
  },
  {
    id: "2",
    date: "Yesterday, 10:15 AM",
    grade: "WELL-MILLED",
    gradeColor: "#3B82F6",
    price: 48,
    millingDegree: "Well-milled",
    brokenRice: 5.2,
    defects: ["Slight chalky"],
  },
  {
    id: "3",
    date: "2 days ago, 3:45 PM",
    grade: "REGULAR",
    gradeColor: "#F59E0B",
    price: 42,
    millingDegree: "Regular",
    brokenRice: 8.1,
    defects: ["Chalky", "Discolored"],
  },
  {
    id: "4",
    date: "3 days ago, 9:20 AM",
    grade: "PREMIUM",
    gradeColor: "#22C55E",
    price: 60,
    millingDegree: "Well-milled",
    brokenRice: 1.8,
    defects: [],
  },
  {
    id: "5",
    date: "1 week ago",
    grade: "WELL-MILLED",
    gradeColor: "#3B82F6",
    price: 46,
    millingDegree: "Well-milled",
    brokenRice: 6.3,
    defects: ["Damaged"],
  },
];

export default function HistoryScreen() {
  const colors = useColors();

  const renderItem = ({ item }: { item: ScanRecord }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-3 border border-border active:opacity-70"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-sm text-muted mb-1">{item.date}</Text>
          <View className="flex-row items-center gap-2">
            <View
              style={{
                backgroundColor: item.gradeColor,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text className="text-xs font-bold text-white">{item.grade}</Text>
            </View>
            <Text className="text-base font-bold text-foreground">₱{item.price}/kg</Text>
          </View>
        </View>
        <Text className="text-lg text-muted">→</Text>
      </View>

      <View className="border-t border-border pt-3 gap-2">
        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">Milling Degree:</Text>
          <Text className="text-xs font-semibold text-foreground">{item.millingDegree}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">Broken Rice:</Text>
          <Text className="text-xs font-semibold text-foreground">{item.brokenRice}%</Text>
        </View>
        {item.defects.length > 0 && (
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Defects:</Text>
            <Text className="text-xs font-semibold text-error">{item.defects.join(", ")}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 px-6 py-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-1">Scan History</Text>
          <Text className="text-sm text-muted">Your rice quality assessments</Text>
        </View>

        {MOCK_HISTORY.length > 0 ? (
          <FlatList
            data={MOCK_HISTORY}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-muted">No scans yet</Text>
            <Text className="text-sm text-muted mt-2">Start by scanning a rice sample</Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
