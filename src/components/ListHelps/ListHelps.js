import { Fragment, useState } from "react";
import SideButtons from "../UI/SideButtons";

const ListHelps = () => {
  const dummy_pedidos = [
    {
      pedidoID: 1,
      pedidoTitle: "Pagar Contas",
      pedidoDescription: "Preciso de ajuda para pagar compras",
      pedidoLocation: "Rua...",
      pedidoType: "Ajuda",
      pedidoOwnerEmail: "asd@hotmail.com",
      pedidoOwnerPicture: "",
      pedidoOwnerName: "Aria",
      pedidoOwnerLastName: "Silva",
      pedidoOwnerHelps: 20,
      pedidoAnonimous: false,
      pedidoDate: "20-05-21",
    },
    {
      pedidoID: 2,
      pedidoTitle: "Preciso de Comida",
      pedidoDescription: "Preciso de ajuda para pagar comer",
      pedidoLocation: "Rua...",
      pedidoType: "Ajuda",
      pedidoOwnerEmail: "ddd@hotmail.com",
      pedidoOwnerPicture: "",
      pedidoOwnerFirstName: "Rui",
      pedidoOwnerLastName: "Gonçalves",
      pedidoOwnerHelps: 4,
      pedidoAnonimous: false,
      pedidoDate: "20-05-21",
    },
    {
      pedidoID: 3,
      pedidoTitle: "Ajuda para alimentar cão",
      pedidoDescription: "Preciso de ajuda para dar comida ao meu cão",
      pedidoLocation: "Rua...",
      pedidoType: "Ajuda",
      pedidoOwnerEmail: "bbb@hotmail.com",
      pedidoOwnerPicture: "",
      pedidoOwnerFirstName: "Alcina",
      pedidoOwnerLastName: "Fernandes",
      pedidoOwnerHelps: 2,
      pedidoAnonimous: true,
      pedidoDate: "20-05-21",
    },
  ];

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
        buttons2="Ofertas"
        onClick1={pedidosHandler}
        onClick2={ofertasHandler}
      />
      <div>Barra Localização - TODO</div>

    </Fragment>
  );
};

export default ListHelps;
