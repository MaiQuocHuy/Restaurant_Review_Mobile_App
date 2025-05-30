import React from 'react';
import Navigators from './src/navigators';
import 'react-native-gesture-handler';
import {UserLocationProvider} from './src/contexts/userLocationContext';
import {
  DataGlobalProvider,
  DataUserGlobalProvider,
} from './src/contexts/dataUserGlobalContext';
import {UserProvider} from './src/contexts/userContext';
import {DataOwnresGlobalProvider} from './src/contexts/dataOwnresGlobalContext';
import {LogBox} from 'react-native';
LogBox.ignoreAllLogs();
export default function App() {
  return (
    <UserLocationProvider>
      <UserProvider>
        <DataOwnresGlobalProvider>
          <DataUserGlobalProvider>
            <Navigators />
          </DataUserGlobalProvider>
        </DataOwnresGlobalProvider>
      </UserProvider>
    </UserLocationProvider>
  );
}
