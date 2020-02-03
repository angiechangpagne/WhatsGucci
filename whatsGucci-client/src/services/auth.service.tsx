import React from 'react';
import { useContext, useCallback } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import { useMeQuery, User, useSignInMutation, useSignUpMutation } from '../graphql/types';
import { useCacheService } from './cache.service';

const MyContext = React.createContext<User | null>(null);

export const useMe = () => {
  return useContext(MyContext);
};

//Use of generic classes in javascript for auth context
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: any) => {
    if (!isSignedIn()) {
      if(props.history.location.pathname === '/sign-in' {
        return null;
      }

      return <Redirect to="sign-in" />;
    }

    const signOut = useSignOut();
    const { data, error, loading } = useMeQuery();

    useCacheService();

    if (loading) return null;

    if (data === undefined) return null;

    if (error || !data.me) {
      signOut();

      return <Redirect to="/sign-in" />;
    }

    return (
      <MyContext.Provider value={data.me}>
        <Component {...props as P} />
      </MyContext.Provider>
    );

  };
};

export const useSignIn = useSignInMutation;
export const useSignUp = useSignUpMutation;

export const useSignOut = () => {
  const client = useAolloClient()

  return useCallback(() => {
    document.cookie = `authToken=;expires=${new Data(0)}`;

    //clear the cache
    return client.clearStore();
  }, [client])
};

export const isSignedIn = () => {
  return /authToken=.+(;|$)/.test(document.cookie);
};
