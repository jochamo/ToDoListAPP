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
           <ion-item onClick="addEditItem(`+index+`)" color="medium">
             <ion-label text-wrap>
               <p>`+item.date.slice(0,10)+` [`+item.hour+`h]</p>
			   <h2>`+item.text+`</h2>               
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

	//https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Date/getHours
	//https://norfipc.com/web/como-mostrar-fecha-hora-paginas-web-javascript.html
	
	let horaActual = new Date().getHours() + ":" + new Date().getMinutes();
	
    if (index !== false) item = list[index];
    else item = { date:new Date().toISOString(), hour:horaActual, text:"", icon:"radio-button-off" };

    const modal = document.createElement('ion-modal');
    modal.component = document.createElement('div');
    modal.component.innerHTML = `
        <ion-header>
            <ion-toolbar>
                <ion-title>`+(index !== false ? 'Editar tarea' : 'Nueva tarea')+`</ion-title>
                <ion-buttons slot="primary">
                    <ion-button color="danger"><ion-icon slot="icon-only" name="close"></ion-icon></ion-button>
                    <ion-button color="primary"><ion-icon slot="icon-only" name="checkmark"></ion-icon></ion-button>
                </ion-buttons>       
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-item>
                    <ion-label position="floating">Seleccionar fecha</ion-label>
                    <ion-datetime display-format="D MMM YYYY" max="2050-12-31" value="`+item.date+`"></ion-datetime>            
                </ion-item>
				<ion-item>
					<ion-label position="floating">Seleccionar hora</ion-label>
        			<ion-datetime class="hour" display-format="HH:mm" value="`+item.hour+`"></ion-datetime>
      			</ion-item>
                <ion-item>
                    <ion-label position="stacked">Insertar tarea</ion-label>
                    <ion-input value="`+item.text+`"></ion-input>
                </ion-item>
            </ion-list>
            <ion-segment value="`+item.icon+`">
                <ion-segment-button value="woman">
                    <ion-icon name="woman"></ion-icon>
                </ion-segment-button>  
                <ion-segment-button value="heart">
                    <ion-icon name="heart"></ion-icon>
                </ion-segment-button>  
                <ion-segment-button value="happy">
                    <ion-icon name="happy"></ion-icon>
                </ion-segment-button>
                <ion-segment-button value="at">
                    <ion-icon name="at"></ion-icon>
                </ion-segment-button>
				<ion-segment-button value="cart">
                    <ion-icon name="cart"></ion-icon>
                </ion-segment-button>  
                <ion-segment-button value="car">
                    <ion-icon name="car"></ion-icon>
                </ion-segment-button>  
                <ion-segment-button value="call">
                    <ion-icon name="call"></ion-icon>
                </ion-segment-button>
            </ion-segment>
			
			<ion-item>
            <ion-label position="stacked">Seleccionar icono</ion-label>
            <ion-select>
              <ion-select-option value="woman"><ion-icon name="woman"></ion-icon>woman</ion-select-option>
			  <ion-select-option value="heart"><ion-icon name="heart"></ion-icon>heart</ion-select-option>
			  <ion-select-option value="happy"><ion-icon name="happy"></ion-icon>happy</ion-select-option>
			  <ion-select-option value="at"><ion-icon name="at"></ion-icon>at</ion-select-option>
			  <ion-select-option value="cart"><ion-icon name="cart"></ion-icon>cart</ion-select-option>
			  <ion-select-option value="car"><ion-icon name="car"></ion-icon>car</ion-select-option>
			  <ion-select-option value="call"><ion-icon name="call"></ion-icon>call</ion-select-option>
            </ion-select>
          </ion-item>
		  
		  <ion-item>
            <ion-label position="stacked">Seleccionar categoria</ion-label>
            <ion-select>
              <ion-select-option value="woman"><ion-icon name="woman"></ion-icon>Hoy</ion-select-option>
			  <ion-select-option value="heart"><ion-icon name="heart"></ion-icon>Casa</ion-select-option>
			  <ion-select-option value="happy"><ion-icon name="happy"></ion-icon>Trabajo</ion-select-option>
			  <ion-select-option value="at"><ion-icon name="at"></ion-icon>Gastos</ion-select-option>
            </ion-select>
          </ion-item>
		  
        </ion-content>`;

    modal.component.querySelector('[color="danger"]').addEventListener('click', () => {
        modal.dismiss();
    });

    modal.component.querySelector('[color="primary"]').addEventListener('click', () => {
        let newDate = modal.component.querySelector('ion-datetime').value;
		let newHour = modal.component.querySelector('.hour').value;
        let newText = modal.component.querySelector('ion-input').value;
        let newIcon = modal.component.querySelector('ion-segment').value;

        if (!newText.length) {
            error('La tarea no puede estar en blanco!');
        }
        else {
            let newItem = { date:newDate, hour:newHour, text:newText, icon:newIcon };
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
  
    alert.header = index !== false ? 'Eliminar tarea' : 'Eliminar todo',
    alert.message = 'Esta seguro?',
    alert.buttons =  
            [{
                text: 'SI',
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

//Salir de la aplicacion
function salirApp(){
	navigator.app.exitApp();
}

//Cambiar una tarea de categoria
function cambiarCategoria(){
	
}