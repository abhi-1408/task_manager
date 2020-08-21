
let servers = [{ 'id': 1, 'task': 0, 'isdeleted': false }]

let task_queue = []
let pending_task = []
let remove_request = 0


function handleProcessing() {
    // checking for the servers and pending tasks, if there are any allot them to servers

    for (let i = 0; i < pending_task.length && i < servers.length; i++) {
        task_queue[pending_task[i]].isstarted = true
        task_queue[pending_task[i]].remaining -= 1
        s = document.getElementById('task' + task_queue[pending_task[i]].id.toString())
        s.style.width = ((20 - task_queue[pending_task[i]].remaining) * 10).toString() + 'px'
        s.textContent = ':' + (task_queue[pending_task[i]].remaining).toString()

        // if task is finished and if there is a remove server request free that server
        if (task_queue[pending_task[i]].remaining == 0) {
            task_queue[pending_task[i]].iscompleted = true
            pending_task.splice(i, 1);
            if (remove_request > 0) {
                if (servers.length > 1) {
                    servers.pop()
                    remove_request -= 1
                }
            }
        }

    }

    // if there is remove server remove_request and no pending_task/ some servers r free
    if (pending_task.length == 0) {
        if (remove_request >= 1) {
            if (servers.length > 1) {
                servers.pop()
                remove_request -= 1
            }

        }
    }
    else if (remove_request >= 1 && servers.length > pending_task.length) {
        let max_remove = servers.length - pending_task.length
        while (max_remove >= 0) {
            remove_request -= 1
            max_remove -= 1
            servers.pop()
        }
    }
    let total = document.getElementById('total')
    total.textContent = 'server:' + servers.length + ' remove server:' + remove_request

    // console.log('handle processing', servers, pending_task)
}


// add a server
function handleAddServer() {
    servers.push({ 'id': servers.length + 1, 'task': 0, 'isdeleted': false })
}


// take a remove server request
function handleRemoveServer() {
    if (remove_request < servers.length - 1) {
        remove_request += 1

    }
}



setInterval(handleProcessing, 1000)



function update() {
    // if delete/add task is pressed then delete/add the task and its div     
    let t1 = document.getElementById('tasks')
    task_queue.forEach(task => {
        if (task.isdeleted == false) {

            progress_update = document.getElementById('task' + task.id.toString())
            progress_update.style.width = ((20 - task.remaining) * 10).toString() + 'px'
            progress_update.textContent = ':' + (task.remaining).toString()

        }
        else {
            s = document.getElementById(task.id.toString())
            if (s != null) {
                t1.removeChild(s)
            }
        }


    })
}


// delete a task if it has not been started/queued
function handleDel(e) {
    console.log('handle del', e)
    if (task_queue[e]['isstarted'] == false) {
        task_queue[e]['isdeleted'] = true
        const index = pending_task.indexOf(e);
        pending_task.splice(index, 1);
        update()
    }
}


// add a task
function handleAddTask() {
    task_queue.push({ 'id': task_queue.length, 'remaining': 20, 'iscompleted': false, 'isdeleted': false, 'isstarted': false })
    pending_task.push(task_queue.length - 1)
    let t1 = document.getElementById('tasks')
    // t1.innerHTML = ''
    task_queue.forEach(task => {
        if (task.isdeleted == false) {

            s = document.getElementById('task' + task.id.toString())
            if (s == null) {
                // d = document.createElement('div')
                progress = document.createElement('div')

                progress.classList.add('progress_bar')
                progress.classList.add('flex')
                progress_update = document.createElement('div')
                progress_update.id = 'task' + task.id.toString()

                progress_update.style.width = ((20 - task.remaining) * 10).toString() + 'px'
                progress_update.textContent = (20 - task.remaining).toString()
                progress.appendChild(progress_update)
                progress.innerHTML += `<button id = ${task.id} class="btn" onclick=handleDel(${task.id})>DEL</button>`
                progress.id = task.id.toString()
                t1.appendChild(progress)
            }

            console.log('in add task', t1, s)
        }


    })
    // update()

    // console.log('pending', pending_task)
}

