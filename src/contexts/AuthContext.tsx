import { createContext, ReactNode, useEffect, useState } from "react";
import { firebase, auth } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode; //quando o children é um componente seu tipo é ReactNode
}


export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider (props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const { displayName, photoURL, uid} = user
        if(!displayName || !photoURL){
          throw new Error('Conta Google incompleta (sem foto ou nome).');
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => { //toda vez que declarar um eventlistener (onAuthStateChanged)
      unsubscribe(); //deve desativar tal event
    }

  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider)
    if(result.user) {
      const { displayName, photoURL, uid} = result.user
      if(!displayName || !photoURL){
        throw new Error('Conta Google incompleta (sem foto ou nome).');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

   

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}