
let VoiceRecorder = new class {
   constructor() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia === false) {
            alert('Sound recording is not available');
        }

        this.recordRTC = null;
    }

    startRecoring() {
        var session = {
            audio: true,
            video: false
       };
       
       navigator.getUserMedia(session, (mediaStream) => {
           this.recordRTC = RecordRTC(mediaStream, { type: 'audio' });

           this.recordRTC.setRecordingDuration(5 * 1000).onRecordingStopped((url) => {
               console.log(url);
               this.recordRTC.save('fname.wav');
           });

           this.recordRTC.startRecording();
       }, function (err) {
           console.log("Error occurred: " + err.name);
       });
   }

   stopRecording() {
       this.recordRTC.stopRecording((url) => {
           console.log(url);
           this.recordRTC.save('fname.wav');
       });
   }
}();



