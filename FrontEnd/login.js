const form = document.getElementById('formLogin');
const formErr = document.getElementById('formError')

// Ajout d'un event sur la soumission du formulaire
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupération des valeurs des champs email et mot de passe du formulaire
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Envoi à l'API pour authentification
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ email, password }) 
  });

  if (response.ok) {
    const data = await response.json();

    // Stockage du jeton d'authentification dans le stockage de session
    sessionStorage.setItem("token", data.token);   

    // Redirection de l'utilisateur vers la page d'accueil
    window.location.href = "index.html";
    
  } else {
    formErr.innerText = 'le mot de passe ou l’email est incorrecte'
    formErr.classList.add('errorMessage')
    
  }

});