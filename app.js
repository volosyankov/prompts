const promptsContainer = document.getElementById('prompts-container');
let categories = {};
let currentCategory = 'all';

const TRANSLATIONS = {
  en: {
    mainTitle: "Prompt Gallery",
    searchPlaceholder: "Search prompts...",
    allButton: "All",
    copiedToClipboard: "Copied to clipboard!",
    clickToCopy: "Click on the text below to copy the prompt"
  },
  ru: {
    mainTitle: "Галерея промптов",
    searchPlaceholder: "Поиск промптов...",
    allButton: "Все",
    copiedToClipboard: "Скопировано в буфер обмена!",
    clickToCopy: "Нажмите на текст ниже, чтобы скопировать промпт"
  }
};

let currentLanguage = 'en';

fetch('prompts.json')
  .then(response => response.json())
  .then(prompts => {
    prompts.forEach(prompt => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-3';
      
      const card = document.createElement('div');
      card.className = 'card h-100 shadow-sm prompt-card';
      card.style.cursor = 'pointer';
      card.style.transition = 'box-shadow 0.3s ease-in-out';
      
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      
      const name = document.createElement('h6');
      name.className = 'card-subtitle mb-2';
      name.textContent = prompt.name[currentLanguage];

      const description = document.createElement('p');
      description.className = 'card-text description';
      description.textContent = prompt.description[currentLanguage];
      
      cardBody.appendChild(name);
      cardBody.appendChild(description);
      card.appendChild(cardBody);
      col.appendChild(card);
      promptsContainer.appendChild(col);
      
      card.dataset.promptData = JSON.stringify(prompt);
      
      card.addEventListener('mouseenter', () => card.classList.add('shadow'));
      card.addEventListener('mouseleave', () => card.classList.remove('shadow'));
      
      card.addEventListener('click', () => openPromptModal(prompt));
      
      const category = prompt.category[currentLanguage];
      categories[category] = (categories[category] || 0) + 1;
    });
    
    createCategoryFilters();
  })
  .catch(error => console.error('Error loading prompts:', error));

function openPromptModal(prompt) {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${prompt.name[currentLanguage]}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="mb-3">${prompt.description[currentLanguage]}</p>
          <p class="text-muted small mb-2">${TRANSLATIONS[currentLanguage].clickToCopy}</p>
          <div class="bg-light p-3 rounded position-relative" style="max-height: 50vh; overflow-y: auto;">
            <p class="mb-0 prompt-text" style="cursor: pointer; white-space: pre-wrap;" onclick="copyToClipboard(this)">${prompt.text[currentLanguage]}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
  modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

function copyToClipboard(element) {
  const text = element.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const tooltip = bootstrap.Tooltip.getOrCreateInstance(element, {
      title: TRANSLATIONS[currentLanguage].copiedToClipboard,
      placement: 'top',
      trigger: 'manual'
    });
    tooltip.show();
    setTimeout(() => tooltip.hide(), 2000);
  }).catch(err => console.error('Failed to copy text: ', err));
}

document.addEventListener('DOMContentLoaded', () => {
  const languageLinks = document.querySelectorAll('.language-links a');
  
  currentLanguage = navigator.language.startsWith('ru') ? 'ru' : 'en';

  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam && ['en', 'ru'].includes(langParam)) {
    currentLanguage = langParam;
  }

  updateLanguage();

  languageLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      currentLanguage = event.target.dataset.lang;
      updateLanguage();
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('lang', currentLanguage);
      window.history.pushState({}, '', newUrl);
    });
  });
});

function updateLanguage() {
  document.getElementById('main-title').textContent = TRANSLATIONS[currentLanguage].mainTitle;
  document.getElementById('search').placeholder = TRANSLATIONS[currentLanguage].searchPlaceholder;
  
  categories = {};
  document.querySelectorAll('.card').forEach(card => {
    const promptData = JSON.parse(card.dataset.promptData);
    const category = promptData.category[currentLanguage];
    categories[category] = (categories[category] || 0) + 1;
  });
  
  updateCategoryFilters();
  updatePromptCards();
  updateLanguageLinks();
  
  document.getElementById('footer-text-' + currentLanguage).style.display = 'inline';
  document.getElementById('footer-text-' + (currentLanguage === 'en' ? 'ru' : 'en')).style.display = 'none';
  document.getElementById('bot-info-' + currentLanguage).style.display = 'block';
  document.getElementById('bot-info-' + (currentLanguage === 'en' ? 'ru' : 'en')).style.display = 'none';
}

function updateCategoryFilters() {
  const filterContainer = document.getElementById('category-filters');
  if (filterContainer) {
    filterContainer.innerHTML = '';
    
    const allButton = document.createElement('button');
    const totalPrompts = Object.values(categories).reduce((a, b) => a + b, 0);
    allButton.textContent = `${TRANSLATIONS[currentLanguage].allButton} (${totalPrompts})`;
    allButton.className = currentCategory === 'all' ? 'btn btn-primary me-2 mb-2' : 'btn btn-outline-primary me-2 mb-2';
    allButton.onclick = () => filterByCategory('all');
    filterContainer.appendChild(allButton);

    Object.entries(categories).forEach(([category, count]) => {
      const button = document.createElement('button');
      button.textContent = `${category} (${count})`;
      button.className = category === currentCategory ? 'btn btn-primary me-2 mb-2' : 'btn btn-outline-primary me-2 mb-2';
      button.onclick = () => filterByCategory(category);
      filterContainer.appendChild(button);
    });
  }
}

function updateLanguageLinks() {
  document.querySelectorAll('.language-links a').forEach(link => {
    link.classList.toggle('active', link.dataset.lang === currentLanguage);
  });
}

function updatePromptCards() {
  document.querySelectorAll('.card').forEach(card => {
    const promptData = JSON.parse(card.dataset.promptData);
    card.querySelector('.card-subtitle').textContent = promptData.name[currentLanguage];
    card.querySelector('.description').textContent = promptData.description[currentLanguage];
  });
}

function createCategoryFilters() {
  const filterContainer = document.createElement('div');
  filterContainer.className = 'mb-3';
  filterContainer.id = 'category-filters';
  promptsContainer.parentNode.insertBefore(filterContainer, promptsContainer);
  updateCategoryFilters();
}

function filterByCategory(category) {
  currentCategory = category;
  filterPrompts();

  document.querySelectorAll('#category-filters button').forEach(button => {
    button.className = (button.textContent.startsWith(category) || (category === 'all' && button.textContent.startsWith(TRANSLATIONS[currentLanguage].allButton)))
      ? 'btn btn-primary me-2 mb-2'
      : 'btn btn-outline-primary me-2 mb-2';
  });
}

function filterPrompts() {
  const query = document.getElementById('search').value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    const promptData = JSON.parse(card.dataset.promptData);
    const categoryMatch = currentCategory === 'all' || promptData.category[currentLanguage] === currentCategory;
    
    const textMatch = Object.keys(promptData.name).some(lang => 
      promptData.name[lang].toLowerCase().includes(query) ||
      promptData.description[lang].toLowerCase().includes(query) ||
      promptData.text[lang].toLowerCase().includes(query)
    );
    
    card.parentElement.style.display = categoryMatch && textMatch ? '' : 'none';
  });
}
