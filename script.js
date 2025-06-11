// seleciona os elementos do formulário
const form = document.querySelector("form"); // seleciona o valor do formulário
const amount = document.getElementById("amount"); // valor da despesa
const expense = document.getElementById("expense"); // nome da despesa
const category = document.getElementById("category") // categoria

// seleciona os elementos da lista
const exepenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
    // Encontra caracteres (não numéricos) e troca por nada
    let value = amount.value.replace(/\D/g,"");

    // Transforma o valor em centavos(exemplo: 150/100 = 1.5 que é equivalente a R$1,50)
    value = Number(value) / 100; 

    // Atualiza o valor do input
    amount.value = formatCurrencyBRL(value); 
}

function formatCurrencyBRL(value){
    // formata o valor no padrão BRL(Real brasileiro)
    value = value.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL",
        // R$1,23
    })
    
    //Retorna o valor formatado
    return value; // R$1,23
}

// captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) =>{
    // evita o recarregamento da página
    event.preventDefault();

    // criar um objeto com os detalhes da nova despesa.
    const newExpense = {
        id: new Date().getTime(),  // Gera um ID único com base no tempo atual
        expense: expense.value, // Nome da despesa
        category_id: category.value, // Valor da categoria selecionada (ex: "food")
        category_name: category.options[category.selectedIndex].text, // Texto da opção selecionada (ex: "Alimentação")
        amount: amount.value, // Valor formatado da despesa
        created_at: new Date(), // Data/hora atual da criação

    }

    // chama a função que irá adicionar o item na lista
    expenseAdd(newExpense)
}

// Adiciona um novo item na lista
function expenseAdd(newExpense){
    try {
        // cria o elemento de li para adicionar o item(li) na lista(ul).
        const expenseItem = document.createElement("li");

        // adiciona a classe no elemento expenseItem.
        expenseItem.classList.add("expense");

        // cria o ícone da categoria
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src",`img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt",`img/${newExpense.category_name}.svg`);

        // cria a informação da despesa.
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        // cria o nome da despesa
        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense

        // cria a categoria da despesa
        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        // adiciona nome e categoria na div das informações das despesas.
        expenseInfo.append(expenseName,expenseCategory);

        // Cria o valor da despesa
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$","")}`;

        // Cria o ícone de remover
        const removeIcon = document.createElement("img");
        removeIcon.classList.add("remove-icon");
        removeIcon.setAttribute("src","img/remove.svg");
        removeIcon.setAttribute("alt","remover");


        // adiciona as informações no item.
        expenseItem.append(expenseIcon,expenseInfo,expenseAmount,removeIcon);
        
        // adiciona o item na lista
        exepenseList.append(expenseItem);

        // limpa o formulário para adicionar um novo item na lista.
        formClear();

        // atualiza os totais
        updateTotals();

        
    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas!");
        console.log(error);
    }
}

// Atualiza os totais
function updateTotals() {
   try {
    // Recupera todos os itens (li) da lista (ul).
    const items = exepenseList.children
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // variavel para incrementar o total.
    let total = 0;

    // percorre cada item (li) da lista (ul).
    for(let item = 0; item < items.length; item++){
        const itemAmount = items[item].querySelector(".expense-amount");
        // remove caracteres não númericos e substitui a vírgula pelo ponto.
        let value = itemAmount.textContent.replace(/[^\d,]/g,"").replace(",",".");

        // converte o valor para float.
        value = parseFloat(value);

        // verifica se é um número válido.
        if(isNaN(value)){
            return alert("O valor não é um número!");
        }

        // incrementa o valor total.
        total += Number(value);
    }

    // cria a span para adicionar o R$ formatado
    const simbolBRL = document.createElement("small");
    simbolBRL.textContent = "R$";

    // formata o valor e remove o R$ que será exibido na small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$","");

    // limpa o conteudo do elemento.
    expensesTotal.innerHTML = "";

    // adiciona o symbolo da moeda e o valor formatado.
    expensesTotal.append(simbolBRL,total)

    
   } catch (error) {
        console.log(error);
        alert("Não foi possível atualizar os totais!")
   }
}

// Evento que captura os cliques na lista.
exepenseList.addEventListener("click",function(event){
    // Verifica se o elemento clicado é o ícone de remover.
    if(event.target.classList.contains("remove-icon")){
        // Obtém a li pai do elemento clicado.
        const item = event.target.closest(".expense");

        // remove o item da lista.
        item.remove();
        
        // atualiza os totais.
        updateTotals();
    }
})

function formClear(){
    // limpa os inputs.
    expense.value = "";
    category.value = "";
    amount.value = "";

    // coloca o foco no input de amount.
    expense.focus()
}