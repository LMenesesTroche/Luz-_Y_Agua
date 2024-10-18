import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../fireBaseConfig"; // Asegúrate de que esta ruta sea correcta
import "./luz.modules.css";

const Luz = () => {
  // Estados para capturar los valores de los inputs (ahora strings)
  const [medidorMenesesAntes, setMedidorMenesesAntes] = useState("");
  const [medidorMenesesAhora, setMedidorMenesesAhora] = useState("");
  const [medidorTodosAntes, setMedidorTodosAntes] = useState("");
  const [medidorTodosAhora, setMedidorTodosAhora] = useState("");
  const [cuantoDebenPagaMeneses, setCuantoDebenPagaMeneses] = useState("");
  const [cuantoDebenPagaArrayas, setCuantoDebenPagaArrayas] = useState("");
  const [factura, setFactura] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Al cargar la página, obtener el valor anterior de "Medidor Meneses antes"
  useEffect(() => {
    const obtenerDatosAnteriores = async () => {
      const docRef = doc(db, "luzMedidores", "usuario1"); // Cambiado a luzMedidores
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setMedidorMenesesAntes(data.medidorMenesesAhora || "");
        setMedidorTodosAntes(data.medidorTodosAhora || "");
      }
    };

    obtenerDatosAnteriores();
  }, []);

  // Función para calcular la diferencia entre valores
  const calcularDiferencia = () => {
    // Convertimos a números para hacer los cálculos
    const diferenciaMeneses = parseFloat(medidorMenesesAhora) - parseFloat(medidorMenesesAntes);
    const diferenciaTodos = parseFloat(medidorTodosAhora) - parseFloat(medidorTodosAntes);

    const cuantoDebenPagaMenesesRespuesta = parseFloat(
      ((diferenciaMeneses * parseFloat(factura)) / diferenciaTodos).toFixed(2)
    );
    const cuantoDebenPagaArrayasRespuesta = parseFloat(
      (parseFloat(factura) - cuantoDebenPagaMenesesRespuesta).toFixed(2)
    );

    setCuantoDebenPagaMeneses(cuantoDebenPagaMenesesRespuesta);
    setCuantoDebenPagaArrayas(cuantoDebenPagaArrayasRespuesta);
  };

  // Función para confirmar y guardar los datos en Firebase
  const confirmarYGuardar = async () => {
    const userDocRef = doc(db, "luzMedidores", "usuario1"); // Cambiado a luzMedidores

    const data = {
      medidorMenesesAntes: parseFloat(medidorMenesesAntes), // Convertir a número antes de guardar
      medidorTodosAntes: parseFloat(medidorTodosAntes),
      medidorMenesesAhora: parseFloat(medidorMenesesAhora), // Guardamos el valor actual también en el historial
      medidorTodosAhora: parseFloat(medidorTodosAhora), // Guardamos el valor actual también en el historial
      factura: parseFloat(factura), // Convertir a número
      cuantoDebenPagaMeneses,
      cuantoDebenPagaArrayas,
    };

    try {
      // Guardar los datos principales
      await setDoc(userDocRef, data);

      // Agregar un registro al historial con la fecha actual
      const historialRef = collection(db, "luzMedidoresHistorial"); // Cambiado a luzMedidoresHistorial
      await addDoc(historialRef, {
        ...data,
        fecha: Timestamp.now(), // Fecha actual
      });

      // Mostrar mensaje de éxito
      setSuccessMessage("Datos guardados exitosamente");

      // Mover los valores de 'ahora' a 'antes'
      // setMedidorMenesesAntes(medidorMenesesAhora);
      // setMedidorTodosAntes(medidorTodosAhora);

      console.log("Datos guardados con éxito en Firebase.");
    } catch (error) {
      console.error("Error al guardar los datos en Firebase: ", error);
    }
  };

  return (
    <div className="container">
      <h1>Pagina de luz</h1>

      <div className="contenedor1">
        <label htmlFor="medidorMenesesAntes">Medidor Meneses antes:</label>
        <input
          type="text" // Cambiado a texto para permitir puntos decimales
          id="medidorMenesesAntes"
          name="medidorMenesesAntes"
          value={medidorMenesesAntes}
          onChange={(e) => setMedidorMenesesAntes(e.target.value)} // Almacenamos como string
        />
      </div>

      <div className="contenedor1">
        <label htmlFor="medidorTodosAntes">Medidor Todos antes:</label>
        <input
          type="text" // Cambiado a texto para permitir puntos decimales
          id="medidorTodosAntes"
          name="medidorTodosAntes"
          value={medidorTodosAntes}
          onChange={(e) => setMedidorTodosAntes(e.target.value)} // Almacenamos como string
        />
      </div>

      <p></p>

      <div className="contenedor1">
        <label htmlFor="medidorMenesesAhora">Medidor Meneses ahora:</label>
        <input
          type="text" // Cambiado a texto para permitir puntos decimales
          id="medidorMenesesAhora"
          name="medidorMenesesAhora"
          value={medidorMenesesAhora}
          onChange={(e) => setMedidorMenesesAhora(e.target.value)} // Almacenamos como string
        />
      </div>

      <div className="contenedor1">
        <label htmlFor="medidorTodosAhora">Medidor Todos ahora:</label>
        <input
          type="text" // Cambiado a texto para permitir puntos decimales
          id="medidorTodosAhora"
          name="medidorTodosAhora"
          value={medidorTodosAhora}
          onChange={(e) => setMedidorTodosAhora(e.target.value)} // Almacenamos como string
        />
      </div>

      <p></p>

      <div className="contenedor1">
        <label htmlFor="factura">Cuanto pide la factura (Bs):</label>
        <input
          type="text" // Cambiado a texto para permitir puntos decimales
          id="factura"
          name="factura"
          value={factura}
          onChange={(e) => setFactura(e.target.value)} // Almacenamos como string
        />
      </div>

      <p></p>
      
      <button onClick={calcularDiferencia}>Calcular Diferencias</button>

      {cuantoDebenPagaMeneses ? (
        <h2>Cuanto deben pagar Meneses: {cuantoDebenPagaMeneses} Bs</h2>
      ) : null}
      {cuantoDebenPagaArrayas ? (
        <h2>Cuanto deben pagar Arrayas: {cuantoDebenPagaArrayas} Bs</h2>
      ) : null}

      {cuantoDebenPagaMeneses && cuantoDebenPagaArrayas && (
        <button onClick={confirmarYGuardar}>Confirmar y Guardar</button>
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}
      <Link to="/historial-luz">Historial de luz</Link>
      <Link to="/">Volver atras</Link>
    </div>
  );
};

export default Luz;
