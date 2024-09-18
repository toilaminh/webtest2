document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('installBtn');
    const reinstallBtn = document.getElementById('reinstallBtn');

    const contactForm = document.getElementById('contactForm');

    const contactList = document.getElementById('contactList');

    const editcontact = document.getElementById('editcontact');
    const contactName = document.getElementById('contactName');
    const submitChangeBtn = document.getElementById('submitChangeBtn');

    var emp_counter = 0;

    async function fetchContactsDetails(id) {
        const response = await fetch('/contacts/' + id);
        const contact = await response.json();
        return contact;
    }

    async function deleteBank(id) {
        const response1 = await fetch('/deleterequisitebank/' + id);
        const result1 = await response1.json();
        if(result1.result == true)
        {
            console.log("Delete bank successfully!");
        }
        return result1;
    }

    async function deleteRequisites(id) {
        const response2 = await fetch('/deleterequisite/' + id);
        const result2 = await response2.json();
        if(result2.result == true)
        {
            console.log("Delete requisites successfully!");
        }
        return result2;
    }

    async function deleteContact(id) {
        const response3 = await fetch('/deletecontact/' + id);
        const result3 = await response3.json();
        if(result3.result == true)
        {
            console.log("Delete contact successfully!");
            alert("Delete contact successfully!");
        }
        return result3;
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
            var ContactID = 0;
            var PhoneID = 0;
            var EmailID = 0;
            var WebID = 0;
            var RequisiteBankID = 0;
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
            var bankID;
            var requisitesID;

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
                    EmailID = contactx.EMAIL[0].ID;
                }
                else
                {
                    td3.textContent = 'No Email';
                }
                if(contactx.PHONE)
                {
                    td4.textContent = contactx.PHONE[0].VALUE;
                    PhoneID = contactx.PHONE[0].ID;
                }
                else
                {
                    td4.textContent = 'No Phone';
                }
                if(contactx.WEB)
                {
                    td5.textContent = contactx.WEB[0].VALUE;
                    WebID = contactx.WEB[0].ID;
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
                                bankID = bankDetails.ID;
                                requisitesID = requisite.ID;
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

                submitChangeBtn.addEventListener('click', function() {
                    const efirstname = document.getElementById('efirstName');
                    const elastname = document.getElementById('elastName');
                    const eaddress = document.getElementById('eaddress');
                    const eemail = document.getElementById('eemail');
                    const ephone = document.getElementById('ephone');
                    const eweb = document.getElementById('ewebsite');
                    const ebankAccName = document.getElementById('ebankAccName');
                    const ebankAccNum = document.getElementById('ebankAccNum');
                    const updateFields = {
                        LAST_NAME: elastname.value,
                        NAME: efirstname.value,
                        ADDRESS: eaddress.value,
                        EMAIL: [{
                            ID: EmailID,
                            VALUE: eemail.value,
                        }],
                        PHONE: [{
                            ID: PhoneID,
                            VALUE: ephone.value,
                        }],
                        WEB: [{
                            ID: WebID,
                            VALUE: eweb.value,
                        }]
                    }
                    const updateBankFields = {
                        RQ_ACC_NAME: ebankAccName.value,
                        RQ_ACC_NUM: ebankAccNum.value
                    }
                    if (eemail.value != '' || eemail.value != eemail.defaultValue) {
                        if(ephone.value != '' || ephone.value != ephone.defaultValue){
                            if(eweb.value != '' || eweb.value != eweb.defaultValue){
                                console.log('Thông tin cập nhật:',updateFields);
                                updateContact(ContactID, updateFields, RequisiteBankID, updateBankFields);
                            }
                        }
                    }
                    location.reload();
                });
            });
            
            delBtn.addEventListener('click', () => {
                deleteBank(bankID);
                deleteRequisites(requisitesID);
                deleteContact(contact.ID);
                location.reload();
            });

            editBtn.addEventListener('click', () => {
                editcontact.style.display = 'block';
                ContactID = contact.ID;
                RequisiteBankID = bankID;
                contactName.textContent = contact.LAST_NAME + ' ' + contact.NAME;
            });
            
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

    function updateContact(contactId, updateFields, bankId, updateBankFields) {
        fetch('/updatecontact', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contactId: contactId,
                updateFields: updateFields,
                bankId: bankId,
                updateBankFields: updateBankFields
            })
        })
    }

    reinstallBtn.addEventListener('click', refreshtoken)

    installBtn.addEventListener('click', function() {
        window.location.href = '/install';
    });

    fetchContacts();


});
