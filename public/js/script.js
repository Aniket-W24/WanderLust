// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

// let SearchBtn = document.getElementById("search-button");
// SearchBtn.addEventListener("click", ()=> {
//   console.log("Search button was clicked ", SearchBtn);
//     let Search = document.getElementById("search-input");
//     console.log("Search input sent", Search.value);
//     let redirectUrl = `/listings/findByTitle?searchVal=${Search.value}`;   //redirecting to url with given query
//     console.log(redirectUrl);
//     window.location.href = redirectUrl;
// });

