
import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importação das Telas da pasta src/screens/
import CategoryScreen from './src/screens/CategoryScreen';
import HouseListScreen from './src/screens/HouseListScreen';
import HouseDetailScreen from './src/screens/HouseDetailScreen';
import AddEditHouseScreen from './src/screens/AddEditHouseScreen';
import AddEditBlockScreen from './src/screens/AddEditBlockScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // Carrega a fonte salva em assets/fonts/
  const [fontsLoaded] = useFonts({
  'MinecraftFont': require('./assets/fonts/Minecraft.ttf'),
  });

  // Aguarda o carregamento da fonte antes de renderizar a interface
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Stack.Navigator
        initialRouteName="CategoryScreen"
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#55FF55', // Cor verde Minecraft no botão de voltar
          headerTitleStyle: {
            fontFamily: 'MinecraftFont', // Aplica a fonte nos títulos do topo
            color: '#FFFFFF',
          },
        }}
      >
        <Stack.Screen 
          name="CategoryScreen" 
          component={CategoryScreen} 
          options={{ title: 'CraftPlanner' }} 
        />
        <Stack.Screen 
          name="HouseListScreen" 
          component={HouseListScreen} 
          options={{ title: 'Modelos' }} 
        />
        <Stack.Screen 
          name="HouseDetailScreen" 
          component={HouseDetailScreen} 
          options={{ title: 'Blocos' }} 
        />
        <Stack.Screen 
          name="AddEditHouseScreen" 
          component={AddEditHouseScreen} 
          options={{ title: 'Projeto' }} 
        />
        <Stack.Screen 
          name="AddEditBlockScreen" 
          component={AddEditBlockScreen} 
          options={{ title: 'Material' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}