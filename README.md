# Pivotal Deck

Simple front-end for the Pivotal Tracker based on
[their API](https://www.pivotaltracker.com/help/api?version=v3).

This application is built with
[Backbone.js](http://documentcloud.github.com/backbone/)
and currently allows to login, browse projects, and see stories in
projects icebox, current and backlog sections.

## Note

Api v3 of Pivotal Tracker is now obsolete. But I'm going to leave this project as an example of using xml api with Backbone.

## Requirments

*   [Sass](http://sass-lang.com/), [Compass](http://compass-style.org/)
    and [Foundation](http://foundation.zurb.com/docs/gem-install.php) gems.
*   [Node.js](http://nodejs.org/) with [CoffeeScript](http://coffeescript.org/)
    and [mime](https://npmjs.org/package/mime) packages.


## Cakefile

*   `cake watch` — watch for changes and compile `.scss` and `.coffee` files
    to `.css` and `.js` respectively
*   `cake [-p PORT] server` — start simple server that serves static files 
     and proxies API calls to prevent [CORS](http://www.w3.org/TR/cors/) errors
