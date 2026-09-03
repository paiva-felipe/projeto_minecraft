import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const db = SQLite.openDatabaseSync('craftplanner.db');

export default function AddEditHouseScreen({ route, navigation }) {
  const { house, categoryId } = route.params || {};

  const [name, setName] = useState(house ? house.nome : '');
  const [catId, setCatId] = useState(house ? String(house.categoria_id) : categoryId ? String(categoryId) : '1');
  const [imageUri, setImageUri] = useState(house ? house.imagem_url : '');

  // Garante que a tabela 'construcoes' existe antes de fazer INSERT/UPDATE
  useEffect(() => {
    try {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS construcoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoria_id INTEGER NOT NULL,
          nome TEXT NOT NULL,
          imagem_url TEXT
        );
      `);
    } catch (error) {
      console.error('Erro ao inicializar tabela de construcoes:', error);
    }
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome da construção.');
      return;
    }

    const parsedCatId = parseInt(catId, 10) || 1;

    try {
      if (house) {
        // UPDATE
        db.runSync(
          'UPDATE construcoes SET nome = ?, categoria_id = ?, imagem_url = ? WHERE id = ?;',
          [name.trim(), parsedCatId, imageUri.trim(), house.id]
        );
      } else {
        // CREATE
        db.runSync(
          'INSERT INTO construcoes (nome, categoria_id, imagem_url) VALUES (?, ?, ?);',
          [name.trim(), parsedCatId, imageUri.trim()]
        );
      }
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar casa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a construção no banco de dados.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{house ? 'Editar Construção' : 'Nova Construção'}</Text>

      <CustomInput
        label="Nome da Construção"
        value={name}
        onChangeText={setName}
        placeholder="Ex: Casa Moderna de Quartzo"
      />

      <CustomInput
        label="ID da Categoria (1: Moderno, 2: Medieval, 3: Japonesa)"
        value={catId}
        onChangeText={setCatId}
        placeholder="1"
        keyboardType="numeric"
      />

      <CustomInput
        label="URL da Foto do Projeto"
        value={imageUri}
        onChangeText={setImageUri}
        placeholder="https://..."
      />

      <View style={styles.buttonContainer}>
        <CustomButton title="Salvar Casa" variant="primary" onPress={handleSave} />
        <CustomButton title="Cancelar" variant="secondary" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  buttonContainer: { marginTop: 20, gap: 10 },
});