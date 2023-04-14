//Tüm elementleri seçmek

const form=document.querySelector("#todoAddForm");

const addInput=document.querySelector("#todoName");

const todoList=document.querySelector(".list-group");

const firstCardbody=document.querySelectorAll(".card-body")[0];
const secondCardbody=document.querySelectorAll(".card-body")[1];
 
const clearButton=document.querySelector("#clearButton");

const filterInput=document.querySelector("#todoSearch");
    

 let todos=[];
runEvents();

function filter(e){// filtrleme fonksiyonu
    //trim sagdaki ve soldaki boşlukları siler
    const filterValue=e.target.value.toLowerCase().trim();//target event teki olayda o zamandaki değeri belirtir 
    const todolistesi=document.querySelectorAll(".list-group-item");//todo listesini todolistesinin içine aldık

    if(todolistesi.length>0){//todo listesinin boş olmama durumunda yapılacaklar
        todolistesi.forEach(function(todo){
            if(todo.textContent.toLowerCase().trim().includes(filterValue)){ //inputa gireceğimiz değerler todo.textcontentte bulunuyorsa yapılacaklar
                todo.setAttribute("style","display: block"); //etiket gösterilsin
            }else{
                todo.setAttribute("style","display:none !important") //etiket gösterilmesin
            }
        })
    }else{
        showAlert("warning","Filtre yapmak için en az bir Todo olmalıdır!") //uyarı
    }
}

function runEvents(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",pageLoaded);//sayfam yüklendiğinde
    secondCardbody.addEventListener("click",removeTodoUI)//2.cardbodye tıklandıgında çalışacak fonksiyon
    clearButton.addEventListener("click",allTodosEverywhereRemove)//Tüm ToDoları temizle butonuna tıklanınca çağırılacak fonksiyon
    filterInput.addEventListener("keyup",filter)//Todo Arayınız ainputundan harf girip elimizi çektiğimizde çalışacak fonksiyon
}

function allTodosEverywhereRemove(){
    const todolistesi=document.querySelectorAll(".list-group-item");
    if (todolistesi.length>0){
        //Ekrandan silme
        todolistesi.forEach(function(todo){
            todo.remove();
        });
        //storageden silme
        todos=[];
        localStorage.setItem("todos",JSON.stringify(todos));
        showAlert("success","Bütün Todolar Silindi");

    }else{ showAlert("warning","Bütün Todoları silebilmen için en az 1  todo olması lazım")}
   
}

function removeTodoUI(e){
//console.log(e.target);//target cardbody de hangi todoya tıklandığını belirtir
if (e.target.className==="fa fa-remove"){
console.log("carpiya basmıştır")

/*
 <li class="list-group-item d-flex justify-content-between">Todo 1
 <a href="#" class="delete-item">
<i class="fa fa-remove"></i>//todo burdan li ye kadar ulaşıp altta li'yi kaldırma işlemi yaptık 
  </a>
  </li>
  */
//ekrandan silmek
const todo=e.target.parentElement.parentElement;
todo.remove();

//storageden silmek
removeTodoToStorage(todo.textContent);

showAlert("success","silme işlemi başarılı")
}
}

function removeTodoToStorage(removeTodo){
checkLocalstorage();
todos.forEach(function(todo,index){
    if(removeTodo===todo){
        todos.splice(index,1);
    }
})
localStorage.setItem("todos",JSON.stringify(todos));
}

function pageLoaded(){ //sayfam yüklen ince çalışacak fonkisyon
checkLocalstorage(); //storageyi kontrol ettik
todos.forEach(function(todo){ //todos dizisinin içindekilerini foreachle  addTodoUI(todo) ya gönderdik 
    addTodoUI(todo);          //bu da stoaragedeki verileri arayüze ekliyor
})
}

function addTodo(e){ //inputa bişeyler yazılması ve...
    //bunların arayüze ve local storageye yazdıran fonksiyonu çağırma işlemi

    const inputText=addInput.value.trim();
    if(inputText==null||inputText==""){
        showAlert("warning","Lütfen boş bırakmayınız!");
    }else{
        addTodoUI(inputText);           //LİSTEYE TODOEKLEME İŞLEMİ
        addTodoStorage(inputText);   //hafızaya yükleme
        showAlert("success","ToDo başarılı bir şekilde eklendi");
    }
    e.preventDefault();   //BAŞKA SAYFAYA GÖNDERMEYİ ENGELLER
}

function addTodoUI(newTodo){//arayüze ekleme 
    /*
    <li class="list-group-item d-flex justify-content-between">Todo 1
        <a href="#" class="delete-item">
             <i class="fa fa-remove"></i>
         </a>
    </li>
*/

const li =document.createElement("li");
li.className="list-group-item d-flex justify-content-between";
li.textContent=newTodo;

const a =document.createElement("a");
a.href="#";
a.className="delete-item";

const i =document.createElement("i");
i.className="fa fa-remove";

a.appendChild(i);
li.appendChild(a);
todoList.appendChild(li);

addInput.value="";

}

function addTodoStorage(newTodo){// local storageye Todo ekleme 
checkLocalstorage();
todos.push(newTodo);
localStorage.setItem("todos",JSON.stringify(todos));
console.log(todos);
}
function checkLocalstorage(){ //local storageyi Kontrol 
if(localStorage.getItem("todos")===null){
    todos=[];
}
else{todos=JSON.parse(localStorage.getItem("todos"))}
}
function showAlert(type,message){
   /* <div class="alert alert-success" role="alert">
    This is a warning message.
  </div>*/

  const div=document.createElement("div");
  div.className="alert alert-"+type;
 div.textContent=message;
 firstCardbody.appendChild(div);// cardbody sınıfına div ekledik

 setTimeout(function(){div.remove();},2500);//uyarıyı 2.5 saniye sonra kaldıracak
}