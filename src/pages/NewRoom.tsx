import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';

import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { database } from '../services/firebase';

export function NewRoom() {
  const { user } = useAuth()
  const history = useHistory()

  const [newRoom, setNewRoom] = useState('')

  async function handleCreateRoom(event: FormEvent) { //criar nova sala
    event.preventDefault();
  
    if (newRoom.trim() === '') { //se o valor de newRoom passado no input for vazio
      return; //retorna nulo
    }
    //else:
    const roomRef = database.ref('rooms'); //coleta uma ref do grupo 'rooms' do db

    const firebaseRoom = await roomRef.push({ //empurra pra tal grupo uma room
      title: newRoom, //com o titulo passando no input
      authorId: user?.id, //e com o id do usuario que enviou tal input
    })

    history.push(`/rooms/${firebaseRoom.key}`) //redireciona para o id da sala
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
          <h1>{user && `Olá ${user?.name}`}</h1>
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}