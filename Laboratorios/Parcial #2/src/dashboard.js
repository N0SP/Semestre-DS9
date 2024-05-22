((Session) => {
    const DashboardApp = {
        htmlElement: {
            formTransaction: document.getElementById('transaction_form'),
            transactionsTable: document.getElementById('transactions_table').querySelector('tbody'),
            chartContainer: document.getElementById('chartContainer'),
            logoutButton: document.getElementById('logout_button'),
            usernameDisplay: document.getElementById('username_display'),
        },
        userTransactionsKey: '', // Key específica para las transacciones del usuario actual
        init() {
            if(!Session.isActiveSession()) {
                window.location.href = 'index.html';
                return;
            }
            this.bindEvents();
            this.loadUserProfile();
            this.loadTransactions();
            this.renderChart();
            this.initialValidations();
        },
        initialValidations() {
            if (!Session.isActiveSession()) {
                window.location.href = 'index.html';
            }
        },
        bindEvents() {
            this.htmlElement.formTransaction.addEventListener('submit', this.handlers.onTransactionSubmit.bind(this));
            this.htmlElement.logoutButton.addEventListener('click', this.handlers.onLogout.bind(this));
        },
        handlers: {
            onTransactionSubmit(event) {
                event.preventDefault();
                const type = event.target.elements.transaction_type.value;
                const amount = parseFloat(event.target.elements.transaction_amount.value);
                DashboardApp.addTransaction({ type, amount });
                event.target.reset();
            },
            onLogout() {
                Session.clearActiveSession();
                window.location.href = 'index.html';
            }
        },
        loadUserProfile() {
            const user = Session.getUser();
            this.htmlElement.usernameDisplay.textContent = user.username;
            this.userTransactionsKey = `transactions_${user.username}`;
        },
        loadTransactions() {
            const transactions = this.getTransactions();
            this.htmlElement.transactionsTable.innerHTML = '';
            transactions.forEach(tx => {
                this.addTransactionToTable(tx);
            });
        },
        addTransaction(transaction) {
            const transactions = this.getTransactions();
            transactions.push(transaction);
            localStorage.setItem(this.userTransactionsKey, JSON.stringify(transactions));
            this.addTransactionToTable(transaction);
            this.renderChart();
        },
        addTransactionToTable(transaction) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${transaction.type}</td><td>${transaction.amount}</td>`;
            this.htmlElement.transactionsTable.appendChild(row);
        },
        getTransactions() {
            return JSON.parse(localStorage.getItem(this.userTransactionsKey)) || [];
        },
        renderChart() {
            const transactions = this.getTransactions();
            const entrada = transactions.filter(tx => tx.type === 'Entrada').reduce((acc, tx) => acc + tx.amount, 0);
            const salida = transactions.filter(tx => tx.type === 'Salida').reduce((acc, tx) => acc + tx.amount, 0);

            const chart = new CanvasJS.Chart(this.htmlElement.chartContainer, {
                animationEnabled: true,
                title: {
                    text: "Comparativa de Entradas y Salidas"
                },
                data: [{
                    type: "pie",
                    startAngle: 240,
                    yValueFormatString: "##0.00\"%\"",
                    indexLabel: "{label} {y}",
                    dataPoints: [
                        { y: entrada, label: "Entrada" },
                        { y: salida, label: "Salida" }
                    ]
                }]
            });

            chart.render();
        }
    };
    DashboardApp.init();
})(window.Session);