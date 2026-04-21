import { Text, View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function ScanScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to results modal or new screen
      // For now, navigate back to home
      router.push("/(tabs)");
    }, 2000);
  };

  const handleRetake = () => {
    setSelectedImage(null);
  };

  if (selectedImage) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 px-6 py-8 gap-6">
          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-foreground">Preview</Text>
            <Text className="text-sm text-muted">Confirm your rice sample image</Text>
          </View>

          <View className="flex-1 items-center justify-center bg-surface rounded-2xl overflow-hidden border-2 border-primary">
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          </View>

          {isProcessing ? (
            <View className="items-center gap-3 py-6">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-sm text-muted">Analyzing rice quality...</Text>
            </View>
          ) : (
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleProcessImage}
                style={{ backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12 }}
                activeOpacity={0.85}
              >
                <Text className="text-center font-semibold text-white text-base">
                  ✓ Confirm & Analyze
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRetake}
                className="bg-surface border border-border py-4 rounded-lg active:opacity-70"
              >
                <Text className="text-center font-semibold text-foreground text-base">
                  ✕ Retake Photo
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 px-6 py-8 gap-8 items-center justify-center">
        <View className="items-center gap-4">
          <Text className="text-5xl">📸</Text>
          <Text className="text-2xl font-bold text-foreground text-center">Scan Rice Sample</Text>
          <Text className="text-sm text-muted text-center leading-relaxed">
            Position rice grains on a white background for best results
          </Text>
        </View>

        <View className="w-full gap-4 mt-8">
          <TouchableOpacity
            onPress={handleTakePhoto}
            style={{ backgroundColor: colors.primary, paddingVertical: 18, borderRadius: 12 }}
            activeOpacity={0.85}
          >
            <Text className="text-center font-bold text-white text-base">📷 Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePickImage}
            className="bg-surface border border-border py-5 rounded-lg active:opacity-70"
          >
            <Text className="text-center font-semibold text-foreground text-base">
              📁 Choose from Gallery
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-12 bg-surface rounded-xl p-4 border border-border w-full">
          <Text className="text-xs font-semibold text-foreground mb-2">💡 Tips for best results:</Text>
          <View className="gap-2">
            <Text className="text-xs text-muted">• Use natural lighting or bright room light</Text>
            <Text className="text-xs text-muted">• Place rice on a clean white background</Text>
            <Text className="text-xs text-muted">• Ensure rice grains are clearly visible</Text>
            <Text className="text-xs text-muted">• Take a clear, focused photo</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
