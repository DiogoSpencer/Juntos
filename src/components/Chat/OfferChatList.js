import { Link } from 'react-router-dom'
import ChatItem from './ChatItem'

const offerChat = [
    {id: 1,
    title: "dar comida ao gato",
    status: "active",
    userEmail: "asd@hotmail.com",
    userFistName: "dan",
    userLastName: "sss",
    ownerEmail: "ddd@hotmail.com"
    }
]
//falta foto, data etc...
//quando clica vai estabelecer a conexao websocket e vai buscar o historico de mensagens

const OfferChatList = () => {
    return (
        <div>
            <ol>
            {offerChat.map((offer) => (
                <li key={offer.id}>
                    <Link to={`chats/ofertas/${offer.id}`}>
                        <ChatItem title={offer.title} status={offer.status} name={offer.userFistName + " " + offer.userLastName}/>
                    </Link>
                </li>
            ))}
            </ol>
        </div>
    )
}

export default OfferChatList