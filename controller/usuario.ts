import { Request, Response } from "express";
import { db } from "../firebase/firebase";
import { UserModel } from "../models/usuario";
import {crearLog} from "../controller/log"

const collection = db.collection("usuarios"); // colección de usuarios

// Crear usuario
export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const data: UserModel = req.body;
    const { id, ...userData } = data; // evitar sobrescribir id
    const docRef = await collection.add(userData);
    await crearLog({nombre:data.nombre, sucursal:data.sucursal, accion:"crear usuario", fecha: new Date()})
    res.status(201).json({ id: docRef.id, ...userData });
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// Listar todos los usuarios
export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const snapshot = await collection.get();
    const usuarios: UserModel[] = [];
    snapshot.forEach(doc => {
      usuarios.push({ id: doc.id, ...(doc.data() as UserModel) });
    });
    await crearLog({nombre:usuarios.values.name, sucursal:usuarios.values.arguments.sucursal, accion:"crear usuario", fecha: new Date()})
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};

// Obtener un usuario por ID
export const obtenerUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await collection.doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await crearLog({nombre:doc.data.name, sucursal:doc.data.arguments.sucursal, accion:"obtener usuario", fecha: new Date()})
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: Partial<UserModel> = req.body;
    if (!data.nombre||!data.sucursal || data.nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }
    await collection.doc(id).update(data);
    await crearLog({nombre:data.nombre, sucursal:data.sucursal, accion:"actualizar usuario", fecha: new Date()})
    res.json({ mensaje: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await collection.doc(id).delete();
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
