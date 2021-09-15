// import { database } from '../services/firebase';
import { useParams } from 'react-router';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';
import '../styles/room.scss';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Link } from 'react-router-dom';



type FirebaseQuestions = Record<string, {
  //macete pra transformar em array o object q vem do firebase
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

type RoomParams = {
  id: string;
}




export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  const roomId = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => { 
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
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      console.log(parsedQuestions)
    })
  }, [roomId]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === ''){
      return;
    }
    if (!user){
      throw new Error ('Você deve estar logado para fazer uma pergunta.')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }


  return (
    // <h1>{database.ref(`/rooms/${roomC}`)}</h1>
    <div id="page-room">
      <header >
        <div className="content">
          <Link to="/"><img className="logo-room" src={logoImg} alt="Logotipo" /></Link> 
          <RoomCode code={params.id}/>
        </div>
      </header>

      <main>
        <div className="room-title">
          <span>Assunto:</span>
          <h1>{title}</h1>

          { questions.length === 1 ? 
            <span>{questions.length} pergunta</span>
          : questions.length > 1 ?
            <span>{questions.length} perguntas</span>
          : <span>Ainda não há perguntas</span>
          }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta <button>faça seu login</button></span>
            )}    
            <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  );
}