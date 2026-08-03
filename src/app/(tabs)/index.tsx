import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { CustomButton } from "@/components/CustomButton/CustomButton";
import { CustomDivider } from "@/components/CustomDivider/CustomDivider";
import { CustomInput } from "@/components/CustomInput/CustomInput";
import { View } from "@/components/Themed";

export default function TabOneScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <CustomInput
          type="image"
          imageUri={profileImage}
          onImagePress={() =>
            setProfileImage("https://via.placeholder.com/150")
          }
        />

        <CustomInput
          label="Correo electrónico"
          placeholder="tucorreo@example.com"
          leftIcon="mail-outline"
          value={email}
          onChangeText={setEmail}
        />

        <CustomInput
          label="Contraseña"
          leftIcon="lock-closed-outline"
          placeholder="********"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <CustomDivider />

        <CustomButton title="Crear Cuenta" disabled={!email || !password} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
});
