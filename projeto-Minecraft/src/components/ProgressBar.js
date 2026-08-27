//Uma barra visual (0% a 100%) que calcula o progresso geral da construção com base nos blocos coletados.

import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ progress }) {
  // Garante que o progresso fique entre 0 e 100
  const validProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${validProgress}%` }]} />
      </View>
      <Text style={styles.text}>{validProgress.toFixed(0)}% Concluído</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  track: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#28a745', // Cor verde estilo Minecraft
  },
  text: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
});