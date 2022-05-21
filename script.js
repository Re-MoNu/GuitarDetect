// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/xgG82t4Zw/";
    function displayHelp() {
        alert("Start 버튼을 눌러서 카메라를 켜주세요!");
        alert("그다음 카메라에 기타를 비춰주시면 ai가 무슨 기타인지 알려드립니다!")
    }
    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
        
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        document.getElementById("webcam-container").innerHTML="";
        window.requestAnimationFrame(loop);
        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        let tempCount=1;
        let guitarCount=0;
        let guitarMuch=0;
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                parseInt(prediction[i].probability.toFixed(2)*100);
            
            document.getElementById("bar-0" + tempCount).style.width = classPrediction + "%";
            document.getElementById("bar-0" + tempCount).innerText = prediction[i].className + ": " + classPrediction + "%";
            if(parseInt(prediction[i].probability.toFixed(2)*100) > guitarMuch+10){
                guitarCount=i;
                guitarMuch = parseInt(prediction[i].probability.toFixed(2)*100);
            }
            tempCount++;
        }
        switch(parseInt(guitarCount)) {
            case 0:
                document.getElementById("thinkbox").innerText = "TM: I think this is an Electric Guitar!"
                break;
            case 1:
                document.getElementById("thinkbox").innerText = "TM: I think this is a Bass Guitar!"
                break;
            case 2:
                document.getElementById("thinkbox").innerText = "TM: I think this is an Acoustic Guitar!"
                break;
            default:
                document.getElementById("thinkbox").innerText = "Error"
                break;
        }
    }
//document.getElementById("thinkbox").innerText = "I think this is a(n) " + prediction[i].className + " Guitar!"