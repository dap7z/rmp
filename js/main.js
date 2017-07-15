//"use strict"

var Appli = {
    
    //Attributs:
    audio:null,
    data:null,
    
    //Methods:
    constructor: function (){
        this.load();
        this.musicChange(1);
        //console.log(this.data);
    },
    
    load: function (){
        this.audio = $("#audio")[0];
        /* $.ajax({
            url: "/music.json",
            sucess: function(reponse){
                console.log(reponse);
                //PB CROSS ORIGIN
            }

        }); */
        var chaineJSON = `{
            "music": [
                {"title": "Blue Skies", "artist": "ArtistName1", "file": "Blue_Skies.mp3"},
                {"title": "Cartoon Hoedown", "artist": "ArtistName2", "file": "Cartoon_Hoedown.mp3"},
                {"title": "Earthy Crust", "artist": "ArtistName3", "file": "Earthy_Crust.mp3"},
                {"title": "Hold on a minute", "artist": "ArtistName4", "file": "Hold_On_a_Minute.mp3"},
                {"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
{"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
{"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
{"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
{"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
{"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
{"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
{"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
{"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
{"title": "Stay with you", "artist": "ArtistName5", "file": "Stay_With_You.mp3"},
                {"title": "Symphony no 5 by Beethoven", "artist": "ArtistName6", "file": "Symphony_No_5_by_Beethoven.mp3"}
            ]
        }`;

        var reponse = jQuery.parseJSON(chaineJSON);
        this.data = reponse;
        
        $(this.data["music"]).each(function(index, music){
            var identifier = index+1;
            var ancreMusic = "music"+identifier;
            var newPochette = $("#pochette-model").clone();
            //$(newPochette).removeAttr("id");
            $(newPochette).attr("id", ancreMusic);
            
            $("#pochette-container").append(newPochette);
            var pochetteInsere = $("#pochette-container").find(".pochette:last");
            
            pochetteInsere.find(".pochette-image").each(function(){
                var num = index+1;
                var url = $(this).attr("data-src");
                $(this).attr("src", url+num+".jpg");
            });
            pochetteInsere.find(".pochette-link").attr("data-identifier", identifier);
            pochetteInsere.find(".pochette-link").attr("href", "#"+ancreMusic);
            pochetteInsere.find(".pochette-title").html(music.title);
            pochetteInsere.find(".pochette-artist").html(music.artist);
            pochetteInsere.find(".pochette-file").val(music.file);
            pochetteInsere.removeClass("invisible");
            //console.log(music);
            //console.log( pochetteInsere.html() );
        });
    },
    
    musicPlayPause: function (){
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
        this.updateBtnPlay();
        this.updateDisplay();
    },
    
    musicChange: function(musicIdentifier, autoStart){
        musicIdentifier = parseInt(musicIdentifier);
        if(isNaN(musicIdentifier)) console.log('erreur app.music.change() not a number');
        else
        {
            var zeroBasedIndex = musicIdentifier-1;
            if(zeroBasedIndex < 0) console.log('erreur app.music.change() zeroBasedIndex < 0');
            else if(zeroBasedIndex >= this.data["music"].length) console.log('erreur app.music.change() zeroBasedIndex >= data[music].length');
            else
            {
                this.data.currentMusicIdentifier = musicIdentifier;
                var music = this.data["music"][zeroBasedIndex];
                $(this.audio).attr("src","ressources/mp3/"+music.file);
                $(".block-infos").find(".titreChanson").html(music.title);
                $(".block-infos").find(".nomArtiste").html(music.artist);
                if(autoStart){
                    this.audio.play();
                }
                //start next when this one end
                var self = this;
                this.audio.onended = function() {
                    self.musicNext();
                };
            }
        }
        this.updateSelection();
        this.updateBtnPlay();
        this.updateDisplay();
    },
    
    musicPrevious: function (){
        this.musicChange(this.data.currentMusicIdentifier-1, true);
    },
    
    musicNext: function (){
        this.musicChange(this.data.currentMusicIdentifier+1, true);
    },
    
    updateDisplay: function (){
        if(this.audio && !this.audio.paused)
        {
            var nbSecEcoulees = Math.round(this.audio.currentTime);
            var nbSecTotal = Math.round(this.audio.duration);

            var time = new Date();
            time.setHours(0);
            time.setMinutes(0);
            time.setSeconds(0);
            time.setSeconds(nbSecEcoulees);
            
            var progress = 0;
            if(!isNaN(nbSecTotal) && nbSecTotal>0){
                progress = Math.round(100*nbSecEcoulees/nbSecTotal);
            }
            $("#audio-progress").val(progress);  //0 a 100

            var min = time.getMinutes();
            if(min<10) min='0'+min;
            var sec = time.getSeconds();
            if(sec<10) sec='0'+sec;
            var aff = min+":"+sec;

            $("#audio-time").html(aff);
        }
    },
    
    updateBtnPlay: function (){
        var classCSS = ["fa-play-circle-o", "fa-pause-circle-o"];
        if (this.audio.paused) {
            $("#play").addClass(classCSS[0]);
            $("#play").removeClass(classCSS[1]);
        } else {
            $("#play").addClass(classCSS[1]);
            $("#play").removeClass(classCSS[0]);
        }
    },
    
    updateSelection: function (){
        var classCSS = "selected";
        var container = $("#pochette-container");
        container.find(".pochette").removeClass(classCSS);
        container.find("[data-identifier="+ (this.data.currentMusicIdentifier) +"]").closest(".pochette").addClass(classCSS);
    }

    
};




