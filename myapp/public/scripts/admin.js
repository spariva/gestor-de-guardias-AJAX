const addPopup = document.getElementById('addPopup');
const guardiaForm = document.getElementById('guardiaForm');

addPopup.addEventListener('click', function() {
    guardiaPopup.toggleAttribute('hidden');
});