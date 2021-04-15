// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io')

var app = express();
var server = http.Server(app);
var io = socketIO(server);
const port = process.env.PORT || 4001;

var cards = require('./src/functions/cards.js');
//var events = require('./static/events.js');

app.set('port', port);
app.use('/src', express.static(__dirname + '/src'));
app.use(express.static("build"))

// Routing

app.get('/build', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, function() {
  console.log('Starting server on port '+port);
});
/*
const io = require('socket.io')();
const port = 3000;
io.listen(port);
console.log('listening on port ', port);*/

var players = {};
var playerList = [];
var noPlayers = 0;
const playersMax = 10;

var winningPoints = 5;

var whiteQueue = [];
var whitei = 0;
var whitePerPerson = 10;

var blackQueue = [];
var blacki = 0;

var cardsPlayed = [];
var cardsPlayedi = 0;

var tzarTag = 0;
var tzarID;

var acceptCards = false;
var acceptTzar = false;

var gameStarted = false;
var prevBlack;

var customCard = "";

var mostpickedcards = [];

var decks = false;
var pressed = false;

var blackSkip = 0;

//import { fetchWhite, fetchBlack } from './cards.mjs';

// TODO events
// tak/nie odpowiedz w wiekszosci dostaje ekstra karte do konca gry
// TODO players not having enough cards sometimes?
// TODO player can have 11 cards when rerolling hand after picking 1 card during multiple choice cards
// TODO cards sets color coding
// TODO players cant join during tzar turn?
// TODO work on disconnects, cards sometimes not sending?
// TODO custom cards searching not having to loop


io.on('connect', function(client){
  io.to(client.id).emit('sessionid', client.id);
  io.to(client.id).emit('recieveCategories', cards.getCat);
  players[client.id] = {
    id: client.id,
    name: "unknown",
    points: 0,
    tzar: false,
    played: false,
    tag: noPlayers,
    pick: false,
    amountPicked: 0,
    rerolled: false,
    voted: false
  };
  //console.log(players)
});

