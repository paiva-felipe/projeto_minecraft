// Card com foto, nome, categoria, favorito e botões de ação.

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function HouseCard({
  title,
  imageUri,
  category,
  isFavorite = false,
  onToggleFavorite,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <View style={styles.card}>
      {/* Imagem, informações e botão de favorito */}
      <View style={styles.mediaContainer}>
        <TouchableOpacity onPress={onView} activeOpacity={0.8}>
          <Image source={{ uri: imageUri }} style={styles.image} />

          <View style={styles.infoContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.category}>{category}</Text>
          </View>
        </TouchableOpacity>

        {/* Botão de favorito */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
          activeOpacity={0.7}
        >
          <Text
            style={
              isFavorite
                ? styles.favoriteActive
                : styles.favoriteInactive
            }
          >
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botões de ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.btnEdit]}
          onPress={onEdit}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.btnDelete]}
          onPress={onDelete}
        >
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 4,
  },

  // Permite posicionar a estrela sobre a imagem
  mediaContainer: {
    position: 'relative',
  },

  image: {
    width: '100%',
    height: 150,
  },

  infoContainer: {
    padding: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },

  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Botão circular no canto superior direito da imagem
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  favoriteInactive: {
    color: '#fff',
    fontSize: 28,
  },

  favoriteActive: {
    color: '#ffd700',
    fontSize: 28,
  },

  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  button: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },

  btnEdit: {
    backgroundColor: '#f8f9fa',
  },

  btnDelete: {
    backgroundColor: '#ffe6e6',
  },

  btnText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
