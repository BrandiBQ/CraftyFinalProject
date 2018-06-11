var gameArea = document.getElementById('gameArea');
var widthX = 1280;
var heightY = 700;


window.onload = function(){

Crafty.init(widthX, heightY, gameArea);

Crafty.scene('WelcomeScene');

} // end of onload



Crafty.scene('WelcomeScene', function () {
    document.getElementById('points').innerHTML = "<u>Scoreboard</u><br><br>"; 
    document.getElementById('transition').innerHTML = 
        "<h1>Welcome to the Washington Apple Cup!<br><br>" +
        "To win:<br> Collect 10 apples and don't get hit by rain more than 10 times.<br>The trees will protect you from the rain, but be careful;<br>when lightning stricks you only have a 50/50 chance if you are by a tree.<br><br>Press enter key to continue.</h1>";      
        Crafty.bind('KeyDown', function (e) {
            if (e.key == Crafty.keys.ENTER) {
                Crafty.enterScene("WashingtonAppleGame");
            }
        }); 
}); 

Crafty.scene('YouWonAppleGame', function () {
    Crafty.unbind("EnterFrame");
    Crafty.audio.stop();
    document.getElementById('transition').innerHTML = 
        "<h1>Congratulations! You Won!<br>" +
        "Welcome to Level 2: Mining Madness<br> Collect all the gold from the mines before the time runs out.<br>Watch out for the robber, he'll take all of your gold.<br><br>Press enter key to continue.</h1>";    
    Crafty.bind('KeyDown', function (e) {
        if (e.key == Crafty.keys.ENTER) {
            Crafty.enterScene("mineGameScene");
        }
    }); 
});

Crafty.scene('YouLostAppleGame', function () {    
    Crafty.audio.stop();
    Crafty.unbind("EnterFrame"); 
    // Crafty.unbind('UpdateFrame');
    document.getElementById('transition').innerHTML = 
        "<h1>Sorry! You Lost!<br>" +
        "Press enter key to play again.</h1>";   
    Crafty.bind('KeyDown', function (e) {
        if (e.key == Crafty.keys.ENTER) {
            Crafty.enterScene("WashingtonAppleGame");
        }
    }); 
    
});

Crafty.scene('YouWonMineGame', function () {  
    Crafty.unbind("EnterFrame"); 
    Crafty.background('');   
    document.getElementById('transition').innerHTML = 
        "<h1>Congratulations! You Conquered Both Worlds!<br></h1>";    
});

Crafty.scene('YouLostMineGame', function () {    
    Crafty.audio.stop();
    Crafty.unbind("EnterFrame");     
    Crafty.background('');    
    document.getElementById('transition').innerHTML = 
        "<h1>Sorry! You Lost!<br>" +
        "Press enter key to play again.</h1>"; 
    Crafty.bind('KeyDown', function (e) {
        if (e.key == Crafty.keys.ENTER) {
            Crafty.enterScene("mineGameScene");
        }
    }); 
});


