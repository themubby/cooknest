import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "@/config/firebase";

// One document per (user, recipe) pair, so a favorite can't be added twice.
const favoriteDocId = (email: string, recipeId: string) => `${email}__${recipeId}`;

export async function getFavoriteIds(email: string): Promise<string[]> {
  const snapshot = await getDocs(query(collection(db, "favorites"), where("userEmail", "==", email)));
  return snapshot.docs.map((d) => d.data().recipeId as string);
}

export async function addFavorite(email: string, recipeId: string): Promise<void> {
  await setDoc(doc(db, "favorites", favoriteDocId(email, recipeId)), {
    userEmail: email,
    recipeId,
    createdAt: serverTimestamp(),
  });
}

export async function removeFavorite(email: string, recipeId: string): Promise<void> {
  await deleteDoc(doc(db, "favorites", favoriteDocId(email, recipeId)));
}
