import { Fragment, useState } from "react";
import SideButtons from "../UI/SideButtons";
import HelpListItem from "./HelpListItem";
import HelpAnonimousItem from "./HelpAnonimousItem";
import { Link } from "react-router-dom";
import LocationBar from "./LocationBar";

const dummy_pedidos = [
  {
    id: 1,
    title: "Pagar Contas",
    description: "Preciso de ajuda para pagar compras",
    location: "Rua...",
    type: "Ajuda",
    ownerEmail: "asd@hotmail.com",
    ownerPicture: "",
    ownerFirstName: "Aria",
    ownerLastName: "Silva",
    ownerHelps: 20,
    anonimous: false,
    date: "20-05-21",
  },
  {
    id: 2,
    title: "Preciso de Comida",
    description: "Preciso de ajuda para pagar comer",
    location: "Rua...",
    type: "Ajuda",
    ownerEmail: "ddd@hotmail.com",
    ownerPicture: "",
    ownerFirstName: "Rui",
    ownerLastName: "Gonçalves",
    ownerHelps: 4,
    anonimous: false,
    date: "20-05-21",
  },
  {
    id: 3,
    title: "Ajuda para alimentar cão",
    description: "Preciso de ajuda para dar comida ao meu cão",
    location: "Rua...",
    type: "Ajuda",
    ownerEmail: "bbb@hotmail.com",
    ownerPicture: "",
    ownerFirstName: "Alcina",
    ownerLastName: "Fernandes",
    ownerHelps: 2,
    anonimous: true,
    date: "20-05-21",
  },
];

const dummy_ofertas = [
  {
    id: 1,
    title: "Arroz",
    description: "Tenho 2kg de arroz a oferecer a quem precisar",
    location: "Rua...",
    type: "Ajuda",
    ownerEmail: "asd@hotmail.com",
    ownerPicture: "",
    ownerFirstName: "Aria",
    ownerLastName: "Silva",
    ownerHelps: 20,
    anonimous: false,
    date: "20-05-21",
  },
  {
    id: 2,
    title: "Roupa Criança",
    description: "Ofereço roupa de criança",
    location: "Rua...",
    type: "Ajuda",
    ownerEmail: "ddd@hotmail.com",
    ownerPicture: "",
    ownerFirstName: "Rui",
    ownerLastName: "Gonçalves",
    ownerHelps: 4,
    anonimous: false,
    date: "20-05-21",
  },
  {
    id: 3,
    title: "Ajudo com CV",
    description: "Ajudo a fazer CV a quem precisar",
    location: "Rua...",
    type: "Ajuda",
    ownerEmail: "bbb@hotmail.com",
    ownerPicture: "",
    ownerFirstName: "Alcina",
    ownerLastName: "Fernandes",
    ownerHelps: 2,
    anonimous: true,
    date: "20-05-21",
  },
];

const ListHelps = () => {
  const [showPedidos, setShowPedidos] = useState(true);

  const pedidosHandler = () => {
    setShowPedidos(true);
  };

  const ofertasHandler = () => {
    setShowPedidos(false);
  };

  return (
    <Fragment>
      <h1>Ajudas</h1>
      <SideButtons
        button1="Pedidos"
        button2="Ofertas"
        onClick1={pedidosHandler}
        onClick2={ofertasHandler}
      />
      <LocationBar />
      <ol>
        {showPedidos &&
          dummy_pedidos.map((pedido) => (
            <li key={pedido.id}>
              <Link to={`pedidos/${pedido.id}`}>
                {!pedido.anonimous && (
                  <HelpListItem
                    title={pedido.title}
                    fistName={pedido.firstName}
                    lastName={pedido.lastName}
                    helps={pedido.helps}
                    date={pedido.date}
                    picture={pedido.picture}
                    type={pedido.type}
                    location={pedido.location}
                  />
                )}
                {pedido.anonimous && (
                  <HelpAnonimousItem
                    title={pedido.title}
                    fistName={pedido.firstName}
                    helps={pedido.helps}
                    date={pedido.date}
                    type={pedido.type}
                    location={pedido.location}
                  />
                )}
              </Link>
            </li>
          ))}
        {!showPedidos &&
          dummy_ofertas.map((oferta) => (
            <li key={oferta.id}>
              <Link to={`ofertas/${oferta.id}`}>
                {!oferta.anonimous && (
                  <HelpListItem
                    title={oferta.title}
                    fistName={oferta.firstName}
                    lastName={oferta.lastName}
                    helps={oferta.helps}
                    date={oferta.date}
                    picture={oferta.picture}
                    type={oferta.type}
                    location={oferta.location}
                  />
                )}
                {oferta.anonimous && (
                  <HelpAnonimousItem
                    title={oferta.title}
                    fistName={oferta.firstName}
                    helps={oferta.helps}
                    date={oferta.date}
                    type={oferta.type}
                    location={oferta.location}
                  />
                )}
              </Link>
            </li>
          ))}
      </ol>
    </Fragment>
  );
};

export default ListHelps;
