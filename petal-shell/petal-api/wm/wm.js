/*
    petal-api/wm.js - Petal Desktop window manager API.

    Copyright (C) 2024-present Sipaa Projects
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

// Load the stylesheet
petalde.loadStylesheet("petal-api/wm/wm.css")

// Define the namespace
petalde.wm = {
    createWindow: function (content, title, initialX, initialY, initialWidth, initialHeight, isWidget) {
        const workingArea = document.getElementById('workingArea');

        // Create a new window div
        const windowDiv = document.createElement('div');
        windowDiv.style.width = initialWidth + 'px';
        windowDiv.style.height = initialHeight + 'px';
        windowDiv.style.left = initialX + 'px';
        windowDiv.style.top = initialY + 'px';
        if (!isWidget)
            windowDiv.className = 'window';
        else
            windowDiv.className = 'wdgwindow';
        windowDiv.id = Math.random()

        // Store a window icon inside the window.
        if (!isWidget)
            windowDiv.wndicon = petalde.wm.internal.createWindowIcon();

        // Create a title bar
        const titleBar = document.createElement('div');
        titleBar.className = 'title-bar';

        // Create title text
        const titleText = document.createElement('span');
        titleText.textContent = title; // You can customize the title here

        // Create close button with FontAwesome icon
        const closeButton = document.createElement('span');
        closeButton.className = 'title-bar-btn close-btn';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';

        // Create minimize button with FontAwesome icon
        const minimizeButton = document.createElement('span');
        minimizeButton.className = 'title-bar-btn minimize-btn';
        minimizeButton.innerHTML = '<i class="fas fa-window-minimize"></i>';

        // Append title text and buttons to the title bar
        titleBar.appendChild(titleText);
        titleBar.appendChild(minimizeButton);
        titleBar.appendChild(closeButton);

        // Append the title bar to the window
        windowDiv.appendChild(titleBar);

        // Create an iframe
        const iframe = document.createElement('iframe');
        iframe.src = content; // Set your iframe source URL here
        iframe.style.width = '100%';
        if (!isWidget)
            iframe.style.height = 'calc(100% - 32px)';
        else {
            iframe.style.height = '100%';
            iframe.style.top = '0';
            iframe.style.borderRadius = '4px';
        }

        iframe.addEventListener('load', () => {
            if (iframe.src.includes(window.location.hostname))
            {
                // Assuming you have a reference to the iframe element
                var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

                // Get the favicon link
                var faviconLink = iframeDocument.querySelector("link[rel*='icon']") || iframeDocument.querySelector("link[rel='shortcut icon']");

                // Check if a favicon link is found
                if (faviconLink) {
                    var faviconURL = faviconLink.href;
                    if (windowDiv.wndicon)
                    {
                        let icon = windowDiv.wndicon.querySelector('i')
                        icon.className = 'windowIconImg';
                        icon.style.backgroundImage = 'url(\'' + faviconURL + '\')';
                    }
                } else {
                    console.log("Favicon not found.");
                }
            }
            /**if (iframe.contentWindow.document.title)
            {
                titleText.textContent = iframe.contentWindow.document.title;
            }**/
        });

        // Append the iframe to the window
        windowDiv.appendChild(iframe);

        // Make the window draggable and resizable
        petalde.wm.internal.makeDraggable(windowDiv, titleBar);
        petalde.wm.internal.makeResizable(windowDiv);

        // Close button click event
        closeButton.addEventListener('click', function () {
            windowDiv.classList.remove('open');
            windowIconsContainer.removeChild(windowDiv.wndicon)
            setTimeout(() => {
                workingArea.removeChild(windowDiv);
            }, 300);
        });

        // Minimize button click event
        minimizeButton.addEventListener('click', function () {
            console.log('Minimize button clicked');
        });

        // Append the window to the working area
        workingArea.appendChild(windowDiv);

        // Trigger opening animation
        setTimeout(() => {
            windowDiv.classList.add('open');
        }, 0);

        return windowDiv.id;
    }
}

petalde.wm.internal = {

    windowIconsContainer: document.getElementById('windowIconsContainer'),

    createWindowIcon: function () {
        // Create a new window icon div
        const windowIconDiv = document.createElement('div');
        windowIconDiv.className = 'windowIcon';
        windowIconDiv.innerHTML = '<i class="fa-solid fa-globe"></i>'

        // TODO: Add an icon or label based on the window content or type

        // Append the window icon to the container
        petalde.wm.internal.windowIconsContainer.appendChild(windowIconDiv);

        // TODO: Add event listeners or functionality to the window icon
        windowIconDiv.addEventListener('click', function () {
            // TODO: Handle click on the window icon (bring window to front, minimize, etc.)
        });

        return windowIconDiv;
    },
    makeDraggable: function (element, dragBar) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        dragBar.onmousedown = function (e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },
    // Inside the makeResizable function
    makeResizable: function (element, iframe) {
        const resizers = document.createElement('div');
        resizers.className = 'resizers';

        ['bottom', 'left', 'right', 'bottom-left', 'bottom-right'].forEach((type) => {
            const resizer = document.createElement('div');
            resizer.className = 'resizer ' + type;
            resizers.appendChild(resizer);

            resizer.addEventListener('mousedown', (e) => {
                e.preventDefault();

                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
                const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
                const startLeft = element.offsetLeft;
                const startTop = element.offsetTop;

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                });

                function handleMouseMove(e) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;

                    if (type.includes('left')) {
                        const newWidth = startWidth - deltaX;
                        if (newWidth > 0) {
                            element.style.width = newWidth + 'px';
                            element.style.left = startLeft + deltaX + 'px';
                        }
                    }

                    if (type.includes('right')) {
                        const newWidth = startWidth + deltaX;
                        if (newWidth > 0) {
                            element.style.width = newWidth + 'px';
                        }
                    }

                    if (type.includes('bottom')) {
                        const newHeight = startHeight + deltaY;
                        if (newHeight > 0) {
                            element.style.height = newHeight + 'px';
                            iframe.style.height = 'calc(' + newHeight + 'px - 32px)';
                        }
                    }
                    if (type.includes('bottom-right')) {
                        const newWidth = startWidth + deltaX;
                        const newHeight = startHeight + deltaY;
                        if (newWidth > 0 && newHeight > 0) {
                            element.style.width = newWidth + 'px';
                            element.style.height = newHeight + 'px';
                            iframe.style.height = 'calc(' + newHeight + 'px - 32px)';
                        }
                    }

                    if (type.includes('bottom-left')) {
                        const newWidth = startWidth - deltaX;
                        const newHeight = startHeight + deltaY;
                        if (newWidth > 0 && newHeight > 0) {
                            element.style.width = newWidth + 'px';
                            element.style.left = startLeft + deltaX + 'px';
                            element.style.height = newHeight + 'px';
                            iframe.style.height = 'calc(' + newHeight + 'px - 32px)';
                        }
                    }
                }
            });
        });

        element.appendChild(resizers);
    }
}
