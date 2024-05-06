let generateForm = document.querySelector(".generatorForm");
let gallery = document.querySelector(".gallery");
const OPENAI_API_KEY = "harshsk-proj-UIj1nvoqbbgUjHAltljRT3BlbkFJ57aL6o8xdQ9tGXsLOMu4";
let isImageGenerating = false;

const updateCards = function(imageDataArray){
    imageDataArray.forEach(function(imageObject,index){

        const imgCard = gallery.querySelectorAll(".card")[index];
        const imageElement = imgCard.querySelector("img");
        const generatedImage = `data:image/jpeg;base64,${imageObject.b64_json}`;
        const downloadButton = imgCard.querySelector(".download-button");

        imageElement.src = generatedImage;

        imageElement.onload = function(){
            imgCard.classList.remove("loading");
            downloadButton.setAttribute("href",generatedImage);
            downloadButton.setAttribute("download",`${new Date().getTime()}.jpg`);
        }
    })
}

let imageGenerate = async function(imagePrompt,quantity){
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method:"POST",//post is used to send a request to server to update or create a resource
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY.substring(5)}`,
                
            },
            body: JSON.stringify({
                prompt: imagePrompt,
                n:parseInt(quantity),
                size:"512x512",
                response_format:"b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate image ! Try later")

        const {data}= await response.json();
        console.log(data);
        updateCards([...data]);
    } catch (error) {
        alert(error.message);
    }finally{
        isImageGenerating=false;
    }
}
generateForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(isImageGenerating) return ;
    isImageGenerating=true;
    // console.log(e.target);
    let imagePrompt = e.target[0].value;
    let quantity = e.target[1].value;
    // console.log(prompt);
    // console.log(quantity);
    let imageCards = Array.from({length:quantity},()=>
        `<div class="card loading">
        <img src="./loader.svg" alt="image1">
        <a href="#" class="download-button">
            <img src="./download.svg" alt="download icon">
        </a>
    </div>`
    ).join("");
    // console.log(imageCards);
    gallery.innerHTML = imageCards;
    imageGenerate(imagePrompt,quantity);
})
