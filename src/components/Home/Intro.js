import classes from "./Intro.module.css";
import background from "../../img/sourcegif.gif"

const Intro = () => {
  return (
    <div className={classes.containerDiv}>
      <div className={classes.mainImageDiv}>
        <div className={classes.hDiv}>
          <h1 className={classes.hFirst}>Temos um longo caminho pela frente</h1>
          <h1 className={classes.hSecond}>
            ... e finalmente podemos caminhar{" "}
            <span className={classes.juntosTitle}>juntos</span>
          </h1>
        </div>
      </div>

      <div className={classes.mainContent}>
        <p>
          <span className={classes.juntos}>juntos</span> é um projeto que
          procura ajudar após a pandemia SARS-CoV-2.
        </p>
        <p>
          <span className={classes.juntos}>juntos</span> procura incentivar a
          cooperação e entreajuda de todos para todos.
        </p>
        <p>
          Finalmente podemos caminhar{" "}
          <span className={classes.juntos}>juntos</span> para um futuro melhor.
        </p>
      </div>
      <div className={classes.mainVideo}>
        <video width="320" height="240" controls>
          <source src="" type="video/mp4" />O teu browser não suporta video
        </video>
      </div>
    </div>
  );
};

export default Intro;
