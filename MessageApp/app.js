const {hash} = window.location;

const message = atob(hash.replace("#",''));

if(message) {
  document.querySelector("#message-form").classList.add('hide');
  const ms = document.querySelector("#message-show")
  ms.classList.remove('hide');
  ms.querySelector('h1').innerHTML = message;
}
document.querySelector('form').addEventListener('submit',event => {
  event.preventDefault(); //prevent browser from submitting data to nonexistent backend server

  document.querySelector('#message-form').classList.add('hide');
  document.querySelector('#link-form').classList.remove('hide');

  const input = document.querySelector('#message-input');
  const encrypted = btoa(input.value);
  const linkInput = document.querySelector('#link-input');
  linkInput.value = `${window.location}#${encrypted}`;
  
  //show copy button 
  const btn = document.querySelector('#copy')
  btn.addEventListener('click',e => {
    navigator.clipboard.writeText(linkInput.value);
  });
  linkInput.select();

});
/*

  btoa() & atob() 

  the encryption will work by taking the ascii character code and converting that number into 8-digit binary, combining the binary string, divide that binary into parts of 6 and map them onto base64
  for example:

  string: 'sec'
  ascii: 
    s => 115
    e => 101
    c => 99
  
  ascii to 8-digit binary:
    115 => 01110011
    101 => 01100101
     99 => 01100011

  combine binary string:
    011100110110010101100011
  
  break into sets of 6:
    011100110110010101100011 => 011100 | 110110 | 010101 | 100011

  map 6-digit sets onto base64 characters:
    011100 => 'c'
    110110 => '2'
    010101 => 'V'
    100011 => 'j'
  
  therefore:
    'sec' => 'c2Vj'
*/

