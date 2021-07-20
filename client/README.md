## Starting the front end

1. Nagivate to the /client directory
2. Run `npm install` to install/update all the necessary packages
3. Run `npm start`
4. Open `localhost:3000` on the web browser of your choice
5. To make sure the front end retrieves data from the backend, start the backend as well.

## Pages directory

- / -> Home page
- /lang -> Page for choosing which language to practice
- /race -> Page for the actual race. One must be in a valid room, otherwise the page will display a "You don't seem to be in a race" message.
- /rooms -> Page for viewing and joining rooms
- /solotyping/[language] -> Page for the solo typing practice, with an optional parameter for practicing only on code from [language]. If no valid parameter is given, a random code snippet from any language is used.
- /user/[user] -> Page for viewing the user profile of [user]. If the user does not exist, the page will display a "The user does not exist" message.
- /waitingroom -> Page for waiting in a room before the race starts. One must be in a valid room, otherwise the page will display a "You don't seem to be in a room" message.
- /vim/tutorial/[part] -> Page for the vim tutorial, with an optional parameter for starting the tutorial from part [part]. If no valid parameter is given, it starts at part 0.
- Any other url will display a "404 Error Page Not Found."

## Image Sources

- Background: https://cdn.wallpapersafari.com/23/0/sioLPa.jpg
- Rocket: https://wikiclipart.com/wp-content/uploads/2017/01/Rocket-clipart-free-images-4.png
- UFO: https://www.clipartmax.com/png/full/21-213902_ufo-clipart.png
- Speedometer: https://www.clipartmax.com/png/full/142-1421212_speedometer-clip-art.png
- Vim Logo: https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Vimlogo.svg/1200px-Vimlogo.svg.png
- Control Panel: https://clipartart.com/categories/control-panel-clipart.html
