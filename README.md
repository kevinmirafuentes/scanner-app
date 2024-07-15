## Installation 

1. Install Nodejs, at least version 10.
2. Save app directory to `C:\Program Files`.
3. Edit `C:\Windows\System32\drivers\etc\hosts` file, and add `<virtual machine ip> vm.host`.
4. Go to `C:\Program Files\<folder name>` and run `npm run build`.
4. Copy .\startup.bat to `%ProgramData%\Microsoft\Windows\Start Menu\Programs\Startup`.
  - This will auto start the server on window startup.
  - When the PC was rebooted, this will automatically open the terminal and start up the server.
5. Run .\startup.bat to start the server.

## Multi server installation 
1. Create a new copy of app folder; ec. cp `C:\Program Files\lotte-web-pos` `lotte-web-pos2`
2. Go to folder; `cd lotte-web-pos2`
3. Create `.env.local` file in root folder, and change `DB_SERVER` variable with IP of db server to connect to. 
4. Build command: `npm run build`
5. Edit `startup.bat`, add different port to eg: `npm -- start --port 3001`
6. Copy .\startup.bat to `%ProgramData%\Microsoft\Windows\Start Menu\Programs\Startup`.
7. Start server: `npm run start`
 
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
