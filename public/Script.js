const socket = io("/");
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
})
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    peer.on('call',call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream => {
            addVideoStream(video,userVideoStream)
        })
    })
    socket.on('user-connected',userId => {
        //connectToNewUser(userId,stream)
        console.log("New User Connected...");
        setTimeout(connectToNewUser,1000,userId,stream);
    })
    let text = $('input')
    $('html').keydown((e) => {
        if(e.which == 13 && text.val().length !== 0) {
            console.log(text.val())
            socket.emit('message',text.val());
            text.val('')
        }
    })
    socket.on('createMessage',message => {
        console.log('this is comming from server',message);
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToBottom()
    })
});
peer.on('open',id => {
    socket.emit('join-room', ROOM_ID, id)
})
const connectToNewUser = (userId,stream) => {
    console.log(`New User ${userId} joined room ${ROOM_ID}`);
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
}
const addVideoStream = (video,stream) => {
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',() => {
        video.play();
    })
    videoGrid.append(video);
}
const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}
const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}
const setMuteButton = () =>{
    const html = `
        <i class="fa fa-microphone" aria-hidden="true"></i>
        <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}
const setUnmuteButton = () =>{
    const html =`
        <i class="fa fa-microphone-slash" aria-hidden="true"></i>
        <span>UnMute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}
const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayVideo()
    }else{
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}
const setStopVideo = () => {
    const html = `
        <i class="fa fa-video-camera" aria-hidden="true"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;
}
const setPlayVideo = () => {
    const html = `
        <i class="fa fa-stop" aria-hidden="true"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;
}
