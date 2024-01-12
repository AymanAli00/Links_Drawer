let links = []
const add_Link = document.getElementById('addLink')
const cancelLink = document.getElementById('cancelLink')
const submitLink = document.getElementById('submitLink')
const container = document.getElementById('container')
const linkName = document.getElementById('link_name')
const linkUrl = document.getElementById('link_url')
linkUrl.value = 'https://'
const linksList = document.querySelector('.container')

// Function to save items to localStorage
function saveItemsToLocalStorage() {
    localStorage.setItem('links', JSON.stringify(links));
}

// Function to load items from localStorage
function loadItemsFromLocalStorage() {
    const storedItems = localStorage.getItem('links');
    links = storedItems ? JSON.parse(storedItems) : [];
}

// Sample data for initialization
loadItemsFromLocalStorage();

add_Link.addEventListener('click', function showCustomPrompt() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('addModal').style.display = 'block';
})
cancelLink.addEventListener('click', function cancelCustomPrompt() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('addModal').style.display = 'none';
})

// localStorage.clear()

const isValidUrl = urlString => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

submitLink.addEventListener('click', function submitLink() {
    if (linkName.value && linkUrl.value) {
        if (isValidUrl(linkUrl.value)) {
            const linkName = document.getElementById('link_name').value;
            const linkUrl = document.getElementById('link_url').value;
            addLink(linkName, linkUrl);
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('addModal').style.display = 'none';
            document.getElementById('link_name').value = ""
            document.getElementById('link_url').value = "https://"
            document.getElementById('warning').textContent = ""
            renderLinks()
        }
        else {
            document.getElementById('warning').style.display = 'block'
            document.getElementById('warning').textContent = 'Provided URL is invalid!'
            linkUrl.value = "https://"
        }
    }
    else {
        document.getElementById('warning').style.display = 'block'
        document.getElementById('warning').textContent = 'Please fill all feilds!'
    }
})


function renderLinks() {
    const tableBody = document.getElementById('container');
    tableBody.innerHTML = '';
    links.forEach(link => {
        const linkContainer = document.createElement('div');
        linkContainer.classList.add('d-flex');

        linkContainer.innerHTML = `
        <div class="item-container">
            <div class='item-box'>
                <a target='_blank' href='${link.url}' title='${link.name}\n${link.url}' class='item' >
                    <div class='icon'><img src='https://www.google.com/s2/favicons?domain=${link.url}'></div>
                    ${link.name}
                </a>
            </div>
            <div class="tools">
                <div id='edit-link' title='Edit'>
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <div id='delete-link' title='Delete'>
                    <i class="fa-solid fa-trash"></i>
                </div>
            </div>
        </div>`;

        // Add event listeners using addEventListener
        linkContainer.querySelector('#edit-link').addEventListener('click', () => editLink(link.id));
        linkContainer.querySelector('#delete-link').addEventListener('click', () => deleteLink(link.id));

        // Append the created element to the table body
        tableBody.appendChild(linkContainer);
    });

    // for (let index = 0; index < links.length; index++) {
    // const li = document.createElement('li')
    // li.textContent = links[index]
    // linksList.append(li)
    // }
    // linksList.innerHTML = listItems
}

// Function to add a new item
function addLink(name, url) {
    const newLink = {
        id: links.length + 1,
        name: name,
        url: url
    };
    links.push(newLink);
    renderLinks();
    saveItemsToLocalStorage();
}

// Function to edit an existing item
// function editLink(id) {
//     const newName = prompt('Enter new link name:');
//     const newUrl = prompt('Enter new link url:');
//     if (newName !== null, newUrl !== null) {
//         const link = links.find(link => link.id === id);
//         if (link) {
//             link.name = newName;
//             link.url = newUrl;
//             renderLinks();
//         }
//     }
//     saveItemsToLocalStorage();
// }

function editLink(id) {
    const overlay = document.getElementById('overlay');
    const newNameInput = document.getElementById('newName');
    const newUrlInput = document.getElementById('newUrl');

    const link = links.find(link => link.id === id);

    if (link) {
        // Populate the form with existing values
        newNameInput.value = link.name;
        newUrlInput.value = link.url;

        // Show the overlay
        overlay.style.display = 'block';
        document.getElementById('editModal').style.display = 'block';
        // Set a data attribute to identify the link being edited
        overlay.dataset.linkId = id;
    }
}

function updateLink() {
    const overlay = document.getElementById('overlay');
    const newNameInput = document.getElementById('newName');
    const newUrlInput = document.getElementById('newUrl');

    const id = overlay.dataset.linkId;
    const newName = newNameInput.value;
    const newUrl = newUrlInput.value;

    const link = links.find(link => link.id == id);
    // if (!link) {
    //     console.error(`Link with id ${id} not found.`);
    //     return;
    // }
    
    if (link) {
        // Update link values
        link.name = newName;
        link.url = newUrl;

        // Render links, save to local storage, and close the overlay
        renderLinks();
        saveItemsToLocalStorage();
        closeOverlay();
    }
}

document.getElementById('updateLink').addEventListener('click', updateLink);
document.getElementById('cancelUpdateLink').addEventListener('click', closeOverlay);

function closeOverlay() {
    const overlay = document.getElementById('overlay');

    // Clear input values
    document.getElementById('newName').value = '';
    document.getElementById('newUrl').value = '';
    document.getElementById('editModal').style.display = 'none';
    // Hide the overlay
    overlay.style.display = 'none';
}


// Function to delete an item
function deleteLink(id) {
    links = links.filter(link => link.id !== id);
    renderLinks();
    saveItemsToLocalStorage();
}

// Function to search items based on input
function searchItems(query) {
    const filteredItems = links.filter(link => link.name.toLowerCase().includes(query.toLowerCase()));
    renderFilteredItems(filteredItems);
}

// Initial rendering of items
renderLinks();

function renderFilteredItems(filteredItems) {
    const tableBody = document.getElementById('container');
    tableBody.innerHTML = '';
    filteredItems.forEach(link => {
        const linkContainer = document.createElement('div');
        linkContainer.classList.add('d-flex');

        linkContainer.innerHTML = `
            <div class='d-flex'>
                <div class="item-container">
                <div class='item-box'>
                    <a target='_blank' href='${link.url}' title='${link.name}\n${link.url}' class='item' >
                        <div class='icon'><img src='https://www.google.com/s2/favicons?domain=${link.url}'>
                        </div>
                        ${link.name}
                    </a>
                </div>
                <div class="tools">
                <div id='edit-link' title='Edit'>
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <div id='delete-link' title='Delete'>
                    <i class="fa-solid fa-trash"></i>
                </div>
            </div>
        </div>`;

        // Add event listeners using addEventListener
        linkContainer.querySelector('#edit-link').addEventListener('click', () => editLink(link.id));
        linkContainer.querySelector('#delete-link').addEventListener('click', () => deleteLink(link.id));

        // Append the created element to the table body
        tableBody.appendChild(linkContainer);
    })
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', function (event) {
    const query = event.target.value;
    searchItems(query);
});