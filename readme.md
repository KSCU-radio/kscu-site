# KSCU 103.3 FM's Website
## Overview
This is the website source code for KSCU 103.3 FM Santa Clara, the student-run radio station at Santa Clara University. Check us out at [KSCU.org](https://kscu.org)!

Our site is built primarily using [Hugo](https://gohugo.io/), a static site generator. The theme is based roughly on [Congo](https://github.com/jpanther/congo) with major modifications. 

To function correctly, the site relies on our in-house [Spinitron API Relay Server](https://github.com/aidansmth/API_relay). 

While this began as a classroom project, the project has grown into a complex interweaving of different components and libraries. While stable, it's not recommended that you use this project or Hugo theme as a base for your own project. Instead, check out the excellent [Congo theme](https://github.com/jpanther/congo) and use this as reference for how to integrate the Spinitron API Relay and Howler library for live audio streaming.

## Tools Used

- [**Hugo**](https://gohugo.io/) - For static site generation and templating.
- [**Congo**](https://github.com/jpanther/congo) - As a base template for Hugo.
- [**Tailwind CSS**](https://tailwindcss.com/) - For class based CSS.
- [**Howler**](https://howlerjs.com/) - Web audio library for in-browser streaming of the station broadcast.
- [**DOMPurify**](https://github.com/cure53/DOMPurify) - To prevent injection attacks.