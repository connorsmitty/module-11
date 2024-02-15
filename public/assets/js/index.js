document.addEventListener('DOMContentLoaded', () => {
  let noteForm = document.querySelector('.note-form');
  let noteTitle = document.querySelector('.note-title');
  let noteText = document.querySelector('.note-text');
  let saveNoteBtn = document.querySelector('.save-note');
  let newNoteBtn = document.querySelector('.new-note');
  let noteList = document.querySelector('.list-container');

  const show = (elem) => {
    elem.style.display = 'block';
  };

  const hide = (elem) => {
    elem.style.display = 'none';
  };

  let activeNote = {};

  const getNotes = () => {
    return fetch('/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  const saveNote = (note) => {
    return fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    });
  };

  const renderActiveNote = () => {
    if (activeNote.id) {
      show(newNoteBtn);
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      hide(newNoteBtn);
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    }
  };

  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value
    };
    saveNote(newNote)
      .then(() => {
        getAndRenderNotes();
        renderActiveNote();
      })
      .catch((error) => console.error('Error saving note:', error));
  };

  const handleNoteDelete = (e) => {
    e.stopPropagation();
    const noteId = e.target.parentElement.dataset.noteId;

    if (activeNote.id === noteId) {
      activeNote = {};
      renderActiveNote();
    }

    deleteNote(noteId)
      .then(() => getAndRenderNotes())
      .catch((error) => console.error('Error deleting note:', error));
  };

  const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderActiveNote();
  };

  const handleNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
  };

  const handleRenderBtns = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  };

  const renderNoteList = async () => {
    try {
      const response = await getNotes();
      const notes = await response.json();
      noteList.innerHTML = '';
      
      if (notes.length === 0) {
        const noNoteItem = document.createElement('li');
        noNoteItem.textContent = 'No saved notes.';
        noteList.appendChild(noNoteItem);
      } else {
        notes.forEach((note) => {
          const li = document.createElement('li');
          li.dataset.noteId = note.id;
          li.textContent = note.title;
          li.addEventListener('click', handleNoteView);
          
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.classList.add('btn', 'btn-danger', 'ml-2');
          deleteBtn.addEventListener('click', handleNoteDelete);
          
          li.appendChild(deleteBtn);
          noteList.appendChild(li);
        });
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const getAndRenderNotes = () => {
    renderNoteList();
  };

  if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteForm.addEventListener('input', handleRenderBtns);
  }

  getAndRenderNotes();
});