Crafty.scene ('WashingtonAppleGame', function () {  
    document.getElementById('transition').innerHTML = ""; 
    
    var appleCounter = 0;
    var cloudCounter = 0;
    var rainCounter = 0;

    var appleAssets = {
        "sprites": {
            "assets/PlayerSpriteMap.png": {
                tile: 270,
                tileh: 421,
                map: {
                    sp_playerRunRight : [1, 1]
                }
            }
        }
    };

    Crafty.sprite('assets/LightningBolt.png', {bolt:[0,0,96,507]});
    Crafty.sprite('assets/tree.png', {tree:[0,0,133,161]});
    Crafty.sprite('assets/mountain.png', {mountain:[0,0,1280,357]});
    Crafty.sprite('assets/whiteclouds.png', {whiteclouds:[0,0,1280,418]});
    Crafty.sprite('assets/grass.png', {grass:[0,0,1280,150]});
    Crafty.sprite('assets/apple1.png', {apple:[0,0,20,20]});
    
    
    Crafty.e('2D, Canvas, mountain')
                         .attr({x:0, y:heightY-430});    
    Crafty.e('2D, Canvas, whiteclouds')
                         .attr({x:0, y:heightY-700});    
    Crafty.e('2D, Canvas, tree, Solid')
                      .attr({x:200, y:heightY-230});    
    Crafty.e('2D, Canvas, tree, Solid')
                      .attr({x:900, y:heightY-230});    
    Crafty.e('2D, Canvas, tree, Solid')
                      .attr({x:500, y:heightY-325, w: 233, h: 270});    
    Crafty.e('2D, Canvas, grass')
                      .attr({x:0, y:heightY-150});
    
Crafty.e('Floor, 2D, Canvas')
      .attr({x:0, y:heightY-10, w:widthX, h:10});
    
    var appleSounds = {
    "audio": {
        "music" : ['assets/appleMusic.mp3'],
        "thunder" : ['assets/thunderSound.mp3']
    }
};

Crafty.load(appleAssets);
Crafty.load(appleSounds);

Crafty.audio.play('music'); 

var playerRunRight = Crafty.e('2D, Canvas, Keyboard, sp_playerRunRight, playerRunRight, SpriteAnimation, Gravity, Collision, Twoway')
        .attr({x:0, y:heightY-150, w: 130, h: 150})
        .twoway(200)
        .checkHits('Drop')
        .gravity('Floor')        
        .bind("HitOn", function() {
            rainCounter++;
            hits.innerHTML = 'Rain Hits: ' + rainCounter;
            console.log('Rain Counter' + rainCounter); 
            if (rainCounter === 10) {
                Crafty.scene('YouLostAppleGame');
            }            
        })
        .reel("playerRunRight", 500, [
                [0, 0],
                [1, 0],
                [2, 0],
                [3, 0],                
                [0, 1],
                [1, 1],
                [2, 1]

          ])
        .reel("playerRunLeft", 500, [
                [4, 0],    
                [3, 1],
                [4, 1],
                [0, 2],
                [1, 2],
                [2, 2],
                [3, 2]
        ])
        .bind("KeyDown", function (e) {
            if (e.key == Crafty.keys.RIGHT_ARROW) {
                this.animate('playerRunRight', -1);
            } else if (e.key == Crafty.keys.LEFT_ARROW) {
                this.animate('playerRunLeft', -1);
            }
        });

var cloudX = Math.floor((Math.random() * (575-10)) + 10);
var boltRandom = Math.floor((Math.random() * 6) + 3);
var boltArray = [true, false];
var trueOrFalse = Math.floor((Math.random() * 2) + 0);    
    
var points = document.getElementById("points");
points.innerHTML = '<u>Scoreboard</u><br><br>Apples: ' + appleCounter;

Crafty.e('2D, Canvas, Collision, apple')
      .attr({x:280, y:520})
      .checkHits('playerRunRight')   
      .bind('HitOn', function () {      
        appleCounter+=1;
        cloudCounter+=1;
        points.innerHTML = '<u>Scoreboard</u><br><br>Apples: ' + appleCounter;
        if (appleCounter === 1 || appleCounter === 3 || appleCounter === 6) {
            this.x = Math.floor((Math.random() * (1020-930)) + 930);
            this.y = Math.floor((Math.random() * (540-500)) + 500);
        }
        if (appleCounter === 2 || appleCounter === 4 || appleCounter === 7) {
            this.x = Math.floor((Math.random() * (320-230)) + 230);
            this.y = Math.floor((Math.random() * (540-500)) + 500);
        }
        if (appleCounter === 5 || appleCounter === 8 || appleCounter === 9) {
            this.x = Math.floor((Math.random() * (710-550)) + 550);
            this.y = Math.floor((Math.random() * (510-410)) + 410);
        }

        if (cloudCounter > 1) {
            Crafty.e ('Raincloud, 2D, Canvas, Image')
                  .attr({x:150, y:-130})
                  .image('assets/stormCloud.png');
            Crafty.e ('Raincloud2, 2D, Canvas, Image')
                  .attr({x:-200, y:-180})
                  .image('assets/StormCloud2.png');
            Crafty.e ('Raincloud3, 2D, Canvas, Image')
                  .attr({x:550, y:-180})
                  .image('assets/StormCloud3.png');        
        }
    
        if (appleCounter === boltRandom) {            
            Crafty.audio.play('thunder') 
            var bolt = Crafty.e("2D, Canvas, bolt, Collision")
                             .attr({x:250, y:140})
                             .checkHits('playerRunRight')
                             .bind("HitOn", function() {
                               console.log('Lightning 1 hit!'); 
                               if (boltArray[trueOrFalse] === false) {
                                points.innerHTML = "YOU'VE BEEN STRUCK BY LIGHTNING!!!";                
                                setTimeout(function(){ Crafty.scene('YouLostAppleGame'); }, 1000)}
                            });
            var bolt1 = Crafty.e("2D, Canvas, bolt, Collision")
                             .attr({x:600, y:140})
                             .checkHits('playerRunRight')
                             .bind("HitOn", function() {
                               console.log('Lightning 2 hit!'); 
                               if (boltArray[trueOrFalse] === false) {
                                   points.innerHTML = "YOU'VE BEEN STRUCK BY LIGHTNING!!!";                
                                   setTimeout(function(){ Crafty.scene('YouLostAppleGame'); }, 1000)}
                            });
            var bolt2 = Crafty.e("2D, Canvas, bolt, Collision")
                             .attr({x:950, y:130})
                             .checkHits('playerRunRight')
                             .bind("HitOn", function() {
                               console.log('Lightning 3 hit!');
                               if (boltArray[trueOrFalse] === false) {
                                points.innerHTML = "YOU'VE BEEN STRUCK BY LIGHTNING!!!";                
                                setTimeout(function(){ Crafty.scene('YouLostAppleGame'); }, 1000)}
                            });
            console.log("PlayerX: " + playerRunRight.x);
            console.log("TrueFalse: " + boltArray[trueOrFalse]);
            
            setTimeout(function() {bolt.destroy();}, 1000); 
            setTimeout(function() {bolt1.destroy();}, 1000); 
            setTimeout(function() {bolt2.destroy();}, 1000);
        };    
        if (appleCounter === 10) {
            Crafty.scene('YouWonAppleGame');        
        }
    });


var hits = document.getElementById("hits");
hits.innerHTML = 'Rain Hits: ' + rainCounter;

Crafty.bind("EnterFrame", function () {
    if ((Crafty.frame() % 8 == 0) && (cloudCounter > 1)) {
        var randomx = Math.floor((Math.random() * widthX-250) + 20);
        var Drop = Crafty.e('Drop, 2D, Canvas, Color, Solid, Gravity, Collision')
        .attr({x: randomx, y: 150, w: 2, h: 10})
        .color('#000080')
        .gravity()
        .gravityConst(200)
        // .checkHits('playerRunRight')
        .checkHits('tree')
        .bind("HitOn", function () {
            this.destroy();

        })
    }
});

}); // End of Washington Apple scene.


