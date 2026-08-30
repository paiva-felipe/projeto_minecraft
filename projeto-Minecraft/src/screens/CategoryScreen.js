//Tela inicial com a lista de estilos (Moderno, Medieval, Redstone)


import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import CategoryCard from '../components/CategoryCard';
import CustomButton from '../components/CustomButton';

const db = SQLite.openDatabaseSync('craftplanner.db');

export default function CategoryScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  // Carrega as categorias do SQLite sempre que a tela ganha foco
  const loadCategories = () => {
    try {
      // Cria a tabela se não existir e insere dados padrão se estiver vazia
      db.execSync(`
        CREATE TABLE IF NOT EXISTS categorias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          imagem_url TEXT
        );
      `);

      let result = db.getAllSync('SELECT * FROM categorias;');

      // Se o banco estiver limpo, popula com estilos padrão
      if (result.length === 0) {
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Moderno', 'https://i.redd.it/n6l6pojysy1b1.jpg');");
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Medieval', 'https://i.pinimg.com/736x/16/37/97/1637978bb73a4a1d053fd1be033545ce.jpg');");
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Japonesa', 'https://i.pinimg.com/736x/ac/11/d3/ac11d3537ab589280fff19254a152883.jpg');");
        result = db.getAllSync('SELECT * FROM categorias;');
      }

      setCategories(result);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Estilos Arquitetônicos</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard
            title={item.nome}
            imageUri={item.imagem_url}
            onPress={() =>
              navigation.navigate('HouseListScreen', {
                categoryId: item.id,
                categoryName: item.nome,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          title="+ Cadastrar Nova Casa"
          variant="primary"
          onPress={() => navigation.navigate('AddEditHouseScreen')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  headerTitle: { fontFamily: 'MinecraftFont', fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  listContainer: { paddingBottom: 16 },
  buttonContainer: { marginTop: 8 },
});