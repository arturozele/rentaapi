import express from "express";
import productoRoutes from "./routes/productRoutes";
const app = express();
const PORT = 3000;

// Middleware para trabajar con JSON
app.use(express.json());;
app.use("/productos", productoRoutes);


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
