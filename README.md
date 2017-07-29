# Arty Widget

## Development

### Dependencies

* Node
* Grunt
* Mongo
* Nodemon (optional)

### Initial Setup

1. Create a folder called `local-db` in the root of the repo
1. You'll also need `src/keys-local.js`; get it from @iangilman

### Running

One terminal tab each:

* `npm run db`
* `nodemon`
* `grunt dev`

## Deployment

This project is set up to deploy to OpenShift, but it should work on most Node hosts.

### Environment Variables

* `SESSION_SECRET`
* `PASSWORD_SALT`
