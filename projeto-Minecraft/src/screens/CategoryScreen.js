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
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Moderno', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReICUGZ2Z3t2csGpuhxf74kK2E2Bj8qFf14w5UhORhoZIgcW-rloYpO3NC&s=10');");
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Medieval', 'https://i.pinimg.com/736x/16/37/97/1637978bb73a4a1d053fd1be033545ce.jpg');");
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Japonesa', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpAReRVn91-AN2I39EKK7LhEVsTCxt4V9TrWgBaIIe5gCAUgeen22uS7s&s=10');");
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Steampunk', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXq3Hmd7rv5QaPBrhMPI6AErLoxPi0phYSnW6n6g7H19KRmtDpuIG89Ck&s=10')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Cyberpunk', 'https://i.pinimg.com/736x/da/03/e0/da03e0d8e71550736183407a97611bad.jpg')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Árabe', 'https://i.pinimg.com/736x/05/bc/37/05bc372f2164b64ce42ecfaf5bbb8ac7.jpg')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Viking', 'https://i.ytimg.com/vi/NuUnXDzc8cw/maxresdefault.jpg')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Gótico', 'https://i.pinimg.com/1200x/45/39/1b/45391b0cd0f4caa0f55550d07cc63e0f.jpg')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Industrial', 'https://i.pinimg.com/736x/6b/f2/40/6bf24071786a99bd2878a1e97fad31fe.jpg')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Nether', 'https://i.pinimg.com/736x/d8/d2/6f/d8d26ff98ae9cf81789f904be3f66598.jpg')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Kawaii', 'https://i.ytimg.com/vi/ORKAwrafrX8/maxresdefault.jpg')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES (' Velho Oeste', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQbiIaUVTjVo0N2uz-nkfG2GetywkM_mkvxNDEVfwD9M2dYcdCy')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Fantasia', 'https://i.pinimg.com/1200x/03/93/69/0393697ea3b8623babb41ddafe1d3308.jpg')")
        db.runSync("INSERT INTO categorias (nome, imagem_url) VALUES ('Tropical', 'https://i.pinimg.com/736x/f2/3d/33/f23d337fd82a1d670dcd5499a0229dff.jpg')")
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
          title="Favoritos"
          variant="primary"
          onPress={() => navigation.navigate('FavoritesScreen')}
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