## Getting Started

First, run the server:

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For other devices within LAN, use host PC IP, ie: http://192.168.1.1:3000. It is recommended to use Chrome browser.

By default, camera access is restricted, follow this steps in this [GUIDE](https://medium.com/@Carmichaelize/enabling-the-microphone-camera-in-chrome-for-local-unsecure-origins-9c90c3149339) to allow access to host IP address: 

1. Navigate to `chrome://flags/#unsafely-treat-insecure-origin-as-secure` in Chrome.
2. Find and enable the `Insecure origins treated as secure` section (see below).
3. Add any addresses you want to ignore the secure origin policy for. Remember to include the port number too (if required).
4. Save and restart Chrome.


## Demo URLs


* [http://localhost:3000/api/products](http://localhost:3000/api/products)
* [http://localhost:3000/product-checker](http://localhost:3000/product-checker)