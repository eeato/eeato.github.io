// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMtjRi1rQrlj5jqXo7WBDP6cll4IHdLSk",
  authDomain: "eeato-9d065.firebaseapp.com",
  databaseURL: "https://eeato-9d065-default-rtdb.firebaseio.com",
  projectId: "eeato-9d065",
  storageBucket: "eeato-9d065.appspot.com",
  messagingSenderId: "779338557288",
  appId: "1:779338557288:web:aea2ab9c058ba5448fd8dd",
  measurementId: "G-H5RZ8412LE",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();
// Create a child reference
var profilesRef = storageRef.child("profiles");

// imagesRef now points to 'images'
// profilesRef.child('space.jpg')
// storageRef.child('images/stars.jpg').getDownloadURL()
//.then((url) => {
// `url` is the download URL for 'images/stars.jpg'

var user = {};
var database = firebase.database();
var applicants = database.ref("applicants");
var organisations = database.ref("organisations");
var programs = database.ref("programs");
var provider = new firebase.auth.GoogleAuthProvider();


firebase.auth().onAuthStateChanged((userr) => {
  if (userr) {
    user = userr;
    //var uid = userr.uid;
    // ...
  }
});


try {
    
  if (window.location.href.includes('/profile/edit/')) {
    addApplicant();
  }

  if (window.location.href.includes('/profile/') && !window.location.href.includes('/edit/')) {
    applicants.child(user.uid).get().then((snapshot) => {
      if (snapshot.exists()) {
        
      } else{
        window.location.href = "/profile/edit/";
      }
    });
  }

  document.querySelector(".user_displayname").innerText = user.displayName;
  document.querySelector(".user_email").innerText = user.email;
  document.querySelector(".user_photo").innerText = user.photoURL;
} catch (e) {}



function uploadFile(childref, file, oncomplete, onerror) {
  let rtnURL;
  var uploadTask = childref.put(file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
      onerror(error)
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
        rtnURL = downloadURL;
        oncomplete(downloadURL);
      });
    }
  );
  return rtnURL;
}
function deleteFile(childref, oncomplete, onerror) {
  // Delete the file
  childref.delete().then(() => {
    oncomplete();
  }).catch((error) => {
    onerror(error);
  });
}


document.querySelector('body > header > div > div.left > a').addEventListener('click', event => {
    firebase.auth().onAuthStateChanged((userr) => {
    if (userr) {
      user = userr;
      //var uid = userr.uid;
      // ...
    } else {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {

          // The signed-in user info.
          user = result.user;
          // IdP data available in result.additionalUserInfo.profile.
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
          notify(error.message, ['text-danger']);
          console.log(error);
        });
    }

    
  });
});


function SignUp(email, password, username) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      user = firebase.auth().currentUser;
      addFriend({
        user_id: user.uid,
        lastseen: new Date().toString(),
        location: { lat: -17.78521, lng: 31.05311 },
        username: username,
      });
      user
        .updateProfile({
          displayName: username,
        })
        .then(() => {
          // Update successful
          window.location.href = "index.html";

          // ...
        })
        .catch((error) => {
          // An error occurred
          window.setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
          return "Error in editing username";
          // ...
        });
    })
    .catch((error) => {
      notify(error.message, ["text-danger"]);
      // ..
    });
}
function Login(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user;
      window.location.href = "index.html";
      // ...
    })
    .catch((error) => {
      return error.message;
    });
}

function signout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "/";
  }).catch((error) => {
    notify(error,['text-danger']);
  });
}


document.querySelectorAll("a[type='logout']").forEach(el => el.addEventListener('click', ev=> {ev.preventDefault();signout();}));

function elval(q) {
  let val = document.querySelector(q).value;
  if (val == null) {
    return "";
  }else{
    return val;
  }
}
function setval(val, el) {
  document.querySelector(el).value = val;
}
function setInnerText(val, el) {
  document.querySelector(el).innerText = val;
}