io.on('connection', (client) => {
  //console.log(cards.white[0]);
  //unpack();
  client.on('new player', function(){
    //console.log(players[socket.id].name, socket.id);
    /*io.to(client.id).emit('sessionid', client.id);
    io.to(client.id).emit('recieveCategories', cards.getCat);
    players[client.id] = {
      id: client.id,
      name: "unknown",
      points: 0,
      tzar: false,
      played: false,
      tag: noPlayers,
      pick: false,
      amountPicked: 0,
      rerolled: false,
      voted: false
    };*/
    //console.log(players)
    noPlayers++;
    playerList.push(client.id);
    console.log(playerList);
    io.sockets.emit('message', message("unknown", "joins the lobby"));
    io.sockets.emit('state', playerList, players);
    if (gameStarted==true){
           for (let i=0;i<whitePerPerson;i++){
                console.log("white sent: ", client.id, whiteQueue[0].matchid, cards.white[whiteQueue[0].cardid].text );
                io.to(client.id).emit('recieveWhite', client.id, whiteQueue[0], cards.white[whiteQueue[0].cardid]);
                whiteQueue.shift();
                if (whiteQueue.length===0) shuffleWhite();

           }
           io.to(client.id).emit('blackCard', prevBlack);
           if (acceptCards==true) {
               players[client.id].pick=true;
               emitEmptyWhite();
           }
           if (acceptTzar==true) {
                /*io.to(client.id).emit('playedCards', cardsPlayed, prevBlack.type);
                io.to(client.id).emit('enableCards');
                io.to(client.id).emit('tzarTurn', players[playerList[tzarTag]]);*/
           }
    }
    io.sockets.emit('state', playerList, players);
  });
  client.on('disconnect', function() {
    if (noPlayers==1 || gameStarted==false) {
      for (let id in playerList) {
          if (players[playerList[id]].id==client.id) {
            playerList.splice(id, 1);
            //delete players[id];
            noPlayers--;
          }
      }

      pressed=false;
      gameStarted=false;
      decks=false;

      let playername = "user";
      if (players[client.id]!=undefined) playername=players[client.id].name;
      io.sockets.emit('message', message("server", playername+" disconnected from the server "+"["+client.id+"]"));
      io.sockets.emit('state', playerList, players);
      console.log('user disconnected', playerList);

      return;
    }
    for (let id in playerList) {
      if (playerList[id]==client.id) {
           // remove commited cards of that person
           for (let id2 in cardsPlayed){
               if (cardsPlayed[id2].player==client.id) {
                   cardsPlayed.splice(id2, 1);
                   cardsPlayedi--;
               }
           }
        emitEmptyWhite();
        if (players[playerList[id]].tzar==true) {
        // appoint new tzar
            tzarTag++;
            if (tzarTag>=playerList.length) tzarTag=0;
            players[playerList[tzarTag]].tzar=true;
            players[playerList[tzarTag]].pick=false;
            players[playerList[tzarTag]].amountPicked=0;
            if (acceptCards==true) io.to(playerList[tzarTag]).emit('blockTzar');
        // remove played cards of new tzar
            for (let id2 in cardsPlayed){
                     if (cardsPlayed[id2].player==players[playerList[tzarTag]].id) {
                         cardsPlayed.splice(id2, 1);
                         cardsPlayedi--;
                     }
            }
            emitEmptyWhite();
        }

        //console.log(noPlayers, cardsPlayed.length, "sdikjfbnsdihfjswbfiuyshdgbusi");
        if ((noPlayers-2<=cardsPlayed.length && prevBlack.type==0) || ((prevBlack.type*(noPlayers-2))<=cardsPlayed.length && (prevBlack.type==2 || prevBlack.type==3))) {
            acceptCards=false;
            acceptTzar=true;
        }
        if (acceptTzar==true) {
            shufflePlayed();
            players[playerList[tzarTag]].pick=true;
            io.sockets.emit('playedCards', cardsPlayed, prevBlack.type);
            io.sockets.emit('enableCards');
            for (let i in playerList){
              if (playerList[tzarTag]!=playerList[i]) io.to(playerList[i]).emit('playerWait');
            }
            io.to(playerList[tzarTag]).emit('tzarTurn');
        }

        playerList.splice(id, 1);
        noPlayers--;

        if (tzarTag<0) tzarTag=playerList.length-1;
        else if (tzarTag>=noPlayers) tzarTag=0;

        io.sockets.emit('state', playerList, players);
        break;
      }
    }
      let playername = "user";
      if (players[client.id]!=undefined) playername=players[client.id].name;
        io.sockets.emit('message', message("server", playername+" disconnected from the server "+"["+client.id+"]"));
        io.sockets.emit('state', playerList, players);
        console.log('user disconnected', playerList);
        if (noPlayers==0) {
            pressed=false;
            gameStarted=false;
            decks=false;
        }
  });
  client.on('updateName', function(nickname) {
      if (players[client.id]!=undefined && nickname!="" && nickname!=null && nickname!=undefined) players[client.id].name = nickname;
      console.log("updateName", playerList);
      io.sockets.emit('message', message(nickname, "is in the game"));
      io.sockets.emit('state', playerList, players);
  });
  client.on('setPoints', function(number){
    if(number=="Points to win") return;
    winningPoints=number;
    console.log("Points to win set: ", winningPoints);
    io.sockets.emit('pointsToWin', winningPoints);
    io.sockets.emit('message', message("server", "Points now required to win: "+winningPoints));
    io.sockets.emit('state', playerList, players);
  });
  client.on('setDecks', async function(cdecks){
    if (gameStarted==true) return;
    decks = true;
    io.sockets.emit('message', message("server", "Fetching white cards from chosen decks..."))
    let msg = await cards.selectDecks(cdecks);
    io.sockets.emit('message', message("server", msg))
  });
  client.on('writeCustom', function(text){
    //cards.white[301].text = text;
    for (let i=0;i<cards.white.length;i++){
      if (cards.white[i].type==2) {
        cards.white[i].text=text;
        break;
      }
    }
    io.to(client.id).emit('message', message("server", "Customowa karta ustawiona: "+text));
  });
  client.on('skipBlack', function(){
    if (acceptTzar) return;
    console.log("black card: ", cards.black[blackQueue[0]]);
    io.sockets.emit('blackCard', cards.black[blackQueue[0]]);
    io.sockets.emit('message', message("Black Card", cards.black[blackQueue[0]].text));
    prevBlack = cards.black[blackQueue[0]];
    blackQueue.shift();
    if (blackQueue.length===0) shuffleBlack();
    io.sockets.emit('state', playerList, players);
    blackSkip=0;
  });
  client.on('reroll', function(){
    if(players[client.id].reroll) return;
    if(players[client.id].tzar || acceptTzar) return;
    if(!gameStarted) return;
    players[client.id].reroll = true;

    io.to(client.id).emit('clearBoard');
    for (let i=0;i<whitePerPerson;i++){
        console.log("white sent: ", client.id, whiteQueue[0].matchid, cards.white[whiteQueue[0].cardid].text);
        io.to(client.id).emit('recieveWhite', client.id, whiteQueue[0], cards.white[whiteQueue[0].cardid]);
        whiteQueue.shift();
        if (whiteQueue.length===0) shuffleWhite();
    }

    io.sockets.emit('message', message("server", players[client.id].name+" rerolled their cards"));
  });
  client.on('vote', function(){
    if(players[client.id].voted) return;
    if(!gameStarted || !acceptTzar) return;
    players[client.id].voted = true;
    io.sockets.emit('message', message(players[client.id].name, "voted to give everyone a point"));

    let votes=true;
    for (let id in playerList){
        if (!players[playerList[id]].voted) {
            votes=false;
            break;
        }
    }
    if (!votes) return;
    acceptTzar=false;

    io.sockets.emit('message', message("server", "Everybody wins! Next round starting in 5s..."));
    let winner=false;
    for (let id in playerList){
        if (!players[playerList[id]].tzar) players[playerList[id]].points++;
        if (players[playerList[id]].points>=winningPoints) {
              io.sockets.emit('message', message(players[playerList[id]].name, "wins!"));
              pressed=false;
              gameStarted=false;
              decks=false;
              io.sockets.emit('startEnable');
              io.sockets.emit('pointsEnable');
              winner=true;
            }
    }
    io.sockets.emit('state', playerList, players);
    if (!winner) setUpTurn();
  });
  client.on('cardCommited', function(matchCardID, cardID) { // matchCardID
      // emit to client card disabling signal
      if (acceptCards==false || players[client.id].pick==false) return;
      players[client.id].amountPicked++;
      //console.log(prevBlack.type);
      if (prevBlack.type==0){
             //console.log("RECIEVE WHITE", client.id, whiteQueue[0]);
              players[client.id].played=true;
              players[client.id].pick=false;
              io.sockets.emit('playedCardsHidden');
              io.sockets.emit('state', playerList, players);
              io.to(client.id).emit('recieveWhite', client.id, whiteQueue[0], cards.white[whiteQueue[0].cardid]);
              io.sockets.emit('disableCards', client.id);
              whiteQueue.shift();
              if (whiteQueue.length===0) shuffleWhite();
              cardsPlayed[cardsPlayedi++] = {
                player: client.id,
                matchid: matchCardID,
                card: cards.white[cardID]
              }
              console.log(cardsPlayedi, cardsPlayed, cardID);
              if (cardsPlayedi>=noPlayers-1){
                acceptCards=false;
                acceptTzar=true;
                players[playerList[tzarTag]].pick=true;
                console.log("Tzar turn", tzarTag);
                shufflePlayed();
                io.sockets.emit('playedCards', cardsPlayed, prevBlack.type);
                io.sockets.emit('state', playerList, players);
                io.sockets.emit('enableCards');

                for (let i in playerList){
                  if (playerList[tzarTag]!=playerList[i]) io.to(playerList[i]).emit('playerWait');
                }
                io.to(playerList[tzarTag]).emit('tzarTurn');
                
              }
      }
      else if (prevBlack.type==2 || prevBlack.type==3){
      io.sockets.emit('updateWhite', client.id);
        cardsPlayed[cardsPlayedi++] = {
                   player: client.id,
                   matchid: matchCardID,
                   card: cards.white[cardID]
        }
        if (players[client.id].amountPicked==prevBlack.type){
               players[client.id].played=true;
               players[client.id].pick=false;
                 io.sockets.emit('state', playerList, players);
                 io.sockets.emit('playedCardsHidden');
                 for (let i=0;i<prevBlack.type;i++){
                        io.to(client.id).emit('recieveWhite', client.id, whiteQueue[0], cards.white[whiteQueue[0].cardid]);
                        whiteQueue.shift();
                        if (whiteQueue.length===0) shuffleWhite();
                 }
                 io.sockets.emit('disableCards', client.id);

                 console.log(cardsPlayedi, cardsPlayed, cardID);
                 if (cardsPlayedi>=((noPlayers-1)*prevBlack.type)){
                   acceptCards=false;
                   acceptTzar=true;
                   players[playerList[tzarTag]].pick=true;
                   console.log("Tzar turn", tzarTag);
                   //shufflePlayed();
                   io.sockets.emit('playedCards', cardsPlayed, prevBlack.type);
                   io.sockets.emit('state', playerList, players);
                   io.sockets.emit('enableCards');
                   for (let i in playerList){
                    if (playerList[tzarTag]!=playerList[i]) io.to(playerList[i]).emit('playerWait');
                  }
                  io.to(playerList[tzarTag]).emit('tzarTurn');
                 }
        }
      }
  });
  client.on('tzarPicked', function(cardID) {
      // emit to client card disabling signal
      if (acceptTzar==false || players[client.id].tzar==false) return;
      acceptTzar=false;
      for (let id in cardsPlayed) {
        if (cardsPlayed[id].matchid==cardID) {
          if (players[cardsPlayed[id].player]!=undefined) players[cardsPlayed[id].player].points++;
          mostpickedcards.push(cardsPlayed[id].card.id);
          //console.log(mostpickedcards)
          io.sockets.emit('highlightCard', cardID, players);
          io.sockets.emit('state', playerList, players);
          io.sockets.emit('message', message(players[cardsPlayed[id].player].name, "wins this round with: "+cardsPlayed[id].card.text+"; Next round starting in 5s..."));
        }
        if (players[cardsPlayed[id].player].points>=winningPoints) {
          io.sockets.emit('message', message(players[cardsPlayed[id].player].name, "wins!"));
          gameStarted=false;
          pressed=false;
          decks=false;
          io.sockets.emit('startEnable');
          io.sockets.emit('pointsEnable');
          return;
        }
      }
      setUpTurn();
  });
  client.on('start', async function() {
    // doesnt check if there is enough cards
      if (pressed) return;
      pressed=true;
      gameStarted = true;
      io.sockets.emit('pointsDisable');
      io.sockets.emit('startDisable');
      io.sockets.emit('playedCards', [], 0);
      io.sockets.emit('clearBoard');
      whiteQueue.splice(0, whiteQueue.length);
      blackQueue.splice(0, blackQueue.length);
      cardsPlayed.splice(0, cardsPlayed.length);
      whitei=0;
      cardsPlayedi=0;
      blacki=0;
      blackSkip=0;

      io.sockets.emit('loadloader');
      if (!decks) {
        io.sockets.emit('message', message("server", "Fetching white cards..."))
        await cards.generateWhite();
      }
      io.sockets.emit('message', message("server", "Fetching black cards..."))
      await cards.generateBlack();

      let tmp = (whitePerPerson*2)+(noPlayers*winningPoints);
      tmp = tmp * noPlayers;
      tmp = Math.ceil(tmp/cards.white.length);
      for (let i=0;i<tmp;i++){
        shuffleWhite();
      }
      for (let i=0;i<Math.ceil((noPlayers*winningPoints)/cards.black.length);i++){
        shuffleBlack();
      }

      console.log("White cards prepped: ", whiteQueue.length);
      console.log("Black cards prepped: ", blackQueue.length);
      //cards.white[301].text = 'Customowa karta - napisz w chacie na dole jaki ma mieć tekst i ją kliknij';
      io.sockets.emit('unloadloader');

      console.log("black card: ", cards.black[blackQueue[0]]);
      acceptCards = true;
      acceptTzar = false;

      //io.to(client.id).emit('log');
      //io.sockets.emit('log');
      //console.log(client.id, playerList[0])
      for (let id in playerList) {
        for (let i=0;i<whitePerPerson;i++){
          console.log("white sent: ", playerList[id], whiteQueue[0].matchid, cards.white[whiteQueue[0].cardid].text);
          io.to(playerList[id]).emit('recieveWhite', playerList[id], whiteQueue[0], cards.white[whiteQueue[0].cardid]);
          whiteQueue.shift();
          if (whiteQueue.length===0) shuffleWhite();
        }
      }

      io.sockets.emit('state', playerList, players);
      io.sockets.emit('blackCard', cards.black[blackQueue[0]]);
      io.sockets.emit('message', message("Black Card", cards.black[blackQueue[0]].text));
      prevBlack = cards.black[blackQueue[0]];
      blackQueue.shift();
      if (blackQueue.length===0) shuffleBlack();

      for (let id in players) {
        players[id].points=0;
        players[id].tzar=false;
        players[id].played=false;
        players[id].pick=true;
        players[id].amountPicked=0;
        players[id].reroll=false;
        players[id].voted=false;
      }

      tzarTag=0;
      players[playerList[tzarTag]].tzar=true;
      players[playerList[tzarTag]].pick=false;
      players[playerList[tzarTag]].amountPicked=0;

      io.sockets.emit('state', playerList, players);
      io.to(playerList[tzarTag]).emit('blockTzar');
      io.sockets.emit('startTurn');
      //console.log(players, playerList);
      //console.log(fetchBlack(0), fetchBlack(2), fetchBlack(5));
      pressed=false;
  });
  client.on('message', async function(msg) {
    let date = new Date();
    let input = {
      date: "["+String(date.getHours()).padStart(2,"0")+":"
      +String(date.getMinutes()).padStart(2,"0")+":"
      +String(date.getSeconds()).padStart(2,"0")+"]",
      author: players[client.id].name,
      sauce: msg
    }
    console.log(input.date," ",players[client.id].name," : ", input.sauce);
    io.sockets.emit('message', input);
    //console.log("|"+input.sauce+"|")
    if (input.sauce=="!stats") {
        io.sockets.emit('message', message("Most picked cards", countCards()));
    }
    else if (input.sauce=="!rudy") {
        io.sockets.emit('message', message("server", rudy(client.id)));
    }
    else if (input.sauce.substring(0,5)=="!kick") {
        io.sockets.emit('message', message("server", kick(input.sauce.slice(6, input.sauce.length))));
    }
  });
});

