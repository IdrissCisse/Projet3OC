document.getElementById("connexion").addEventListener("submit", async function(e) {
    e.preventDefault();  //Empeche la page de se recharger lors de la soumission du formulaire 

    // Récupération des identifiants fournis par le client et du message d'erreur
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.querySelector(".error-message");

    // Envoi de la requete avec les informations reçues 
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    });

    // Traitement de la reponse du serveur 
    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      // Enregistre le token dans le local storage pour l'autorisation de manipuler les travaux
      localStorage.setItem('authToken', token);   
      window.location.href = "dashboard.html";    // Redirige l'utilisateur vers une autre page en cas de succés
    } else {
        errorMessage.style.display = "block";     // Affiche le message d'erreur en cas d'echec de la connexion
    };
});
