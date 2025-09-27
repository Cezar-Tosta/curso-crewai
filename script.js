// Configuração do marked.js para processar markdown
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

// Função para carregar e processar arquivo markdown
async function loadMarkdownFile(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${filename}`);
        }
        const markdown = await response.text();
        return marked.parse(markdown);
    } catch (error) {
        console.error('Erro:', error);
        return `<div class="error">
            <h2>❌ Erro ao carregar conteúdo</h2>
            <p>Não foi possível carregar o arquivo: <strong>${filename}</strong></p>
            <p>Verifique se o arquivo existe no diretório correto.</p>
        </div>`;
    }
}

// Função para adicionar botões de copiar aos blocos de código
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock, index) => {
        const pre = codeBlock.parentElement;
        
        // Criar container para o código
        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-container';
        
        // Criar botão de copiar
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '📋 Copiar';
        copyButton.setAttribute('data-index', index);
        
        // Inserir container e botão
        pre.parentNode.insertBefore(codeContainer, pre);
        codeContainer.appendChild(copyButton);
        codeContainer.appendChild(pre);
        
        // Adicionar evento de clique
        copyButton.addEventListener('click', async () => {
            const code = codeBlock.textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                copyButton.textContent = '✅ Copiado!';
                copyButton.classList.add('copied');
                
                setTimeout(() => {
                    copyButton.textContent = '📋 Copiar';
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Erro ao copiar:', err);
                copyButton.textContent = '❌ Erro';
                setTimeout(() => {
                    copyButton.textContent = '📋 Copiar';
                }, 2000);
            }
        });
    });
}

// Função para adicionar botão "Voltar ao Topo"
function addBackToTopButton() {
    const contentDiv = document.getElementById('lessonContent');
    
    // Verificar se já existe um botão
    const existingButton = contentDiv.querySelector('.back-to-top-container');
    if (existingButton) {
        existingButton.remove();
    }
    
    // Criar container do botão
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'back-to-top-container';
    
    // Criar botão
    const backButton = document.createElement('button');
    backButton.className = 'back-to-top';
    backButton.innerHTML = '⬆️ Voltar ao Topo';
    
    // Adicionar evento de clique
    backButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Adicionar botão ao container e container ao conteúdo
    buttonContainer.appendChild(backButton);
    contentDiv.appendChild(buttonContainer);
}

// Função para carregar uma aula
async function loadLesson(lessonNum, filename) {
    const contentDiv = document.getElementById('lessonContent');
    
    // Mostrar loading
    contentDiv.innerHTML = '<div class="loading">⏳ Carregando conteúdo...</div>';
    
    // Carregar e renderizar markdown
    const htmlContent = await loadMarkdownFile(filename);
    contentDiv.innerHTML = htmlContent;
    
    // Adicionar botões de copiar
    addCopyButtons();
    
    // Adicionar botão "Voltar ao Topo"
    addBackToTopButton();
    
    // Atualizar botão ativo
    document.querySelectorAll('.lesson-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lesson="${lessonNum}"]`).classList.add('active');
    
    // Atualizar barra de progresso
    const progress = (lessonNum / 11) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Scroll suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Adicionar event listeners aos botões
document.querySelectorAll('.lesson-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lessonNum = parseInt(btn.getAttribute('data-lesson'));
        const filename = btn.getAttribute('data-file');
        loadLesson(lessonNum, filename);
    });
});

// Carregar primeira aula ao iniciar
window.addEventListener('DOMContentLoaded', () => {
    loadLesson(1, './aulas/aula1.md');
});

// Atalhos de teclado para navegação
document.addEventListener('keydown', (e) => {
    const currentBtn = document.querySelector('.lesson-btn.active');
    const currentLesson = parseInt(currentBtn.getAttribute('data-lesson'));
    
    // Seta direita ou 'n' = próxima aula
    if ((e.key === 'ArrowRight' || e.key === 'n') && currentLesson < 11) {
        const nextBtn = document.querySelector(`[data-lesson="${currentLesson + 1}"]`);
        nextBtn.click();
    }
    
    // Seta esquerda ou 'p' = aula anterior
    if ((e.key === 'ArrowLeft' || e.key === 'p') && currentLesson > 1) {
        const prevBtn = document.querySelector(`[data-lesson="${currentLesson - 1}"]`);
        prevBtn.click();
    }
});