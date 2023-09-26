import './App.css';
import sanitizeHtml from 'sanitize-html';
import {useEffect} from 'react';

const backendLink = 'https://numworks-api.oriondev.fr';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/setCredentials.js';
    document.querySelector('.App').appendChild(script);
  }, []);


  /*
    * A function to get the results from the backend.
    * @returns {void}
   */
  function getResults() {
    const query = document.getElementById('search').value;
    if (query.length <= 0) return;
    const results = document.getElementById('results');
    results.innerHTML = '';
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      const data = JSON.parse(xhr.responseText);
      if (data.status !== 200) {
        if (data.statusCode === 500) {
          if (data.message === 'Cannot read properties of undefined (reading \'map\')') {
            return results.innerHTML = `
              <div class="error">
                <span>Aucun résultat.</span>
              </div>
            `;
          } else if (data.message === "Request failed with status code 429") {
            return results.innerHTML = `
              <div class="error">
                <span>Erreur lors de la recherche.</span>
                <span>Si la limite de nombre de recherche par jour a été franchi, utilisez votre propre clé d'API, cliquez <a href="https://google.com">ici</a> pour utiliser votre propre clé API.</span>
                <span>Vous pouvez également regarder ce tutoriel, disponible <a href="https://google.com">ici</a>, pour utiliser votre propre backend.</span>
              </div>
            `;
          } else {
            return results.innerHTML = `
              <div class="error">
                <span>Erreur lors de la recherche du à une erreur interne au serveur.</span>
                <span>Contactez l'administrateur du site pour en savoir plus.</span>
              </div>
            `;
          }
        }
        return results.innerHTML = `
          <div class="error">
            <span>Erreur lors de la recherche.</span>
            <span>Contactez l'administrateur du site pour en savoir plus.</span>
            <span>Si la limite de nombre de recherche par jour a été franchi, utilisez votre propre clé d'API, cliquez <a href="https://google.com">ici</a> pour utiliser votre propre clé API.</span>
            <span>Vous pouvez également regarder ce tutoriel, disponible <a href="https://google.com">ici</a>, pour utiliser votre propre backend.</span>
          </div>
        `;
      }

      data.data.forEach((result) => {
        results.innerHTML += `
            <div class="result">
                <div class="result__name">${sanitizeHtml(result.name)}</div>
                <div class="result__author">${sanitizeHtml(result.author)}</div>
                <div class="result__link"><a href="${sanitizeHtml(result.link)}" target="_blank" rel="noreferrer">Accéder à la page</a></div>
            </div>
        `;
      });
    });
    let apiLink = `${backendLink}?q=${query}`;
    if (localStorage.getItem('key') && localStorage.getItem('cx')) apiLink += `&key=${localStorage.getItem('key')}&cx=${localStorage.getItem('cx')}`;

    xhr.open('GET', apiLink);
    xhr.send();
  }

  /*
   * A function to get the results when the user press the enter key.
   * @param {KeyboardEvent} event The event of the keydown.
   * @returns {void}
   */
  function onEnterSearch(event) {
    if (event.key === 'Enter') {
      getResults();
    }
  }

  return (
    <div>
      <div className="App">
        <header>
          <input type="text" id="search" className="search" name="search" placeholder="démineur" onKeyDown={onEnterSearch} />
          <button onClick={getResults} type="submit">Rechercher</button>
        </header>
        <div className="results" id="results">
        </div>
      </div>
      <footer>
        <span>Powered by <a target="_blank" rel="noreferrer" href="https://google.com">Google</a> • Nous ne sommes pas affilié à <a target="_blank" rel="noreferrer" href="https://numworks.com">Numworks</a> • Des tutoriels sont disponibles <a target="_blank" rel="noreferrer" href="https://google.com">ici</a> pour utiliser votre propre clé d'API Google sur le site. • <a target="_blank" rel="noreferrer" href="https://github.com/oriionn/numworks-search">Source Code</a></span>
      </footer>
    </div>
  );
}

export default App;
