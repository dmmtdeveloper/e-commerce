import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Definimos la configuración de Firebase usando los tipos
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializamos la app de Firebase si no ha sido inicializada ya
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Inicializamos el servicio de Firebase Storage
const storage = getStorage(firebaseApp);

// Función para subir la imagen
export const uploadImage = async (file: File, filePath: string): Promise<string> => {
    const storageRef = ref(storage, filePath); // Crear la referencia al archivo
    await uploadBytes(storageRef, file); // Subir el archivo
    const downloadURL = await getDownloadURL(storageRef); // Obtener el URL de descarga
    return downloadURL; // Retornar el URL de la imagen subida
  };

export const deleteImage = async (imagePath: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath); // Aquí se usa la ruta de la imagen
  
    try {
      await deleteObject(imageRef);
      console.log("Imagen eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

export { storage };
