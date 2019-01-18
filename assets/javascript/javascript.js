// Initialize Firebase
const config = {
    apiKey: "AIzaSyBYPX3g0s3CQKWf8h50SUtg-ww7auC1xO8",
    authDomain: "rps-multiplayer-bbb91.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-bbb91.firebaseio.com",
    projectId: "rps-multiplayer-bbb91",
    storageBucket: "rps-multiplayer-bbb91.appspot.com",
    messagingSenderId: "199186993993"
};
// Check if display name is appropriate.
function nameCheck(input) {
    if (Filter.isProfane(input.val())) {
        console.log(input.val());
        input.val("");
        console.log("Inappropriate name");
        return false
    };
    return true;
};

firebase.initializeApp(config);

const database = firebase.database();
let userData = null;
let userName;
let currServer;
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
    if (!nameCheck($("#name-input"))) { 
        alert("Please use an appropriate name!");
        return false;
    };
    userName = $("#name-input").val();
    $("#start-screen").fadeOut();

    $("#game-screen").fadeIn();

    database.ref("servers").once("value", function(snapshot) {
        const serverList = snapshot.val();
        const arr = Object.keys(serverList);
        for (let i = 0; i < arr.length; i++) {
            const curr = serverList[arr[i]];
            if (arr[i] != "test" && Object.keys(curr).length < 2) {
                currServer = database.ref(`servers/${arr[i]}`);
                userData = currServer.push().push({
                    name : userName,
                    choice : "none",
                })
            };
        };

        if (!userData) {
            currServer = database.ref(`servers`).push();
            userData = currServer.push({
                name : userName,
                choice : "none",
            });
        };

        userData.onDisconnect().remove();
    });
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
