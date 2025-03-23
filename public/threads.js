var thread = ''

createThread()
window.addEventListener("beforeunload", deleteThread);

async function createThread() {
    var response = await fetch('/createThread', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    var threads = await response.json()

    thread = threads.id
    // alert(threads)
}

async function deleteThread() {
    if (!thread) return
    await fetch('/deleteThread', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({thread: thread}),
    });
}