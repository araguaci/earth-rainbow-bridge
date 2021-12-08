const shareBtn = document.querySelector('.share-btn');
const shareOptions = document.querySelector('.share-options');

shareBtn.addEventListener('click', () => {
    shareOptions.classList.toggle('active');
})

function clipboard(id) {
    /* Get the text field */
    var r = document.createRange();
    r.selectNode(document.getElementById(id));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  
    /* Alert the copied text */
    shareOptions.classList.toggle('active');
  }