function message(author, input){
  let date = new Date();
  let msg = {
    date: "["+String(date.getHours()).padStart(2,"0")+":"
    +String(date.getMinutes()).padStart(2,"0")+":"
    +String(date.getSeconds()).padStart(2,"0")+"]",
    author: author,
    sauce: input
  }
  return msg;
}

function setUpTurn(){
      setTimeout(function(){
        cardsPlayed.splice(0, cardsPlayed.length);
        cardsPlayedi=0;
        io.sockets.emit('playedCards', [], 0);
        io.sockets.emit('message', message("Black Card", cards.black[blackQueue[0]].text));
        io.sockets.emit('blackCard', cards.black[blackQueue[0]]);
        prevBlack = cards.black[blackQueue[0]];
        blackQueue.shift();
        if (blackQueue.length===0) shuffleBlack();
        blackSkip=0;

        acceptCards=true;
        acceptTzar=false;
        for (let id in players){
          players[id].tzar=false;
          players[id].played=false;
          players[id].pick=true;
          players[id].amountPicked=0;
          players[id].voted=false;
        }
        tzarTag++;
        if (tzarTag>=playerList.length) tzarTag=0;
        players[playerList[tzarTag]].tzar=true;
        players[playerList[tzarTag]].pick=false;
        players[playerList[tzarTag]].amountPicked=0;
        io.sockets.emit('state', playerList, players);
        //console.log(players);
        acceptCards=true;
        io.sockets.emit('enableCards');
        io.to(playerList[tzarTag]).emit('blockTzar');
      }, 5000)
}

