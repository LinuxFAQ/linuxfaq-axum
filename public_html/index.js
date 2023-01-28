!function() {
    while(showdown === undefined); // make sure showdown loads before anything
    const converter = new showdown.Converter();

    const searchForm = document.querySelector('section#search form');
    const searchBar = document.querySelector('section#search input[name="search"]');
    const searchSubmit = document.querySelector('section#search input[type="submit"]');
    const searchResults = document.querySelector('section#search div.search-results');

    var g_LoadingArticle = false; // prevent weird behavior

    document.querySelectorAll('a.reload-btn').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            window.location.reload();
        });
    });

    function LockForLoading() {
        searchSubmit.setAttribute('aria-disabled', 'true');
        searchSubmit.setAttribute('disabled', 'disabled');
        searchResults.setAttribute('aria-busy', 'true');
    }

    function UnlockDoneLoading() {
        searchSubmit.removeAttribute('aria-disabled');
        searchSubmit.removeAttribute('disabled');
        searchResults.removeAttribute('aria-busy');
    }

    function LoadArticle(filename) {
        return new Promise((res, rej) => {
            const xmlHttp = new XMLHttpRequest();

            xmlHttp.onload = res(JSON.parse(xmlHttp.responseText));
            xmlHttp.onerror = rej(null);

            xmlHttp.open('GET', `${window.location.origin}/faq/${filename}`);
            xmlHttp.send();
        });
    }

    function ShowArticle(markdown) {

        const article = document.getElementById('article');
        article.style.display = 'block';
        var html = converter.makeHtml(markdown);
        article.innerHTML = html;
        article.scrollIntoView();
    }

    function ShowResults(results) {
        if(!results instanceof Map) throw "Invalid data passed to showResults()";
        const table = document.createElement('table');
        const tableHead = document.createElement('thead');
        {
            const tableHeadRow = document.createElement('tr');
            var tableHeadData;
            tableHeadData = document.createElement('td');
            tableHeadData.innerHTML = 'Result';
            tableHeadRow.appendChild(tableHeadData);
            tableHeadData = document.createElement('td');
            tableHeadData.innerHTML = 'Description';
            tableHeadRow.appendChild(tableHeadData);
            tableHead.appendChild(tableHeadRow);
        }
        const tableBody = document.createElement('tbody');
        var tableBodyRow;
        results.forEach((value, key) => {
            tableBodyRow = document.createElement('tr');
            const result = document.createElement('td');
            const resultLink = document.createElement('a');
            resultLink.href = '#';
            resultLink.innerHTML = key;
            resultLink.addEventListener('click', async (event) => {
                if(g_LoadingArticle) {
                    alert('Already loading an article. Please wait.');
                    return;
                }
                g_LoadingArticle = true;
                LockForLoading();
                event.preventDefault();
                event.stopPropagation();
                let md = await LoadArticle(key);
                if(md !== undefined && md !== null) ShowArticle(md);
                else alert('Failed to load article!');
                UnlockDoneLoading();
                g_LoadingArticle = false;
            });
            result.appendChild(resultLink);
            tableBodyRow.appendChild(result);
            const description = document.createElement('td');
            description.innerHTML = value;
            tableBodyRow.appendChild(description);
            tableBody.appendChild(tableBodyRow);
        });
        table.appendChild(tableHead);
        table.appendChild(tableBody);
        searchResults.replaceChildren(table);
    }

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        LockForLoading();
        searchResults.innerHTML = "Loading. Please wait.";
        var b = new Map();
        b.set('test', 'test');
        ShowResults(b);        
        UnlockDoneLoading();
    });
}();