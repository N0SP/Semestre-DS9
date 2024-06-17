((Session) => {
    document.addEventListener('DOMContentLoaded', function () {
        DashboardApp.init();
    });

    const DashboardApp = {
        htmlElement: {
            formTransaction: document.getElementById('transaction_form'),
            transactionsTable: document.getElementById('transactions_table').querySelector('tbody'),
            chartContainer: document.getElementById('chartContainer'),
            logoutButton: document.getElementById('logout_button'),
            usernameDisplay: document.getElementById('username_display'),
            deletelastentry: document.getElementById('deleteLastEntry'),
            deletelastexit: document.getElementById('deleteLastExit')
        },

        init() {
            if (!Session.isActiveSession()) {
                window.location.href = 'index.html';
                return;
            }
            this.bindEvents();
            this.loadUserProfile();
            this.loadTransactions();
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
            this.htmlElement.deletelastentry.addEventListener('click', this.deleteLastEntry.bind(this));
            this.htmlElement.deletelastexit.addEventListener('click', this.deleteLastExit.bind(this));
        },

        handlers: {
            onTransactionSubmit(event) {
                event.preventDefault();
                const type = event.target.elements.transaction_type.value;
                const amount = parseFloat(event.target.elements.transaction_amount.value);

                if (amount <= 0) {
                    alert("Por favor, introduce un monto válido.");
                    return;
                }

                DashboardApp.addTransaction({ type, amount });
                event.target.reset();
                DashboardApp.renderChart();
            },

            onLogout() {
                Session.clearActiveSession();
                window.location.href = 'index.html';
            },

            onDeleteLastEntry() {
                DashboardApp.deleteLastEntry();
            },

            onDeleteLastExit() {
                DashboardApp.deleteLastExit();
            }
        },

        showAlert(message) {
            alert(message);
        },

        async loadUserProfile() {
            const user = await Session.getUser();
            this.htmlElement.usernameDisplay.textContent = user.username;
        },

        async loadTransactions() {
            try {
                const authHeaders = Session.getAuthHeaders();
                const ingresosResponse = await fetch('http://localhost:3000/api/ingresos', { headers: authHeaders });
                const egresosResponse = await fetch('http://localhost:3000/api/egresos', { headers: authHeaders });
        
                if (!ingresosResponse.ok || !egresosResponse.ok) {
                    throw new Error('Failed to fetch transactions');
                }
        
                const ingresos = await ingresosResponse.json();
                const egresos = await egresosResponse.json();
                const transactions = [...ingresos, ...egresos];
                this.htmlElement.transactionsTable.innerHTML = '';
                transactions.forEach(transaction => this.addTransactionToTable(transaction));
        
                return transactions;
            } catch (error) {
            }
        },

        async addTransaction(transaction) {
            const url = transaction.type === 'Entrada' ? '/api/ingresos' : '/api/egresos';
            try {
                const response = await fetch(`http://localhost:3000${url}`, {
                    method: 'POST',
                    headers: Session.getAuthHeaders(),
                    body: JSON.stringify(transaction)
                });
                const data = await response.json();
                if (data.error) {
                    return;
                }
                if (data.amount == null || data.type == null) {
                    return;
                }
                this.addTransactionToTable(data);
                await this.renderChart();
            } catch (error) {
            }
        },

        addTransactionToTable(transaction) {
            if (transaction.amount == null || transaction.type == null) {
                return;
            }
        
            const amount = transaction.amount.toFixed(2);
            const row = document.createElement('tr');
            row.innerHTML = `<td>${transaction.type}</td><td>${amount}</td>`;
            this.htmlElement.transactionsTable.appendChild(row);
        },        

        async getTransactions() {
            try {
                const authHeaders = Session.getAuthHeaders();
                const ingresosResponse = await fetch('http://localhost:3000/api/ingresos', { headers: authHeaders });
                const egresosResponse = await fetch('http://localhost:3000/api/egresos', { headers: authHeaders });
        
                if (!ingresosResponse.ok || !egresosResponse.ok) {
                    throw new Error('Failed to fetch transactions');
                }
        
                const ingresos = await ingresosResponse.json();
                const egresos = await egresosResponse.json();
                const transactions = [...ingresos, ...egresos];
        
                this.htmlElement.transactionsTable.innerHTML = '';
                transactions.forEach(transaction => this.addTransactionToTable(transaction));
        
                return transactions;
            } catch (error) {
                return [];
            }
        },

        async deleteLastEntry() {
            try {
                const authHeaders = Session.getAuthHeaders();
                const response = await fetch('http://localhost:3000/api/lastentry', {
                    method: 'DELETE',
                    headers: authHeaders
                });
                if (response.ok) {
                    await this.loadTransactions();
                    await this.renderChart();
                } else {
                    throw new Error('Failed to delete last entry');
                }
            } catch (error) {
            }
        },

        async deleteLastExit() {
            try {
                const authHeaders = Session.getAuthHeaders();
                const response = await fetch('http://localhost:3000/api/lastexit', {
                    method: 'DELETE',
                    headers: authHeaders
                });
                if (response.ok) {
                    await this.loadTransactions();
                    await this.renderChart();
                } else {
                    throw new Error('Failed to delete last exit');
                }
            } catch (error) {
            }
        },

async renderChart() {
    const transactions = await this.getTransactions();
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

    document.addEventListener('DOMContentLoaded', function () {
        DashboardApp.init();
    });

})(window.Session);
