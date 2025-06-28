const uploadForm = document.getElementById('upload-form');

uploadForm.onsubmit = async (e) => {
    e.preventDefault(); 
    if(!e.target.image.files[0]){
        alert("Please select an image to upload.");
        return;
    }else {
        const formData = new FormData();
        formData.append('image', e.target.image.files[0]);
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        e.target.image.value = ''; 
        console.log(`Response status: ${response.status}`);
        if(response.ok){
            alert("Image uploaded successfully!");
        }else {
            alert("Failed to upload image. Please try again.");
        }   

    }
    
}