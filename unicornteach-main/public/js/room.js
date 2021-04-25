
const socket = io();
socket.emit("join-room", USERID, ROOMID);

socket.on("new-member", userId => {
    console.log(userId);
})


window.addEventListener('load', () => {

    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext('2d');

    // Resizing 
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // variables
    let drawing = false;
    let x = 0;
    let y = 0;


    canvas.addEventListener('mousedown', e => {
            // Drawing begins 
            x = e.offsetX;
            y = e.offsetY;
            drawing = true;
        });
    
    canvas.addEventListener('mousemove', e => {
        // Drawing continues 
        if (drawing === true) {
            drawLine(ctx, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });
    
    window.addEventListener('mouseup', e => {
        // Drawing ends 
        if (drawing === true) {
            drawLine(ctx, x, y, e.offsetX, e.offsetY);
            console.log(`x: ${x} y: ${y}`)
            x = 0;
            y = 0;
            drawing = false;
        }
    });



    socket.on('update_canvas',function(data){

        let {x1,y1,x2,y2} = JSON.parse(data);
        drawLine(ctx ,x1,y1,x2,y2,true);

    });

    function drawLine(context, x1, y1, x2, y2,from_server = false) {
        console.log(`x: ${x} y: ${y}`)
        if(!from_server)
            socket.emit('update_canvas',JSON.stringify({x1,y1,x2,y2}));
        
        // Draw line 

            if(eraser==true)
            {
            context.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = 100;
            context.lineCap = 'round'
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
            }
            else 
            {
            context.beginPath();
            context.strokeStyle = "white";
            context.lineWidth = 5;
            context.lineCap = 'round'
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
            }
        }

})

