import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyAIFllUk-GsF81V8aawMlCvuwz103dVGeQ",
authDomain: "lastminutecocktailgenerator.firebaseapp.com",
databaseURL: "https://lastminutecocktailgenerator.firebaseio.com",
projectId: "lastminutecocktailgenerator",
storageBucket: "lastminutecocktailgenerator.appspot.com",
messagingSenderId: "1075313204622",
appId: "1:1075313204622:web:57f83343afff1344"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase