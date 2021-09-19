# Talon

This is a programming language, compiler, and runtime for creating text adventures. It's a work in progress.

![Current Build](https://github.com/Norhaven/Talon/actions/workflows/ci-build.yml/badge.svg?branch=master)

# Developing

After you clone the repo, run `npm install` at the root to acquire the necessary packages. Build/Run configurations are already set up for VS Code, so I would recommend using that. Just open the root folder with it to get started.

It's not required, but if you would like to include the ability to view structured logs then you can set up a local Seq server and this will publish some logs there. In order to set that up, I would recommend installing Docker Desktop and then running the following commands:

```
docker pull datalust/seq
```

```
docker run --name seq -d --restart unless-stopped -e ACCEPT_EULA=Y -p 5341:80 datalust/seq:latest
```

After that, you can open `http://localhost:5341/` in your browser to view your local Seq events.

# Running

Using VS Code, use the `Launch Chrome against localhost` run/debug option. This will build the project and open a browser window with the rudimentary IDE that you can use to play around with.

# Contributing

If you feel so inclined, please reach out to me to find the best way to contribute. As this becomes a more fully formed project, issues with contribution-friendly tags may show up. For now, though, I'll be happy to hear from you.
