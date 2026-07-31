// Importamos axios para hacer las peticiones HTTP al json-server
import axios from "axios";

// Interfaz: define la "forma" que tiene un usuario.
// Sirve para que TypeScript nos avise si nos falta un campo o le ponemos otro tipo.
export interface User {
  id?: number; // el id es opcional porque json-server lo crea solo al crear
  identificacion: string;
  nombre: string;
  email: string;
  password: string;
}

// Clase con los métodos del CRUD. Todos son estáticos:
// eso significa que se llaman con UserController.metodo() sin crear un objeto.
class UserController {
  // URL base del json-server. Todos los métodos la reutilizan.
  static apiUrl: string = "http://localhost:3001/users";

  // ===== READ =====

  // GET: traer todos los usuarios
  static async get(): Promise<User[]> {
    const respuesta = await axios.get<User[]>(UserController.apiUrl);
    return respuesta.data;
  }

  // GET por id: traer un solo usuario
  static async getById(id: number): Promise<User> {
    const respuesta = await axios.get<User>(UserController.apiUrl + "/" + id);
    return respuesta.data;
  }

  // ===== VALIDACIONES =====

  // Validar email repetido: devuelve true si YA existe ese email
  static async emailRepetido(email: string): Promise<boolean> {
    const usuarios = await UserController.get();
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === email) {
        return true;
      }
    }
    return false;
  }

  // Validar identificación repetida: devuelve true si YA existe esa identificación
  static async identificacionRepetida(identificacion: string): Promise<boolean> {
    const usuarios = await UserController.get();
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].identificacion === identificacion) {
        return true;
      }
    }
    return false;
  }

  // ===== CREATE =====

  // CREATE: crear un usuario nuevo, validando antes que no se repita email ni identificación
  static async create(usuario: User): Promise<User | null> {
    const yaExisteEmail = await UserController.emailRepetido(usuario.email);
    if (yaExisteEmail === true) {
      console.log("Error: el email ya está registrado.");
      return null;
    }

    const yaExisteId = await UserController.identificacionRepetida(usuario.identificacion);
    if (yaExisteId === true) {
      console.log("Error: la identificación ya está registrada.");
      return null;
    }

    const respuesta = await axios.post<User>(UserController.apiUrl, usuario);
    console.log("Usuario creado correctamente.");
    return respuesta.data;
  }

  // ===== UPDATE =====

  // UPDATE: actualizar los datos de un usuario que ya existe (por id)
  static async update(id: number, datosNuevos: User): Promise<User | null> {
    // Traemos todos los usuarios para revisar repetidos.
    const usuarios = await UserController.get();
    for (let i = 0; i < usuarios.length; i++) {
      // OJO: nos saltamos al usuario que estamos editando (mismo id).
      // Así puede conservar su propio email/identificación sin dar error.
      if (usuarios[i].id === id) {
        continue;
      }
      // Si OTRO usuario ya tiene ese email, no dejamos actualizar.
      if (usuarios[i].email === datosNuevos.email) {
        console.log("Error: el email ya está registrado en otro usuario.");
        return null;
      }
      // Si OTRO usuario ya tiene esa identificación, no dejamos actualizar.
      if (usuarios[i].identificacion === datosNuevos.identificacion) {
        console.log("Error: la identificación ya está registrada en otro usuario.");
        return null;
      }
    }

    // Nos aseguramos de que el id del objeto sea el mismo que estamos actualizando
    datosNuevos.id = id;
    const respuesta = await axios.put<User>(UserController.apiUrl + "/" + id, datosNuevos);
    console.log("Usuario actualizado correctamente.");
    return respuesta.data;
  }

  // ===== DELETE =====

  // DELETE: eliminar un usuario por id
  static async delete(id: number): Promise<void> {
    await axios.delete(UserController.apiUrl + "/" + id);
    console.log("Usuario eliminado correctamente.");
  }

  // ===== LOGIN =====

  // LOGIN: busca un usuario que tenga ese email y esa contraseña
  static async login(email: string, password: string): Promise<User | null> {
    const usuarios = await UserController.get();
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === email && usuarios[i].password === password) {
        console.log("Login correcto. Bienvenido " + usuarios[i].nombre);
        return usuarios[i];
      }
    }
    console.log("Login incorrecto: email o contraseña equivocados.");
    return null;
  }
}

// Lo exportamos para poder usarlo desde otro archivo (index.ts)
export default UserController;
