
async function fetchFiles() {
    try {
        const response = await axios.get('http://localhost:8080/data/1Oo0V4-I6dthQq1CQX28Xwq8qgw5PbZqD');
        const data = response.data;
        console.log(data)
        if (data.length) {
            let box = document.getElementById('box');
            console.log(data)
            data.forEach((file) => {
               
                const vd = document.createElement('iframe');
                vd.src=file.webViewLink.substring(0,file.webViewLink.indexOf('/view'))+'/preview';
                // vd.innerHTML=`Nmae:${file.name}, Type:${file.mimeType}`
                box.appendChild(vd);
            });
        } else {
            document.getElementById('box').innerHTML = '<p>No files found in the folder.</p>';
        }
    } catch (error) {
        console.error('Error fetching files:', error);
    }
}
async function test(){
    axios.get('http://localhost:8080/data/1Oo0V4-I6dthQq1CQX28Xwq8qgw5PbZqD')
    .then(doc=>{
        console.log(doc.data)
    }).catch((err)=>{
        console.log(err)
    })
}

test();
fetchFiles();