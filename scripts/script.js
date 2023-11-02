const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-form-input]');
const btnCancel = document.querySelector('[data-form-cancel]');
const noteList = document.querySelector('[data-note-list]');

let savedNotes = localStorage.notes ? JSON.parse(localStorage.notes) : [];
let editContent = null;
let editItem = null;

savedNotes.forEach(item => createNote(item));

form.addEventListener('submit', e => {
    e.preventDefault();
    addOrUpdateList();
    input.setAttribute('placeholder', 'Digite um item');
});

btnCancel.addEventListener('click', () => {
    input.value = '';
    input.setAttribute('placeholder', 'Digite um item');
    input.blur();
    editContent = null;
    editItem = null;
});

function addOrUpdateList() {
    if(!input.value) {
        alert('Escreva algo para criar uma nota.');
        return;
    }

    if(editContent) {
        const p = document.querySelector(`[data-value="${editContent}"]`);
        p.textContent = input.value;
        p.setAttribute('data-value', input.value);

        const text = p.parentNode;
        text.style.whiteSpace = 'normal';

        const btnExpand = p.parentNode.querySelector('[data-btn-expand]');

        const i = savedNotes.indexOf(editItem);

        editItem.expanded = false;
        editItem.note = input.value;

        if(p.offsetHeight > 40) {
            text.style.whiteSpace = 'nowrap';
        }

        if(text.style.whiteSpace === 'nowrap') {
            btnExpand.style.display = 'block';
            btnExpand.textContent = 'expand_more';
        } else {
            btnExpand.style.display = 'none';
        }

        savedNotes[i] = editItem;

        updateNotes();

        editContent = null;
        editItem = null;

        input.value = '';

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

    if(!savedNotes.includes(newNote)) {
        createNote(newNote);

        savedNotes.push(newNote);

        updateNotes();
    }

    input.value = '';
}

function createNote(note) {
    const li = document.createElement('li');
    li.classList.add('items__list--item');

    const text = document.createElement('div');
    text.classList.add('list--item--text');

    const btnCheck = document.createElement('button');
    btnCheck.classList.add('material-symbols-outlined', 'item--text--check');
    btnCheck.setAttribute('data-btn-check', '');
    btnCheck.textContent = 'check_small';
    btnCheck.addEventListener('click', () => {
        p.classList.add('checked');

        btnCheck.disabled = true;
        btnCheck.style.color = 'var(--disabled-color)';
        btnCheck.style.cursor = 'auto';

        btnEdit.disabled = true;
        btnEdit.style.color = 'var(--disabled-color)';
        btnEdit.style.borderColor = 'var(--disabled-color)';
        btnEdit.style.cursor = 'auto';

        note.checked = true;

        const i = savedNotes.findIndex(item => item.note === note.note);
        savedNotes[i] = note;

        updateNotes();
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
            text.style.whiteSpace = 'normal';
            btnExpand.textContent = 'expand_less';

            note.expanded = true;
        } else {
            text.style.whiteSpace = 'nowrap';
            btnExpand.textContent = 'expand_more';

            note.expanded = false;
        }

        const i = savedNotes.findIndex(item => item.note === note.note);
        savedNotes[i] = note;

        updateNotes();
    });

    text.appendChild(btnCheck);
    text.appendChild(p);
    text.appendChild(btnExpand);

    const btns = document.createElement('div');

    const btnEdit = document.createElement('button');
    btnEdit.classList.add('material-symbols-outlined', 'item--btn', 'item--btn--edit');
    btnEdit.setAttribute('data-btn-edit', '');
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
    btnDelete.setAttribute('data-btn-delete', '');
    btnDelete.textContent = 'delete';
    btnDelete.addEventListener('click', () => {
        li.remove();

        const i = savedNotes.findIndex(item => item.note === note.note);
        savedNotes.splice(i, 1);

        updateNotes();
    });

    btns.appendChild(btnEdit);
    btns.appendChild(btnDelete);

    li.appendChild(text);
    li.appendChild(btns);

    if(note.checked) {
        p.classList.add('checked');

        btnCheck.disabled = true;
        btnCheck.style.color = 'var(--disabled-color)';
        btnCheck.style.cursor = 'auto';

        btnEdit.disabled = true;
        btnEdit.style.color = 'var(--disabled-color)';
        btnEdit.style.borderColor = 'var(--disabled-color)';
        btnEdit.style.cursor = 'auto';
    }

    noteList.appendChild(li);

    if(p.offsetHeight > 40) {
        if(note.expanded) {
            text.style.whiteSpace = 'normal';
            btnExpand.textContent = 'expand_less';
        } else {
            text.style.whiteSpace = 'nowrap';
        }
        
        btnExpand.style.display = 'block';
    }
}

function updateNotes() {
    localStorage.setItem('notes', JSON.stringify(savedNotes));
}

function exists() {
    let presence = false;

    savedNotes.forEach(item => {
        if(item.note.toLowerCase() === input.value.toLowerCase()) {
            presence = true;
            return;
        }
    });

    return presence;
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

    btn.addEventListener('click', e => {
        e.stopPropagation();
        html.setAttribute('data-theme', currentTheme);
        btnThemeSelection.classList.toggle('theme__selection--hidden');

        localStorage.setItem('theme', currentTheme);
    });
});