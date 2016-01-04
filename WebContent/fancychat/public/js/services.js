(function(appServices){
  appServices.factory("restService", function($http){
    return {
      get: function(url, successFn, errorFn){
        $http({
          method: 'GET',
          url: url
        }).then(function successCallback(response) {
            if(successFn) { successFn(response); }
          }, function errorCallback(response) {
            if(errorFn) { errorFn(response); }
          });
      },
      post: function(url, data){
        $http({
          method: 'POST',
          url: url,
          headers: {
           'Content-Type': "application/json"
          },
          data: data
        }).then(function successCallback(response) {
            if(successFn) { successFn(response); }
          }, function errorCallback(response) {
            if(errorFn) { errorFn(response); }
          });
      }
    }
  });

  appServices.factory("socketService", function($rootScope){
    var socket = io.connect();
    return {
      init: function(roomId, username){
        // Tell the server your username
        socket.emit('add user', username);
        //join the room
        socket.emit('room', roomId);
      },
      emit: function(eventName, data, callback){
        // tell server to execute 'new message' and send along one parameter
        socket.emit(eventName, data, function(){
          var args = arguments;
          $rootScope.$apply(function(){
            if(callback){ callback.apply(socket, args); }
          });
        });
      },
      on: function(eventName, callback){
        // Whenever the server emits 'new message', update the chat body
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function(){
            if(callback){ callback.apply(socket, args); }
          });
        });
      }
    }
  });

  appServices.factory("drawService", function(socketService){
    var drawer = { current: "line" };
    $( window ).on('resize', function() {
      var width = drawer.ctx.canvas.width;
      var height = drawer.ctx.canvas.height;
      var imgData=drawer.ctx.getImageData(0, 0, width, height);
      drawer.ctx.canvas.width = drawer.canvasContainer.width();
      drawer.ctx.canvas.height = $(window).height() - 120;
      drawer.ctx.putImageData(imgData, 0, 0);
    });

    return {
      init: function(canvasId, canvasContainerId){

      	drawer.c = document.getElementById(canvasId);
      	drawer.ctx = drawer.c.getContext("2d");
        drawer.canvasContainer = $("#" + canvasContainerId);
        drawer.canvas = $("#" + canvasId);

      	drawer.ctx.canvas.width = drawer.canvasContainer.width();
      	drawer.ctx.canvas.height = $(window).height() - 120;

      	var mouseDown = false;
      	drawer.canvas.on( "mousedown", function(e){
      		mouseDown = true;
      		var data = {x: e.offsetX, y: e.offsetY};
      		startline(data);
      		socketService.emit('startline', data);
      		//console.log('mousedown', e.offsetX, e.offsetY);
      	} );

      	drawer.canvas.on( "mouseup", function(e){
      		mouseDown = false;
      		//console.log('mouseup', e.offsetX, e.offsetY);
      	} );

      	drawer.canvas.on( "mousemove", function(e){
      		if(mouseDown){
      			var data = {x: e.offsetX, y: e.offsetY};
      			drawline(data);
      			socketService.emit('drawline', data);
      			//console.log('mousemove', e.offsetX, e.offsetY);
      		}
      	} );

      	var startline = function(data){
      		//drawer.ctx.clearRect(0,0,200,200);
      		drawer.ctx.beginPath();
      		drawer.ctx.moveTo(data.x, data.y);
      	};

      	var drawline = function(data){
      		drawer.ctx.lineTo(data.x, data.y);
      		drawer.ctx.stroke();
      	};

      	socketService.on('startline', function (data) {
      	   startline(data);
      	});

      	socketService.on('drawline', function (data) {
      	   drawline(data);
      	});
      },
      toolSet: function(data){
        drawer.current = data.drawingTool;
      }
    }
  });

  appServices.factory("roomService", function(){
    var room = {};
    return {
      get: function(){
        return room;
      },
      set: function(r){
        room = r;
      }
    }
  });

  appServices.factory("webrtcService", function(socketService){
    var startButton = document.getElementById('startButton');
    var callButton = document.getElementById('callButton');
    var hangupButton = document.getElementById('hangupButton');
    callButton.disabled = true;
    hangupButton.disabled = true;
    startButton.onclick = start;
    callButton.onclick = call;
    hangupButton.onclick = hangup;

    var startTime;
    var localVideo = document.getElementById('localVideo');
    var remoteVideo = document.getElementById('remoteVideo');

    localVideo.addEventListener('loadedmetadata', function() {
      trace('Local video videoWidth: ' + this.videoWidth +
        'px,  videoHeight: ' + this.videoHeight + 'px');
    });

    remoteVideo.addEventListener('loadedmetadata', function() {
      trace('Remote video videoWidth: ' + this.videoWidth +
        'px,  videoHeight: ' + this.videoHeight + 'px');
    });

    remoteVideo.onresize = function() {
      trace('Remote video size changed to ' +
        remoteVideo.videoWidth + 'x' + remoteVideo.videoHeight);
      // We'll use the first onsize callback as an indication that video has started
      // playing out.
      if (startTime) {
        var elapsedTime = window.performance.now() - startTime;
        trace('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
        startTime = null;
      }
    };

    var localStream;
    var pc1;
    var pc2;
    var offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    };

    function getName(pc) {
      return (pc === pc1) ? 'pc1' : 'pc2';
    }

    function getOtherPc(pc) {
      return (pc === pc1) ? pc2 : pc1;
    }

    function gotStream(stream) {
      trace('Received local stream');
      localVideo.srcObject = stream;
      localStream = stream;
      callButton.disabled = false;
    }

    function start() {
      trace('Requesting local stream');
      startButton.disabled = true;
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      })
      .then(gotStream)
      .catch(function(e) {
        alert('getUserMedia() error: ' + e.name);
      });
    }

    function call() {
      callButton.disabled = true;
      hangupButton.disabled = false;
      trace('Starting call');
      startTime = window.performance.now();
      var videoTracks = localStream.getVideoTracks();
      var audioTracks = localStream.getAudioTracks();
      if (videoTracks.length > 0) {
        trace('Using video device: ' + videoTracks[0].label);
      }
      if (audioTracks.length > 0) {
        trace('Using audio device: ' + audioTracks[0].label);
      }
      var servers = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
      pc1 = new RTCPeerConnection(servers);
      trace('Created local peer connection object pc1');
      pc1.onicecandidate = function(e) {
        onIceCandidate(pc1, e);
      };
      pc2 = new RTCPeerConnection(servers);
      trace('Created remote peer connection object pc2');
      pc2.onicecandidate = function(e) {
        onIceCandidate(pc2, e);
      };
      pc1.oniceconnectionstatechange = function(e) {
        onIceStateChange(pc1, e);
      };
      pc2.oniceconnectionstatechange = function(e) {
        onIceStateChange(pc2, e);
      };
      pc2.onaddstream = gotRemoteStream;

      pc1.addStream(localStream);
      trace('Added local stream to pc1');

      trace('pc1 createOffer start');
      pc1.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError,
          offerOptions);
    }

    function onCreateSessionDescriptionError(error) {
      trace('Failed to create session description: ' + error.toString());
    }

    function onCreateOfferSuccess(desc) {
      trace('Offer from pc1\n' + desc.sdp);
      trace('pc1 setLocalDescription start');
      pc1.setLocalDescription(desc, function() {
        onSetLocalSuccess(pc1);
      }, onSetSessionDescriptionError);
      trace('pc2 setRemoteDescription start');
      pc2.setRemoteDescription(desc, function() {
        onSetRemoteSuccess(pc2);
      }, onSetSessionDescriptionError);
      trace('pc2 createAnswer start');
      // Since the 'remote' side has no media stream we need
      // to pass in the right constraints in order for it to
      // accept the incoming offer of audio and video.
      pc2.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
    }

    function onSetLocalSuccess(pc) {
      trace(getName(pc) + ' setLocalDescription complete');
    }

    function onSetRemoteSuccess(pc) {
      trace(getName(pc) + ' setRemoteDescription complete');
    }

    function onSetSessionDescriptionError(error) {
      trace('Failed to set session description: ' + error.toString());
    }

    function gotRemoteStream(e) {
      remoteVideo.srcObject = e.stream;
      trace('pc2 received remote stream');
    }

    function onCreateAnswerSuccess(desc) {
      trace('Answer from pc2:\n' + desc.sdp);
      trace('pc2 setLocalDescription start');
      pc2.setLocalDescription(desc, function() {
        onSetLocalSuccess(pc2);
      }, onSetSessionDescriptionError);
      trace('pc1 setRemoteDescription start');
      pc1.setRemoteDescription(desc, function() {
        onSetRemoteSuccess(pc1);
      }, onSetSessionDescriptionError);
    }

    function onIceCandidate(pc, event) {
      if (event.candidate) {
        getOtherPc(pc).addIceCandidate(new RTCIceCandidate(event.candidate),
            function() {
              onAddIceCandidateSuccess(pc);
            },
            function(err) {
              onAddIceCandidateError(pc, err);
            }
        );
        trace(getName(pc) + ' ICE candidate: \n' + event.candidate.candidate);
      }
    }

    function onAddIceCandidateSuccess(pc) {
      trace(getName(pc) + ' addIceCandidate success');
    }

    function onAddIceCandidateError(pc, error) {
      trace(getName(pc) + ' failed to add ICE Candidate: ' + error.toString());
    }

    function onIceStateChange(pc, event) {
      if (pc) {
        trace(getName(pc) + ' ICE state: ' + pc.iceConnectionState);
        console.log('ICE state change event: ', event);
      }
    }

    function hangup() {
      trace('Ending call');
      pc1.close();
      pc2.close();
      pc1 = null;
      pc2 = null;
      hangupButton.disabled = true;
      callButton.disabled = false;
    }

    return {
      init: function(miniVideoId, remoteVideoId, localVideoId){

      },
      startLocalStream: function(){

      },
      stopLocalStream: function(){

      },
      startRemoteStream: function(){

      },
      stopRemoteStream: function(){

      }
    }
  });

}(angular.module("appServices", [])));