//===============================DOCUMENT==READY===============================
$(document).ready(function(){
    
    //var app = new Appli();  //TypeError: Appli is not a constructor
    var app = Object.create(Appli);
    app.constructor();  //charge donnees
    
    //mise a jour etat avencement:
    window.setInterval(function(){
        app.updateDisplay();
    }, 1000); //(100: trop court: empeche changement range par utilisateur
    
    
    //actions utilisateur:
    $("#audio-progress").on("input", function(){
        app.audio.currentTime = Math.round((this.value/100) * app.audio.duration);
        app.updateDisplay();
    });
	
	$("#play").click(function(){
        app.musicPlayPause();
    });
    $("#prev").click(function(){
        app.musicPrevious();
    });
    $("#next").click(function(){
        app.musicNext();
    });
    
    $("#sound-less,#sound-more").click( function(){
        var valOrigin = parseInt( $("#sound-volume").val() );
        
        var ajoutSon = 10;
        if(this.id == "sound-less"){
            ajoutSon = -ajoutSon;
        }
        
        $("#sound-volume").val(valOrigin + ajoutSon);
        $("#sound-volume").trigger("input");
    });
    $("#sound-volume").on("input", function(){
        app.audio.volume = this.value/100; //0 a 1
    });
    
    $(".pochette-link").click(function(){
        app.musicChange($(this).attr("data-identifier"), true);
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //==========================
    //CODE JS PLUS UTILISES
    //==========================
    
    /*
    //======================================================
    //affiche class bootstrap appliquee au redimensionnement
    //(valable seulement avec 1em = 16px)
    $(window).resize(function(){
        var w = $(window).width();
        var ClassBootsrapAppliquee = "Extra small devices";
        //Small devices
        if(w >= 576) ClassBootsrapAppliquee = "Small devices";
        //Medium devices
        if(w >= 768) ClassBootsrapAppliquee = "Medium devices";
        //Large devices
        if(w >= 992) ClassBootsrapAppliquee = "Large devices";
        //Extra large devices
        if(w >= 1200) ClassBootsrapAppliquee = "Extra large devices";
        
        var panelContents = '<div class="alert alert-info">w:'+w+' => ';
        panelContents += ClassBootsrapAppliquee+'</div>';
        $("#msg-panel").html(panelContents);
    });
    //======================================================
    */
    
    /* en em : plus lent et a priori pas plus precis
    //======================================================
    //affiche class bootstrap appliquee au redimensionnement
    $(window).resize(function(){
        var w = $(window).width() / parseFloat($("body").css("font-size"));
        var ClassBootsrapAppliquee = "Extra small devices";
        //Small devices
        if(w >= 34) ClassBootsrapAppliquee = "Small devices";
        //Medium devices
        if(w >= 48) ClassBootsrapAppliquee = "Medium devices";
        //Large devices
        if(w >= 62) ClassBootsrapAppliquee = "Large devices";
        //Extra large devices
        if(w >= 75) ClassBootsrapAppliquee = "Extra large devices";
        
        var panelContents = '<div class="alert alert-info">w:'+w+' => ';
        panelContents += ClassBootsrapAppliquee+'</div>';
        $("#msg-panel").html(panelContents);
    });
    //======================================================
    */
    
    
    
});

