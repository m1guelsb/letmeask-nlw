// import { database } from '../services/firebase';
import { useHistory, useParams } from 'react-router';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'
import '../styles/room.scss';

// import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';






type RoomParams = {
  id: string;
}


export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory()

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId)


  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date()
      })
    }
    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }



  return (
    // <h1>{database.ref(`/rooms/${roomC}`)}</h1>
    <div id="page-room">
      <header >
        <div className="content">
          <Link to="/"><img className="logo-room" src={logoImg} alt="Logotipo" /></Link> 
          <div>
            <RoomCode code={params.id}/>
            <Button 
              isOutlined 
              onClick={handleEndRoom}
            >
              Encerrar Sala
            </Button>
          </div>
          
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


        <div className="question-list">
          {questions.map(question => {
            return (
              <Question 
                key={question.id}
                author={question.author}
                content={question.content}
              >

                <button 
                type = "button"
                onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
        
      </main>
    </div>
  );
}