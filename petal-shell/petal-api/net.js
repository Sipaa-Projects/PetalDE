petalde.net = {
    isRunningOnLocalhost: function()
    {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return true;
        } else {
            return false;
        }        
    },

    isConnectedToInternet: function()
    {
        if (this.isRunningOnLocalhost())
        {
            return fetch('https://www.example.com', { method: 'HEAD' })
            .then(response => {
                return true;
            })
            .catch(error => {
                return false;
            });
        }
        else 
        {
            return true;
        }
    }
}