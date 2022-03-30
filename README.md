# WazirX-Dashboard ( Unofficial ) 

An unofficial dashboard created for Wazirx cypto exchange  to view realtime P&L statements of cryptocurrency investments done in WazirX, that too in INR.

- Fully open sourced code, written in python-flask and react.
- Wrapper API's are created on top of wazirx official ones.
- login using api key and secret  ( here is how ) . Only read access in needed.
- We dont store the credentials anywhere nor use a database

Hosted link : [Here](http://129.154.39.115:3000/ "Here")

##### steps to setup and run yourself in local:
1. install python3 and npm
2. pip install -r requirements.txt
3. python3 flask_server.py
4. npm i
5. npm start

Note : If backend is running on a different IP, it should be manually edited in the file : `UI/src/constants/appconstants.js `for binding to ui.


