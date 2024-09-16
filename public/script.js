document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('installBtn');
    const reinstallBtn = document.getElementById('reinstallBtn');
    const contactForm = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');
    var emp_counter = 0;

    async function fetchContactsDetails(id) {
        const response = await fetch('/contacts/' + id);
        const contact = await response.json();
        return contact;
    }

    async function fetchBankDetails(id) {
        const response = await fetch('/bank/' + id);
        const bank = await response.json();
        return bank;
    }

    async function fetchContacts() {
        // Kiểm tra token hết hạn chưa để refresh rồi mới call API
        refreshtoken();
        for(let i = emp_counter; i > 0; i--) {
            document.getElementById('empTable').deleteRow(i);
        }
        emp_counter = 0;
        const response = await fetch('/contacts');
        const contacts = await response.json();
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');
            const td4 = document.createElement('td');
            const td5 = document.createElement('td');
            const td6 = document.createElement('td');
            const td7 = document.createElement('td');
            const td8 = document.createElement('td');
            var delBtn = document.createElement('button');
            var editBtn = document.createElement('button');

            delBtn.textContent = 'Delete';
            editBtn.textContent = 'Edit';
            td8.appendChild(delBtn);
            td8.appendChild(editBtn);

            const details = fetchContactsDetails(contact.ID);
            details.then(contactx => {
                td1.textContent = contactx.LAST_NAME + ' ' + contactx.NAME;
                if(contact.ADDRESS == '')
                {
                    td2.textContent = 'No Address';
                }
                else
                {
                    td2.textContent = contactx.ADDRESS;
                }
                if(contactx.EMAIL)
                {
                    td3.textContent = contactx.EMAIL[0].VALUE;
                }
                else
                {
                    td3.textContent = 'No Email';
                }
                if(contactx.PHONE)
                {
                    td4.textContent = contactx.PHONE[0].VALUE;
                }
                else
                {
                    td4.textContent = 'No Phone';
                }
                if(contactx.WEB)
                {
                    td5.textContent = contactx.WEB[0].VALUE;
                }
                else
                {
                    td5.textContent = 'No Web';
                }
            });

            const bank = fetchBankDetails(contact.ID);
            if(bank)
            {
                bank.then(contacty => {
                    if(!contacty.RQ_ACC_NAME)
                    {
                        td6.textContent = 'No Bank';
                    }
                    else
                    {
                        td6.textContent = contacty.RQ_ACC_NAME;
                    }
                    if(!contacty.RQ_ACC_NUM)
                    {
                        td7.textContent = 'No Bank';
                    }
                    else
                    {
                        td7.textContent = contacty.RQ_ACC_NUM;
                    }
                });
            }
            else
            {
                td6.textContent = 'No Bank';
                td7.textContent = 'No Bank';
            }
            
            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            row.appendChild(td5);
            row.appendChild(td6);
            row.appendChild(td7);
            row.appendChild(td8);

            contactList.appendChild(row);
        });
    }

    const refreshtoken = async () => {
        try {
            const response = await fetch('/refresh');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Token refreshed successfully');
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    reinstallBtn.addEventListener('click', refreshtoken)

    installBtn.addEventListener('click', function() {
        window.location.href = '/install';
    });

    fetchContacts();


});