function addApplicant(frm = document.body.querySelector('form')) {
  let exi;
  applicants.child(user.uid).get().then((snapshot) => {
    if (snapshot.exists()) {
      let ppa = snapshot.val();
      exi = true;

      setval(ppa.pin,"#pin");
      setval(ppa.fullName, "#fullname");
      setval(ppa.dob, "#dob");
      setval(ppa.idnumber, "#idnumber");
      setval(ppa.address, "#address");
      setval(ppa.city, "#city");
      setval(ppa.country, "#country");
      setval(ppa.phonenumber, "#phonenumber");
      setval(ppa.website, "#website");
      setval(ppa.intro, "#intro");
      setval(ppa.cv, "#cv");
      setval(ppa.languages, "#languages");
      setval(ppa.skills, "#skills");
      setval(ppa.hobbies, "#hobbies");
      setval(ppa.grade7.examboard, "#g7_exam_board");
      setval(ppa.grade7.school, "#g7_school");
      setval(ppa.grade7.year, "#g7_year");
      setval(ppa.grade7.results, "#g7_results");
      setval(ppa.grade7.subjects, "#g7_subjects");
      setval(ppa.oLevel.examboard, "#ol_examboard");
      setval(ppa.oLevel.school, "#ol_school");
      setval(ppa.oLevel.results, "#ol_results");
      setval(ppa.oLevel.year, "#ol_year");
      setval(ppa.aLevel.examboard, "#al_examboard");
      setval(ppa.aLevel.school, "#al_school");
      setval(ppa.aLevel.results, "#al_results");
      setval(ppa.aLevel.year, "#al_year");
      setval(ppa.career.institution, "#university");
      setval(ppa.career.description, "#university_description");

    } else {
      console.log("No data available");
      exi = false;
    }
  }).catch((error) => {
    console.error(error);
    notify(error,['text-danger'])
  });
  

  frm.onsubmit = (event) => {
    event.preventDefault();
    
    let ap = {
        userid : user.uid,
        pin : elval('#pin'),
        fullName : elval('#fullname'),
        dob : elval('#dob'),
        idNumber : elval('#idnumber'),
        address : elval('#address'),
        city : elval('#city'),
        country : elval('#country'),
        phonenumber : elval('#phonenumber'),
        website : elval('#website'), 
        intro : elval('#intro'),
        cv : elval('#cv'),
        languages : elval('languages'),
        skills : elval('#skills'),
        hobbies : elval('#hobbies'),
        messages : "",
        grade7 : {
            examboard : elval('#g7_exam_board'),
            school : elval('#g7_school'),
            year : elval('#g7_year'),
            results : elval('#g7_results'),
            subjects : elval('#g7_subjects'),
            slip : ""
        },
        oLevel : {
            examboard : elval('#ol_exam_board'),
            school : elval('#ol_school'),
            year : elval('#ol_year'),
            results : elval('#ol_results'),
            slip : ""
        },
        aLevel : {
            examboard : elval('#al_exam_board'),
            school : elval('#al_school'),
            year : elval('#al_year'),
            results : elval('#al_results'),
            slip : ""
        },
        career : {
            institution : elval('#university'),
            description : elval('#university_description')
        }
    }

    if (exi) {
      firebase.database().ref('applicants/' + user.uid).update(
      ap,
      (error) => {
        if (error) {
          notify(error, ['text-danger']);
        }else{
          window.location.href = "/profile/";
        }
      }
    );
    } else{
      firebase.database().ref('applicants/' + user.uid).set(
        ap,
        (error) => {
          if (error) {
            notify(error, ['text-danger']);
          }else{
            window.location.href = "/profile/";
          }
        }
      );
    }
    
  }
}


function addOrganisation(frm = document.body.querySelector('form')) {
  let exi;

  organisations.child(user.uid).get().then((snapshot) => {
    if (snapshot.exists()) {
      let ppa = snapshot.val();
      exi = true;

      setval(ppa.fullname,"#org_fullname");
      setval(ppa.title,"#display_title");
      setval(ppa.address,"#address");
      setval(ppa.phonenumber,"#phonenumber");
      setval(ppa.website,"#website");
      setval(ppa.fullname,"#org_fullname");
      setval(ppa.type,"#type");
      setval(ppa.intro,"#intro");
      quill.root.innerHTML = ppa.about;
      setval(ppa.about,"#about");
    } else {
      console.log("No data available");
      exi = false;
    }
  }).catch((error) => {
    console.error(error);
    notify(error,['text-danger'])
  });
  

  frm.onsubmit = event => {
    event.preventDefault();
    document.querySelector('#about').value = quill.root.innerHTML;
    

    let org = {
      title : elval('#display_title'),
      fullname : elval('#org_fullname'),
      address : elval("#address"),
      phonenumber : elval('#phonenumber'),
      website : elval('#website'), 
      intro : elval('#intro'),
      about : elval('#about'),
      type : elval('#type')
    }
    if (exi) {
      firebase.database().ref('organisations/' + user.uid).update(
      org,
      (error) => {
        if (error) {
          notify(error, ['text-danger']);
        }else{
          window.location.href = "/organisation/";
        }
      }
    );
    } else{
      firebase.database().ref('organisations/' + user.uid).set(
        org,
        (error) => {
          if (error) {
            notify(error, ['text-danger']);
          }else{
            window.location.href = "/organisation/";
          }
        }
      );
    }

 }

    
}

async function currentOrganisation() {
  organisations.child(user.uid).get().then((snapshot) => {
    if (snapshot.exists()) {
      let org = snapshot.val()
      setInnerText(org.fullname,'.fullname');
      setInnerText(org.title, '.title');
      displayPrograms();
      return org;
    }else{
      window.location.href = '/organisation/edit/';
      return false;
    }
  })
}

async function displayPrograms() {
  programs.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      // ...

      let tr = `
      <tr class="font text-sm fw-light">
      <td><a href="/program/#${childKey}"><i class="bi bi-box-arrow-up-right"></i></a><button key="${childKey}" onclick="deleteprogram(event)" class="btn bi-trash m-0"></button></td>
      <td>${childData.title}</td>
      <td>${new Date(childData.dateTimeOfPost).toLocaleDateString()}</td>
      <td>${new Date(childData.deadline).toLocaleDateString()}</td>
      </tr>
      `;

      document.querySelector('table').innerHTML = document.querySelector('table').innerHTML + tr;
    });
    return snapshot;
  });
}


async function addProgram(frm = document.querySelector('form')){

  frm.onsubmit = (event) => {
    event.preventDefault();
    document.querySelector('#message').value = quill.root.innerHTML;

    programs.push().set({
          id : string,
          title : frm.querySelector('#title').value,
          subtitle: frm.querySelector('#subtitle').value,
          organisationID : user.uid,
          message : frm.querySelector('#message').value,
          applicants : [],
          // applicants : [{
          //     user : |id|,
          //     options : [strings],
          //     applicationDate : datetime
          // }],
          dateTimeOfPost : Date.now(),
          deadline : new Date(frm.querySelector('#deadline').value).getTime()
    });
    window.location.href = '/organisation/';

  }

  
}



function deleteprogram(event) {
  let ky = event.target.getAttribute('key');
  firebase.database().ref('programs/' + ky).remove();
  window.location.reload();
}