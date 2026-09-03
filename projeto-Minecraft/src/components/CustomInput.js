// Campo de texto/número padronizado com rótulo (label) e tratamento de erros.
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function CustomInput({ label, value, onChangeText, placeholder, keyboardType = 'default' }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        // Evita que 'undefined' ou 'null' virem texto na caixa de digitação
        value={value !== undefined && value !== null ? String(value) : ''}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#888"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ccc', // Mudo para cinza claro para ser visível no tema escuro (#121212)
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12, // Dá margem suficiente para não cortar o número no topo
    minHeight: 48,       // Mantém a altura correta no Android
    textAlignVertical: 'center', // Centraliza o texto verticalmente para o "0" não parecer "U"
    fontSize: 16,
    color: '#000',
    width: '100%',
  },
});