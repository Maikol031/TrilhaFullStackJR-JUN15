const form = document.getElementById("form");
const deleteButton = document.querySelector(".button-delete");
const downloadButton = document.querySelector(".button-download");
const saveButton = document.querySelector(".button-send");
const editButton = document.querySelector("#editButton");
editButton.style.display = 'none';
let fileName = '';
let method = 'create'; 
let jobId = 0;

const loading = () => {
    JsLoadingOverlay.show();
    setTimeout(() => {
        JsLoadingOverlay.hide();
    }, 1000);
}

const getList = async() => {
    loading()
    const response = await fetch("http://localhost:3000/pictures/", {
        method: "GET",
    })
    const data = await response.json();
    return data;
}


const getById = async(id) => {
    saveButton.style.display = 'none';
    deleteButton.style.display = 'flex';
    downloadButton.style.display = 'flex';
    editButton.style.display = 'flex';

    const inputs = document.querySelectorAll('.editable');
    const fileInput = document.getElementById('fileInput');

    inputs.forEach(input => {
        input.disabled = true;
    });

    if (fileInput) {
        fileInput.disabled = true;
    }
    try {
        const response = await fetch(`http://localhost:3000/pictures/${id}`, {
            method: "GET",
        })
        const data = await response.json();
    
        document.getElementById("projectTitle").value = data.name;
        document.getElementById("projectDescription").value = data.description;
        fileName = data.src.split('\\').pop();
        jobId = data._id;
        
    } catch (error) {
        alert(error.message);
    }
}

const download = async() => {
    const fileUrl = `http://localhost:3000/pictures/download/${fileName}`;
    const response = await fetch(fileUrl);
    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

const editTest = () => {
    saveButton.style.display = 'flex';
    editButton.style.display = 'none';
    method = 'edit';
    const inputs = document.querySelectorAll('.editable');
    inputs.forEach(input => {
        input.disabled = !input.disabled; 
    });
    const fileInput = document.getElementById('fileInput');
    fileInput.disabled = !fileInput.disabled;

}

const update = async() => {
    const name =  document.getElementById("projectTitle").value;
    const description = document.getElementById("projectDescription").value;
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('name', name);
    try {
        await fetch(`http://localhost:3000/pictures/${jobId}`, {
            method: "PUT",
            body: formData
        });
        
    } catch (error) {
        alert(error.message);
    }

    const itemToRemove = document.getElementById(`item-${jobId}`);
    if (itemToRemove) {
        itemToRemove.remove();
    }
    method = 'create';
    await onMounted();
    newForm();
}

async function onMounted() {
    let data = await getList();
    let list = document.getElementById("projectList").innerHTML;
    
    const existingIds = new Set();
    
    const currentItems = document.querySelectorAll('#projectList li');
    currentItems.forEach(item => {
        const id = item.id.replace('item-', '');
        existingIds.add(id);
    });
    
    data.forEach(item => {
        if (!existingIds.has(item._id)) { 
            list += `<li id="item-${item._id}">
                        <label>${item.name}</label>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#9C9C9C" fill="none" style="cursor: pointer">
                            <path d="M2 8C2 8 6.47715 3 12 3C17.5228 3 22 8 22 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M21.544 13.045C21.848 13.4713 22 13.6845 22 14C22 14.3155 21.848 14.5287 21.544 14.955C20.1779 16.8706 16.6892 21 12 21C7.31078 21 3.8221 16.8706 2.45604 14.955C2.15201 14.5287 2 14.3155 2 14C2 13.6845 2.15201 13.4713 2.45604 13.045C3.8221 11.1294 7.31078 7 12 7C16.6892 7 20.1779 11.1294 21.544 13.045Z" stroke="currentColor" stroke-width="1.5" />
                            <path d="M15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14Z" stroke="currentColor" stroke-width="1.5" />
                        </svg>
                    </li>`;
            existingIds.add(item._id);
        }
    });

    document.getElementById("projectList").innerHTML = list;

    data.forEach(item => {
        document.querySelector(`#item-${item._id} svg`).addEventListener('click', () => getById(item._id));
    });

    if (method !== 'edit') {
        deleteButton.style.display = 'none';
    }
    downloadButton.style.display = 'none';
}
onMounted();

const newForm = () => {
    saveButton.style.display = 'flex';
    editButton.style.display = 'none';
    document.getElementById("projectTitle").value = "";
    document.getElementById("projectDescription").value = "";
    const inputs = document.querySelectorAll('.editable');
    inputs.forEach(input => {
        input.disabled = false; 
    });
    const fileInput = document.getElementById('fileInput');
    fileInput.disabled = false;
    deleteButton.style.display = 'none';
    downloadButton.style.display = 'none';
   
}

const deleteJob = async() => {
    await fetch(`http://localhost:3000/pictures/${jobId}`, {
        method: "DELETE"
    });

    const itemToRemove = document.getElementById(`item-${jobId}`);
    if (itemToRemove) {
        itemToRemove.remove();
    }
    newForm();
    await onMounted();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault(); 

    if(method === 'edit'){
        return update();
    }
    
    const name =  document.getElementById("projectTitle").value;
    const description = document.getElementById("projectDescription").value;
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    
    if(!name){
        alert('Por favor preencha um nome!');
        return;
    }
    if (!file) {
        alert('Nenhum arquivo selecionado');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('name', name);

    await fetch("http://localhost:3000/pictures/", {
        method: 'POST',
        body: formData
    })
    await onMounted();
    newForm();
});
