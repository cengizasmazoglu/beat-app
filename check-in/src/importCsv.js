import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Papa from "papaparse";
import fs from "fs";


const firebaseConfig = {
    apiKey: "AIzaSyC0kkjYrDIhEYEPMNFPHR2hKv5UNxRbVGU",
    authDomain: "beat-app-92d36.firebaseapp.com",
    projectId: "beat-app-92d36",
    storageBucket: "beat-app-92d36.firebasestorage.app",
    messagingSenderId: "183586841467",
    appId: "1:183586841467:web:7a771074e46d9ea5b493de",
    measurementId: "G-YY6SJ6RGL4"
  };


initializeApp(firebaseConfig);

const db = getFirestore();

// Function to import CSV data to Firestore
function importCsvToFirestore(csvFilePath) {
  // Read the CSV file
  fs.readFile(csvFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Parse the CSV file
    Papa.parse(data, {
      header: false, // Treat the first row as headers
      complete: (result) => {
        const members = result.data; // Parsed data

        // Add each row as a document in Firestore
        members.forEach((member) => {
           if (member[0] != '') {
            const newMember = { name: member[0] };
            addDoc(collection(db, "members"), newMember)
              .then(() => {
                console.log("Member added:", newMember);
              })
              .catch((error) => {
                console.error("Error adding member:", error);
              });
           }
          
        });
      }
    });
  });
}

// Call the function with your CSV file path
importCsvToFirestore("assets/members.csv");
