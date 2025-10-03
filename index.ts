import express from "express";
import productoRoutes from "./routes/productRoutes";
import usuarioRoutes from "./routes/usuarioRoutes"; // importamos rutas de usuarios

const app = express();
const PORT = 3000;

// Middleware para trabajar con JSON
app.use(express.json());

// Rutas
app.use("/productos", productoRoutes);
app.use("/usuarios", usuarioRoutes); // nueva ruta para usuarios

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

