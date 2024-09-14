document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('registerBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const empTable = document.getElementById('empTable');
    var emp_counter = 0;

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/employee');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const displayEmployees = (employees) => {
        // Remove current data from table
        for (let i = emp_counter; i > 0; i--) {
            document.getElementById('empTable').deleteRow(i);
        }
        // Reset employee counter
        emp_counter = 0;
        // Add new data to table
        employees.forEach(employee => {
            emp_counter += 1;
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');
            td1.textContent = emp_counter;
            td2.textContent = employee.ID;
            td3.textContent = employee.LAST_NAME + ' ' + employee.NAME;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            empTable.appendChild(tr);
        });
            
    };

    refreshBtn.addEventListener('click', fetchEmployees);

    registerBtn.addEventListener('click', function() {
        window.location.href = '/install';
    });

});
