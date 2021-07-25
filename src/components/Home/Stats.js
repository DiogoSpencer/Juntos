import classes from "./Stats.module.css"

const Stats = (props) => {
  return (
    <div className={classes.mainStats}>
      <h1 className={classes.mainTitleStats}>
        O Que Significa <span className={classes.juntosTitle}>juntos</span>?
      </h1>
      <div className={classes.parceirosStats}>
        <h1 className={classes.numberStats}>{props.numPartner}</h1>
        <h3 className={classes.titleStats}>Parceiros</h3>
        <p className={classes.textStats}>
          <span className={classes.juntos}>juntos</span> com os nossos parceiros caminhamos para um futuro
          melhor<br/><br/></p>
      </div>
      <div className={classes.ajudasStats}>
        <h1 className={classes.numberStats}>{props.totalNumHelps}</h1>
        <h3 className={classes.titleStats}>Ajudas</h3>
        <p className={classes.textStats}>
          <span className={classes.juntos}>juntos</span> os nossos heróis já realizaram <span>10.000</span>{" "}
          ajudas e ainda agora começámos!</p>
      </div>
      <div className={classes.heroisStats}>
        <h1 className={classes.numberStats}>{props.numHeroes}</h1>
        <h3 className={classes.titleStats}>Heróis</h3>
        <p className={classes.textStats}>
          já caminhamos <span className={classes.juntos}>juntos</span> com <span>30.000</span> heróis do
          dia a dia<br/><br/></p>
      </div>
    </div>
  );
};

//TODO: Operacao para ir buscar estatisticas - numero de parceiros registados + 
//numero total de ajudas + numero total utilizadores registados
//fazer aqui dentro se calhar? vs fazer em home

export default Stats;
