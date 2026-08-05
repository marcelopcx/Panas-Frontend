import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { CardUser, UserProfile } from "@/components/CardUser/CardUser";
import { Header } from "@/components/Header/Header";
import { NotificationDropdown } from "@/components/NotificationDropdown/NotificationDropdown";
import { Text } from "@/components/Themed";
import { useAppTheme } from "@/providers/AppThemeProvider";
import Colors from "@/constants/Colors";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";
const FONT_REGULAR = "AlbertSans_400Regular";

const PEOPLE_DATA: UserProfile[] = [
  {
    id: "1",
    name: "Jhon Doe",
    image: require("../../../assets/images/user1.jpg"),
  },
  {
    id: "2",
    name: "Sofía Vega",
    image: require("../../../assets/images/user2.webp"),
  },
  {
    id: "3",
    name: "Marcos Ruiz",
    image: require("../../../assets/images/user3.jpg"),
  },
];

export default function MeetScreen() {
  const [people, setPeople] = useState<UserProfile[]>(PEOPLE_DATA);
  const [notifVisible, setNotifVisible] = useState(false);
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const toggleNotif = () => {
    setNotifVisible((prev) => !prev);
  };

  const closeNotif = () => {
    setNotifVisible(false);
  };

  const goToNextUser = () => {
    setPeople((prevPeople) => prevPeople.slice(1));
  };

  const handleSwipeLeft = () => {
    console.log("Rechazado");
    goToNextUser();
  };

  const handleSwipeRight = () => {
    console.log("Solicitud enviada");
    goToNextUser();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        logoSource={require("../../../assets/images/logo blue.png")}
        onNotificationPress={toggleNotif}
      />
      <NotificationDropdown visible={notifVisible} onClose={closeNotif} />

      <View style={styles.contentContainer}>
        {people.length > 0 && (
          <View style={styles.heroContainer}>
            <Text style={[styles.heroTitle, { color: colors.text }]}>Conoce gente nueva</Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Descubre personas de forma aleatoria. Desliza o usa los botones
              para enviar una solicitud o pasar al siguiente.
            </Text>
          </View>
        )}

        {people.length > 0 ? (
          <View style={styles.deckContainer}>
            {people.slice(0, 3).map((user, index) => (
              <CardUser
                key={user.id}
                user={user}
                index={index}
                isFirst={index === 0}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconWrap, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)" }]}>
              <FontAwesome name="user-plus" size={48} color={colors.tabIconDefault} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No hay nadie cerca</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Vuelve a intentar más tarde para encontrar nuevas personas.
            </Text>
          </View>
        )}

        {people.length > 0 && (
          <View style={styles.instructionsContainer}>
            <View style={[
              styles.instructionsCard,
              isDark && styles.instructionsCardDark
            ]}>
              <TouchableOpacity
                style={styles.instructionRow}
                onPress={handleSwipeLeft}
                activeOpacity={0.7}
              >
                <View style={[styles.instructionIconSoft, { backgroundColor: isDark ? "rgba(100, 116, 139, 0.15)" : "rgba(100, 116, 139, 0.1)" }]}>
                  <FontAwesome
                    name="angle-double-left"
                    size={16}
                    color={colors.textSecondary}
                  />
                </View>
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  No me interesa
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: isDark ? "rgba(100, 116, 139, 0.2)" : "rgba(100, 116, 139, 0.15)" }]} />

              <TouchableOpacity
                style={styles.instructionRow}
                onPress={handleSwipeRight}
                activeOpacity={0.7}
              >
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  Enviar solicitud
                </Text>
                <View style={[styles.instructionIconPrimary, { backgroundColor: isDark ? "rgba(100, 116, 139, 0.15)" : "rgba(100, 116, 139, 0.1)" }]}>
                  <FontAwesome
                    name="angle-double-right"
                    size={16}
                    color={colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 18,
    paddingHorizontal: 18,
  },
  heroContainer: {
    width: "100%",
    maxWidth: 420,
    marginTop: 10,
    marginBottom: 18,
    alignItems: "center",
  },
  heroTitle: {
    marginTop: 12,
    fontSize: 26,
    lineHeight: 31,
    fontFamily: FONT_SEMIBOLD,
    textAlign: "center",
  },
  heroSubtitle: {
    marginTop: 8,
    maxWidth: 340,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT_REGULAR,
    textAlign: "center",
  },
  deckContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
    flex: 1,
  },
  emptyIconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONT_SEMIBOLD,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    textAlign: "center",
  },
  instructionsContainer: {
    width: "100%",
    maxWidth: 420,
    marginTop: 14,
    alignSelf: "center",
  },
  instructionsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  instructionsCardDark: {
    backgroundColor: "rgba(30,41,59,0.9)",
    borderColor: "rgba(51,65,85,0.4)",
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
    backgroundColor: "transparent",
  },
  instructionIconSoft: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionIconPrimary: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 1,
    height: 28,
    marginHorizontal: 10,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: FONT_SEMIBOLD,
    textAlign: "center",
  },
});
