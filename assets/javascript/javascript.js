// Initialize Firebase
const config = {
    apiKey: "AIzaSyBYPX3g0s3CQKWf8h50SUtg-ww7auC1xO8",
    authDomain: "rps-multiplayer-bbb91.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-bbb91.firebaseio.com",
    projectId: "rps-multiplayer-bbb91",
    storageBucket: "rps-multiplayer-bbb91.appspot.com",
    messagingSenderId: "199186993993"
};

// const uiConfig = {
//     callbacks: {
//       signInSuccessWithAuthResult: function(authResult, redirectUrl) {
//         // User successfully signed in.
//         // Return type determines whether we continue the redirect automatically
//         // or whether we leave that to developer to handle.
//         console.log(authResult);
//         return false;
//       },
//       uiShown: function() {
//         // The widget is rendered.
//         // Hide the loader.
//         document.getElementById('loader').style.display = 'none';
//         //$(".firebaseui-label[for='name']").text("Display Name");
//       }
//     },
//     // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//     signInFlow: 'popup',
//     signInSuccessUrl: '',
//     signInOptions: [
//       // Leave the lines as is for the providers you want to offer your users.
//       //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//       //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//       //firebase.auth.GithubAuthProvider.PROVIDER_ID,
//       firebase.auth.EmailAuthProvider.PROVIDER_ID,
//       //firebase.auth.PhoneAuthProvider.PROVIDER_ID
//     ],
//     // Terms of service url.
//     // tosUrl: '<your-tos-url>',
//     // Privacy policy url.
//     // privacyPolicyUrl: '<your-privacy-policy-url>'
// };
function nameCheck(input) {
    if (Filter.isProfane(input.val())) {
        input.val("");
        console.log("Inappropriate name");
        return false
    };
};

firebase.initializeApp(config);

const database = firebase.database();

// database.ref().on("value", function(snapshot) {
//     console.log(snapshot.val());
// });

$("#name-input").bind("keypress", function(key) {
    const value = String.fromCharCode(event.which);
    // Only grab letters a-z, numbers and whitespaces
    const pattern = new RegExp(/[a-z0-9 ]/i);
    return pattern.test(value);
});

$("#name-form").on("submit", function() {
    $("#start-screen").fadeOut();
    return false;
});

// function shake() {
//     $("img").animate({"text-indent":45}, {
//         duration: 1000,
//         step: function(now,fx) {
//             console.log(fx);
//             $(this).css("transform",`rotate(${now}deg)`);
//         },

//         complete: function() {
//             $(this).animate({"text-indent":120}, {
//                 duration: 1000,
//                 step: function(now,fx) {
//                     $(this).css("transform",`rotate(${now}deg)`);
//                 },
//                 complete: function() {
//                     shake();
//                 }
//             });
//         },
//     });
// };

// shake();
