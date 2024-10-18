import { Link } from "react-router-dom";

const Landing = () => {


    return (
      <div>
        <h1>¿Que te gustaria calcular?</h1>
        <Link to="/agua">Agua</Link>
        <p></p>
        <Link to="/luz">Luz</Link>
      </div>
    );
  };
  
  export default Landing;
  