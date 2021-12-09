class FourierSeries extends InteractiveBox {

    epicyclesColor = '#00ccff';
    linesColor = '#ffffff';
    pathColor = '#ffff00';
    verticalEpicyclesXOffset = 300;
    orizontalEpicyclesYOffset = 300;
    verticalEpicyclesYOffset = 100;
    orizontalEpicyclesXOffset = 100;

    #counter = 0;
    #signalY = [];
    #signalX = [];
    #signalY_DFT;
    #signalX_DFT;

    constructor(name, container, height, width) {
        super(name, container, height, width)

        this.setPoints(this.#getDefaultPath());
    }

    draw(ctx) {
        // Set time
        this.setTime(this.#counter++ / (this.#signalY.length - 1));
        if (this.#counter > this.#signalY.length) {
            this.#counter = 0;
        }

        this.clearCanvas();
        
        // Draw vertical epicycles
        var lastPointX = this.drawEpicycles(ctx, this.#signalX_DFT, this.verticalEpicyclesXOffset, this.verticalEpicyclesYOffset, 0);
        // Draw  epicycles
        var lastPointY = this.drawEpicycles(ctx, this.#signalY_DFT, this.orizontalEpicyclesXOffset, this.orizontalEpicyclesYOffset, Math.PI * 0.5);
        
        ctx.strokeStyle = this.linesColor;
        ctx.beginPath();
        
        ctx.moveTo(this.orizontalEpicyclesXOffset + lastPointY.x, this.orizontalEpicyclesYOffset + lastPointY.y);
        // since the horizontal line oscillates vertically,
        // it gives the impression of being bigger with
        // repect to the other one.            
        ctx.lineWidth = 0.25;
        ctx.lineTo(this.verticalEpicyclesXOffset + lastPointX.x, this.orizontalEpicyclesYOffset + lastPointY.y);
        
        ctx.stroke();
        ctx.lineWidth = 0.5;
        ctx.lineTo(this.verticalEpicyclesXOffset + lastPointX.x, this.verticalEpicyclesYOffset + lastPointX.y);
        ctx.stroke();
        
        
        ctx.beginPath();
        //ctx.lineWidth = 1.0;
        ctx.lineWidth = 2.0;
        ctx.strokeStyle = this.pathColor;
        ctx.moveTo(this.verticalEpicyclesXOffset + this.#signalX[0], this.#signalY[0] + this.orizontalEpicyclesYOffset);
        for (var i = 1; i < this.#counter; i++) {
            ctx.lineTo(this.verticalEpicyclesXOffset + this.#signalX[i], this.#signalY[i] + this.orizontalEpicyclesYOffset);
        }
        
        ctx.stroke();
    };

    onTimeTravel(value) {
        this.#counter = value * this.#signalY.length | 0;
    }

    setPoints(points) {
        this.#signalX = [];
        this.#signalY = [];

        // remove offset
        var minX = 10E5;
        var minY = 10E5;
        for (var i = 0; i < points.length; i++) {
            if (points[i].x < minX) {
                minX = points[i].x;
            }

            if (points[i].y < minY) {
                minY = points[i].y;
            }
        }

        for (var i = 0; i < points.length; i++) {
            this.#signalX[i] = points[i].x - minX;
            this.#signalY[i] = points[i].y - minY;
        }

        this.#counter = 0;

        this.#signalY_DFT = Fourier.dft(this.#signalY);
        this.#signalX_DFT = Fourier.dft(this.#signalX);
    }

    drawEpicycles(ctx, fourier, xOff, yOff, rot) {
        var x = 0;
        var y = 0;

        for (var i = 0; i < fourier.length; i++) {
            var prevX = x;
            var prevY = y;

            // precompute these values
            var freq = i;
            var ampl = Math.sqrt(fourier[i].Re * fourier[i].Re + fourier[i].Im * fourier[i].Im);                
            var phase = Math.atan2(fourier[i].Im, fourier[i].Re);

            var arg = freq * this.#counter / this.#signalY.length * 2 * Math.PI + phase + rot;
            x += ampl * Math.cos(arg);
            y += ampl * Math.sin(arg);

            ctx.lineWidth = 1.0;
            ctx.strokeStyle = this.epicyclesColor;
            ctx.beginPath();
            ctx.arc(xOff + prevX, yOff + prevY, ampl, 0, Math.PI * 2);
            ctx.stroke();
           
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = this.linesColor;
            ctx.beginPath();
            ctx.moveTo(xOff + prevX, yOff + prevY);
            ctx.lineTo(xOff + x, yOff + y);
            ctx.stroke();
        }

        return {x, y}
    }

    #getDefaultPath() {
        return [{x:190.5,y:421.5},{x:188.5,y:423},{x:186.5,y:423.5},{x:183.5,y:424.5},{x:180,y:425},{x:176.5,y:425},{x:171,y:423.5},{x:166.5,y:421},{x:163.5,y:418.5},{x:162.5,y:417.5},{x:162,y:417},{x:157.5,y:397.5},{x:160.5,y:391},{x:162.5,y:388.5},{x:164.5,y:386.5},{x:170,y:383},{x:171.5,y:382.5},{x:176,y:381},{x:182,y:381},{x:192,y:385.5},{x:193.5,y:291},{x:193,y:291},{x:185,y:293},{x:184,y:293.5},{x:177.5,y:295},{x:175.5,y:295.5},{x:175,y:295.5},{x:174,y:296},{x:168.5,y:297},{x:164.5,y:298},{x:163.5,y:298.5},{x:158,y:300},{x:145,y:303},{x:140,y:304},{x:137,y:305},{x:133.5,y:306},{x:125,y:308},{x:121.5,y:308.5},{x:116,y:310},{x:115.5,y:310},{x:112,y:311},{x:109,y:312},{x:107,y:312.5},{x:95.5,y:315},{x:93,y:315.5},{x:92.5,y:316},{x:91.5,y:316},{x:89.5,y:316.5},{x:79,y:434},{x:78,y:436.5},{x:72,y:444},{x:66.5,y:447.5},{x:54.5,y:449.5},{x:53,y:449},{x:50.5,y:448.5},{x:47,y:447},{x:43.5,y:445},{x:40,y:442},{x:35.5,y:435},{x:35,y:433},{x:35,y:432},{x:34.5,y:423},{x:35,y:420.5},{x:35,y:419},{x:38,y:413},{x:39.5,y:411.5},{x:44.5,y:407},{x:45.5,y:406},{x:46,y:406},{x:48,y:405},{x:52.5,y:403.5},{x:53.5,y:403.5},{x:59,y:403},{x:74,y:310.5},{x:78,y:308.5},{x:79.5,y:308},{x:88,y:306},{x:95,y:304.5},{x:102.5,y:302.5},{x:103.5,y:302.5},{x:104,y:302.5},{x:106.5,y:301.5},{x:108,y:301.5},{x:115.5,y:299.5},{x:119,y:298.5},{x:124.5,y:297.5},{x:130,y:296},{x:146,y:292},{x:151.5,y:291},{x:152.5,y:290.5},{x:154,y:290.5},{x:159,y:289},{x:159.5,y:289},{x:164,y:288},{x:166.5,y:287.5},{x:168,y:287},{x:172,y:286},{x:174,y:285.5},{x:176,y:285},{x:196,y:280}];
    }

}