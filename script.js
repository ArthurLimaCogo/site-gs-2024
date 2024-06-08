document.addEventListener('DOMContentLoaded', function() {
    // Muda para a tela de formulário quando o botão "Começar" é clicado
    document.getElementById('botao-iniciar').addEventListener('click', function() {
        document.getElementById('tela-boas-vindas').style.display = 'none';
        document.getElementById('tela-formulario').style.display = 'block';
    });

    // Muda para a tela de visualização das viagens quando o botão "Ver Viagens" é clicado
    document.getElementById('botao-ver-viagens').addEventListener('click', function() {
        document.getElementById('tela-boas-vindas').style.display = 'none';
        document.getElementById('tela-viagens').style.display = 'block';
        listarViagens(); // Chama a função para listar as viagens
    });

    // Muda para a tela de visualização do total de viagens quando o botão "Ver Total de Viagens" é clicado
    document.getElementById('botao-ver-total').addEventListener('click', function() {
        document.getElementById('tela-boas-vindas').style.display = 'none';
        document.getElementById('tela-total-viagens').style.display = 'block';
        mostrarTotalViagens(); // Chama a função para mostrar o total de viagens
    });

    // Volta para a tela de boas-vindas quando o botão "Voltar ao Menu" é clicado
    document.getElementById('botao-voltar').addEventListener('click', function() {
        document.getElementById('tela-formulario').style.display = 'none';
        document.getElementById('tela-boas-vindas').style.display = 'block';
    });

    // Volta para a tela de boas-vindas quando o botão "Voltar ao Menu" da tela de viagens é clicado
    document.getElementById('botao-voltar-menu-viagens').addEventListener('click', function() {
        document.getElementById('tela-viagens').style.display = 'none';
        document.getElementById('tela-boas-vindas').style.display = 'block';
    });

    // Volta para a tela de boas-vindas quando o botão "Voltar ao Menu" da tela de total de viagens é clicado
    document.getElementById('botao-voltar-menu-total').addEventListener('click', function() {
        document.getElementById('tela-total-viagens').style.display = 'none';
        document.getElementById('tela-boas-vindas').style.display = 'block';
    });

    // Limpa o formulário de cadastro de viagens
    document.getElementById('botao-limpar').addEventListener('click', function() {
        document.getElementById('formularioViagem').reset();
    });

    // Limpa todas as viagens salvas no localStorage
    document.getElementById('botao-limpar-tudo').addEventListener('click', function() {
        localStorage.clear();
        alert('Todas as viagens foram removidas.');
        listarViagens(); // Atualiza a lista de viagens após limpar
        mostrarTotalViagens(); // Atualiza o total de viagens após limpar
    });

    // Função para validar as datas
    function validarDatas(dataPartida, dataRetorno) {
        const hoje = new Date().toISOString().split('T')[0];
        return dataPartida >= hoje && dataRetorno >= dataPartida;
    }

    // Salva a viagem ao submeter o formulário
    document.getElementById('formularioViagem').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const dataPartida = document.getElementById('dataPartida').value;
        const dataRetorno = document.getElementById('dataRetorno').value;

        if (!validarDatas(dataPartida, dataRetorno)) {
            alert('As datas de partida e retorno devem ser hoje ou no futuro, e a data de retorno deve ser igual ou posterior à data de partida.');
            return;
        }

        const formData = new FormData(event.target);
        const viagem = {};
        formData.forEach((value, key) => {
            viagem[key] = value; // Adiciona os dados do formulário ao objeto viagem
        });
        salvarViagem(viagem); // Chama a função para salvar a viagem
        alert('Viagem cadastrada com sucesso!');
        event.target.reset(); // Reseta o formulário após o cadastro
    });

    // Função para salvar a viagem no localStorage
    function salvarViagem(viagem) {
        let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        viagens.push(viagem); // Adiciona a nova viagem ao array de viagens
        localStorage.setItem('viagens', JSON.stringify(viagens)); // Salva o array de viagens no localStorage
    }

    // Função para listar as viagens salvas no localStorage
    function listarViagens(filtro = '') {
        const listaViagens = document.getElementById('lista-viagens');
        listaViagens.innerHTML = ''; // Limpa a lista de viagens
        const viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        viagens
            .filter(viagem => viagem.nomeViagem.toLowerCase().includes(filtro.toLowerCase()))
            .forEach((viagem, index) => {
                const item = document.createElement('li');
                item.innerHTML = `${index + 1}. ${viagem.nomeViagem} - ${viagem.destino} (Partida: ${viagem.dataPartida}, Retorno: ${viagem.dataRetorno}) 
                    <button class="botao-excluir" data-index="${index}">Excluir</button>`;
                listaViagens.appendChild(item); // Adiciona cada viagem à lista
            });

        // Adiciona evento de clique aos botões de exclusão
        document.querySelectorAll('.botao-excluir').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                excluirViagem(index);
            });
        });
    }

    // Função para excluir uma viagem
    function excluirViagem(index) {
        const confirmar = confirm('Você tem certeza que deseja excluir esta viagem?');
        if (confirmar) {
            let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
            viagens.splice(index, 1); // Remove a viagem do array
            localStorage.setItem('viagens', JSON.stringify(viagens)); // Atualiza o localStorage
            listarViagens(); // Atualiza a lista de viagens após a exclusão
            mostrarTotalViagens(); // Atualiza o total de viagens após a exclusão
        }
    }

    // Função para mostrar o total de viagens
    function mostrarTotalViagens() {
        const totalViagens = document.getElementById('total-viagens');
        const viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        totalViagens.textContent = `Total de viagens cadastradas: ${viagens.length}`;
    }

    // Restringir datas de partida e retorno para hoje ou futuro
    const dataPartidaInput = document.getElementById('dataPartida');
    const dataRetornoInput = document.getElementById('dataRetorno');
    const hoje = new Date().toISOString().split('T')[0];
    dataPartidaInput.setAttribute('min', hoje);
    dataRetornoInput.setAttribute('min', hoje);

    // Evento para ajustar a data de retorno
    dataPartidaInput.addEventListener('input', function() {
        const dataPartida = dataPartidaInput.value;
        if (dataRetornoInput.value < dataPartida) {
            dataRetornoInput.value = dataPartida;
        }
        dataRetornoInput.setAttribute('min', dataPartida);
    });

    // Evento de input para busca de viagens
    document.getElementById('busca-viagem').addEventListener('input', function() {
        const filtro = this.value;
        listarViagens(filtro); // Chama a função para listar as viagens com o filtro
    });

    // Adiciona evento de clique ao botão de ordenação
    document.getElementById('botao-ordenar').addEventListener('click', function() {
        const selectOrdenacao = document.getElementById('select-ordenacao');
        const criterio = selectOrdenacao.value;
        ordenarViagens(criterio);
    });

    // Função para ordenar as viagens de acordo com o critério selecionado
    function ordenarViagens(criterio) {
        let viagens = JSON.parse(localStorage.getItem('viagens')) || [];

        // Ordena as viagens de acordo com o critério selecionado
        switch (criterio) {
            case 'recente':
                viagens.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'antigo':
                viagens.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                break;
            case 'proxima':
                viagens.sort((a, b) => new Date(a.dataPartida) - new Date(b.dataPartida));
                break;
            default:
                // Não faz nada se o critério não for reconhecido
                break;
        }

        // Atualiza a lista de viagens após a ordenação
        const listaViagens = document.getElementById('lista-viagens');
        listaViagens.innerHTML = '';
        viagens.forEach((viagem, index) => {
            const item = document.createElement('li');
            item.innerHTML = `${index + 1}. ${viagem.nomeViagem} - ${viagem.destino} (Partida: ${viagem.dataPartida}, Retorno: ${viagem.dataRetorno}) 
                <button class="botao-excluir" data-index="${index}">Excluir</button>`;
            listaViagens.appendChild(item);
        });

        // Adiciona evento de clique aos botões de exclusão
        document.querySelectorAll('.botao-excluir').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                excluirViagem(index);
            });
        });
    }

        // Função para listar as viagens salvas no localStorage ordenadas por data de ida
        function listarViagens(filtro = '') {
            const listaViagens = document.getElementById('lista-viagens');
            listaViagens.innerHTML = ''; // Limpa a lista de viagens
            const viagens = JSON.parse(localStorage.getItem('viagens')) || [];

            // Ordena as viagens por data de ida (da mais próxima para a mais distante)
            viagens.sort((a, b) => new Date(a.dataPartida) - new Date(b.dataPartida));

            // Aplica o filtro de busca, se fornecido
            const viagensFiltradas = filtro ? viagens.filter(viagem => viagem.nomeViagem.toLowerCase().includes(filtro.toLowerCase())) : viagens;

            // Adiciona as viagens ordenadas e filtradas à lista
            viagensFiltradas.forEach((viagem, index) => {
                const item = document.createElement('li');
                item.innerHTML = `${index + 1}. ${viagem.nomeViagem} - ${viagem.destino} (Partida: ${viagem.dataPartida}, Retorno: ${viagem.dataRetorno}) 
                    <button class="botao-excluir" data-index="${index}">Excluir</button>`;
                listaViagens.appendChild(item);
            });

            // Adiciona evento de clique aos botões de exclusão
            document.querySelectorAll('.botao-excluir').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    excluirViagem(index);
                });
            });
        }

    });