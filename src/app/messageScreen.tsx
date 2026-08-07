import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import {
  ApiError,
  enviarImagenChat,
  enviarMensaje,
  listMensajes,
  marcarChatLeido,
} from "@/services/api";
import type { Mensaje } from "@/types/api";
import { avatarSource, formatMessageTime } from "@/utils/format";

type UiMessage = {
  id: string;
  text?: string;
  image?: { uri: string };
  time: string;
  isMine: boolean;
};

function toUiMessage(msg: Mensaje, myId: number | undefined): UiMessage {
  return {
    id: String(msg.id_mensaje),
    text: msg.contenido ?? undefined,
    image: msg.url_imagen ? { uri: msg.url_imagen } : undefined,
    time: formatMessageTime(msg.fecha_envio),
    isMine: myId != null && msg.id_remitente === myId,
  };
}

export default function MessageScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    updatedAt?: string;
    avatarUrl?: string;
  }>();

  const { colorScheme } = useAppTheme();
  const { user } = useAuth();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const chatId = Number(params.id);
  const name = params.name ?? "Chat";
  const avatar = avatarSource(params.avatarUrl);

  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
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

  const loadMessages = useCallback(async () => {
    if (!chatId || Number.isNaN(chatId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const items = await listMensajes(chatId);
      // API returns newest first → reverse for chat UI
      const ordered = [...items].reverse();
      setMessages(ordered.map((m) => toUiMessage(m, user?.id_usuario)));
      await marcarChatLeido(chatId);
      scrollToBottom(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudieron cargar los mensajes.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }, [chatId, user?.id_usuario]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

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

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chatId || sending) return;
    const text = messageText.trim();
    setMessageText("");
    setSending(true);
    try {
      const msg = await enviarMensaje(chatId, text);
      setMessages((prev) => [...prev, toUiMessage(msg, user?.id_usuario)]);
      scrollToBottom(true);
    } catch (error) {
      setMessageText(text);
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo enviar el mensaje.";
      Alert.alert("Error", message);
    } finally {
      setSending(false);
    }
  };

  const sendImage = async (uri: string) => {
    if (!chatId || sending) return;
    setSending(true);
    try {
      const result = await enviarImagenChat(chatId, uri);
      setMessages((prev) => [
        ...prev,
        toUiMessage(result.mensaje, user?.id_usuario),
      ]);
      scrollToBottom(true);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo enviar la imagen.";
      Alert.alert("Error", message);
    } finally {
      setSending(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].uri) {
      await sendImage(result.assets[0].uri);
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
      await sendImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <HeaderMessage
        name={name}
        avatarSource={avatar}
        subtitle={params.updatedAt}
      />

      <View style={styles.keyboardContainer}>
        <ImageBackground
          source={
            isDark
              ? require("../../assets/images/background_dark.png")
              : require("../../assets/images/background white.png")
          }
          style={[
            styles.chatBackground,
            { backgroundColor: colors.background },
          ]}
          imageStyle={{ opacity: 0.15 }}
        >
          {loading ? (
            <ActivityIndicator
              color={colors.tint}
              style={{ marginTop: 40 }}
            />
          ) : (
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
                  onPressImage={(imageSource, time) =>
                    setSelectedImage({ source: imageSource, time })
                  }
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
          )}

          <View
            style={[styles.composerWrapper, { bottom: composerBottom }]}
            onLayout={(e) => setComposerHeight(e.nativeEvent.layout.height)}
          >
            <MessageContainer
              value={messageText}
              onChangeText={setMessageText}
              onSend={() => void handleSendMessage()}
              onPickImage={() => void handlePickImage()}
              onTakePhoto={() => void handleTakePhoto()}
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
  safeArea: { flex: 1 },
  keyboardContainer: { flex: 1 },
  chatBackground: { flex: 1, position: "relative" },
  listContent: { paddingTop: 8 },
  composerWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingBottom: 8,
  },
  list: { flex: 1 },
});
