$(document).ready(function() {

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBYPX3g0s3CQKWf8h50SUtg-ww7auC1xO8",
    authDomain: "rps-multiplayer-bbb91.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-bbb91.firebaseio.com",
    projectId: "rps-multiplayer-bbb91",
    storageBucket: "rps-multiplayer-bbb91.appspot.com",
    messagingSenderId: "199186993993"
};

firebase.initializeApp(config);

const database = firebase.database();
let currServer;
let userData = null;
let userName;

let plrChoice = null;
let oppChoice = null;

const timeLimit = 15; // Amount of seconds per round

let timerInt;

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


// Compares player choices
function checkChoice() {
    if (!plrChoice || !oppChoice) return;
    clearInterval(timerInt);
    let data;
    userData.once("value", function(snapshot) {
        data = snapshot.val();
    });
    switch (plrChoice) {
        case oppChoice:
            data["ties"]++;
        break;
        case "rock":
            if (oppChoice == "paper") {
                data["losses"]++;
            } else {
                data["wins"]++;
            };
        break;
        case "scissors":
            if (oppChoice == "rock") {
                data["losses"]++;
            } else {
                data["wins"]++;
            };
        break;
        case "paper":
            if (oppChoice == "scissors") {
                data["losses"]++;
            } else {
                data["wins"]++;
            };
        break;
    }
    console.log(data);
    userData.set(data);
    Object.keys(data).forEach(function(stat) {
        $(`#player1 .${stat}`).text(data[stat]);
    });
}

// Initialize and set up game server
function serverHandler() {
    const defaultStats = {
        name : userName,
        choice : "none",
        wins : 0,
        losses : 0,
        ties : 0
    };
    
    database.ref("servers").once("value", function(snapshot) {
        const serverList = snapshot.val();
        const arr = Object.keys(serverList);
        for (let i = 0; i < arr.length; i++) {
            const curr = serverList[arr[i]];
            if (arr[i] != "test" && Object.keys(curr).length < 2) {
                currServer = database.ref(`servers/${arr[i]}`);
                userData = currServer.push(defaultStats);
            };
        };

        if (!userData) {
            currServer = database.ref(`servers`).push();
            userData = currServer.push(defaultStats);
        };

        userData.onDisconnect().remove();

        let oppData = null;

        currServer.on("child_added", function(snapshot) {
            if (userData.key == snapshot.key) {return;};
            const newPlayer = snapshot.val();
            const updateStat = function(stat) {
                $(`#player2 .${stat.key}`).text(stat.val());
                if (stat.key == "choice") {
                    oppChoice = stat.val();
                    checkChoice();
                }
            };
            Object.keys(newPlayer).forEach(function(stat) {
                $(`#player2 .${stat}`).text(newPlayer[stat]);
            });

            oppData = database.ref("servers/"+currServer.key+"/"+snapshot.key);
            oppData.on("child_changed", updateStat);

            $("#player2 .name").text(newPlayer.name);
            $("#wait-text").css("display","none");
            $("#time-text").css("display", "block");

            let int = timeLimit;
            timerInt = setInterval(function() {
                int--;
                $("#timer").text(int);
                if (int <= 0) {
                    clearInterval(timerInt);
                    const rand = Math.floor(Math.random()*3);
                    userData.child("choice").set($(".btn-choice").get()[rand].textContent.toLowerCase());
                }
            },1000);
        });

        currServer.on("child_removed", function(snapshot) {
            if (snapshot.key == userData.key) {
                $("#game-screen").css("display","none");
                $("#start-screen").fadeIn();
            }
            else {
                $("#player2 .name").text("Opponent");
                $("#player2 .wins, #player2 .losses, #player2 .ties").text("0");
            };
            if (oppData) {
                oppData.off();
                oppData = null;
            };
        });
    });
};

// User input handler
$("#name-input").bind("keypress", function(key) {
    if (key.which == 13) {
        $("#name-form").submit();
        return;
    };
    const value = String.fromCharCode(key.which);
    // Only grab letters a-z, numbers and whitespaces
    const pattern = new RegExp(/[a-z0-9 ]/i);
    return pattern.test(value);
});

// Form submission handler
$("#name-form").on("submit", function() {
    if (!nameCheck($("#name-input"))) { 
        alert("Please use an appropriate name!");
        return false;
    };

    userName = $("#name-input").val();
    $("#player1 .name").text(userName);
    $("#start-screen").fadeOut();
    $("#game-screen").fadeIn();

    serverHandler();

    $("#name-input").val("");
    return false;
});

$(".btn-choice").on("click", function() {
    plrChoice = $(this).text().toLowerCase();
    userData.child("choice").set(plrChoice);
    checkChoice();
});

screen.orientation.lock("landscape").catch(function(exception) {
    console.log(exception.name, exception.message, exception.code);
});

});
