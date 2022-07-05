# Simple-Auth
#### Authentication and Authorization made easy

___
### Why  ?
The topic of authentication/authorization comes up again and again.
Every time, everything has to be implemented again from the beginning, and it's no different here than with crypto:  
*never do your own crypto*.

These packages are intended to remedy the situation and use a standard that is quick to implement and maintain.
___
### Features
* api keys
* *default* save access and refresh token
* *default* save cookie management
* stateless permissions
* encoded jwt content (session)
* 2FA TOTP (others come soon via plugins...)
___
### TODO
#### Server libraries
* implement plugin handler
* save permissions in session
* encode jwt payload possibility
* authorization handler
  * with entity ownership check possibilities
* reduce database round trips (AsyncStorage?)
* logout
#### Client libraries
* implement refresh interceptor
  * custom interceptor activation
___
### Packages
* @simple-auth/nestjs
  * Library for nestjs server
* @simple-auth/express
  * Library for express server
* @simple-auth/web
  * Library for client

### Routes
* Get access token and refresh token  
  [POST] /auth/login
  * body
    * usernameField: string
    * passwordField: string
    * rememberMe: boolean
* Verify 2FA TOTP code  
  [POST] /auth/twofa
  * body
    * token: string
    * code: string
* Get with refresh token new access token and refresh token  
  [POST] /auth/refresh
---
### Documentation
TODO

---
### Get Started
####  Library options (server)
```TypeScript
const options = {
    apiKey: {
        body: {
            names: ["key-1", "key2"], // names to look at for api keys in body
        },
        query: {
            names: ["key-3", "key-4"], // names to look at for api keys in query
        },
        header: {
            names: ["key-5", "key-6"], // names to look at for api keys in header
        },
        find: (key: string) => {
            // return user;
            return {};
        },
    },
    login: {
        usernameField: "email", // field to use for user identification from body
        passwordField: "password", // field to use for password from body
        find: (username: string, password: string) => {
            // return user
        },
        twoFa: {
            saveTwoFaSessionToken: (id: string, user: any, rememberMe: boolean) => {
                // save twofa token id and rememberMe for user
            },
            findTwoFaSessionToken: (id: string) => {
                // return {user, rememberMe}
            },
            deleteTwoFaSessionToken: (id: string) => {
                // delete twofa token
            },
            validateTwoFaCode: (code: string) => {
                // validate totp code for user
            },
            shouldValidateTwoFa: (user: any) => {
                // return boolean
            }
        }
    },
    session: {
        cookie: {
            name: "session_name",
            signed: true,
            secure: true,
            httpOnly: true,
            domain: "localhost",
            path: "/",
            sameSite: "lax",
        },
        lifetime: 15 * 60, // lifetime for jwt and cookie (15min)
        encoded: true, // encode content from session jwt
        secret: "session_secret", // secret for session jwt
        find: (id: string) => {
            // return user with session id
        },
        delete: (id: string) => {
            // delete session id from user
        },
        save: (id: string, user: any) => {
            // save session with id for user
        },
        customResponse: (req: I, res: R, accessToken: string, refreshToken: string) => {
          // return custom response    
        },
    },
    refresh: {
        cookie: {
            name: "refresh_name",
            signed: true,
            secure: true,
            httpOnly: true,
            domain: "localhost",
            path: "/",
            sameSite: "lax",
        },
        lifetime: 14 * 24 * 60 * 60, // lifetime for jwt and cookie (14 days)
        secret: "refresh_secret", // secret for refresh jwt
        find: (id: string) => {
            // return user with refresh id
        },
        delete: (id: string) => {
            // delete refresh id from user
        },
        save: (id: string, user: any, rememberMe: boolean) => {
            // save refresh id and rememberMe for user
        },
        customResponse: (req: I, res: R, accessToken: string, refreshToken: string) => {
            // return custom response    
        },
    },
    parser: {
        cookieSecret: "very_secure" // cookie-parser secret for signed cookies
    },
    error: (errors: any) => {
        // handle errors
    }
}
```

#### Library options (client)
