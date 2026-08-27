//Botão estilizado reaproveitável (ex: botões de Salvar, Excluir, Adicionar). Em todas as telas

import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress, variant = 'primary' }) {
  // Define a cor de fundo com base na prop variant
  const getBackgroundColor = () => {
    switch (variant) {
      case 'danger': return '#dc3545';
      case 'secondary': return '#6c757d';
      case 'primary':
      default: return '#4CAF50'; // Verde principal do CraftPlanner
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: getBackgroundColor() }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});