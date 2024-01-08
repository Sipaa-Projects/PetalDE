/*
    petal-api/main.js - Petal Desktop API entry point.

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

// Define the main namespace
const petalde = {
    PETALDE_VER: 0.1,
    loadScript: function (src) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;

        script.onload = function () {
            /**if (callback) {
                callback();
            }**/
        };

        script.onerror = function (error) {
            console.error('Error loading script:', src);
            /**if (callback) {
                callback(error);
            }**/
        };

        // Append the script to the document head
        document.head.appendChild(script);
    },
    loadStylesheet : function(url) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
    
        document.head.appendChild(link);
    }
}

// then, load other API scripts
petalde.loadScript('petal-api/wm/wm.js')
petalde.loadScript('petal-api/fs.js')
petalde.loadScript('petal-api/net.js')