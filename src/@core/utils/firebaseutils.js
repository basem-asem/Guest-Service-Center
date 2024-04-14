import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "src/configs/firebaseConfig";

// Function to get Users data Based on UserType Query
export function getUsersByType(COLLECTION, USERTYPE) {
  return new Promise((resolve, reject) => {
    try {
      const UsersQuery = query(
        collection(db, COLLECTION),
        where("type", "==", USERTYPE)
      );
      onSnapshot(UsersQuery, (querySnapshot) => {
        resolve(querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() })));
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to get Collection All data
export function getStaticData(COLLECTION) {
  return new Promise((resolve, reject) => {
    try {
      const Query = collection(db, COLLECTION);
      onSnapshot(Query, (querySnapshot) => {
        resolve(querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() })));
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Image Uploading
export const imageUploading = (UPLOAD_PATH, FILE) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageRef = ref(storage, `${UPLOAD_PATH}/${FILE.name}`);
      const uploadTask = uploadBytesResumable(imageRef, FILE);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {}
      );
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      resolve(downloadURL);
    } catch (error) {
      reject(error);
    }
  });
};

// Function to Create or Update Doc
export function Create_Update_Doc(COLLECTION, DATA, DOC_ID) {
  return new Promise((resolve, reject) => {
    try {
      if (DOC_ID) {
        const updateDocRef = doc(db, COLLECTION, DOC_ID);
        updateDoc(updateDocRef, DATA).then(() => {
          // Update Alert
          resolve("data.update");
        });
      } else {
        const newDocRef = doc(collection(db, COLLECTION));
        setDoc(newDocRef, DATA).then(() => {
          resolve("data.insert");
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}