// *****************************************************************************
// MINE SCENE STARTS HERE
// *****************************************************************************

Crafty.scene('mineGameScene', function () {       
    document.getElementById('transition').innerHTML = ""; 
    Crafty.unbind("EnterFrame");
    hits.innerHTML = '';
    
// *****************************************************************************
// Countdown timer.
// *************************
    
    var count=25;
    var timeRemaining = document.getElementById("timeRemaining");
    timeRemaining.innerHTML = "Time: " + count;    
    var counter=setInterval(timer, 1000);
    function timer() {
        count=count-1;
        timeRemaining.innerHTML = "Time: " + count;        
        if (count === 0 || (playerRunRight.x === robberRunRight.x && playerRunRight.y === robberRunRight.y) && coinPoints > 5) {  
            Crafty.scene("YouLostMineGame") 
            clearInterval(counter); 
            }
        if (coinPoints === 5){            
            Crafty.scene("YouWonMineGame") 
            clearInterval(counter); 
        };
    };
    
// *****************************************************************************
// Loading sprites and audio.
// *****************************************************************************
        
    Crafty.background('url(assets/MineBackground.png) center center');
    var mineAssets = {    
    "sprites": {
        "assets/PlayerSpriteMap.png": {
            tile: 278,
            tileh: 429,
            map: {
                sp_playerRunRight : [4, 0]
            }
        },
        "assets/RobberSpriteMap.png": {
            tile: 278,
            tileh: 429,
            map: {
                sp_robberRunRight : [4, 0]
            }
        }
    }
};
    
    var mineSounds = {
        "audio": {
            "coinMusic" : ['assets/CoinSound.mp3']
        }
    };

    Crafty.load(mineAssets);
    Crafty.load(mineSounds);
    Crafty.sprite('assets/Coin.png', {coin:[0,0,2233,2243]});
    Crafty.sprite('assets/Mine01.png', {mine:[0,0,95,94]});

    var coinsToPlace = 5;
    var mineArray = [0, 0, 0, 0, 0, 0, 0];
    var myRandom = 0;
    var arrayPointer = 0;

    do {
        myRandom = getRandom();

        if (myRandom === 1 && mineArray[arrayPointer] === 0){
            mineArray[arrayPointer] = 1;
            coinsToPlace--;
        }
        else
        {
            if (arrayPointer === mineArray.length)
            {
                arrayPointer = 0;
            }
            else
            {
                arrayPointer++;
            }
        }

    } while (coinsToPlace > 0);

    function getRandom() {
        var tempRandom = Math.random();
        if (Math.random() >= 0.5) {
            return 1;
        }
        else
        {
            return 0;
        }
    }

        var mine01 = Crafty.e("2D, Canvas, mine")
                           .attr({x:980, y:150});
        var coin01 = Crafty.e("2D, Canvas, coin, Collision")
                           .attr({x:1000, y:150, w:50, h:50})
                           .checkHits('playerRunRight')
                           .bind('HitOn', function () {          
                               this.destroy();
                            });

        var mine02 = Crafty.e("2D, Canvas, mine")
                           .attr({x:900, y:550});
        var coin02 = Crafty.e("2D, Canvas, coin, Collision")
                           .attr({x:920, y:550, w:50, h:50})
                            .checkHits('playerRunRight')
                           .bind('HitOn', function () {          
                               this.destroy();
                            });

        var mine03 = Crafty.e("2D, Canvas, mine")
                           .attr({x:200, y:575});
        var coin03 = Crafty.e("2D, Canvas, coin, Collision")
                           .attr({x:220, y:575, w:50, h:50})
                            .checkHits('playerRunRight')
                           .bind('HitOn', function () {          
                               this.destroy();
                            });

        var mine04 = Crafty.e("2D, Canvas, mine")
                           .attr({x:275, y:275});
        var coin04 = Crafty.e("2D, Canvas, coin, Collision")
                           .attr({x:295, y:275, w:50, h:50})
                            .checkHits('playerRunRight')
                           .bind('HitOn', function () {          
                               this.destroy();
                            });

        var mine05 = Crafty.e("2D, Canvas, mine")
                           .attr({x:500, y:250});
        var coin05 = Crafty.e("2D, Canvas, coin, Collision")
                           .attr({x:520, y:250, w:50, h:50})
                           .checkHits('playerRunRight')
                           .bind('HitOn', function () {          
                               this.destroy();
                            });

        var mine06 = Crafty.e("2D, Canvas, mine")
                           .attr({x:800, y:450});
        var coin06 = Crafty.e("2D, Canvas, coin, Collision")
                            .attr({x:820, y:450, w:50, h:50})
                            .checkHits('playerRunRight')
                            .bind('HitOn', function () {          
                                this.destroy();
                            });
        

        var mine07 = Crafty.e("2D, Canvas, mine")
                           .attr({x:100, y:100});
        var coin07 = Crafty.e("2D, Canvas, coin, Collision")
                           .attr({x:120, y:100, w:50, h:50})
                           .checkHits('playerRunRight')
                           .bind('HitOn', function () {          
                               this.destroy();
                           });

    
    //destroy 2 of the 7 coins

    if (mineArray[0] === 0)
    {
        coin01.destroy();
    }
    if (mineArray[1] === 0)
    {
        coin02.destroy();
    }
    if (mineArray[2] === 0)
    {
        coin03.destroy();
    }
    if (mineArray[3] === 0)
    {
        coin04.destroy();
    }
    if (mineArray[4] === 0)
    {
        coin05.destroy();
    }
    if (mineArray[5] === 0)
    {
        coin06.destroy();
    }
    if (mineArray[6] === 0)
    {
        coin07.destroy();
    }
    
    
    Crafty.sprite('assets/stump01.png', {stump:[0,0,48,42]});

        var stump01 = Crafty.e("2D, Canvas, stump, Solid")
                            .attr({x:500, y:80});

        var stump02 = Crafty.e("2D, Canvas, stump, Solid")
                            .attr({x:500, y:50});

        var stump03 = Crafty.e("2D, Canvas, stump, Solid")
                            .attr({x:550, y:50});

        var stump04 = Crafty.e("2D, Canvas, stump, Solid")
                            .attr({x:650, y:350});

        var stump05 = Crafty.e("2D, Canvas, stump, Solid")
                            .attr({x:850, y:275});

        var stump06 = Crafty.e("2D, Canvas, stump, Solid")
                            .attr({x:150, y:500});

        var stump07 = Crafty.e("2D, Canvas, stump, Solid")
                            .attr({x:150, y:550});

        var stump08 = Crafty.e("2D, Canvas, stump, Solid")
                            .attr({x:200, y:500});
    
// *****************************************************************************
// Loading the different trees.
// *****************************************************************************

    
Crafty.sprite('assets/tree.png', {tree:[0,0,133,161]});

    var tree01 = Crafty.e("2D, Canvas, tree, Solid")
              .attr({x:350, y:275});
    
    var tree02 = Crafty.e("2D, Canvas, tree, Solid")
      .attr({x:450, y:375});
    
    var tree03 = Crafty.e("2D, Canvas, tree, Solid")
      .attr({x:700, y:50});
    
    var tree04 = Crafty.e("2D, Canvas, tree, Solid")
      .attr({x:200, y:10});
    
    var tree05 = Crafty.e("2D, Canvas, tree, Solid")
      .attr({x:600, y:400});
    
    var tree06 = Crafty.e("2D, Canvas, tree, Solid")
      .attr({x:1050, y:300});
    
    var tree07 = Crafty.e("2D, Canvas, tree, Solid")
      .attr({x:950, y:450});

    
// *****************************************************************************
// Player details.
// *****************************************************************************
    
    var coinPoints = 0;
    var points = document.getElementById("points");
    points.innerHTML = "<u>Scoreboard</u><br><br>Coins: " + coinPoints;
    var playerRunRight = Crafty.e('2D, sp_playerRunRight, playerRunRight, Canvas, SpriteAnimation, Collision, Fourway')
        .attr({x:0, y:heightY-150, w: 26, h: 30})
        .fourway(200)
        .checkHits('coin')
        .bind('HitOn', function () {            
            Crafty.audio.play('coinMusic');
            coinPoints += 1;
            points.innerHTML = "<u>Scoreboard</u><br><br>Coins: " + coinPoints;
         })
         .bind('Moved', function(evt){
            if (this.hit('Solid')){
                // evt still exists, but not evt.axis or .oldValue
                this[evt.axis] = evt.oldValue;
            }
         });
    
    var robberRunRight = Crafty.e('2D, sp_robberRunRight, Canvas, SpriteAnimation, Collision')
        .attr({x:1000, y:heightY-450, w: 26, h: 30})
        .flip("X")
        .checkHits('playerRunRight')
        .bind('HitOn', function () {
            clearInterval(counter);          
            Crafty.scene('YouLostMineGame');
        })
        //create movement to try to collide with the player
        .bind("EnterFrame", function() {
            let xDiff = Math.abs(this.x - playerRunRight.x);
            let yDiff = Math.abs(this.y - playerRunRight.y);

            //set a maximum speed of 2
            if (xDiff > 2) {
                xDiff = 2;
            }

            if (yDiff > 2) {
                yDiff = 2;
            }

            if (this.x > playerRunRight.x)
            {
                this.x = this.x - xDiff;
            }
            
            if (this.x < playerRunRight.x)
            {
                this.x = this.x + xDiff;
            }
            
            if (this.y > playerRunRight.y)
            {
                this.y = this.y - yDiff;
            }
            if (this.y < playerRunRight.y)
            {
                this.y = this.y + yDiff;
            }
            
            /*this is an alternate way to check whether to end the game
            if ((this.x === playerRunRight.x && this.y === playerRunRight.y)) 
            {
                //game over
                console.log("end game");
            }
            */
        })
    
        //have the NPC navigate around obstacles
    ;
    
    /*
    Crafty.c('NPC', {
            init: function() {
                this.requires('2D, Canvas, Collision, playerRunRight, NPCsprite, spr_robber')
                    .onHit('playerRunRight', this.playerCollision)

                    //Have the NPC move toward the player

                    //Have the NPC collide with and move around objects

                    //Constrain the NPC by the edges of the screen
            },
        }
    );

    this.myNPC = Crafty.e('NPC').at(5, 5);
    */

});    
// *****************************************************************************
// End of mine scene.
// *****************************************************************************
