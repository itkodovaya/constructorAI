import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProjectsScreen } from './src/screens/ProjectsScreen';
import { ProjectDetailScreen } from './src/screens/ProjectDetailScreen';
import { EditorScreen } from './src/screens/EditorScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4f46e5' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Projects"
          component={ProjectsScreen}
          options={{ title: 'ConstructorAI' }}
        />
        <Stack.Screen
          name="ProjectDetail"
          component={ProjectDetailScreen}
          options={({ route }: any) => ({ title: route.params.name })}
        />
        <Stack.Screen
          name="Editor"
          component={EditorScreen}
          options={({ route }: any) => ({ title: `Edit: ${route.params.name}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

