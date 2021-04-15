const fetch = require('node-fetch').default;

let white = []
let black = []

let blacki = 0;

function getCat() {
    console.log("Fetching available decks...")
    let cat = []
    fetch('https://mysterious-caverns-api.herokuapp.com/categories')
        .then(res => res.json())
        .then(json => {
            for (let i = 0; i < json.length; i++) {
                cat[i] = {
                    id: json[i].id,
                    name: json[i].name,
                    color: json[i].color
                }
                console.log(cat[i])
            }
        })
    return cat;
}

const cdecks = async (decks) => {
    console.log("Fetching white cards from custom decks...")
    let vars;
    let msg = "The following decks will be used this match:<br>";
    let whitei = 0;
    white.splice(0, white.length);

    if (decks == undefined) return;
    vars = "&id_in=" + decks[0];
    for (let i = 1; i < decks.length; i++) {
        vars += "&id_in=" + decks[i];
    }
    //console.log(vars);

    let res = await fetch('https://mysterious-caverns-api.herokuapp.com/categories?_limit=1000' + vars)
    let json = await res.json();
    for (let i = 0; i < json.length; i++) {
        if (json[i].whites == undefined) continue;
        //console.log(json[i].whites);
        for (let j = 0; j < json[i].whites.length; j++) {
            white[whitei] = {
                id: whitei++,
                type: json[i].whites[j].type,
                text: json[i].whites[j].text,
                //color: json[i].color
            }
            //console.log(white[whitei-1]);
        }
        console.log(json[i].name);
        msg += "-" + json[i].name + "<br>";
        if (i == json.length - 1) {
            console.log(msg)
            return msg;
        }
    }
}

const generateWhite = async () => {
    console.log("Fetching white cards...");
    white.splice(0, white.length);
    let res = await fetch('https://mysterious-caverns-api.herokuapp.com/whites?_limit=1000')
    let json = await res.json();
    for (let i = 0; i < json.length; i++) {
        //let cm = white;
        //if (json[i].categories[0]!=undefined) cm = json[i].categories[0].color;
        white[i] = {
            id: i,
            type: json[i].type,
            text: json[i].text,
            //color: cm
        }
        //console.log(i, white[i].text);
    }
}

const generateBlack = async () => {
    console.log("Fetching black cards...");
    black.splice(0, black.length);
    let res = await fetch('https://mysterious-caverns-api.herokuapp.com/blacks?_limit=1000')
    let json = await res.json();
    for (let i = 0; i < json.length; i++) {
        black[i] = {
            id: i,
            type: json[i].type,
            text: json[i].text
        }
    }
}

module.exports = {
    white: white,
    black: black,
    generateWhite: generateWhite,
    generateBlack: generateBlack,
    getCat: getCat(),
    selectDecks: cdecks
};
