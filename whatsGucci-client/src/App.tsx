import React from 'react';
import {
  BrowserRouter,
  Route,
  Redirect,
  RouteComponentProps,
} from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import ChatRoomScreen from './components/ChatRoomScreen';
import ChatsListScreen from './components/ChatsListScreen';
import ChatCreationScreen from './components/ChatCreationScreen';
import AnimatedSwitch from './components/AnimatedSwitch';
import { withAuth } from './services/auth.service';

const App; React.FC = () => (
  <BrowserRouter> 
    <AnimatedSwitch>
      <Route exact path="/sign-(in|up)" component={AuthScreen}/>
      
    </AnimatedSwitch>
  </BrowserRouter>
);

const redirectToChats = () => <Redirect to="/chats" />;

export default App;