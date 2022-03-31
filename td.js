const todoInput = document.querySelector(".todo-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
todoBox = document.querySelector(".todo-box");

let editId,
isEdittodo = false,
todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let liTag = "";
    if(todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                liTag += `<li class="todo">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="todo-menu">
                                    <li onclick='edittodo(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deletetodo(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    todoBox.innerHTML = liTag || `<span>You don't have any todo here</span>`;
    let checktodo = todoBox.querySelectorAll(".todo");
    !checktodo.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    todoBox.offsetHeight >= 300 ? todoBox.classList.add("overflow") : todoBox.classList.remove("overflow");
}
showTodo("all");

function showMenu(selectedtodo) {
    let menuDiv = selectedtodo.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedtodo) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedtodo) {
    let todoName = selectedtodo.parentElement.lastElementChild;
    if(selectedtodo.checked) {
        todoName.classList.add("checked");
        todos[selectedtodo.id].status = "completed";
    } else {
        todoName.classList.remove("checked");
        todos[selectedtodo.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function edittodo(todoId, textName) {
    editId = todoId;
    isEdittodo = true;
    todoInput.value = textName;
    todoInput.focus();
    todoInput.classList.add("active");
}

function deletetodo(deleteId, filter) {
    isEdittodo = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEdittodo = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});

todoInput.addEventListener("keyup", e => {
    let usertodo = todoInput.value.trim();
    if(e.key == "Enter" && usertodo) {
        if(!isEdittodo) {
            todos = !todos ? [] : todos;
            let todoInfo = {name: usertodo, status: "pending"};
            todos.push(todoInfo);
        } else {
            isEdittodo = false;
            todos[editId].name = usertodo;
        }
        todoInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});