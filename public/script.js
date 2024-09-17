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

    async function deleteContact(id) {
        const response = await fetch('/delete/' + id);
        const result = await response.json();
        if(result.result == true)
        {
            alert("Delete contact successfully!");
        }
        return result;
    }

    async function fetchContacts() {
        // Kiểm tra token hết hạn chưa để refresh rồi mới call API
        refreshtoken();
        for(let i = emp_counter; i > 0; i--) {
            document.getElementById('empTable').deleteRow(i);
        }
        emp_counter = 0;
        const response1 = await fetch('/contacts');
        const contacts = await response1.json();
        const response2 = await fetch('/requisites');
        const requisites = await response2.json();
        const response3 = await fetch('/bank');
        const bank = await response3.json();
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
            // Delete button style
            delBtn.style.backgroundColor = '#FFA3A3';
            delBtn.style.color = 'black';
            delBtn.style.fontWeight = 'bold';
            delBtn.style.borderColor = 'black';
            delBtn.style.borderWidth = '1px';
            delBtn.style.borderStyle = 'solid';
            delBtn.style.borderRadius = '5px';
            delBtn.style.padding = '5px';
            delBtn.style.margin = '5px';
            // Edit button style
            editBtn.style.backgroundColor = '#C4FFAA';
            editBtn.style.color = 'black';
            editBtn.style.fontWeight = 'bold';
            editBtn.style.borderColor = 'black';
            editBtn.style.borderWidth = '1px';
            editBtn.style.borderStyle = 'solid';
            editBtn.style.borderRadius = '5px';
            editBtn.style.padding = '5px';
            editBtn.style.margin = '5px';


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
                requisites.forEach(requisite => {
                    console.log('ID : ' + requisite.ENTITY_ID + ' ' + contactx.ID);
                    if(requisite.ENTITY_ID == contactx.ID)
                    {
                        bank.forEach(bankDetails => {
                            if(bankDetails.ENTITY_ID == requisite.ID)
                            {
                                if(!bankDetails.RQ_ACC_NAME)
                                {
                                    td6.textContent = 'No Bank';
                                }
                                else
                                {
                                    td6.textContent = bankDetails.RQ_ACC_NAME;
                                }
                                if(!bankDetails.RQ_ACC_NUM)
                                {
                                    td7.textContent = 'No Bank';
                                }
                                else
                                {
                                    td7.textContent = bankDetails.RQ_ACC_NUM;
                                }
                            }
                        });
                    }
                });
            });
            
            // delBtn.addEventListener('click', deleteContact(contact.ID));
            
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
