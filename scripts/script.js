const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-form-input]');
const btnCancel = document.querySelector('[data-form-cancel]');
const notesList = document.querySelector('[data-notes-list]');

let savedNotes = localStorage.notes ? JSON.parse(localStorage.notes) : [];
let editContent = null;
let editItem = null;

savedNotes.forEach(item => createNote(item));

form.addEventListener('submit', e => {
    e.preventDefault();
    addOrUpdateList();
});

btnCancel.addEventListener('click', () => {
    resetInputValue();
    input.blur();
    resetEdit();
});

function addOrUpdateList() {
    if(!input.value) {
        alert('Escreva algo para criar um item.');
        return;
    }

    if(editContent) {
        if(exists()) {
            alert('Item já existente!');
            resetInputValue(`Editando: ${editContent}`);
            return;
        }

        const p = document.querySelector(`[data-value="${editContent}"]`);
        p.textContent = input.value;
        p.setAttribute('data-value', input.value);

        const div = p.parentNode;
        div.style.whiteSpace = 'normal';

        const btnExpand = p.parentNode.querySelector('[data-btn-expand]');

        const i = savedNotes.indexOf(editItem);

        editItem.expanded = false;
        editItem.note = input.value;

        if(p.offsetHeight > 40) {
            div.style.whiteSpace = 'nowrap';
            btnExpand.style.display = 'block';
            btnExpand.textContent = 'expand_more';
        } else {
            btnExpand.style.display = 'none';
        }

        savedNotes.splice(i, 1, editItem);

        localStorage.setItem('notes', JSON.stringify(savedNotes));

        resetEdit();

        resetInputValue();

        return;
    }

    if(exists()) {
        alert('Item já existente!');
        input.value = '';
        return;
    }

    const newNote = {
        note: input.value,
        checked: false,
        expanded: false
    };

    createNote(newNote);

    savedNotes.push(newNote);

    localStorage.setItem('notes', JSON.stringify(savedNotes));

    resetInputValue();
}

function createNote(note) {
    const li = document.createElement('li');
    li.classList.add('items__list--item');

    const div = document.createElement('div');
    div.classList.add('list--item--text');

    const btnCheck = document.createElement('button');
    btnCheck.classList.add('material-symbols-outlined', 'item--text--check');
    btnCheck.textContent = 'check_small';
    btnCheck.addEventListener('click', () => {
        p.classList.add('checked');

        disableBtn(btnCheck);
        disableBtn(btnEdit);

        note.checked = true;

        updateLocalStorage('check', note);
    });

    const p = document.createElement('p');
    p.setAttribute('data-value', note.note);
    p.textContent = note.note;

    const btnExpand = document.createElement('button');
    btnExpand.classList.add('material-symbols-outlined', 'item--text--expand');
    btnExpand.setAttribute('data-btn-expand', '');
    btnExpand.textContent = 'expand_more';
    btnExpand.addEventListener('click', () => {
        if(!note.expanded) {
            div.style.whiteSpace = 'normal';
            btnExpand.textContent = 'expand_less';

            note.expanded = true;
        } else {
            div.style.whiteSpace = 'nowrap';
            btnExpand.textContent = 'expand_more';

            note.expanded = false;
        }

        updateLocalStorage('expand', note);
    });

    div.appendChild(btnCheck);
    div.appendChild(p);
    div.appendChild(btnExpand);

    const btns = document.createElement('div');

    const btnEdit = document.createElement('button');
    btnEdit.classList.add('material-symbols-outlined', 'item--btn', 'item--btn--edit');
    btnEdit.textContent = 'edit_note';
    btnEdit.addEventListener('click', () => {
       input.value = p.textContent;
       editContent = p.textContent;
       editItem = note;
       input.setAttribute('placeholder', `Editando: ${p.textContent}`);
       input.focus();
    });

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('material-symbols-outlined', 'item--btn', 'item--btn--delete');
    btnDelete.textContent = 'delete';
    btnDelete.addEventListener('click', () => {
        li.remove();
        updateLocalStorage('delete', note);
    });

    btns.appendChild(btnEdit);
    btns.appendChild(btnDelete);

    li.appendChild(div);
    li.appendChild(btns);

    if(note.checked) {
        p.classList.add('checked');

        disableBtn(btnCheck);
        disableBtn(btnEdit);
    }

    notesList.appendChild(li);

    if(p.offsetHeight > 40) {
        if(note.expanded) {
            div.style.whiteSpace = 'normal';
            btnExpand.textContent = 'expand_less';
        } else {
            div.style.whiteSpace = 'nowrap';
        }
        
        btnExpand.style.display = 'block';
    }
}

function exists() {
    let presence = false;

    savedNotes.forEach(item => {
        if(item.note.toLowerCase() === input.value.toLowerCase()) {
            presence = true;
        }
    });

    return presence;
}

function resetEdit() {
    editContent = null;
    editItem = null;
}

function disableBtn(element) {
    element.disabled = true;
    element.style.color = 'var(--disabled-color)';
    element.style.borderColor = 'var(--disabled-color)';
    element.style.cursor = 'auto';
}

function updateLocalStorage(btn, note) {
    const i = savedNotes.indexOf(note);

    if(btn === 'delete') {
        savedNotes.splice(i, 1);
    } else {
        savedNotes.splice(i, 1, note);
    }

    localStorage.setItem('notes', JSON.stringify(savedNotes));
}

function resetInputValue(message) {
    input.value = '';

    if(message) {
        input.setAttribute('placeholder', message);
    } else {
        input.setAttribute('placeholder', 'Adicione um item');
    }

    
}

const html = document.querySelector('html');
const btnTheme = document.querySelector('[data-btn-theme]');
const btnThemeSelection = document.querySelector('[data-btn-theme-selection]');
const themeList = btnThemeSelection.querySelectorAll('span');

html.setAttribute('data-theme', localStorage.theme ? localStorage.theme : 'bright');

btnTheme.addEventListener('click', () => {
    btnThemeSelection.classList.toggle('theme__selection--hidden');
});

themeList.forEach(btn => {
    const currentTheme = btn.classList[1];

    btn.addEventListener('click', () => {
        html.setAttribute('data-theme', currentTheme);

        localStorage.setItem('theme', currentTheme);
    });
});