function shuffleWhite(){
    let nums = [];
    for (let k=0;k<cards.white.length;k++){
      nums[k]=k;
    }
    let i = cards.white.length;
    let j = 0;

  while (i--) {
      j = Math.floor(Math.random() * (i+1));
      whiteQueue.push({
        cardid: nums[j],
        matchid: whitei++
      });
      nums.splice(j,1);
  }
  //console.log(whiteQueue);
}

function shuffleBlack(){
    let nums = [];
    for (let k=0;k<cards.black.length;k++){
      nums[k]=k;
    }
    let i = cards.black.length;
    let j = 0;

  while (i--) {
      j = Math.floor(Math.random() * (i+1));
      blackQueue.push(nums[j]);
      nums.splice(j,1);
  }
 //console.log(blackQueue);
}

function shufflePlayed(){
    let nums = [];
    for (let k=0;k<cardsPlayed.length;k++){
      nums[k]=k;
    }
    let i = cardsPlayed.length;
    let j = 0;
    let playedQueue = [];

  while (i--) {
      j = Math.floor(Math.random() * (i+1));
      playedQueue.push(cardsPlayed[j]);
      cardsPlayed.splice(j,1);
  }
  cardsPlayed = playedQueue;
}

function countCards(){
    let curr = 0;
    let index = [];
    for (let i=0;i<mostpickedcards.length;i++){
        curr++;
        if (mostpickedcards.length-1==i || mostpickedcards[i]!=mostpickedcards[i+1]) {
            index.push({cardid: mostpickedcards[i], amount: curr});
            curr=0;
        }
    }

    insertionSort(index);
    console.log(index);
    let response;
    if (index[index.length-1]!=undefined) response="<br>"+cards.white[index[index.length-1].cardid].text+" - "+index[index.length-1].amount+"<br>";
    if (index[index.length-2]!=undefined) response=response+cards.white[index[index.length-2].cardid].text+" - "+index[index.length-2].amount+"<br>";
    if (index[index.length-3]!=undefined) response=response+cards.white[index[index.length-3].cardid].text+" - "+index[index.length-3].amount;
    return response;
}

