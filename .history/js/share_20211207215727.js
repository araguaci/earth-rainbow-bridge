const shareBtn = document.querySelector('.share-btn');
const shareOptions = document.querySelector('.share-options');

shareBtn.addEventListener('click', () => {
    shareOptions.classList.toggle('active');
})

function clipboard() {
    /* Get the text field */
    var copyText = document.getElementById("urllink");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
  
    /* Alert the copied text */
    shareOptions.classList.toggle('active');
  }