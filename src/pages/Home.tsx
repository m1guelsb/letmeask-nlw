import { useHistory } from 'react-router-dom'
import { database } from '../services/firebase';

import { useAuth } from '../hooks/useAuth'

import { FormEvent, useState } from 'react'

import { Button } from '../components/Button';

import '../styles/auth.scss';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'






export function Home() {

  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom(){
    if (!user) {
      await signInWithGoogle()
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) { //entrar em uma sala
    event.preventDefault();

    if (roomCode.trim() === '') { //se o valor de roomCode passado no input for vazio
      return; //retorna nulo
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get() //pega de dentro de rooms a sala com o código passado no input
    if (!roomRef.exists()) { //se !nao existir tal sala com tal codigo
      alert('Room does not exist.');
      return;
    }//se existe:
    
    history.push(`/rooms/${roomCode}`); //redireciona para o id da sala

  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" /> 
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask logo" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Google logo" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}