function insertionSort(inputArr) {
    let n = inputArr.length;
        for (let i = 1; i < n; i++) {
            // Choosing the first element in our unsorted subarray
            let current = inputArr[i];
            // The last element of our sorted subarray
            let j = i-1;
            while ((j > -1) && (current.amount < inputArr[j].amount)) {
                inputArr[j+1] = inputArr[j];
                j--;
            }
            inputArr[j+1] = current;
        }
    return inputArr;
}

function rudy(id){
    if (players[id].name!="Rudy" || players[id].name!="rudy") return "Ty nie jesteś Rudy!";
    let rudysave = "brak";
    for (let i in players){
    console.log(players[i]);
        if (players[i].id!=id && (players[i].name=="rudy" || players[i].name=="Rudy")) {
            rudysave = players[i];
        }
    }
    if (rudysave!="brak"){
        players[id].points = rudysave.points;
        io.sockets.emit('state', playerList, players);
        return "Kolejny dc? Punkty przywrócone!"
    }
    return "Nie udało się przywrócić punktów :("
}

function kick(name){
console.log(name)
    for (let i in playerList){
        if (players[playerList[i]].name==name){
                      // remove commited cards of that person
                                io.to(playerList[i]).emit('clearBoard');
                                   for (let id2 in cardsPlayed){
                                       if (cardsPlayed[id2].player==playerList[i]) {
                                           cardsPlayed.splice(id2, 1);
                                           cardsPlayedi--;
                                       }
                                   }
                                emitEmptyWhite();
                                if (players[playerList[i]].tzar==true) {
                                // appoint new tzar
                                    tzarTag++;
                                    if (tzarTag>=playerList.length) tzarTag=0;
                                    players[playerList[tzarTag]].tzar=true;
                                    players[playerList[tzarTag]].pick=false;
                                    players[playerList[tzarTag]].amountPicked=0;
                                    if (acceptCards==true) io.to(playerList[tzarTag]).emit('blockTzar');
                                // remove played cards of new tzar
                                    for (let id2 in cardsPlayed){
                                             if (cardsPlayed[id2].player==players[playerList[tzarTag]].id) {
                                                 cardsPlayed.splice(id2, 1);
                                                 cardsPlayedi--;
                                             }
                                    }
                                    emitEmptyWhite();
                                }

                                //console.log(noPlayers, cardsPlayed.length, "sdikjfbnsdihfjswbfiuyshdgbusi");
                                if ((noPlayers-2<=cardsPlayed.length && prevBlack.type==0) || ((prevBlack.type*(noPlayers-2))<=cardsPlayed.length && (prevBlack.type==2 || prevBlack.type==3))) {
                                    acceptCards=false;
                                    acceptTzar=true;
                                }
                                if (acceptTzar==true) {
                                    shufflePlayed();
                                    players[playerList[tzarTag]].pick=true;
                                    io.sockets.emit('playedCards', cardsPlayed, prevBlack.type);
                                    io.sockets.emit('enableCards');
                                    for (let i in playerList){
                                      if (playerList[tzarTag]!=playerList[i]) io.to(playerList[i]).emit('playerWait');
                                    }
                                    io.to(playerList[tzarTag]).emit('tzarTurn');
                                }

                                playerList.splice(playerList[i], 1);
                                noPlayers--;

                                if (tzarTag<0) tzarTag=playerList.length-1;
                                else if (tzarTag>=noPlayers) tzarTag=0;

                                io.sockets.emit('state', playerList, players);
                                break;
        }
    }
                        io.sockets.emit('state', playerList, players);
                        console.log('user kicked', playerList);
                        if (noPlayers==0) {
                            pressed=false;
                            gameStarted=false;
                            decks=false;
                        }
    return name+" has been kicked from the game"
}

function emitEmptyWhite(){
                          io.sockets.emit('playedCards', [], 0);
                           if (prevBlack.type==0) {
                                      for (let i=0;i<cardsPlayed.length;i++){
                                           io.sockets.emit('playedCardsHidden');
                                      }
                           }
                           else if (prevBlack.type==2 || prevBlack.type==3){
                                        for (let i=0;i<cardsPlayed.length/prevBlack.type;i++){
                                            io.sockets.emit('playedCardsHidden');
                                        }
                           }
}

function generateEvent(){

}

function unpack(){
    for (let id in cards.black){
        console.log(cards.black[id].text)
    }

}

/*
setInterval(function() {
  io.sockets.emit('state', playerList, players);
}, 5000);*/
