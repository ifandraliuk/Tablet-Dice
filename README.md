# Welcome to the Tablet & Dice! 
 Step into an exciting world of adventure with Tablet&Dice! Create your own character and customize it to your liking with a variety of species, abilities, and talents. Take on daring quests and battles with the help of your ever-faithful companion. As you progress, upgrade your gear and track your story in the diary to keep all the details safe. It's time to embark on an unforgettable adventure with Tablet&Dice!

# Main idea
In this project I'm going to digitilize a simplified version of a [Pen & Paper] (https://en.wikipedia.org/wiki/Tabletop_role-playing_game) game. Spend quality time with friends, make memories and get creative with Tablet&Dice. This app helps you organize your campaigns, keep track of all your adventures, and share it with your friends in a secure and easy-to-use platform. Never worry about forgetting details or searching for notes again. 
## Main features of the project:
* Create a unique character
* Level up system, talents and abilities 
* Diary with sharing & editing features. Forget all those papers gone missing by the last game session. Now you have everything safe and sorted in the app!
* Inventory with huge item database. Enchant, equip your gear. Loot everything in your adventure and simply add it in your inventory instead of writing it on a paper. Enjoy playfull and colorfull items you found. Collect set items and get unique set bonuses!

## Goals:
* Companions and taming system. Enjoy exploring the world and have fun not only by taming creatures, but by equipping and leveling it. 
* Additional inventory functionality, such as destroying elements.
* Battle system: save initiative role for the fight, add enemies as a gamemaster and keep tracking about the battle in battellog.
* Campaigns: start your adventure in one of the epic world events. Join a bad or good campaign with lore description and strategy.
# Project info
This is a MERN project and is used to develope my skills in programming by mixing my hobbies with my favorite frameworks. The work in progress.
Database: Mongodb
Backend: Node, Express
Frontend: React, Sass, Redux

## Crafting
Crafting uses the shared station definitions in `client/src/pages/Crafting/stations.json`. The server validates the recipe, profession, station access and current inventory before atomically updating inventory and talent records in a MongoDB transaction. MongoDB must support transactions (for example, Atlas or a replica set); standalone deployments cannot complete crafting. The transaction also stores a retry identifier for 30 days to prevent an uncertain request from being applied twice.

Station artwork is read from `client/public/crafting/images/`. Each profession has three PNG files named by profession and station level: `alchemy-1.png`–`alchemy-3.png`, `woodworking-1.png`–`woodworking-3.png`, `enchanting-1.png`–`enchanting-3.png`, `cooking-1.png`–`cooking-3.png`, `leatherworking-1.png`–`leatherworking-3.png`, `smithing-1.png`–`smithing-3.png` and `tailoring-1.png`–`tailoring-3.png`. Place the image at the expected path; no configuration change is needed. Refresh the development page, or rebuild and redeploy the client for production. The same image is used for the profession card and station preview. Missing files show “Bild folgt”; other loading errors are reported. The paths can be changed in `client/src/pages/Crafting/stationImages.json`.

The optional integration test `node server/controllers/craftingController.integration.test.js` connects using `server/.env` and creates temporary, uniquely prefixed collections in the `test` database. It removes only those test collections afterward; use a test cluster with permission to create and drop collections.