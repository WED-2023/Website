# Welcome to Chen's and Ofir's Website!
This Website was created for a project in the course 'Internet Programming Environments'.

## Installation
In order to install the website, you are going to need:

### 1. Get the API key from spoonacular
Create a user in this [website](spoonacular.com) and get the API key from there

### 2. Install MySQL
Download MySQL server from this [website](https://dev.mysql.com/downloads/installer/). We used Version 8.0.39 on Windows machine.

### 3. Node.js
Download Node.js from [here](https://nodejs.org/en/download/prebuilt-installer). We used v20.17.0 (LTS) on Windows.

### 4. Create .env file 
Create the .env file in the main folder with the following information:

host = [your host name], </br>
user = [your user to the MySQL], </br>
password = [your password to the MySQL],</br>
database = [your database to the MySQL],</br>
VUE_APP_spooncular_apiKey = [your api key from spoonacular]

### 5. Create the tables
Create the tables according to the [tables.txt](./tables.txt)

### 6. Run npm install
Run the command npm install in order to install everthing required

### 7. Run node main.js
Start the server running with the command 'node main.js' in the terminal.