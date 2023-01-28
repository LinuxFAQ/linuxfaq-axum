# LinuxFAQ Backend
This is the backend side of LinuxFAQ. If you would like to contribute to the base repository, it is located here: [https://github.com/LinuxFAQ/linuxfaq](https://github.com/LinuxFAQ/linuxfaq).

## Work in Progress

TODO List:

- [ ] Automagically pull from [https://github.com/LinuxFAQ/linuxfaq](https://github.com/LinuxFAQ/linuxfaq) repository for Markdown files
- [ ] Index Markdown files for an in-memory search database
- [ ] Reply with 10 most relevant search results from in-memory database to client upon /search GET request
- [ ] Reply with a full Markdown file with a /faq/{file} GET request
- [ ] JavaScript correctly sends the right X-HTTP requests and handles response data correctly.
- [x] Page is correctly styled
- [x] Basic HTML layout all made
- [x] Axum server rolling on port 80
