import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { HeaderMessage } from "@components/HeaderMessage/HeaderMessage";
import { Message } from "@components/Message/Message";
import { MessageContainer } from "@components/MessageContainer/MessageContainer";
import { ShowImageChatModal } from "@components/ShowImageMessage/ShowImageMessage";
import { useAppTheme } from "@/providers/AppThemeProvider";
import Colors from "@/constants/Colors";

const INITIAL_MESSAGES = [
  {
    id: "1",
    text: "El que abre mucho la boca busca que se la rompan",
    time: "10:30pm",
    isMine: false,
  },
  {
    id: "2",
    text: "El que abre mucho la boca busca que se la rompan",
    time: "10:35pm",
    isMine: true,
  },
  {
    id: "3",
    image: require("../../assets/images/user1.jpg"),
    time: "10:36pm",
    isMine: false,
  },
  {
    id: "4",
    image: require("../../assets/images/user2.webp"),
    time: "10:38pm",
    isMine: true,
  },
];

const AVATAR_MAP = {
  user1: require("../../assets/images/user1.jpg"),
  user2: require("../../assets/images/user2.webp"),
  user3: require("../../assets/images/user3.jpg"),
};

export default function MessageScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    updatedAt?: string;
    avatarId?: keyof typeof AVATAR_MAP;
  }>();

  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const name = params.name ?? "Jhon Doe";
  const avatarSource = AVATAR_MAP[params.avatarId ?? "user1"];

  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [messageText, setMessageText] = useState("");
  const [composerBottom, setComposerBottom] = useState(0);

  const [composerHeight, setComposerHeight] = useState(80);

  const [selectedImage, setSelectedImage] = useState<{
    source: any;
    time: string;
  } | null>(null);

  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 100);
  };

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      const keyboardHeight = event.endCoordinates?.height ?? 0;
      setComposerBottom(keyboardHeight + insets.bottom);
      scrollToBottom(false);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setComposerBottom(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom]);

  const getCurrentTime = () => {
    return new Date()
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      .toLowerCase();
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      time: getCurrentTime(),
      isMine: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      const newMessage = {
        id: Date.now().toString(),
        image: { uri: result.assets[0].uri },
        time: getCurrentTime(),
        isMine: true,
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permisos requeridos",
        "Se necesitan permisos de cámara para tomar fotos.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      const newMessage = {
        id: Date.now().toString(),
        image: { uri: result.assets[0].uri },
        time: getCurrentTime(),
        isMine: true,
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const handleOpenImage = (imageSource: any, time: string) => {
    setSelectedImage({ source: imageSource, time });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <HeaderMessage
        name={name}
        avatarSource={avatarSource}
        subtitle={params.updatedAt}
      />

      <View style={styles.keyboardContainer}>
        <ImageBackground
          source={
            isDark
              ? require("../../assets/images/background_dark.png")
              : require("../../assets/images/background white.png")
          }
          style={[styles.chatBackground, { backgroundColor: colors.background }]}
          imageStyle={{ opacity: 0.15 }}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Message
                text={item.text}
                image={item.image}
                time={item.time}
                isMine={item.isMine}
                onPressImage={handleOpenImage}
              />
            )}
            onContentSizeChange={() => scrollToBottom(true)}
            onLayout={() => scrollToBottom(false)}
            contentContainerStyle={[styles.listContent, { paddingBottom: 16 }]}
            style={[
              styles.list,
              { marginBottom: composerBottom + composerHeight },
            ]}
          />

          <View
            style={[styles.composerWrapper, { bottom: composerBottom }]}
            onLayout={(e) => setComposerHeight(e.nativeEvent.layout.height)}
          >
            <MessageContainer
              value={messageText}
              onChangeText={setMessageText}
              onSend={handleSendMessage}
              onPickImage={handlePickImage}
              onTakePhoto={handleTakePhoto}
            />
          </View>
        </ImageBackground>
      </View>

      <ShowImageChatModal
        visible={!!selectedImage}
        imageSource={selectedImage?.source ?? null}
        time={selectedImage?.time}
        onClose={() => setSelectedImage(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  chatBackground: {
    flex: 1,
    position: "relative",
  },
  listContent: {
    paddingTop: 8,
  },
  composerWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
});
