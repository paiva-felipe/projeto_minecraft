import React, { useState } from 'react';
import { View, Text, Image, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Lista de blocos disponíveis para escolha
const LISTA_DE_BLOCOS = [
  { id: '1', name: 'Concreto Branco', imageUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_oczNOaoW2mLqHShzZTxPeD__grSYq2EEcTgMNW5w0Q&s=10' },
  { id: '2', name: 'Tábua de Carvalho', imageUri: 'https://minecraft.wiki/images/Oak_Planks.png' },
  { id: '3', name: 'Pedregulho', imageUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuw8u5wl6nvdcn_vQ_foDW-GvFV0X4kroeVqrAmhwMOg&s=10' },
  { id: '4', name: 'Bloco de Quartzo', imageUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAA5zYPnODEVwxCW_tQ_-IK2k-VAwNIk2stM52WaMdw&s=10' },
  { id: '5', name: 'Tabua de Cerejeira', imageUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxGN4bJ5yPzHvpgGiVW1SnT7y1l1uGQGd-cd8La4bFOQ&s=10' },
  { id: '6', name: 'Grama', imageUri: 'https://cdn.pixabay.com/photo/2016/11/11/14/49/minecraft-1816996_960_720.png' },
  { id: '7', name: 'Tijolo', imageUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDjIB33yrshEExJ9bLBWoBkcs1gDjjoN9B4MA4Tzz_Ag&s' },
  { id: '8', name: 'Terra', imageUri: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/9b/Dirt_JE2_BE2.png/revision/latest?cb=20200309195232' },
];

export default function SeletorBloco({ blocoSelecionado, onSelect }) {
  const [modalVisible, setModalVisible] = useState(false);

  const selecionar = (item) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Bloco</Text>
      
      <TouchableOpacity style={styles.campoSeletor} onPress={() => setModalVisible(true)}>
        {blocoSelecionado ? (
          <View style={styles.linhaItem}>
            <Image source={{ uri: blocoSelecionado.imageUri }} style={styles.foto} />
            <Text style={styles.textoItem}>{blocoSelecionado.name}</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>Ex: Concreto Branco, Tábua de Carvalho...</Text>
        )}
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.fundoModal} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.caixaOpcoes}>
            <Text style={styles.tituloModal}>Selecione um Bloco</Text>
            <FlatList
              data={LISTA_DE_BLOCOS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.opcao} onPress={() => selecionar(item)}>
                  <Image source={{ uri: item.imageUri }} style={styles.fotoModal} />
                  <Text style={styles.textoOpcao}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { color: '#aaa', fontSize: 12, marginBottom: 4 },
  campoSeletor: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    height: 48,
  },
  placeholder: { color: '#888' },
  linhaItem: { flexDirection: 'row', alignItems: 'center' },
  foto: { width: 24, height: 24, marginRight: 10 },
  textoItem: { color: '#000', fontWeight: 'bold' },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  caixaOpcoes: {
    backgroundColor: '#222',
    borderRadius: 8,
    maxHeight: 300,
    padding: 16,
  },
  tituloModal: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  fotoModal: { width: 30, height: 30, marginRight: 12 },
  textoOpcao: { color: '#fff', fontSize: 16 },
});