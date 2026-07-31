// Archivo principal para probar el UserController (todo el CRUD + login).
import UserController from "./user.controller";

// Función principal. La usamos porque await solo funciona dentro de una función async.
async function main(): Promise<void> {
  // 1. READ: traer todos los usuarios
  console.log("--- 1. Lista de usuarios ---");
  const usuarios = await UserController.get();
  console.log(usuarios);

  // 2. CREATE: crear un usuario nuevo
  console.log("--- 2. Crear usuario ---");
  const nuevo = await UserController.create({
    identificacion: "2002",
    nombre: "Ana",
    email: "ana@correo.com",
    password: "abcd",
  });
  console.log(nuevo);

  // 3. CREATE con email repetido (debe fallar por la validación)
  console.log("--- 3. Crear usuario con email repetido ---");
  await UserController.create({
    identificacion: "3003",
    nombre: "Otro",
    email: "ana@correo.com",
    password: "xyz",
  });

  // 4. READ por id: traer un solo usuario (usamos el que acabamos de crear)
  if (nuevo !== null && nuevo.id !== undefined) {
    console.log("--- 4. Buscar usuario por id ---");
    const encontrado = await UserController.getById(nuevo.id);
    console.log(encontrado);

    // 5. UPDATE: actualizar ese usuario
    console.log("--- 5. Actualizar usuario ---");
    await UserController.update(nuevo.id, {
      identificacion: "2002",
      nombre: "Ana Actualizada",
      email: "ana@correo.com",
      password: "nuevaClave",
    });

    // 5b. UPDATE poniendo el email de OTRO usuario (debe fallar por la validación)
    console.log("--- 5b. Actualizar con email de otro usuario ---");
    await UserController.update(nuevo.id, {
      identificacion: "2002",
      nombre: "Ana",
      email: "camilo@correo.com", // este email ya lo tiene el usuario 1
      password: "nuevaClave",
    });

    // 6. LOGIN con la clave nueva
    console.log("--- 6. Login ---");
    await UserController.login("ana@correo.com", "nuevaClave");

    // 7. DELETE: eliminar ese usuario
    console.log("--- 7. Eliminar usuario ---");
    await UserController.delete(nuevo.id);
  }

  // 8. READ final para confirmar cómo quedó la lista
  console.log("--- 8. Lista final de usuarios ---");
  const usuariosFinal = await UserController.get();
  console.log(usuariosFinal);
}

// Llamamos a la función principal
main();
