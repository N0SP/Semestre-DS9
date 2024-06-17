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
        userTransactionsDeptKey: '', // Key específica para las transacciones del usuario actual

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

        loadUserProfile() {
            const user = Session.getUser();
            this.htmlElement.usernameDisplay.textContent = user.username;
            this.userTransactionsDeptKey = `transactions_${user.username}`;
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
                console.error('Error getting transactions:', error);
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
                console.log('Transaction added:', data);
                this.addTransactionToTable(data);
                await this.renderChart();
            } catch (error) {
                console.error('Error adding transaction:', error);
            }
        },

        addTransactionToTable(transaction) {
            console.log("Adding transaction to table:", transaction);
            // Verifica que el monto y el tipo existan para prevenir filas incompletas
            if (!transaction.amount || !transaction.type) {
                console.error("Transaction missing necessary data:", transaction);
                return;  // Salta la adición de esta transacción si falta información
            }
        
            const amount = transaction.amount.toFixed(2);
            const row = document.createElement('tr');
            row.innerHTML = `<td>${transaction.type}</td><td>${amount}</td>`;
            this.htmlElement.transactionsTable.appendChild(row);
        },

        async getTransactions() {
            try {
                const ingresosResponse = await fetch('http://localhost:3000/api/ingresos');
                const egresosResponse = await fetch('http://localhost:3000/api/egresos');
                
                if (!ingresosResponse.ok || !egresosResponse.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                
                const ingresos = await ingresosResponse.json();
                const egresos = await egresosResponse.json();
            
                const transactions = [...ingresos, ...egresos];
                console.log("Transacciones recibidas (Ingresos y Egresos):", transactions);
                
                // Limpia la tabla antes de agregar nuevas filas
                this.htmlElement.transactionsTable.innerHTML = '';  // Asegúrate de que este es el elemento correcto
                transactions.forEach(transaction => this.addTransactionToTable(transaction));
        
                return transactions;
            } catch (error) {
                console.error('Error getting transactions:', error);
                return [];
            }
        },

        async  deleteLastEntry() {
            try {
                const response = await fetch('http://localhost:3000/api/lastentry', { method: 'DELETE' });
                const data = await response.json();
                DashboardApp.loadTransactions();
                DashboardApp.renderChart();
            } catch (error) {
                console.error('Error eliminando la última entrada:', error);
            }
        },
        
        async  deleteLastExit() {
            try {
                const response = await fetch('http://localhost:3000/api/lastexit', { method: 'DELETE' });
                const data = await response.json();
                DashboardApp.loadTransactions();
                DashboardApp.renderChart();
            } catch (error) {
                console.error('Error eliminando la última salida:', error);
            }
        },

        async renderChart() {
            const transactions = await this.getTransactions();
            const entrada = transactions.filter(tx => tx.type === 'Entrada').reduce((acc, tx) => acc + tx.amount, 0);
            const salida = transactions.filter(tx => tx.type === 'Salida').reduce((acc, tx) => acc + tx.amount, 0);
        
            console.log("Total Entradas: ", entrada);
            console.log("Total Salidas: ", salida);
        
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
})(window.Session);
