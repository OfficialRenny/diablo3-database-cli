# diablo3-database-cli
Item database tool of Diablo3 game.

## What

A tool to build up a database for Diablo III game, including equitment items and character skills, etc.

With those game data in hand, you can develop other amazing apps for Diablo III.  

## How

Without using blizzard APIs, this tool uses very original way to collect the data: by crawling the official website of Diablo III.

    ./bin/d3db create -a -o somewhere/
    
This will crawl and save the data to "somewhere" folder. For now only skills and items are collected.

When finished, you would like to run following command:

    ./bin/d3db stat somewhere/databases/item.json
    ./bin/d3db stat somewhere/databases/skill.json
    
This will display the summary of the database and do necessary sanity checks.
