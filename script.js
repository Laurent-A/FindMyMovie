// Récupération du bouton de recherche
const searchButton = document.getElementById('searchUser');
const lastSearchButton = document.getElementById('lastSearchUser');

// Écouteur d'événement pour la soumission du formulaire de recherche
searchButton.addEventListener('click', function (event) {
    event.preventDefault(); // Empêche la soumission du formulaire
    const formatValue = document.getElementById('format-select').value;
    const textResultatElement = document.getElementById('textResultat');
    if (formatValue === "film") {
        textResultatElement.innerHTML = 'film';
        performMoviesSearch();
    } else {
        textResultatElement.innerHTML = 'série';
        performSeriesSearch();
    }
});

// Écouteur d'événement pour le bouton de sélection après recherche
lastSearchButton.addEventListener('click', function (event) {
    event.preventDefault(); // Empêche la soumission du formulaire
    const formatValue = document.getElementById('format-select').value;
    if(formatValue === "film") {
        performMovieSelection();
    } else {
        performSerieSelection();
    }
});

function performMoviesSearch() {
    const searchValue = document.getElementById('search').value;
    const formatSelect = document.getElementById('format-select').value;

    // Construction de l'URL de recherche en utilisant les paramètres saisis
    const apiUrl = 'https://api.themoviedb.org/3/search/movie';
    const search = "&query=" + searchValue;
    const apikey = "?api_key=d51e7f14559510465d6e0af351351119";
    const url = apiUrl+apikey+search;

    // Appel JSON à l'API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMoviesSearchResults(data);
        })
        .catch(error => {
            //console.error('Erreur lors de la requête API:', error);
            const resultDiv = document.querySelector('.textResultat p');
            resultDiv.textContent = "Nous ne trouvons pas de film correspondant à votre recherche";

        });
}

function displayMoviesSearchResults(data) {
    const movieSelect = document.getElementById('movie-select');
    movieSelect.innerHTML = '<option value="">Sélectionner le film</option>';

    // Ajouter les options dans la liste déroulante en fonction des données de l'API
    data.results.forEach(movie => {
      const option = document.createElement('option');
      option.value = movie.id; // Remplacez "id" par la propriété appropriée pour l'identifiant du film
      option.textContent = movie.title; // Remplacez "title" par la propriété appropriée pour le titre du film
      movieSelect.appendChild(option);
    });

    // Afficher le résultat
    const resultDiv = document.querySelector('.textResultat p');
    resultDiv.textContent = `Votre résultat pour "${document.getElementById('search').value}" : ${data.length} films trouvés.`;

    // Afficher la div avec la liste des films trouvés
    const listFromSearchDiv = document.getElementById('listfromsearch');
    listFromSearchDiv.style.display = 'block';
}

function performMovieSelection() {
    const selectedMovie = document.getElementById('movie-select').value;
    // Vous pouvez utiliser la valeur sélectionnée ici pour effectuer d'autres actions.
    const apiUrl = 'https://api.themoviedb.org/3/movie/';
    const search = selectedMovie + "/watch/providers";
    const apikey = "?api_key=d51e7f14559510465d6e0af351351119";
    const url = apiUrl+search+apikey;

    // Appel JSON à l'API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayProvidersResults(data);
        })
        .catch(error => {
            console.error('Erreur lors de la requête API:', error);
        });
}

function displayProvidersResults(data) {

    if ("FR" in data.results) {
        const frData = data.results["FR"];
        const flatrate = frData.flatrate;
        console.log(frData);

        if(flatrate != null) {
            const table = document.createElement('table');
            table.innerHTML = `
            <tr>
                <th>Type</th>
                <th>Fournisseur</th>
                </tr>
            `;
            
            addProvidersToTable(flatrate, "Présent sur :", table);
    
            const textResultatElement = document.getElementById('textResultat');
            textResultatElement.innerHTML = '';
            textResultatElement.appendChild(table);
            resetForm()
        } else {
            const textResultatElement = document.getElementById('textResultat');
            textResultatElement.innerHTML = 'Aucun résultat';
        }

    } else {
        const textResultatElement = document.getElementById('textResultat');
        textResultatElement.innerHTML = 'Aucun résultat';
    }
}
        
function addProvidersToTable(providers, type, table) {
    if (providers && providers.length > 0) {
        providers.forEach(provider => {
        const providerName = provider.provider_name;
        const row = table.insertRow();
            row.innerHTML = `
            <td>${type}</td>
            <td>${providerName}</td>
            `;
        });
    }
}

function resetForm() {
    document.getElementById('movie-select').selectedIndex = 0;
}

////////////////////SERIES/////////////////

function performSeriesSearch() {
    const searchValue = document.getElementById('search').value;

    if (searchValue != null ) {
        // Construction de l'URL de recherche en utilisant les paramètres saisis
    const apiUrl = 'https://api.themoviedb.org/3/search/tv';
    const search = "&query=" + searchValue;
    const apikey = "?api_key=d51e7f14559510465d6e0af351351119";
    const url = apiUrl+apikey+search;
    // Appel JSON à l'API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displaySeriesSearchResults(data);
        })
        .catch(error => {
            //console.error('Erreur lors de la requête API:', error);
            const resultDiv = document.querySelector('.textResultat p');
            resultDiv.textContent = "Nous ne trouvons pas de séries correspondant à votre recherche";
        });
    } else {
        resultDiv.textContent = "Nous ne trouvons pas de séries correspondant à votre recherche";
    }
    
}

function displaySeriesSearchResults(data) {
    const seriesSelect = document.getElementById('movie-select');
    seriesSelect.innerHTML = '<option value="">Sélectionner la série</option>';

    data.results.forEach(serie => {
        console.log(serie);
      const option = document.createElement('option');
      option.value = serie.id;
      option.textContent = serie.name; 
      seriesSelect.appendChild(option);
    });

    // Afficher le résultat
    const resultDiv = document.querySelector('.textResultat p');
    resultDiv.textContent = `Votre résultat pour "${document.getElementById('search').value}" : ${data.length} séries trouvés.`;

    // Afficher la div avec la liste des films trouvés
    const listFromSearchDiv = document.getElementById('listfromsearch');
    listFromSearchDiv.style.display = 'block';
}

function performSerieSelection() {
    const selectedSerie = document.getElementById('movie-select').value;

    if (selectedSerie != null) {
        const apiUrl = 'https://api.themoviedb.org/3/tv/';
        const search = selectedSerie + "/watch/providers";
        const apikey = "?api_key=d51e7f14559510465d6e0af351351119";
        const url = apiUrl+search+apikey;
    
        // Appel JSON à l'API
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayProvidersResults(data);
            })
            .catch(error => {
                console.error('Erreur lors de la requête API:', error);
            });
    }    
}

