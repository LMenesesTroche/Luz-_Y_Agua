import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../../fireBaseConfig"; // Asegúrate de que esta ruta sea correcta
import { Link } from "react-router-dom";
import "./historialLuz.modules.css"; // Archivo CSS para estilizar la tabla y botones

const HistorialAgua = () => {
  const [historial, setHistorial] = useState([]);

  // Obtener el historial de Firebase
  useEffect(() => {
    const obtenerHistorial = async () => {
      const historialRef = collection(db, "luzMedidoresHistorial");
      const querySnapshot = await getDocs(historialRef);

      const datosHistorial = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistorial(datosHistorial);
    };

    obtenerHistorial();
  }, []);

//   Función para borrar todo el historial
  const borrarTodoElHistorial = async () => {
    const historialRef = collection(db, "luzMedidoresHistorial");
    const querySnapshot = await getDocs(historialRef);

    const borrarPromesas = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

    try {
      await Promise.all(borrarPromesas);
      setHistorial([]); // Limpiar el estado local
      console.log("Historial eliminado con éxito.");
    } catch (error) {
      console.error("Error al borrar el historial: ", error);
    }
  };

  return (
    <div className="historial-container">
      <h1>Historial de Cálculos de Luz</h1>
      {historial.length > 0 ? (
        <table className="historial-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Meneses Antes</th>
              <th>Meneses Ahora</th>
              <th>Todos Antes</th>
              <th>Todos Ahora</th>
              <th>Factura</th>
              <th>Paga Meneses</th>
              <th>Paga Arrayas</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.fecha.seconds * 1000).toLocaleDateString()}</td>
                <td>{item.medidorMenesesAntes}</td>
                <td>{item.medidorMenesesAhora}</td>
                <td>{item.medidorTodosAntes}</td>
                <td>{item.medidorTodosAhora}</td>
                <td>{item.factura}</td>
                <td>{item.cuantoDebenPagaMeneses} Bs</td>
                <td>{item.cuantoDebenPagaArrayas} Bs</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay datos en el historial.</p>
      )}

      {/* Botón para borrar todo el historial */}
      {historial.length > 0 && (
        <button className="boton-borrar" onClick={borrarTodoElHistorial}>
          Borrar todo el historial
        </button>
      )}

      <Link to="/luz" className="boton-volver">Volver atrás</Link>
    </div>
  );
};

export default HistorialAgua;
