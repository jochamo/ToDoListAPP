function onLoad() { 
    document.addEventListener("ionModalDidDismiss", closeItems);
    document.addEventListener("ionAlertDidDismiss", closeItems);
    document.addEventListener("ionDidOpen", closeItems);
    document.addEventListener('ionItemReorder', (event) => { moveItem(event.detail); });
    document.querySelectorAll('ion-tab').forEach(function(t) { printList(t); });
}

function getTab() {
    return(document.querySelector('ion-tab:not(.tab-hidden)'));
}

function getList(tab = getTab()) {
    let list = localStorage.getItem('todo-list-'+tab.tab);
    return list ? JSON.parse(list) : [];
}

function saveList(tab, list) {
    localStorage.setItem('todo-list-'+tab.tab, JSON.stringify(list));
    printList(tab);
}

function printList(tab) {
    tab.querySelector('ion-reorder-group').innerHTML = "";

    getList(tab).forEach((item, index) => {
        tab.querySelector('ion-reorder-group').innerHTML +=
        `<ion-item-sliding>
           <ion-item onClick="addEditItem(`+index+`)">
             <ion-label text-wrap>
               <h2>`+item.text+`</h2>
               <p>`+item.date.slice(0,10)+`</p>
             </ion-label>
             <ion-icon slot="end" name="`+item.icon+`"></ion-icon>
             <ion-reorder slot="end"></ion-reorder>
          </ion-item>
          <ion-item-options side="start">
            <ion-item-option color="danger" onClick="deleteItem(`+index+`)">
                <ion-icon slot="icon-only" name="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>`;
    });    
}

function error(message) {
  const alert = document.createElement('ion-alert');
  alert.message = message;
  alert.buttons = ['OK'];

  document.querySelector('ion-app').appendChild(alert);
  alert.present();
}

function toggleReorder() {
    closeItems();
    let reorder = getTab().querySelector('ion-reorder-group');
    reorder.disabled = !reorder.disabled;
}

function closeItems() {
    getTab().querySelector('ion-list').closeSlidingItems();
}

function addEditItem(index = false) {
    closeItems();
    let list = getList();
    let item = null;

    if (index !== false) item = list[index];
    else item = { text:"", date:new Date().toISOString(), icon:"radio-button-off" };

    const modal = document.createElement('ion-modal');
    modal.component = document.createElement('div');
    modal.component.innerHTML = `
        <ion-header>
            <ion-toolbar>
                <ion-title>ToDo - `+(index !== false ? 'Edit task' : 'New task')+`</ion-title>
                <ion-buttons slot="primary">
                    <ion-button color="danger"><ion-icon slot="icon-only" name="close"></ion-icon></ion-button>
                    <ion-button color="primary"><ion-icon slot="icon-only" name="checkmark"></ion-icon></ion-button>
                </ion-buttons>       
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-item>
                    <ion-label position="floating">Select date</ion-label>
                    <ion-datetime display-format="D MMM YYYY" max="2050-12-31" value="`+item.date+`"></ion-datetime>            
                </ion-item>
                <ion-item>
                    <ion-label position="floating">Enter task</ion-label>
                    <ion-input value="`+item.text+`"></ion-input>
                </ion-item>
            </ion-list>
            <ion-segment value="`+item.icon+`">
                <ion-segment-button value="radio-button-off">
                    <ion-icon name="radio-button-off"></ion-icon>
                </ion-segment-button>  
                <ion-segment-button value="radio-button-on">
                    <ion-icon name="radio-button-on"></ion-icon>
                </ion-segment-button>  
                <ion-segment-button value="snow">
                    <ion-icon name="snow"></ion-icon>
                </ion-segment-button>
                <ion-segment-button value="flame">
                    <ion-icon name="flame"></ion-icon>
                </ion-segment-button>
            </ion-segment>
        </ion-content>`;

    modal.component.querySelector('[color="danger"]').addEventListener('click', () => {
        modal.dismiss();
    });

    modal.component.querySelector('[color="primary"]').addEventListener('click', () => {
        let newDate = modal.component.querySelector('ion-datetime').value;
        let newText = modal.component.querySelector('ion-input').value;
        let newIcon = modal.component.querySelector('ion-segment').value;

        if (!newText.length) {
            error('The task cannot be empty');
        }
        else {
            let newItem = { text:newText, date:newDate, icon:newIcon };
            if (index !== false) list[index] = newItem; 
            else list.unshift(newItem);
            saveList(getTab(), list);
            modal.dismiss();
        }
    });

    document.querySelector('ion-app').appendChild(modal);
    modal.present();
}

function moveItem(indexes) {
    let tab = getTab();
    let list = getList(tab);
    let item = list[indexes.from];
    list.splice(indexes.from, 1);
    list.splice(indexes.to, 0, item);
    indexes.complete();
    saveList(tab, list);
}

function deleteItem(index = false) {
    const alert = document.createElement('ion-alert');
  
    alert.header = index !== false ? 'Delete item' : 'Delete all',
    alert.message = 'Are you sure?',
    alert.buttons =  
            [{
                text: 'YES',
                handler: () => {
                    let list = getList();
                    if (index !== false) { list.splice(index, 1); }
                    else { list.length = 0; }
                    saveList(getTab(), list);
                }
            }, {
                text: 'NO',
                role: 'cancel'
            }]

    document.querySelector('ion-app').appendChild(alert);
    alert.present();
}