const form = document.getElementById('formLogin');
const formErr = document.getElementById('formError')

// Ajout d'un event sur la soumission du formulaire
form.addEventListener('submit',  (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupération des valeurs des champs email et mot de passe du formulaire
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Envoi à l'API pour authentification
  fetch("http://localhost:5678/api/users/login", {
  method: 'POST',
  headers: {
    "Content-Type": "application/json" 
  },
  body: JSON.stringify({ email, password }) 
})

  

  .then(response =>{
    if (response.ok) {
      return response.json();
    }

  }) 
  
  .then(data => {
    sessionStorage.setItem("token", data.token);
    window.location.href = "index.html";   
    })
  
  .catch(error => {
    formErr.innerText = 'le mot de passe ou l’email est incorrecte'
    formErr.classList.add('errorMessage')
    
  })

});