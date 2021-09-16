import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";



type FirebaseQuestions = Record<string, {
  //macete pra transformar em array o object q vem do firebase
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

export function useRoom(roomId: string) {

  const { user } = useAuth();

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');


  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => { //sempre q tiver um event listener tem q desinscrever ele no retorno do useeffect/ nesse caso o firebase tem .off pra desligar o listener da func .on
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions  ?? {};
      //macete pra transformar em array o object q vem do firebase
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0], //? = verifica se retornou algo pra ai pegar a pos[0]
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })

    return () => {
      roomRef.off('value'); //remove todos listeners desse ref
    }
  }, [roomId, user?.id]);

  return { questions, title };

}