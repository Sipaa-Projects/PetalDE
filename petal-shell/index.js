// TODO: move these functions to an API namespace
console.log("  ____      _        _   ____            _    _                |");
console.log(" |  _ \ ___| |_ __ _| | |  _ \  ___  ___| | _| |_ ___  _ __    | You just entered the DevTools (developer tools) console.");
console.log(" | |_) / _ \ __/ _` | | | | | |/ _ \/ __| |/ / __/ _ \| '_ \   | This is not the dark place for hackers that you may think.");
console.log(" |  __/  __/ || (_| | | | |_| |  __/\__ \   <| || (_) | |_) |  | But... Please... Don't trust anyone, except you. Don't run code from unknown");
console.log(" |_|   \___|\__\__,_|_| |____/ \___||___/_|\_\\__\___/| .__/   | persons without understanding how it works.");
console.log("                                                      |_|      | ALSO... You can play with the API here. Start by typing \"petalde.\"...");

let isLogged = true
const startup = document.querySelector('.startup')
const shelf = document.querySelector('.shelf');
const workArea = document.querySelector('.workingArea');
const login = document.querySelector('.lockScreen');
const scrsaver = document.querySelector('.scrsaver');
const watermark = document.querySelector('.watermark');

function showLoginScreen()
{
    const launcher = document.getElementById('launcher');
    launcher.classList.add('closed');
    scrsaver.classList.remove('open');

    hideShelf()
    hideWorkArea()
    login.classList.add('open');
}

function showScreenSaver()
{
    login.classList.remove('open');

    const launcher = document.getElementById('launcher');
    launcher.classList.add('closed');
    scrsaver.classList.add('open');
    
    hideShelf()
    hideWorkArea()
}

function workareaVisible()
{
    return workArea.classList.contains('open')
}

function showWorkArea() {
    workArea.classList.add('open');
}

// Hide the WorkArea
function hideWorkArea() {
    workArea.classList.remove('open');
}

function shelfVisible()
{
    return shelf.classList.contains('open')
}

function showShelf() {
    shelf.classList.add('open');
}

// Hide the shelf
function hideShelf() {
    shelf.classList.remove('open');
}

function wait(ms) {
    return new Promise(resolve => {
        // Simulating an asynchronous operation, like fetching data or processing
        setTimeout(() => {
            console.log('Async operation completed');
            resolve('Result of async operation');
        }, ms); // Simulating a 2-second delay
    });
}

function showDe()
{
    login.classList.remove('open');
    scrsaver.classList.remove('open');
    showWorkArea();
    showShelf();
}

var userAgent = navigator.userAgent;
watermark.textContent = "Petal Desktop " + petalde.PETALDE_VER + " running on " + userAgent

function launcherBtn_clicked()
{
    const launcher = document.getElementById('launcher');
    launcher.classList.toggle('closed');
}

function openBing_clicked()
{
    petalde.wm.createWindow("https://www.bing.com", "Bing", 50, 50, 1000, 700, false)
    launcherBtn_clicked();
}

function openAbout_clicked()
{
    petalde.wm.createWindow("petal-about/index.html", "About...", 50, 50, 550, 640, false)
    launcherBtn_clicked();
}

async function postStartup()
{
    await wait(4000);
    startup.classList.add('closed')
    await wait(1500);
    showDe();
}

postStartup()